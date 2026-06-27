export const getLoyaltyTier = (points, tiers) => {
  const sorted = [...(tiers || [])].sort((a, b) => b.minPoints - a.minPoints);
  return sorted.find((t) => points >= t.minPoints) || sorted[sorted.length - 1];
};

export const pointsFromSpend = (amount, pointsPerAzn = 1) => Math.floor(amount * pointsPerAzn);

export const loyaltyDiscountAmount = (subtotal, tier) =>
  Math.round(subtotal * ((tier?.discount || 0) / 100) * 100) / 100;

export const getCustomerLoyalty = (customer, program) => {
  const points = customer?.loyaltyPoints || 0;
  const tier = getLoyaltyTier(points, program?.tiers);
  const nextTier = (program?.tiers || []).find((t) => t.minPoints > points);
  return {
    points,
    tier,
    nextTier,
    pointsToNext: nextTier ? nextTier.minPoints - points : 0,
    discountPercent: tier?.discount || 0,
  };
};
