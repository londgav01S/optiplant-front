import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { useCompras } from '../../hooks/useCompras';
import { Button } from '../../components/ui/button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CurrencyDisplay } from '../../components/common/CurrencyDisplay';
import { formatDate } from '../../utils/formatters';
import { Plus, Eye, PackageCheck, XCircle } from 'lucide-react';
import useAuthStore from '../../store/authStore';

/**
 * Vista de Listado de Compras.
 * Muestra el historial de compras realizadas a proveedores.
 * Administradores ven compras de todas las sucursales, usuarios normales solo de la suya.
 */
export const ComprasPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = user?.rolNombre === 'ADMIN';

  const { comprasQuery, recibirCompra, cancelarCompra, isRecibiendo, isCancelando } = useCompras({
    sucursalId: isAdmin ? null : user?.sucursalId
  });

  const handleRecibir = (id) => {
    recibirCompra(id);
  };

  const handleCancelar = (id) => {
    const confirmed = window.confirm('¿Estás seguro de cancelar esta orden de compra?');
    if (!confirmed) return;
    cancelarCompra(id);
  };

  const columns = [
    { header: 'Orden', accessorKey: 'id', className: 'w-16 font-mono text-gray-500' },
    { header: 'Fecha', accessorKey: 'fechaCreacion', cell: (row) => formatDate(row.fechaCreacion) },
    { header: 'Proveedor', accessorKey: 'proveedorNombre' },
    ...(isAdmin ? [{ header: 'Sucursal', accessorKey: 'sucursalNombre' }] : []),
    { header: 'Total', accessorKey: 'total', cell: (row) => <CurrencyDisplay amount={row.total} /> },
    { header: 'Estado', accessorKey: 'estado', cell: (row) => <StatusBadge status={row.estado} /> },
    {
      header: 'Acciones',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.estado === 'PENDIENTE' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRecibir(row.id)}
                disabled={isRecibiendo || isCancelando}
                title="Marcar como recibida"
              >
                <PackageCheck className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCancelar(row.id)}
                disabled={isRecibiendo || isCancelando}
                title="Cancelar orden"
              >
                <XCircle className="h-4 w-4 text-danger-500" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm" onClick={() => navigate(`/compras/${row.id}`)} title="Ver detalles">
            <Eye className="h-4 w-4 text-info-500 hover:text-info-600" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader 
        title="Compras" 
        breadcrumb="Operaciones › Compras"
        actionButton={
          <Button onClick={() => navigate('/compras/nuevo')} className="bg-primary-600 hover:bg-primary-700">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Compra
          </Button>
        }
      />

      <DataTable 
        columns={columns} 
        data={comprasQuery.data?.content || comprasQuery.data || []} 
        isLoading={comprasQuery.isLoading}
        pageParams={comprasQuery.data?.pageable ? comprasQuery.data : null}
      />
    </div>
  );
};
