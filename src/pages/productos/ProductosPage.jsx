import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { useProductos } from '../../hooks/useProductos';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { CurrencyDisplay } from '../../components/common/CurrencyDisplay';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Plus, Edit, Eye, Power, PowerOff } from 'lucide-react';

export const ProductosPage = () => {
  const navigate = useNavigate();
  const { productosQuery, desactivarProducto, isDesactivando } = useProductos({});
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, producto: null });

  const handleToggleEstado = (producto) => {
    setConfirmDialog({ isOpen: true, producto });
  };

  const confirmToggle = () => {
    if (confirmDialog.producto) {
      desactivarProducto(confirmDialog.producto.id, {
        onSuccess: () => setConfirmDialog({ isOpen: false, producto: null })
      });
    }
  };

  const columns = [
    { header: 'Código', accessorKey: 'codigo', className: 'font-mono text-sm' },
    { header: 'Nombre', accessorKey: 'nombre' },
    { header: 'Categoría', accessorKey: 'categoria', cell: (row) => row.categoria || '-' },
    { header: 'Precio Base', accessorKey: 'precioBase', cell: (row) => <CurrencyDisplay amount={row.precioBase} /> },
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
          <Button variant="ghost" size="sm" onClick={() => navigate(`/productos/${row.id}`)} title="Ver detalles">
            <Eye className="h-4 w-4 text-info-500 hover:text-info-600" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate(`/productos/${row.id}/editar`)}>
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
        title="Productos" 
        breadcrumb="Catálogo › Productos"
        actionButton={
          <Button onClick={() => navigate('/productos/nuevo')} className="bg-primary-600 hover:bg-primary-700">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        }
      />

      <DataTable 
        columns={columns} 
        data={productosQuery.data?.content || productosQuery.data || []} 
        isLoading={productosQuery.isLoading}
        pageParams={productosQuery.data?.pageable ? productosQuery.data : null}
      />

      <ConfirmDialog 
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, producto: null })}
        onConfirm={confirmToggle}
        title={confirmDialog.producto?.activo ? "Desactivar producto" : "Activar producto"}
        description={`¿Estás seguro que deseas ${confirmDialog.producto?.activo ? 'desactivar' : 'activar'} el producto "${confirmDialog.producto?.nombre}"?`}
        confirmText={confirmDialog.producto?.activo ? "Desactivar" : "Activar"}
        isDestructive={confirmDialog.producto?.activo}
        isLoading={isDesactivando}
      />
    </div>
  );
};
