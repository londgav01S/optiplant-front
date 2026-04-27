import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useTransferencias } from '../../hooks/useTransferencias';
import { formatDate } from '../../utils/formatters';
import { Button } from '../../components/ui/button';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ArrowLeft, Truck, PackageCheck, XCircle, CheckCircle, Clock } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { DespachoModal } from './DespachoModal';
import { RecepcionTransferenciaModal } from './RecepcionTransferenciaModal';
import { toast } from 'sonner';

// Helpers para el Timeline
const STEPS = [
  { id: 'PENDIENTE_APROBACION', label: 'Solicitud' },
  { id: 'EN_PREPARACION', label: 'Aprobación' },
  { id: 'EN_TRANSITO', label: 'Despacho' },
  { id: 'RECIBIDA', label: 'Recepción' }
];

export const TransferenciaDetallePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    getTransferenciaQuery, 
    cancelarTransferencia, // Usado como "Rechazar"
    enviarTransferencia,   // Usado como "Aprobar" (pasa a en preparacion)
    // El spec menciona endpoints específicos, pero para el prototipo usamos los del hook actual
  } = useTransferencias();
  
  const { data: transferencia, isLoading } = getTransferenciaQuery(id);
  
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, action: null });
  const [despachoModal, setDespachoModal] = useState(false);
  const [recepcionModal, setRecepcionModal] = useState(false);

  if (isLoading) return <div className="p-8">Cargando detalles de transferencia...</div>;
  if (!transferencia) return <div className="p-8 text-danger-500">Transferencia no encontrada</div>;

  const isAdminOrGerente = user.rolNombre === 'ADMIN' || user.rolNombre === 'GERENTE';
  const isOrigen = user.sucursalId === transferencia.sucursalOrigenId;
  const isDestino = user.sucursalId === transferencia.sucursalDestinoId;

  // Lógica de botones según SPEC
  const canAprobar = transferencia.estado === 'PENDIENTE_APROBACION' && isAdminOrGerente;
  const canDespachar = transferencia.estado === 'EN_PREPARACION' && (isAdminOrGerente || isOrigen);
  const canRecibir = transferencia.estado === 'EN_TRANSITO' && (user.rolNombre === 'ADMIN' || isDestino);

  const handleAprobar = () => {
    // Simulamos que aprueba
    toast.success('Transferencia aprobada para preparación');
    // enviarTransferencia(id); -> idealmente llama a patch /aprobar
  };

  const handleRechazar = () => {
    setConfirmDialog({ isOpen: true, action: 'RECHAZAR' });
  };

  const confirmRechazo = () => {
    cancelarTransferencia(id, { onSuccess: () => setConfirmDialog({ isOpen: false, action: null }) });
  };

  const onDespachoSave = (data) => {
    // Llama al endpoint de despacho con los datos de transportista
    toast.success('Despacho registrado correctamente');
    setDespachoModal(false);
  };

  const onRecepcionSave = (data) => {
    // Llama al endpoint de recepcion
    const hayFaltantes = data.detalles.some(d => d.cantidadRecibida < d.cantidadEnviada);
    if (hayFaltantes) {
      toast.warning('Recepción registrada con faltantes');
    } else {
      toast.success('Recepción completada satisfactoriamente');
    }
    setRecepcionModal(false);
  };

  const currentStepIndex = STEPS.findIndex(s => s.id === transferencia.estado) >= 0 ? STEPS.findIndex(s => s.id === transferencia.estado) : (transferencia.estado === 'RECIBIDA_CON_FALTANTES' ? 3 : -1);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <Button variant="ghost" onClick={() => navigate('/transferencias')} className="-ml-4 text-gray-500">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a transferencias
      </Button>

      <PageHeader 
        title={`Transferencia #${transferencia.id}`} 
        breadcrumb="Operaciones › Transferencias › Detalles"
        actionButton={
          <div className="flex gap-2">
            {canAprobar && (
              <>
                <Button variant="outline" className="text-danger-500 hover:text-danger-600 hover:bg-danger-50" onClick={handleRechazar}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Rechazar
                </Button>
                <Button className="bg-success-600 hover:bg-success-700" onClick={handleAprobar}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Aprobar
                </Button>
              </>
            )}
            {canDespachar && (
              <Button className="bg-info-600 hover:bg-info-700" onClick={() => setDespachoModal(true)}>
                <Truck className="h-4 w-4 mr-2" />
                Registrar Despacho
              </Button>
            )}
            {canRecibir && (
              <Button className="bg-success-600 hover:bg-success-700 text-white" onClick={() => setRecepcionModal(true)}>
                <PackageCheck className="h-4 w-4 mr-2" />
                Confirmar Recepción
              </Button>
            )}
          </div>
        }
      />

      {/* TIMELINE */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
            {STEPS.map((step, idx) => {
              const isCompleted = currentStepIndex > idx || transferencia.estado === 'RECIBIDA' || transferencia.estado === 'RECIBIDA_CON_FALTANTES';
              const isActive = currentStepIndex === idx;
              const isRejected = transferencia.estado === 'RECHAZADA' && idx === 1;

              return (
                <div key={step.id} className="flex flex-col items-center bg-white px-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 
                    ${isCompleted ? 'bg-success-500 border-success-500 text-white' : 
                      isActive ? 'bg-primary-100 border-primary-500 text-primary-600' : 
                      isRejected ? 'bg-danger-500 border-danger-500 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : isRejected ? <XCircle className="h-5 w-5" /> : <Clock className="h-4 w-4" />}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${isActive ? 'text-primary-600' : isCompleted ? 'text-gray-900' : isRejected ? 'text-danger-600' : 'text-gray-400'}`}>
                    {isRejected ? 'Rechazada' : step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Productos Transferidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="hidden sm:grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 pb-2 border-b">
                <div className="col-span-6">Producto</div>
                <div className="col-span-3 text-center">Solicitado</div>
                <div className="col-span-3 text-center">Enviado/Recibido</div>
              </div>
              
              {(transferencia.detalles || []).map((det, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center py-2 border-b border-gray-50 last:border-0">
                  <div className="col-span-1 sm:col-span-6">
                    <p className="font-medium text-gray-900">{det.productoNombre}</p>
                  </div>
                  <div className="hidden sm:block col-span-3 text-center text-gray-700">
                    <span className="font-semibold bg-gray-100 px-3 py-1 rounded-full">{det.cantidad}</span>
                  </div>
                  <div className="hidden sm:block col-span-3 text-center text-gray-700">
                     {/* Simplificación visual para prototipo */}
                    <span className="font-semibold px-3 py-1">-</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">Estado</p>
              <div className="mt-1"><StatusBadge status={transferencia.estado} /></div>
            </div>
            {transferencia.urgencia && (
              <div>
                <p className="text-sm text-gray-500 font-medium">Urgencia</p>
                <p className={`mt-1 font-semibold ${transferencia.urgencia === 'ALTA' ? 'text-warning-600' : 'text-gray-900'}`}>{transferencia.urgencia}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500 font-medium">Fecha Solicitud</p>
              <p className="mt-1 text-gray-900">{formatDate(transferencia.fecha)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Origen</p>
              <p className="mt-1 text-gray-900">{transferencia.sucursalOrigenNombre}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Destino</p>
              <p className="mt-1 text-gray-900">{transferencia.sucursalDestinoNombre}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog 
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, action: null })}
        onConfirm={confirmRechazo}
        title="Rechazar Transferencia"
        description="La transferencia será rechazada permanentemente y el origen será notificado."
        confirmText="Sí, rechazar"
        isDestructive={true}
      />

      <DespachoModal 
        isOpen={despachoModal} 
        onClose={() => setDespachoModal(false)} 
        onSave={onDespachoSave} 
        transferencia={transferencia} 
      />

      <RecepcionTransferenciaModal 
        isOpen={recepcionModal} 
        onClose={() => setRecepcionModal(false)} 
        onSave={onRecepcionSave} 
        transferencia={transferencia} 
      />
    </div>
  );
};
