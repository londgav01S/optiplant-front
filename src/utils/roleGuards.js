export const canAccess = (user, allowedRoles) => {
  if (!user || !user.rolNombre) return false;
  if (user.rolNombre === 'ADMIN') return true; // ADMIN always has access
  return allowedRoles.includes(user.rolNombre);
};
