import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { useCompras } from '../../hooks/useCompras';
import { Button } from '../../components/ui/button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CurrencyDisplay } from '../../components/common/CurrencyDisplay';
import { formatDate } from '../../utils/formatters';
import { Plus, Eye } from 'lucide-react';
import useAuthStore from '../../store/authStore';

export const ComprasPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = user?.rolNombre === 'ADMIN';

  const { comprasQuery } = useCompras({
    sucursalId: isAdmin ? null : user?.sucursalId
  });

  const columns = [
    { header: 'Orden', accessorKey: 'id', className: 'w-16 font-mono text-gray-500' },
    { header: 'Fecha', accessorKey: 'fecha', cell: (row) => formatDate(row.fecha) },
    { header: 'Proveedor', accessorKey: 'proveedorNombre' },
    ...(isAdmin ? [{ header: 'Sucursal', accessorKey: 'sucursalNombre' }] : []),
    { header: 'Total', accessorKey: 'total', cell: (row) => <CurrencyDisplay amount={row.total} /> },
    { header: 'Estado', accessorKey: 'estado', cell: (row) => <StatusBadge status={row.estado} /> },
    {
      header: 'Acciones',
      cell: (row) => (
        <div className="flex items-center gap-2">
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
