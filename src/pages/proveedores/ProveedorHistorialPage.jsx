import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CurrencyDisplay } from '../../components/common/CurrencyDisplay';
import { useProveedores } from '../../hooks/useProveedores';
import { formatDate } from '../../utils/formatters';
import { Button } from '../../components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const ProveedorHistorialPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProveedorQuery, getHistorialQuery } = useProveedores({});

  const { data: proveedor } = getProveedorQuery(id);
  const { data: historial, isLoading } = getHistorialQuery(id, {}); // params empty por ahora

  const columns = [
    { header: 'ID Orden', accessorKey: 'id', className: 'w-20' },
    { header: 'Fecha', accessorKey: 'fecha', cell: (row) => formatDate(row.fecha) },
    { header: 'Sucursal', accessorKey: 'sucursalNombre' },
    { header: 'Total', accessorKey: 'total', cell: (row) => <CurrencyDisplay amount={row.total} /> },
    { header: 'Estado', accessorKey: 'estado', cell: (row) => <StatusBadge status={row.estado} /> },
  ];

  return (
    <div>
      <Button variant="ghost" onClick={() => navigate('/proveedores')} className="mb-4 -ml-4 text-gray-500">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a proveedores
      </Button>

      <PageHeader 
        title={`Historial: ${proveedor?.nombre || 'Cargando...'}`} 
        breadcrumb="Configuración › Proveedores › Historial"
      />

      <DataTable 
        columns={columns} 
        data={historial?.content || historial || []} 
        isLoading={isLoading}
        pageParams={historial?.pageable ? historial : null}
      />
    </div>
  );
};
