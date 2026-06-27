import { RESERVATION_STATUS, TIME_SLOTS, TABLE_STATUS } from './constants';
import { findCustomerByPhone, suggestBestTable, getEstimatedTurnTime } from './bookingHelpers';

export const DEFAULT_AVG_CHECK = 95;

export const getCustomerAvgCheck = (customer) => {
  if (!customer?.visitCount) return DEFAULT_AVG_CHECK;
  return Math.round(customer.totalSpent / customer.visitCount);
};

export const calcNoShowRisk = (customer, reservation) => {
  let risk = 10;
  if (customer?.noShowCount) risk += customer.noShowCount * 18;
  if (customer?.visitCount >= 15) risk -= 15;
  else if (customer?.visitCount >= 5) risk -= 8;
  if (customer?.vip || reservation.vip) risk -= 12;
  if (reservation.depositPaid) risk -= 22;
  if (reservation.smsReminderSent) risk -= 6;
  if (reservation.source === 'walkin') risk -= 10;
  if (reservation.status === RESERVATION_STATUS.CHECKED_IN) return 0;
  return Math.min(92, Math.max(3, Math.round(risk)));
};

const activeReservations = (reservations, dateStr) =>
  reservations.filter((r) => {
    if ([RESERVATION_STATUS.CANCELLED, RESERVATION_STATUS.NO_SHOW, RESERVATION_STATUS.COMPLETED].includes(r.status)) return false;
    return new Date(r.date).toDateString() === dateStr;
  });

