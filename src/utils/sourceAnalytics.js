import { BOOKING_SOURCE_LABELS } from './constants';

export const computeSourceAnalytics = (reservations) => {
  const counts = {};
  const revenue = {};

  reservations.forEach((r) => {
    const src = r.source || 'unknown';
    counts[src] = (counts[src] || 0) + 1;
    revenue[src] = (revenue[src] || 0) + (r.partySize || 0) * 95;
  });

  return Object.keys(counts)
    .map((src) => ({
      source: src,
      label: BOOKING_SOURCE_LABELS[src] || src,
      count: counts[src],
      estimatedRevenue: revenue[src],
      vipCount: reservations.filter((r) => r.source === src && r.vip).length,
    }))
    .sort((a, b) => b.count - a.count);
};
