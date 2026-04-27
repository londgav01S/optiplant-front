import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Layout básico para las páginas relacionadas con la autenticación.
 * Centra el contenido en la pantalla y provee un fondo neutro (ej. para la página de Login).
 */
export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Outlet />
    </div>
  );
};
