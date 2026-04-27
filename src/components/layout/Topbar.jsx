import React from 'react';
import { Menu, LogOut, User } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";

export const Topbar = ({ setIsMobileOpen }) => {
  const { user, logout } = useAuthStore();

  const getRoleColor = (rolNombre) => {
    switch (rolNombre) {
      case 'ADMIN': return 'bg-[#7C3AED] text-white hover:bg-[#7C3AED]/80';
      case 'GERENTE': return 'bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/80';
      case 'OPERADOR': return 'bg-[#0D9488] text-white hover:bg-[#0D9488]/80';
      default: return 'bg-gray-500 text-white';
    }
  };

  const initials = user?.nombre ? user.nombre.substring(0, 2).toUpperCase() : 'US';

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center">
        <button
          type="button"
          className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 rounded-md focus:outline-none"
          onClick={() => setIsMobileOpen(true)}
        >
          <span className="sr-only">Abrir menú</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="hidden md:flex text-sm text-gray-500">
          {/* Aquí iría el breadcrumb dinámico. Por ahora es un placeholder */}
          Sistema de Inventario
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <Badge className={`hidden sm:inline-flex ${getRoleColor(user.rolNombre)} border-0`}>
            {user.rolNombre}
          </Badge>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 rounded-full flex items-center gap-2 pl-2 pr-0 sm:pr-2">
              <div className="hidden sm:flex flex-col items-end text-sm text-right mr-2">
                <span className="font-medium text-gray-900 leading-none">{user?.nombre || 'Usuario'}</span>
                <span className="text-xs text-gray-500 leading-tight mt-1">{user?.sucursalNombre || 'Sucursal Principal'}</span>
              </div>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary-100 text-primary-600 font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.nombre}</p>
                <p className="text-xs leading-none text-gray-500">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-danger-500 focus:text-danger-500 focus:bg-danger-50 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
