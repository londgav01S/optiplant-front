import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { canAccess } from '../../utils/roleGuards';

/**
 * Componente envoltorio para proteger rutas privadas.
 * Verifica que el usuario esté autenticado y tenga los roles necesarios para acceder a la vista.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes o vistas a renderizar si se permite el acceso.
 * @param {Array<string>} [props.allowedRoles] - Lista de roles permitidos para la ruta (ej. ['ADMIN', 'GERENTE']).
 */
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  // Muestra un estado de carga mientras se valida la sesión con el backend
  if (isLoading) {
    // Podría ser un Skeleton de toda la página o un loader global
    return <div className="h-screen w-screen flex items-center justify-center">Cargando...</div>;
  }

  // Si no está autenticado, bloquea el acceso y redirige al login
  if (!isAuthenticated) {
    // Redirigir al login guardando la ruta intentada para volver a ella después
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si la ruta requiere roles específicos, verifica contra el rol del usuario
  if (allowedRoles && !canAccess(user, allowedRoles)) {
    // Si no tiene permisos, redirigir a no autorizado (por ahora a /403, si existe)
    return <Navigate to="/403" replace />;
  }

  // Si todo está correcto, renderiza la vista solicitada
  return children;
};
