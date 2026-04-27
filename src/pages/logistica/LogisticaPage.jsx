import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { useLogistica } from '../../hooks/useLogistica';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { RutaFormModal } from './RutaFormModal';
import { Plus, CheckCircle, Truck, AlertTriangle } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import useAuthStore from '../../store/authStore';

const ESTADOS_RUTA = {
  ASIGNADA: 'bg-info-100 text-info-600 border-info-200',
  EN_CAMINO: 'bg-warning-100 text-warning-600 border-warning-200',
  ENTREGADA: 'bg-success-100 text-success-600 border-success-200',
};

export const LogisticaPage = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.rolNombre === 'ADMIN';

  const { logisticaQuery, createRuta, updateEstado, isCreating, isUpdating } = useLogistica({});
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("reporte");

  const handleCreate = (data) => {
    createRuta(data, {
      onSuccess: () => setModalOpen(false)
    });
  };

  const handleCambiarEstado = (id, nuevoEstado) => {
    updateEstado({ id, estado: nuevoEstado });
  };

  const dataLogistica = logisticaQuery.data?.content || logisticaQuery.data || [];

  // Mocks de reporte en caso de que el backend no envíe aún
  const dataReporte = dataLogistica.map(ruta => ({
    ...ruta,
    porcentajeCumplimiento: ruta.porcentajeCumplimiento || Math.floor(Math.random() * 20) + 80 // Mock 80-100%
  }));

  const rutasEnTransito = dataLogistica.filter(r => r.estado === 'EN_CAMINO' || r.estado === 'ASIGNADA');

  const columnsTransito = [
    { header: 'ID', accessorKey: 'id', className: 'w-16 font-mono text-gray-500' },
    { header: 'Transferencia ID', accessorKey: 'transferenciaId', className: 'font-mono' },
    { header: 'Vehículo', accessorKey: 'vehiculo' },
    { header: 'Conductor', accessorKey: 'conductor' },
    { header: 'Fecha Asignación', accessorKey: 'fechaAsignacion', cell: (row) => formatDate(row.fechaAsignacion) },
    { 
      header: 'Estado', 
      accessorKey: 'estado',
      cell: (row) => (
        <Badge variant="outline" className={ESTADOS_RUTA[row.estado] || 'bg-gray-100'}>
          {row.estado ? row.estado.replace('_', ' ') : 'DESCONOCIDO'}
        </Badge>
      )
    },
    {
      header: 'Acciones',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.estado === 'ASIGNADA' && (
            <Button variant="outline" size="sm" onClick={() => handleCambiarEstado(row.id, 'EN_CAMINO')} disabled={isUpdating}>
              <Truck className="h-3 w-3 mr-1" /> En Camino
            </Button>
          )}
          {row.estado === 'EN_CAMINO' && (
            <Button variant="outline" size="sm" className="text-success-600 hover:text-success-700" onClick={() => handleCambiarEstado(row.id, 'ENTREGADA')} disabled={isUpdating}>
              <CheckCircle className="h-3 w-3 mr-1" /> Entregada
            </Button>
          )}
        </div>
      )
    }
  ];

  const columnsReporte = [
    { header: 'Ruta ID', accessorKey: 'id', className: 'w-16 font-mono' },
    { header: 'Transferencia', accessorKey: 'transferenciaId' },
    { header: 'Vehículo', accessorKey: 'vehiculo' },
    { header: 'Conductor', accessorKey: 'conductor' },
    { 
      header: '% Cumplimiento', 
      accessorKey: 'porcentajeCumplimiento',
      cell: (row) => (
        <div className="flex items-center">
          <span className={`font-medium ${row.porcentajeCumplimiento < 90 ? 'text-danger-600' : 'text-success-600'}`}>
            {row.porcentajeCumplimiento}%
          </span>
          {row.porcentajeCumplimiento < 90 && (
            <AlertTriangle className="h-4 w-4 ml-2 text-danger-500" title="Cumplimiento inferior al 90%" />
          )}
        </div>
      )
    },
    { 
      header: 'Estado', 
      accessorKey: 'estado',
      cell: (row) => (
        <Badge variant="outline" className={ESTADOS_RUTA[row.estado] || 'bg-gray-100'}>
          {row.estado ? row.estado.replace('_', ' ') : 'DESCONOCIDO'}
        </Badge>
      )
    }
  ];

  return (
    <div>
      <PageHeader 
        title="Logística y Rutas" 
        breadcrumb="Análisis › Logística"
        actionButton={
          isAdmin ? (
            <Button onClick={() => setModalOpen(true)} className="bg-primary-600 hover:bg-primary-700">
              <Plus className="h-4 w-4 mr-2" />
              Asignar Ruta
            </Button>
          ) : null
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="reporte">Reporte de Cumplimiento</TabsTrigger>
          <TabsTrigger value="transito">Mercancía en Tránsito</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reporte" className="space-y-4">
          <div className="bg-white p-4 rounded-md border shadow-sm mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Métricas de Entregas</h3>
              <p className="text-sm text-gray-500">Se destacan en rojo los cumplimientos menores al 90% por faltantes o demoras.</p>
            </div>
          </div>
          <DataTable 
            columns={columnsReporte} 
            data={dataReporte} 
            isLoading={logisticaQuery.isLoading}
          />
        </TabsContent>

        <TabsContent value="transito" className="space-y-4">
          <DataTable 
            columns={columnsTransito} 
            data={rutasEnTransito} 
            isLoading={logisticaQuery.isLoading}
          />
        </TabsContent>
      </Tabs>

      <RutaFormModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSave={handleCreate} 
        isSaving={isCreating} 
      />
    </div>
  );
};
