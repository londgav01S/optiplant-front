import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { canAccess } from '../../utils/roleGuards';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    // Podría ser un Skeleton de toda la página o un loader global
    return <div className="h-screen w-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!isAuthenticated) {
    // Redirigir al login guardando la ruta intentada
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !canAccess(user, allowedRoles)) {
    // Si no tiene permisos, redirigir a no autorizado
    return <Navigate to="/403" replace />;
  }

  return children;
};
