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

export const RecepcionCompraModal = ({ isOpen, onClose, onSave, compra }) => {
  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: { detalles: [] }
  });

  const { fields } = useFieldArray({ control, name: "detalles" });

  useEffect(() => {
    if (isOpen && compra?.detalles) {
      reset({
        detalles: compra.detalles.map(d => ({
          id: d.id,
          productoNombre: d.productoNombre,
          cantidadPedida: d.cantidad,
          cantidadRecibida: d.cantidad
        }))
      });
    }
  }, [isOpen, compra, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Recepción de Compra</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSave)} className="space-y-4 mt-4">
          <p className="text-sm text-gray-500 mb-4">
            Ajuste las cantidades recibidas si hubo faltantes.
          </p>

          <div className="max-h-64 overflow-y-auto pr-2 space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-lg border">
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">{field.productoNombre}</p>
                  <p className="text-xs text-gray-500">Pedido: {field.cantidadPedida} uds</p>
                </div>
                <div className="w-32">
                  <FormField label="Recibido">
                    <Input 
                      type="number" 
                      min="0" 
                      max={field.cantidadPedida} 
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
