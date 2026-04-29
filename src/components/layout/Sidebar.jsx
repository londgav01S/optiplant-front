import React from 'react';
import { NavLink } from 'react-router-dom';
import { canAccess } from '../../utils/roleGuards';
import useAuthStore from '../../store/authStore';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  ArrowRightLeft,
  Bell,
  BarChart3,
  Users,
  Store,
  Settings
} from 'lucide-react';

/**
 * Configuración central del menú de navegación lateral.
 * Define la estructura, iconos, rutas y permisos necesarios para cada elemento.
 */
const MENU_ITEMS = [
  {
    category: 'Inicio',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'GERENTE'] },
    ]
  },
  {
    category: 'Operaciones',
    items: [
      { name: 'Inventario', path: '/inventario', icon: Package, roles: ['ADMIN', 'GERENTE', 'OPERADOR'] },
      { name: 'Ventas', path: '/ventas', icon: ShoppingCart, roles: ['ADMIN', 'GERENTE', 'OPERADOR'] },
      { name: 'Compras', path: '/compras', icon: Store, roles: ['ADMIN', 'GERENTE', 'OPERADOR'] },
      { name: 'Transferencias', path: '/transferencias', icon: ArrowRightLeft, roles: ['ADMIN', 'GERENTE', 'OPERADOR'] },
    ]
  },
  {
    category: 'Análisis',
    items: [
      { name: 'Alertas', path: '/alertas', icon: Bell, roles: ['ADMIN', 'GERENTE', 'OPERADOR'] },
      { name: 'Logística', path: '/logistica', icon: Truck, roles: ['ADMIN', 'GERENTE', 'OPERADOR'] },
    ]
  },
  {
    category: 'Configuración',
    items: [
      { name: 'Productos', path: '/productos', icon: Settings, roles: ['ADMIN', 'GERENTE'] },
      { name: 'Proveedores', path: '/proveedores', icon: Users, roles: ['ADMIN', 'GERENTE'] },
      { name: 'Usuarios', path: '/usuarios', icon: Users, roles: ['ADMIN'] },
      { name: 'Sucursales', path: '/sucursales', icon: Store, roles: ['ADMIN'] },
    ]
  }
];

/**
 * Componente de Navegación Lateral (Sidebar).
 * Muestra el menú interactivo con enlaces filtrados según el rol del usuario autenticado.
 * Es responsivo: actúa como un cajón deslizable en dispositivos móviles y barra fija en desktop.
 * 
 * @param {Object} props
 * @param {boolean} props.isMobileOpen - Estado que indica si el menú móvil está abierto.
 * @param {Function} props.setIsMobileOpen - Función para alternar la visibilidad del menú móvil.
 */
export const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const user = useAuthStore(state => state.user);

  return (
    <>
      {/* Mobile backdrop para cerrar menú al hacer click fuera */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 md:hidden" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Contenedor principal del sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-100 border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:w-64 md:shrink-0 flex flex-col ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Cabecera del sidebar (Logo/Marca) */}
        <div className="h-16 flex items-center px-6 bg-white border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary-600 rounded flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">OptiPlant</span>
          </div>
        </div>

        {/* Listado de menús */}
        <div className="flex-1 overflow-y-auto py-4">
          {MENU_ITEMS.map((section, idx) => {
            // Filtrar items asegurándose de que el usuario tiene los roles adecuados
            const visibleItems = section.items.filter(item => canAccess(user, item.roles));
            
            // Si no hay items visibles para la categoría, no se renderiza el encabezado
            if (visibleItems.length === 0) return null;

            return (
              <div key={idx} className="mb-6 px-4">
                <p className="px-2 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {section.category}
                </p>
                <div className="space-y-1">
                  {visibleItems.map((item, itemIdx) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={itemIdx}
                        to={item.path}
                        onClick={() => setIsMobileOpen(false)}
                        className={({ isActive }) => 
                          `flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors ${
                            isActive 
                              ? 'bg-primary-100 text-primary-600' 
                              : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                          }`
                        }
                      >
                        <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                        {item.name}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
