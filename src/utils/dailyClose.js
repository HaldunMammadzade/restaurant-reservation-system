import { RESERVATION_STATUS, TABLE_STATUS } from './constants';
import { getCustomerAvgCheck } from './operationsEngine';
import { findCustomerByPhone } from './bookingHelpers';

export const computeDailyClose = ({
  reservations, events, tables, customers, menuItems, waitlist, operationsBriefing,
}) => {
  const today = new Date().toDateString();
  const todayRes = reservations.filter((r) => new Date(r.date).toDateString() === today);
  const checkedIn = todayRes.filter((r) => r.status === RESERVATION_STATUS.CHECKED_IN);
  const completed = todayRes.filter((r) => r.status === RESERVATION_STATUS.COMPLETED);
  const noShows = todayRes.filter((r) => r.status === RESERVATION_STATUS.NO_SHOW);
  const cancelled = todayRes.filter((r) => r.status === RESERVATION_STATUS.CANCELLED);

  const reservationRevenue = [...checkedIn, ...completed].reduce((sum, r) => {
    const cust = findCustomerByPhone(customers, r.customerPhone);
    return sum + (r.partySize || 0) * getCustomerAvgCheck(cust);
  }, 0);

  const tableOrderRevenue = tables.reduce((sum, t) => {
    if (!t.orders?.length) return sum;
    return sum + t.orders.reduce((s, o) => s + o.price * o.qty, 0);
  }, 0);

  const walkInRevenue = tables
    .filter((t) => t.status === TABLE_STATUS.OCCUPIED && !todayRes.some((r) => r.tableId === t.id && r.status === RESERVATION_STATUS.CHECKED_IN))
    .reduce((sum, t) => sum + (t.partySize || 2) * getCustomerAvgCheck(null), 0);

  const depositsToday = events
    .filter((e) => new Date(e.date).toDateString() === today && e.depositPaid)
    .reduce((s, e) => s + (e.deposit || 0), 0);

  const coversServed = checkedIn.reduce((s, r) => s + (r.partySize || 0), 0)
    + completed.reduce((s, r) => s + (r.partySize || 0), 0)
    + tables.filter((t) => t.status === TABLE_STATUS.OCCUPIED).reduce((s, t) => s + (t.partySize || 0), 0);

  const avgCheck = coversServed ? Math.round((reservationRevenue + tableOrderRevenue + walkInRevenue) / coversServed) : 0;
  const totalGross = Math.round(reservationRevenue + tableOrderRevenue + walkInRevenue + depositsToday);
  const lostNoShow = noShows.reduce((s, r) => {
    const cust = findCustomerByPhone(customers, r.customerPhone);
    return s + (r.partySize || 0) * getCustomerAvgCheck(cust);
  }, 0);

  const unavailableItems = menuItems.filter((m) => !m.available).length;
  const openTables = tables.filter((t) => t.status === TABLE_STATUS.OCCUPIED).length;

  return {
    reservationRevenue: Math.round(reservationRevenue),
    tableOrderRevenue: Math.round(tableOrderRevenue),
    walkInRevenue: Math.round(walkInRevenue),
    depositsToday: Math.round(depositsToday),
    totalGross,
    avgCheck,
    coversServed,
    reservationsTotal: todayRes.length,
    checkedIn: checkedIn.length,
    completed: completed.length,
    noShows: noShows.length,
    cancelled: cancelled.length,
    lostNoShow: Math.round(lostNoShow),
    waitlistServed: waitlist.length === 0 ? operationsBriefing?.waitlistMatches?.length || 0 : 0,
    unavailableItems,
    openTables,
    forecastDelta: totalGross - (operationsBriefing?.totalForecast || totalGross),
  };
};