export const computeOperationsBriefing = ({
  reservations, events, customers, tables, staff, floors, restaurant, waitlist, menuItems,
  date = new Date(),
}) => {
  const dateStr = date.toDateString();
  const tonight = activeReservations(reservations, dateStr);
  const todayEvents = (events || []).filter((e) => new Date(e.date).toDateString() === dateStr);

  const covers = tonight.reduce((s, r) => s + (r.partySize || 0), 0);
  const walkInCovers = tables
    .filter((t) => t.status === TABLE_STATUS.OCCUPIED && !tonight.some((r) => r.tableId === t.id))
    .reduce((s, t) => s + (t.partySize || 2), 0);

  const reservationRevenue = tonight.reduce((sum, r) => {
    const cust = findCustomerByPhone(customers, r.customerPhone);
    const check = getCustomerAvgCheck(cust);
    const multiplier = r.occasionType && r.occasionType !== 'standard' ? 1.35 : 1;
    return sum + (r.partySize || 0) * check * multiplier;
  }, 0);

  const liveRevenue = tables
    .filter((t) => t.status === TABLE_STATUS.OCCUPIED)
    .reduce((sum, t) => {
      const cust = t.guestName ? customers.find((c) => c.name?.startsWith(t.guestName?.split(' ')[0])) : null;
      return sum + (t.partySize || 2) * getCustomerAvgCheck(cust);
    }, 0);

  const eventDepositsCollected = todayEvents.filter((e) => e.depositPaid).reduce((s, e) => s + (e.deposit || 0), 0);
  const eventDepositsPending = todayEvents.filter((e) => e.deposit && !e.depositPaid).reduce((s, e) => s + (e.deposit || 0), 0);
  const eventProjected = todayEvents.reduce((s, e) => s + (e.partySize || 0) * DEFAULT_AVG_CHECK * 1.5, 0);

  const maxCovers = restaurant?.settings?.maxCoversPerSlot || 48;
  const pacing = TIME_SLOTS.map((time) => {
    const slotRes = tonight.filter((r) => r.time === time);
    const slotCovers = slotRes.reduce((acc, r) => acc + (r.partySize || 0), 0);
    return {
      time,
      covers: slotCovers,
      reservations: slotRes.length,
      capacity: maxCovers,
      utilization: maxCovers ? Math.round((slotCovers / maxCovers) * 100) : 0,
      overbooked: slotCovers > maxCovers,
      remaining: Math.max(maxCovers - slotCovers, 0),
    };
  }).filter((p) => p.covers > 0);

  const peakSlot = pacing.reduce((best, p) => (p.utilization > (best?.utilization || 0) ? p : best), null);

  const onDutyStaff = (staff || []).filter((s) => s.status === 'active' || s.status === 'on_duty');
  const occupied = tables.filter((t) => t.status === TABLE_STATUS.OCCUPIED).length;
  const tablesPerServer = onDutyStaff.length ? (occupied / onDutyStaff.length) : occupied;
  const idealRatio = 4;
  const staffingGap = Math.max(0, Math.ceil(occupied / idealRatio) - onDutyStaff.length);

  const duration = Number(restaurant?.settings?.reservationDuration) || 90;
  const turnAlerts = tables
    .filter((t) => t.status === TABLE_STATUS.OCCUPIED && t.seatedAt)
    .map((t) => {
      const turn = getEstimatedTurnTime(t, duration);
      const cust = customers.find((c) => c.name?.split(' ')[0] === t.guestName?.split(' ')[0]);
      const avgCheck = getCustomerAvgCheck(cust);
      const lostIfLate = turn.remaining <= 0 ? Math.round(avgCheck * 0.45) : 0;
      return {
        table: t,
        ...turn,
        urgent: turn.elapsed >= duration - 10,
        overdue: turn.remaining <= 0,
        nextTurnRevenue: Math.round(avgCheck * (t.partySize || 2) * 0.85),
        lostIfLate,
      };
    })
    .sort((a, b) => b.elapsed - a.elapsed);

  const noShowAlerts = tonight
    .map((r) => {
      const cust = findCustomerByPhone(customers, r.customerPhone);
      const risk = calcNoShowRisk(cust, r);
      const atRiskRevenue = (r.partySize || 0) * getCustomerAvgCheck(cust);
      return { reservation: r, customer: cust, risk, atRiskRevenue };
    })
    .filter((x) => x.risk >= 20)
    .sort((a, b) => b.risk - a.risk);

  const vipArrivals = tonight.filter((r) => r.vip).sort((a, b) => a.time.localeCompare(b.time));

  const pendingDeposits = [
    ...todayEvents.filter((e) => e.deposit && !e.depositPaid).map((e) => ({ type: 'event', name: e.title, amount: e.deposit, time: e.startTime })),
    ...tonight.filter((r) => r.deposit && !r.depositPaid).map((r) => ({ type: 'reservation', name: r.customerName, amount: r.deposit, time: r.time })),
  ];

  const waitlistMatches = (waitlist || []).map((w) => {
    const table = suggestBestTable(tables, w.partySize, w.preferredFloor);
    const floor = floors?.find((f) => f.id === table?.floorId);
    return { entry: w, table, floor, waitMinutes: w.waitTime || 0 };
  }).filter((m) => m.table);

  const floorBreakdown = (floors || []).map((floor) => {
    const ft = tables.filter((t) => t.floorId === floor.id);
    const resOnFloor = tonight.filter((r) => r.floorId === floor.id);
    const floorCovers = resOnFloor.reduce((s, r) => s + (r.partySize || 0), 0);
    const occ = ft.filter((t) => t.status === TABLE_STATUS.OCCUPIED).length;
    return {
      floor,
      tables: ft.length,
      occupied: occ,
      rate: ft.length ? Math.round((occ / ft.length) * 100) : 0,
      coversTonight: floorCovers,
      reservations: resOnFloor.length,
    };
  });

  const menu86 = (menuItems || []).filter((i) => !i.available);

  const totalForecast = Math.round(reservationRevenue + eventProjected * 0.4 + liveRevenue * 0.3);
  const avgCheckTonight = covers ? Math.round(reservationRevenue / covers) : DEFAULT_AVG_CHECK;

  return {
    date: dateStr,
    covers,
    walkInCovers,
    totalCovers: covers + walkInCovers,
    reservationRevenue: Math.round(reservationRevenue),
    liveRevenue: Math.round(liveRevenue),
    eventProjected: Math.round(eventProjected),
    eventDepositsCollected,
    eventDepositsPending,
    totalForecast,
    avgCheckTonight,
    pacing,
    peakSlot,
    onDutyStaff: onDutyStaff.length,
    tablesPerServer: Math.round(tablesPerServer * 10) / 10,
    staffingGap,
    turnAlerts,
    noShowAlerts,
    vipArrivals,
    pendingDeposits,
    waitlistMatches,
    floorBreakdown,
    menu86,
    noShowExposure: noShowAlerts.reduce((s, x) => s + x.atRiskRevenue, 0),
    turnRecoveryPotential: turnAlerts.filter((t) => t.overdue).reduce((s, t) => s + t.nextTurnRevenue, 0),
  };
};
