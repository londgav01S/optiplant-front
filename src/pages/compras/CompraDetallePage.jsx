import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CurrencyDisplay } from '../../components/common/CurrencyDisplay';
import { useCompras } from '../../hooks/useCompras';
import { formatDate } from '../../utils/formatters';
import { Button } from '../../components/ui/button';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { RecepcionCompraModal } from './RecepcionCompraModal';
import { ArrowLeft, PackageCheck, XCircle } from 'lucide-react';

export const CompraDetallePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCompraQuery, recibirCompra, cancelarCompra, isRecibiendo, isCancelando } = useCompras();
  
  const { data: compra, isLoading } = getCompraQuery(id);
  
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, action: null });
  const [recepcionModal, setRecepcionModal] = useState(false);

  if (isLoading) return <div className="p-8">Cargando detalles de compra...</div>;
  if (!compra) return <div className="p-8 text-danger-500">Compra no encontrada</div>;

  const handleAction = (action) => {
    if (action === 'RECIBIR') {
      setRecepcionModal(true);
    } else {
      setConfirmDialog({ isOpen: true, action });
    }
  };

  const confirmAction = () => {
    if (confirmDialog.action === 'CANCELAR') {
      cancelarCompra(id, { onSuccess: () => setConfirmDialog({ isOpen: false, action: null }) });
    }
  };

  const onRecepcionSave = (data) => {
    recibirCompra(id, { onSuccess: () => setRecepcionModal(false) });
  };

  const isPendingState = compra.estado === 'PENDIENTE';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate('/compras')} className="-ml-4 text-gray-500">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a compras
      </Button>

      <PageHeader 
        title={`Orden de Compra #${compra.id}`} 
        breadcrumb="Operaciones › Compras › Detalles"
        actionButton={
          isPendingState ? (
            <div className="flex gap-2">
              <Button variant="outline" className="text-danger-500 hover:text-danger-600 hover:bg-danger-50 border-danger-200" onClick={() => handleAction('CANCELAR')}>
                <XCircle className="h-4 w-4 mr-2" />
                Cancelar Orden
              </Button>
              <Button className="bg-success-600 hover:bg-success-700 text-white" onClick={() => handleAction('RECIBIR')}>
                <PackageCheck className="h-4 w-4 mr-2" />
                Marcar como Recibido
              </Button>
            </div>
          ) : null
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="hidden sm:grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 pb-2 border-b">
                <div className="col-span-6">Producto</div>
                <div className="col-span-2 text-center">Cant.</div>
                <div className="col-span-2 text-right">Costo Unit.</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>
              
              {(compra.detalles || []).map((det, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center py-2 border-b border-gray-50 last:border-0">
                  <div className="col-span-1 sm:col-span-6">
                    <p className="font-medium text-gray-900">{det.productoNombre}</p>
                    <p className="text-xs text-gray-500 sm:hidden">Cant: {det.cantidad} x <CurrencyDisplay amount={det.precioUnitario} /></p>
                  </div>
                  <div className="hidden sm:block col-span-2 text-center text-gray-700">
                    {det.cantidad}
                  </div>
                  <div className="hidden sm:block col-span-2 text-right text-gray-700">
                    <CurrencyDisplay amount={det.precioUnitario} />
                  </div>
                  <div className="col-span-1 sm:col-span-2 text-right font-medium text-gray-900">
                    <CurrencyDisplay amount={det.subtotal} />
                  </div>
                </div>
              ))}

              <div className="pt-4 flex justify-end text-lg">
                <span className="font-semibold text-gray-900 mr-4">Total:</span>
                <CurrencyDisplay amount={compra.total} className="text-primary-600 font-bold" />
              </div>
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
              <div className="mt-1"><StatusBadge status={compra.estado} /></div>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Fecha de Emisión</p>
              <p className="mt-1 text-gray-900">{formatDate(compra.fecha)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Proveedor</p>
              <p className="mt-1 text-gray-900">{compra.proveedorNombre}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Sucursal Destino</p>
              <p className="mt-1 text-gray-900">{compra.sucursalNombre}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Registrada por</p>
              <p className="mt-1 text-gray-900">{compra.usuarioNombre}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog 
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, action: null })}
        onConfirm={confirmAction}
        title="Cancelar Compra"
        description="¿Estás seguro de cancelar esta orden de compra?"
        confirmText="Sí, cancelar"
        isDestructive={true}
        isLoading={isCancelando}
      />

      <RecepcionCompraModal
        isOpen={recepcionModal}
        onClose={() => setRecepcionModal(false)}
        onSave={onRecepcionSave}
        compra={compra}
      />
    </div>
  );
};
