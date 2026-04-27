import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

/**
 * Layout principal de la aplicación.
 * Engloba la barra lateral (Sidebar), la barra superior (Topbar) y el área de contenido principal.
 * Maneja el estado de visibilidad del menú en dispositivos móviles.
 */
export const MainLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Navegación lateral principal */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Barra superior con acciones de usuario */}
        <Topbar setIsMobileOpen={setIsMobileOpen} />
        
        {/* Contenedor principal donde se inyectan las vistas mediante react-router */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
