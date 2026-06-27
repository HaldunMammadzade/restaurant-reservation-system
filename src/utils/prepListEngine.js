import { RESERVATION_STATUS, DIETARY_LABELS } from './constants';

export const computePrepList = ({ reservations, events, menuItems, date = new Date() }) => {
  const dateStr = date.toDateString();
  const todayRes = reservations.filter((r) => {
    if ([RESERVATION_STATUS.CANCELLED, RESERVATION_STATUS.NO_SHOW].includes(r.status)) return false;
    return new Date(r.date).toDateString() === dateStr;
  });
  const todayEvents = (events || []).filter((e) => new Date(e.date).toDateString() === dateStr);

  const dietaryCounts = {};
  todayRes.forEach((r) => {
    const d = r.dietary && r.dietary !== 'none' ? r.dietary : null;
    if (d) dietaryCounts[d] = (dietaryCounts[d] || 0) + (r.partySize || 1);
  });

  const dietaryItems = Object.entries(dietaryCounts).map(([key, count]) => ({
    type: 'dietary',
    label: DIETARY_LABELS[key] || key,
    count,
    priority: count >= 4 ? 'high' : 'normal',
  }));

  const occasionItems = todayRes
    .filter((r) => r.occasionType && r.occasionType !== 'standard')
    .map((r) => ({
      type: 'occasion',
      label: `${r.customerName} — ${r.occasionType}`,
      time: r.time,
      partySize: r.partySize,
      notes: r.notes,
      priority: r.vip ? 'high' : 'normal',
    }));

  const eventPrep = todayEvents.map((e) => ({
    type: 'event',
    label: e.title,
    time: e.startTime,
    partySize: e.partySize,
    checklist: e.checklist?.filter((c) => !c.done).map((c) => c.label) || [],
    priority: 'high',
  }));

  const popularItems = menuItems
    .filter((m) => m.isPopular && m.available)
    .map((m) => ({
      type: 'stock',
      label: m.name,
      prepTime: m.prepTime,
      estimatedQty: Math.ceil(todayRes.reduce((s, r) => s + r.partySize, 0) * 0.15),
      priority: 'normal',
    }));

  const unavailable = menuItems.filter((m) => !m.available).map((m) => ({
    type: '86',
    label: m.name,
    priority: 'high',
  }));

  const totalCovers = todayRes.reduce((s, r) => s + (r.partySize || 0), 0)
    + todayEvents.reduce((s, e) => s + (e.partySize || 0), 0);

  return {
    totalCovers,
    dietaryItems,
    occasionItems,
    eventPrep,
    popularItems,
    unavailable,
    all: [...dietaryItems, ...occasionItems, ...eventPrep, ...popularItems, ...unavailable],
  };
};
