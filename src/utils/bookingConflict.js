import { RESERVATION_STATUS } from './constants';

export const findBookingConflicts = (reservations, { date, time, tableId, tableIds = [], excludeId }) => {
  const dateStr = new Date(date).toDateString();
  const ids = [tableId, ...tableIds].filter(Boolean);
  const conflicts = [];

  reservations.forEach((r) => {
    if (excludeId && r.id === excludeId) return;
    if ([RESERVATION_STATUS.CANCELLED, RESERVATION_STATUS.NO_SHOW, RESERVATION_STATUS.COMPLETED].includes(r.status)) return;
    if (new Date(r.date).toDateString() !== dateStr) return;
    if (r.time !== time) return;

    const rTables = [r.tableId, ...(r.mergedTableIds || [])].filter(Boolean);
    const overlap = ids.some((id) => rTables.includes(id));
    if (overlap) {
      conflicts.push({
        reservation: r,
        message: `Masa ${r.tableNumber} — ${r.customerName} (${r.time}) ilə üst-üstə düşür`,
      });
    }
  });

  return conflicts;
};

export const computeTurnQueue = (tables, restaurant) => {
  const duration = Number(restaurant?.settings?.reservationDuration) || 90;
  return tables
    .filter((t) => t.status === 'occupied' && t.seatedAt)
    .map((t) => {
      const elapsed = Math.floor((Date.now() - t.seatedAt) / 60000);
      const remaining = Math.max(duration - elapsed, 0);
      const freeAt = new Date(Date.now() + remaining * 60000);
      return { table: t, elapsed, remaining, freeAt, eta: remaining };
    })
    .sort((a, b) => a.remaining - b.remaining);
};
