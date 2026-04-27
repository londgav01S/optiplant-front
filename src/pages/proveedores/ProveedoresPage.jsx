import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { useProveedores } from '../../hooks/useProveedores';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Plus, Edit, History } from 'lucide-react';

export const ProveedoresPage = () => {
  const navigate = useNavigate();
  const { proveedoresQuery } = useProveedores({});

  const columns = [
    { header: 'Nombre', accessorKey: 'nombre' },
    { header: 'Contacto', accessorKey: 'contacto', cell: (row) => row.contacto || '-' },
    { header: 'Teléfono', accessorKey: 'telefono', cell: (row) => row.telefono || '-' },
    { header: 'Email', accessorKey: 'email', cell: (row) => row.email || '-' },
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
          <Button variant="ghost" size="sm" onClick={() => navigate(`/proveedores/${row.id}/historial`)} title="Ver historial">
            <History className="h-4 w-4 text-info-500 hover:text-info-600" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate(`/proveedores/${row.id}/editar`)}>
            <Edit className="h-4 w-4 text-gray-500 hover:text-primary-600" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader 
        title="Proveedores" 
        breadcrumb="Configuración › Proveedores"
        actionButton={
          <Button onClick={() => navigate('/proveedores/nuevo')} className="bg-primary-600 hover:bg-primary-700">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Proveedor
          </Button>
        }
      />

      <DataTable 
        columns={columns} 
        data={proveedoresQuery.data?.content || proveedoresQuery.data || []} 
        isLoading={proveedoresQuery.isLoading}
        pageParams={proveedoresQuery.data?.pageable ? proveedoresQuery.data : null}
      />
    </div>
  );
};
