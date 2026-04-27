import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { useSucursales } from '../../hooks/useSucursales';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Plus, Edit, Power, PowerOff } from 'lucide-react';

/**
 * Vista de Listado de Sucursales.
 * Muestra todas las sedes registradas en el sistema.
 * Permite activarlas o desactivarlas, lo que afecta el alcance de las operaciones.
 */
export const SucursalesPage = () => {
  const navigate = useNavigate();
  const { sucursalesQuery, desactivarSucursal, isDesactivando } = useSucursales();
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, sucursal: null });

  const handleToggleEstado = (sucursal) => {
    setConfirmDialog({ isOpen: true, sucursal });
  };

  const confirmToggle = () => {
    if (confirmDialog.sucursal) {
      desactivarSucursal(confirmDialog.sucursal.id, {
        onSuccess: () => setConfirmDialog({ isOpen: false, sucursal: null })
      });
    }
  };

  const columns = [
    { header: 'ID', accessorKey: 'id', className: 'w-16' },
    { header: 'Nombre', accessorKey: 'nombre' },
    { header: 'Dirección', accessorKey: 'direccion', cell: (row) => row.direccion || '-' },
    { header: 'Teléfono', accessorKey: 'telefono', cell: (row) => row.telefono || '-' },
    { 
      header: 'Estado', 
      accessorKey: 'activo',
      cell: (row) => (
        <Badge variant="outline" className={row.activo ? 'bg-success-100 text-success-500 border-success-500/20' : 'bg-gray-100 text-gray-500'}>
          {row.activo ? 'Activa' : 'Inactiva'}
        </Badge>
      )
    },
    {
      header: 'Acciones',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/sucursales/${row.id}/editar`)}>
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
        title="Sucursales" 
        breadcrumb="Configuración › Sucursales"
        actionButton={
          <Button onClick={() => navigate('/sucursales/nuevo')} className="bg-primary-600 hover:bg-primary-700">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Sucursal
          </Button>
        }
      />

      <DataTable 
        columns={columns} 
        data={sucursalesQuery.data || []} 
        isLoading={sucursalesQuery.isLoading}
      />

      <ConfirmDialog 
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, sucursal: null })}
        onConfirm={confirmToggle}
        title={confirmDialog.sucursal?.activo ? "Desactivar sucursal" : "Activar sucursal"}
        description={`¿Estás seguro que deseas ${confirmDialog.sucursal?.activo ? 'desactivar' : 'activar'} la sucursal "${confirmDialog.sucursal?.nombre}"?`}
        confirmText={confirmDialog.sucursal?.activo ? "Desactivar" : "Activar"}
        isDestructive={confirmDialog.sucursal?.activo}
        isLoading={isDesactivando}
      />
    </div>
  );
};
