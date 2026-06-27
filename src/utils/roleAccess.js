export const ROLE_NAV = {
  admin: null,
  manager: ['/dashboard', '/operations', '/hostess', '/reservations', '/events', '/waitlist', '/floor-plan', '/kitchen', '/billing', '/prep', '/customers', '/menu', '/staff', '/communications', '/daily-close', '/loyalty', '/incidents', '/analytics', '/settings'],
  hostess: ['/dashboard', '/hostess', '/reservations', '/waitlist', '/floor-plan', '/communications'],
  server: ['/dashboard', '/floor-plan', '/kitchen', '/billing', '/table-menu'],
  kitchen: ['/dashboard', '/kitchen', '/prep'],
};

export const filterNavByRole = (items, role) => {
  const allowed = ROLE_NAV[role];
  if (!allowed) return items;
  return items.filter((item) => allowed.includes(item.path));
};
