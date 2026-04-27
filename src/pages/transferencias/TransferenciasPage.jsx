import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { useTransferencias } from '../../hooks/useTransferencias';
import { Button } from '../../components/ui/button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/formatters';
import { Plus, Eye } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { Badge } from '../../components/ui/badge';

/**
 * Vista de Listado de Transferencias.
 * Muestra el registro de todos los movimientos inter-sucursales.
 * Permite a los usuarios consultar transferencias relacionadas con su sucursal,
 * y a los administradores ver el consolidado global.
 */
export const TransferenciasPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = user?.rolNombre === 'ADMIN';

  const { transferenciasQuery } = useTransferencias({
    sucursalId: isAdmin ? null : user?.sucursalId
  });

  const columns = [
    { header: 'ID', accessorKey: 'id', className: 'w-16 font-mono text-gray-500' },
    { header: 'Fecha', accessorKey: 'fecha', cell: (row) => formatDate(row.fecha) },
    { header: 'Origen', accessorKey: 'sucursalOrigenNombre' },
    { header: 'Destino', accessorKey: 'sucursalDestinoNombre' },
    { 
      header: 'Urgencia', 
      accessorKey: 'urgencia',
      cell: (row) => (
        <Badge variant="outline" className={row.urgencia === 'ALTA' ? 'bg-warning-100 text-warning-700 border-warning-300' : 'bg-gray-100'}>
          {row.urgencia || 'NORMAL'}
        </Badge>
      )
    },
    { header: 'Estado', accessorKey: 'estado', cell: (row) => <StatusBadge status={row.estado} /> },
    {
      header: 'Acciones',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/transferencias/${row.id}`)} title="Ver detalles">
            <Eye className="h-4 w-4 text-info-500 hover:text-info-600" />
          </Button>
        </div>
      )
    }
  ];

  const data = transferenciasQuery.data?.content || transferenciasQuery.data || [];

  return (
    <div>
      <PageHeader 
        title="Transferencias" 
        breadcrumb="Operaciones › Transferencias"
        actionButton={
          <Button onClick={() => navigate('/transferencias/nuevo')} className="bg-primary-600 hover:bg-primary-700">
            <Plus className="h-4 w-4 mr-2" />
            Solicitar Transferencia
          </Button>
        }
      />

      <div className="bg-white rounded-lg shadow-sm">
        <DataTable 
          columns={columns} 
          data={data} 
          isLoading={transferenciasQuery.isLoading}
          pageParams={transferenciasQuery.data?.pageable ? transferenciasQuery.data : null}
        />
      </div>
    </div>
  );
};
