import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { useVentas } from '../../hooks/useVentas';
import { Button } from '../../components/ui/button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CurrencyDisplay } from '../../components/common/CurrencyDisplay';
import { formatDate } from '../../utils/formatters';
import { Plus, Eye } from 'lucide-react';
import useAuthStore from '../../store/authStore';

/**
 * Vista de Listado de Ventas.
 * Muestra el registro histórico de las ventas de la sucursal del usuario
 * (o de todas las sucursales si es ADMIN).
 */
export const VentasPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = user?.rolNombre === 'ADMIN';

  const { ventasQuery } = useVentas({
    sucursalId: isAdmin ? null : user?.sucursalId
  });

  const columns = [
    { header: 'ID', accessorKey: 'id', className: 'w-16 font-mono text-gray-500' },
    { header: 'Fecha', accessorKey: 'fecha', cell: (row) => formatDate(row.fecha) },
    { header: 'Cliente', accessorKey: 'clienteNombre', cell: (row) => row.clienteNombre || '-' },
    // Solo mostrar sucursal si es admin
    ...(isAdmin ? [{ header: 'Sucursal', accessorKey: 'sucursalNombre' }] : []),
    { header: 'Total', accessorKey: 'total', cell: (row) => <CurrencyDisplay amount={row.total} /> },
    { header: 'Estado', accessorKey: 'estado', cell: (row) => <StatusBadge status={row.estado} /> },
    {
      header: 'Acciones',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/ventas/${row.id}`)} title="Ver detalles">
            <Eye className="h-4 w-4 text-info-500 hover:text-info-600" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader 
        title="Ventas" 
        breadcrumb="Operaciones › Ventas"
        actionButton={
          <Button onClick={() => navigate('/ventas/nuevo')} className="bg-primary-600 hover:bg-primary-700">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Venta
          </Button>
        }
      />

      <DataTable 
        columns={columns} 
        data={ventasQuery.data?.content || ventasQuery.data || []} 
        isLoading={ventasQuery.isLoading}
        pageParams={ventasQuery.data?.pageable ? ventasQuery.data : null}
      />
    </div>
  );
};
