export const normalizeRole = (role) => {
  if (!role || typeof role !== 'string') return null;
  const normalized = role.trim().toUpperCase();
  return normalized.startsWith('ROLE_') ? normalized.slice(5) : normalized;
};

export const canAccess = (user, allowedRoles) => {
  const userRole = normalizeRole(user?.rolNombre);
  if (!userRole) return false;

  if (userRole === 'ADMIN') return true; // ADMIN always has access

  const normalizedAllowed = Array.isArray(allowedRoles)
    ? allowedRoles.map(normalizeRole).filter(Boolean)
    : [];

  return normalizedAllowed.includes(userRole);
};

export const getDefaultRouteForRole = (user) => {
  const role = normalizeRole(user?.rolNombre);

  switch (role) {
    case 'ADMIN':
    case 'GERENTE':
      return '/dashboard';
    case 'OPERADOR':
      return '/ventas';
    default:
      return '/ventas';
  }
};
