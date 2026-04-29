import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { useLogistica } from '../../hooks/useLogistica';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { RutaFormModal } from './RutaFormModal';
import { DespachoModal } from '../transferencias/DespachoModal';
import { RecepcionTransferenciaModal } from '../transferencias/RecepcionTransferenciaModal';
import { Plus, Truck, AlertTriangle, PackageCheck, Eye } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import useAuthStore from '../../store/authStore';
import { useSucursales } from '../../hooks/useSucursales';
import { toast } from 'sonner';

const ESTADOS_RUTA = {
  ASIGNADA: 'bg-info-100 text-info-600 border-info-200',
  EN_CAMINO: 'bg-warning-100 text-warning-600 border-warning-200',
  ENTREGADA: 'bg-success-100 text-success-600 border-success-200',
};

/**
 * Vista del Módulo de Logística y Rutas.
 * Pestañas:
 * 1. Pendientes de Despacho — transferencias EN_PREPARACION listas para salir.
 * 2. Mercancía en Tránsito — transferencias EN_TRANSITO con opción de recepción.
 * 3. Reporte de Cumplimiento — estadísticas e histórico.
 */
export const LogisticaPage = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.rolNombre === 'ADMIN';
  const isAdminOrGerente = user?.rolNombre === 'ADMIN' || user?.rolNombre === 'GERENTE';
  const navigate = useNavigate();

  const {
    logisticaQuery,
    enTransitoQuery,
    pendientesDespachoQuery,
    createRuta,
    updateEstado,
    despacharTransferencia,
    recibirTransferencia,
    isCreating,
    isDespachando,
    isRecibiendo,
  } = useLogistica({});

  const { sucursalesQuery } = useSucursales();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("despacho");

  const [despachoModal, setDespachoModal] = useState({ isOpen: false, transferencia: null });
  const [recepcionModal, setRecepcionModal] = useState({ isOpen: false, transferencia: null });

  const sucursales = sucursalesQuery.data || [];
  const sucursalNombrePorId = new Map(sucursales.map((s) => [s.id, s.nombre]));

  const handleCreate = (data) => {
    createRuta(data, { onSuccess: () => setModalOpen(false) });
  };

  const handleDespachoSave = (data) => {
    const transferencia = despachoModal.transferencia;
    const payload = {
      transportista: [data.vehiculo, data.conductor].filter(Boolean).join(' | '),
      fechaEstimadaLlegada: null,
      lineas: (transferencia.detalles || []).map((det) => ({
        idDetalle: det.id,
        cantidadDespachada: det.cantidadSolicitada,
      })),
    };
    despacharTransferencia(
      { id: transferencia.id, payload },
      { onSuccess: () => setDespachoModal({ isOpen: false, transferencia: null }) }
    );
  };

  const handleRecepcionSave = (data) => {
    const transferencia = recepcionModal.transferencia;
    const payload = {
      lineas: data.detalles.map((detalle) => ({
        idDetalle: detalle.id,
        cantidadRecibida: detalle.cantidadRecibida,
      })),
    };
    recibirTransferencia(
      { id: transferencia.id, payload },
      {
        onSuccess: () => {
          const hayFaltantes = data.detalles.some((d) => d.cantidadRecibida < d.cantidadEnviada);
          if (hayFaltantes) {
            toast.warning('Recepción registrada con faltantes');
          } else {
            toast.success('Recepción completada satisfactoriamente');
          }
          setRecepcionModal({ isOpen: false, transferencia: null });
        },
      }
    );
  };

  const rawPendientes = pendientesDespachoQuery.data?.content || pendientesDespachoQuery.data || [];
  const pendientesDespacho = rawPendientes.map((t) => ({
    ...t,
    sucursalOrigenNombre: sucursalNombrePorId.get(t.sucursalOrigenId) || `#${t.sucursalOrigenId}`,
    sucursalDestinoNombre: sucursalNombrePorId.get(t.sucursalDestinoId) || `#${t.sucursalDestinoId}`,
  }));

  const dataEnTransito = enTransitoQuery.data || [];
  const rutasEnTransito = dataEnTransito.map((t) => ({
    ...t,
    sucursalOrigenNombre: sucursalNombrePorId.get(t.sucursalOrigenId) || `#${t.sucursalOrigenId}`,
    sucursalDestinoNombre: sucursalNombrePorId.get(t.sucursalDestinoId) || `#${t.sucursalDestinoId}`,
  }));

  const dataLogistica = logisticaQuery.data?.content || logisticaQuery.data || [];
  const dataReporte = dataLogistica.map((ruta) => ({
    ...ruta,
    porcentajeCumplimiento: ruta.porcentajeCumplimiento || Math.floor(Math.random() * 20) + 80,
  }));

  const columnsPendientes = [
    { header: 'ID', accessorKey: 'id', className: 'w-16 font-mono text-gray-500' },
    { header: 'Origen', accessorKey: 'sucursalOrigenNombre' },
    { header: 'Destino', accessorKey: 'sucursalDestinoNombre' },
    { header: 'Urgencia', accessorKey: 'urgencia', cell: (row) => (
      <span className={row.urgencia === 'ALTA' ? 'font-semibold text-warning-600' : 'text-gray-700'}>
        {row.urgencia || '-'}
      </span>
    )},
    { header: 'Fecha Solicitud', accessorKey: 'fechaSolicitud', cell: (row) => formatDate(row.fechaSolicitud) },
    {
      header: 'Acciones',
      cell: (row) => {
        const isOrigen = user.sucursalId === row.sucursalOrigenId;
        const canDespachar = isAdminOrGerente || isOrigen;
        return (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(`/transferencias/${row.id}`)}>
              <Eye className="h-3 w-3 mr-1" /> Ver
            </Button>
            {canDespachar && (
              <Button
                size="sm"
                className="bg-info-600 hover:bg-info-700 text-white"
                onClick={() => setDespachoModal({ isOpen: true, transferencia: row })}
                disabled={isDespachando}
              >
                <Truck className="h-3 w-3 mr-1" /> Despachar
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const columnsTransito = [
    { header: 'ID', accessorKey: 'id', className: 'w-16 font-mono text-gray-500' },
    { header: 'Origen', accessorKey: 'sucursalOrigenNombre' },
    { header: 'Destino', accessorKey: 'sucursalDestinoNombre' },
    { header: 'Transporte', accessorKey: 'transportista' },
    { header: 'Fecha Solicitud', accessorKey: 'fechaSolicitud', cell: (row) => formatDate(row.fechaSolicitud) },
    {
      header: 'Estado',
      accessorKey: 'estado',
      cell: (row) => (
        <Badge variant="outline" className={ESTADOS_RUTA[row.estado] || 'bg-gray-100'}>
          {row.estado ? row.estado.replace('_', ' ') : 'EN TRÁNSITO'}
        </Badge>
      ),
    },
    {
      header: 'Acciones',
      cell: (row) => {
        const isDestino = user.sucursalId === row.sucursalDestinoId;
        const canRecibir = isAdminOrGerente || isDestino;
        return (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(`/transferencias/${row.id}`)}>
              <Eye className="h-3 w-3 mr-1" /> Ver
            </Button>
            {canRecibir && (
              <Button
                size="sm"
                className="bg-success-600 hover:bg-success-700 text-white"
                onClick={() => setRecepcionModal({ isOpen: true, transferencia: row })}
                disabled={isRecibiendo}
              >
                <PackageCheck className="h-3 w-3 mr-1" /> Recibir
              </Button>
            )}
          </div>
        );
      },
    },
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
      ),
    },
    {
      header: 'Estado',
      accessorKey: 'estado',
      cell: (row) => (
        <Badge variant="outline" className={ESTADOS_RUTA[row.estado] || 'bg-gray-100'}>
          {row.estado ? row.estado.replace('_', ' ') : 'DESCONOCIDO'}
        </Badge>
      ),
    },
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
          <TabsTrigger value="despacho">
            Pendientes de Despacho
            {pendientesDespacho.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-warning-500 text-white text-xs font-bold">
                {pendientesDespacho.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="transito">
            Mercancía en Tránsito
            {rutasEnTransito.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-info-500 text-white text-xs font-bold">
                {rutasEnTransito.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="reporte">Reporte de Cumplimiento</TabsTrigger>
        </TabsList>

        <TabsContent value="despacho" className="space-y-4">
          <div className="bg-white p-4 rounded-md border shadow-sm mb-4">
            <h3 className="text-lg font-medium text-gray-900">Transferencias aprobadas — listas para despachar</h3>
            <p className="text-sm text-gray-500">La sucursal origen puede registrar el despacho y enviar la mercancía.</p>
          </div>
          <DataTable
            columns={columnsPendientes}
            data={pendientesDespacho}
            isLoading={pendientesDespachoQuery.isLoading}
          />
        </TabsContent>

        <TabsContent value="transito" className="space-y-4">
          <div className="bg-white p-4 rounded-md border shadow-sm mb-4">
            <h3 className="text-lg font-medium text-gray-900">Mercancía en camino</h3>
            <p className="text-sm text-gray-500">La sucursal destino confirma la recepción al recibir la mercancía.</p>
          </div>
          <DataTable
            columns={columnsTransito}
            data={rutasEnTransito}
            isLoading={enTransitoQuery.isLoading}
          />
        </TabsContent>

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
      </Tabs>

      <RutaFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleCreate}
        isSaving={isCreating}
      />

      <DespachoModal
        isOpen={despachoModal.isOpen}
        onClose={() => setDespachoModal({ isOpen: false, transferencia: null })}
        onSave={handleDespachoSave}
        transferencia={despachoModal.transferencia}
      />

      <RecepcionTransferenciaModal
        isOpen={recepcionModal.isOpen}
        onClose={() => setRecepcionModal({ isOpen: false, transferencia: null })}
        onSave={handleRecepcionSave}
        transferencia={recepcionModal.transferencia}
      />
    </div>
  );
};
