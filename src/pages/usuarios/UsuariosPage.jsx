import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { useUsuarios } from '../../hooks/useUsuarios';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Plus, Edit, Power, PowerOff } from 'lucide-react';

/**
 * Vista de Listado de Usuarios.
 * Muestra una tabla con el personal registrado en el sistema.
 * Permite cambiar su estado (Activo/Inactivo) mediante un modal de confirmación.
 */
export const UsuariosPage = () => {
  const navigate = useNavigate();
  // En una versión más avanzada se pueden manejar paginación y filtros desde el estado
  const { usuariosQuery, toggleEstado, isToggling } = useUsuarios({});
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, usuario: null });

  const handleToggleEstado = (usuario) => {
    setConfirmDialog({ isOpen: true, usuario });
  };

  const confirmToggle = () => {
    if (confirmDialog.usuario) {
      toggleEstado(confirmDialog.usuario.id, {
        onSuccess: () => setConfirmDialog({ isOpen: false, usuario: null })
      });
    }
  };

  const columns = [
    { header: 'Nombre', accessorKey: 'nombre' },
    { header: 'Email', accessorKey: 'email' },
    { 
      header: 'Rol', 
      accessorKey: 'rolNombre',
      cell: (row) => (
        <Badge variant="outline" className="bg-primary-50 text-primary-600 border-primary-600/20">
          {row.rolNombre}
        </Badge>
      )
    },
    { header: 'Sucursal', accessorKey: 'sucursalNombre', cell: (row) => row.sucursalNombre || 'N/A' },
    { 
      header: 'Estado', 
      accessorKey: 'activo',
      cell: (row) => (
        <Badge variant="outline" className={row.activo ? 'bg-success-100 text-success-500 border-success-500/20' : 'bg-gray-100 text-gray-500'}>
          {row.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    },
    {
      header: 'Acciones',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/usuarios/${row.id}/editar`)}>
            <Edit className="h-4 w-4 text-gray-500 hover:text-primary-600" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleToggleEstado(row)}>
            {row.activo ? (
              <PowerOff className="h-4 w-4 text-danger-500" />
            ) : (
              <Power className="h-4 w-4 text-success-500" />
            )}
          </Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader 
        title="Usuarios" 
        breadcrumb="Configuración › Usuarios"
        actionButton={
          <Button onClick={() => navigate('/usuarios/nuevo')} className="bg-primary-600 hover:bg-primary-700">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </Button>
        }
      />

      {/* Aquí irían los filtros si se implementaran (ej. Select de sucursal) */}

      <DataTable 
        columns={columns} 
        data={usuariosQuery.data?.content || usuariosQuery.data || []} 
        isLoading={usuariosQuery.isLoading}
        pageParams={usuariosQuery.data?.pageable ? usuariosQuery.data : null}
      />

      <ConfirmDialog 
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, usuario: null })}
        onConfirm={confirmToggle}
        title={confirmDialog.usuario?.activo ? "Desactivar usuario" : "Activar usuario"}
        description={`¿Estás seguro que deseas ${confirmDialog.usuario?.activo ? 'desactivar' : 'activar'} a ${confirmDialog.usuario?.nombre}?`}
        confirmText={confirmDialog.usuario?.activo ? "Desactivar" : "Activar"}
        isDestructive={confirmDialog.usuario?.activo}
        isLoading={isToggling}
      />
    </div>
  );
};
