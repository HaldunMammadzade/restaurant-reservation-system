import { TABLE_STATUS, RESERVATION_STATUS, TIME_SLOTS } from './constants';

export const normalizePhone = (phone) => ('' + phone).replace(/\D/g, '');

export const findCustomerByPhone = (customers, phone) => {
  const n = normalizePhone(phone);
  return customers.find((c) => normalizePhone(c.phone) === n || normalizePhone(c.phone).endsWith(n.slice(-9)));
};

export const getTablesForSlot = (tables, reservations, date, time, partySize, floorId, zone) => {
  const dateStr = new Date(date).toDateString();
  const bookedTableIds = new Set(
    reservations
      .filter((r) => {
        if (r.status === RESERVATION_STATUS.CANCELLED || r.status === RESERVATION_STATUS.NO_SHOW) return false;
        return new Date(r.date).toDateString() === dateStr && r.time === time;
      })
      .flatMap((r) => [r.tableId, ...(r.mergedTableIds || [])].filter(Boolean)),
  );

  return tables.filter((t) => {
    if (t.status === TABLE_STATUS.MAINTENANCE || t.status === TABLE_STATUS.CLEANING) return false;
    if (bookedTableIds.has(t.id)) return false;
    if (floorId && t.floorId !== floorId) return false;
    if (zone && t.zone !== zone) return false;
    if (t.capacity < partySize) return false;
    if (t.status === TABLE_STATUS.OCCUPIED) return false;
    return true;
  });
};

const isSlotBlocked = (settings, date, time) => {
  if (!settings?.blockedDates?.length) return false;
  const dateKey = typeof date === 'string' ? date.split('T')[0] : new Date(date).toISOString().split('T')[0];
  return settings.blockedDates.some((bd) => {
    if (bd.date !== dateKey) return false;
    if (bd.allDay) return true;
    return (bd.slots || []).includes(time);
  });
};

const coversForSlot = (reservations, date, time) => {
  const dateStr = new Date(date).toDateString();
  return reservations
    .filter((r) => {
      if (r.status === RESERVATION_STATUS.CANCELLED || r.status === RESERVATION_STATUS.NO_SHOW) return false;
      return new Date(r.date).toDateString() === dateStr && r.time === time;
    })
    .reduce((sum, r) => sum + (r.partySize || 0), 0);
};

export const getAvailableSlots = (tables, reservations, date, partySize, floorId, zone, settings) =>
  TIME_SLOTS.filter((time) => {
    if (isSlotBlocked(settings, date, time)) return false;
    const maxCovers = settings?.maxCoversPerSlot;
    if (maxCovers && coversForSlot(reservations, date, time) + partySize > maxCovers) return false;
    const available = getTablesForSlot(tables, reservations, date, time, partySize, floorId, zone);
    return available.length > 0;
  }).map((time) => {
    const available = getTablesForSlot(tables, reservations, date, time, partySize, floorId, zone);
    return { time, availableCount: available.length, tables: available };
  });

export const suggestBestTable = (tables, partySize, floorId, zone) => {
  let candidates = tables.filter((t) =>
    t.status === TABLE_STATUS.AVAILABLE && t.capacity >= partySize,
  );
  if (floorId) candidates = candidates.filter((t) => t.floorId === floorId);
  if (zone) candidates = candidates.filter((t) => t.zone === zone);
  candidates.sort((a, b) => a.capacity - b.capacity);
  return candidates[0] || null;
};

export const getEstimatedTurnTime = (table, defaultMinutes = 90) => {
  if (!table?.seatedAt) return null;
  const elapsed = Math.floor((Date.now() - table.seatedAt) / 60000);
  const remaining = Math.max(defaultMinutes - elapsed, 0);
  return { elapsed, remaining, total: defaultMinutes };
};

export const defaultEventChecklist = (occasionType) => [
  { id: 'deposit', label: 'Depozit alınıb', done: false, auto: true },
  { id: 'menu', label: 'Menyu / paket təsdiqlənib', done: false },
  { id: 'room', label: 'Salon hazırlığı', done: false },
  { id: 'staff', label: 'Personal təyin edilib', done: false },
  { id: 'sms', label: 'SMS xatırlatma göndərilib', done: false, auto: true },
  { id: 'decor', label: occasionType === 'birthday' ? 'Dekorasiya / tort' : 'Xüsusi tələblər', done: false },
];
