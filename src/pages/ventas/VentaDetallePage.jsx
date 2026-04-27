import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CurrencyDisplay } from '../../components/common/CurrencyDisplay';
import { useVentas } from '../../hooks/useVentas';
import { formatDate } from '../../utils/formatters';
import { Button } from '../../components/ui/button';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

export const VentaDetallePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getVentaQuery, confirmarVenta, cancelarVenta, isConfirmando, isCancelando } = useVentas();
  
  const { data: venta, isLoading } = getVentaQuery(id);
  
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, action: null });

  if (isLoading) return <div className="p-8">Cargando detalles de venta...</div>;
  if (!venta) return <div className="p-8 text-danger-500">Venta no encontrada</div>;

  const handleAction = (action) => {
    setConfirmDialog({ isOpen: true, action });
  };

  const confirmAction = () => {
    if (confirmDialog.action === 'CONFIRMAR') {
      confirmarVenta(id, { onSuccess: () => setConfirmDialog({ isOpen: false, action: null }) });
    } else if (confirmDialog.action === 'CANCELAR') {
      cancelarVenta(id, { onSuccess: () => setConfirmDialog({ isOpen: false, action: null }) });
    }
  };

  const isPendingState = venta.estado === 'PENDIENTE';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate('/ventas')} className="-ml-4 text-gray-500">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a ventas
      </Button>

      <PageHeader 
        title={`Venta #${venta.id}`} 
        breadcrumb="Operaciones › Ventas › Detalles"
        actionButton={
          isPendingState ? (
            <div className="flex gap-2">
              <Button variant="outline" className="text-danger-500 hover:text-danger-600 hover:bg-danger-50 border-danger-200" onClick={() => handleAction('CANCELAR')}>
                <XCircle className="h-4 w-4 mr-2" />
                Cancelar Venta
              </Button>
              <Button className="bg-success-600 hover:bg-success-700 text-white" onClick={() => handleAction('CONFIRMAR')}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirmar Venta
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
                <div className="col-span-2 text-right">Precio Unit.</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>
              
              {(venta.detalles || []).map((det, idx) => (
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
                <CurrencyDisplay amount={venta.total} className="text-primary-600 font-bold" />
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
              <div className="mt-1"><StatusBadge status={venta.estado} /></div>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Fecha</p>
              <p className="mt-1 text-gray-900">{formatDate(venta.fecha)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Cliente</p>
              <p className="mt-1 text-gray-900">{venta.clienteNombre}</p>
              {venta.clienteDocumento && <p className="text-xs text-gray-500">Doc: {venta.clienteDocumento}</p>}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Sucursal</p>
              <p className="mt-1 text-gray-900">{venta.sucursalNombre}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Vendedor</p>
              <p className="mt-1 text-gray-900">{venta.usuarioNombre}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog 
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, action: null })}
        onConfirm={confirmAction}
        title={confirmDialog.action === 'CONFIRMAR' ? "Confirmar Venta" : "Cancelar Venta"}
        description={
          confirmDialog.action === 'CONFIRMAR' 
            ? "Al confirmar la venta, se deducirá el inventario definitivamente. ¿Continuar?" 
            : "Al cancelar la venta, no se afectará el inventario. ¿Continuar?"
        }
        confirmText={confirmDialog.action === 'CONFIRMAR' ? "Sí, confirmar" : "Sí, cancelar"}
        isDestructive={confirmDialog.action === 'CANCELAR'}
        isLoading={isConfirmando || isCancelando}
      />
    </div>
  );
};
