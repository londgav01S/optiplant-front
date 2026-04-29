import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { FormField } from '../../components/common/FormField';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

/**
 * Modal para confirmar la recepción de una transferencia de inventario.
 * Permite ajustar las cantidades finales en la sucursal de destino si ocurren
 * pérdidas, daños o faltantes durante el trayecto.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Visibilidad del modal.
 * @param {Function} props.onClose - Cierra el modal.
 * @param {Function} props.onSave - Callback que ejecuta la acción de recepción.
 * @param {Object} props.transferencia - Datos de la transferencia que llega a destino.
 */
export const RecepcionTransferenciaModal = ({ isOpen, onClose, onSave, transferencia }) => {
  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: { detalles: [] }
  });

  const { fields } = useFieldArray({ control, name: "detalles" });

  useEffect(() => {
    if (isOpen && transferencia?.detalles) {
      reset({
        detalles: transferencia.detalles.map(d => ({
          id: d.id,
          productoNombre: d.productoNombre,
          cantidadEnviada: d.cantidadDespachada ?? d.cantidadSolicitada,
          cantidadRecibida: d.cantidadDespachada ?? d.cantidadSolicitada // Por defecto asume que llegó todo
        }))
      });
    }
  }, [isOpen, transferencia, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Confirmar Recepción</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSave)} className="space-y-4 mt-4">
          <p className="text-sm text-gray-500 mb-4">
            Confirme las cantidades recibidas. El stock se sumará automáticamente a la sucursal de destino.
          </p>

          <div className="max-h-64 overflow-y-auto pr-2 space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-lg border">
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">{field.productoNombre}</p>
                  <p className="text-xs text-gray-500">Enviado: {field.cantidadEnviada} uds</p>
                </div>
                <div className="w-32">
                  <FormField label="Recibido">
                    <Input 
                      type="number" 
                      min="0" 
                      max={field.cantidadEnviada} 
                      {...register(`detalles.${index}.cantidadRecibida`, { valueAsNumber: true })} 
                      className="text-center"
                    />
                  </FormField>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="bg-success-600 hover:bg-success-700">Confirmar Recepción</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
