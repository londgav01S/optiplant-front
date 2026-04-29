import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { FormField } from '../../components/common/FormField';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea'; // or textarea
import { requiredString } from '../../utils/validators';

const ajusteSchema = z.object({
  cantidadOriginal: z.number(),
  cantidadNueva: z.coerce.number().min(0, 'El stock no puede ser menor a 0'),
  motivo: requiredString,
});

/**
 * Modal para realizar ajustes de inventario (ingresos/salidas manuales).
 * Permite cambiar la cantidad actual por una nueva y calcular la diferencia.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Visibilidad del modal.
 * @param {Function} props.onClose - Función para cerrar el modal.
 * @param {Object} props.inventario - Objeto con los datos del inventario a modificar.
 * @param {Function} props.onAjustar - Callback que envía los datos del formulario.
 * @param {boolean} props.isAjustando - Indica si la petición está en curso para deshabilitar controles.
 */
export const AjusteStockModal = ({ isOpen, onClose, inventario, onAjustar, isAjustando }) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: zodResolver(ajusteSchema),
    defaultValues: {
      cantidadOriginal: 0,
      cantidadNueva: 0,
      motivo: ''
    }
  });

  useEffect(() => {
    if (inventario && isOpen) {
      reset({
        cantidadOriginal: inventario.stockActual || 0,
        cantidadNueva: inventario.stockActual || 0,
        motivo: ''
      });
    }
  }, [inventario, isOpen, reset]);

  const cantidadOriginal = watch('cantidadOriginal');
  const cantidadNueva = watch('cantidadNueva');
  const diferencia = Number(cantidadNueva) - Number(cantidadOriginal);

  const onSubmit = (data) => {
    if (!inventario) return;
    
    // Convertir el diferencial en la cantidad que el backend espera
    // Depende del payload exacto del backend. Si el backend espera { productoId, sucursalId, cantidad, motivo }
    // donde cantidad es el número a sumar/restar (diferencia):
    onAjustar({
      productoId: inventario.productoId || inventario.producto?.id,
      sucursalId: inventario.sucursalId || inventario.sucursal?.id,
      cantidad: diferencia,
      motivo: data.motivo,
      tipo: diferencia > 0 ? 'INGRESO_AJUSTE' : 'SALIDA_AJUSTE' // Asumiendo que se necesita un tipo o es inferido
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajuste de Stock</DialogTitle>
          <DialogDescription>
            Producto: <span className="font-semibold text-gray-900">{inventario?.productoNombre || inventario?.producto?.nombre}</span>
            <br />
            Sucursal: <span className="font-semibold text-gray-900">{inventario?.sucursalNombre || inventario?.sucursal?.nombre}</span>
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Stock Actual">
              <Input type="number" disabled {...register('cantidadOriginal')} className="bg-gray-50" />
            </FormField>
            
            <FormField label="Nuevo Stock" required error={errors.cantidadNueva?.message}>
              <Input type="number" {...register('cantidadNueva')} />
            </FormField>
          </div>

          <div className="bg-gray-50 p-3 rounded-md text-sm border border-gray-200">
            Diferencia a aplicar: <span className={`font-bold ${diferencia > 0 ? 'text-success-600' : diferencia < 0 ? 'text-danger-600' : 'text-gray-500'}`}>
              {diferencia > 0 ? '+' : ''}{diferencia}
            </span>
          </div>

          <FormField label="Motivo del Ajuste" required error={errors.motivo?.message}>
            <textarea 
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Ej. Conteo físico, mercancía dañada, etc."
              {...register('motivo')}
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isAjustando}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary-600 hover:bg-primary-700" disabled={isAjustando || diferencia === 0}>
              {isAjustando ? 'Aplicando...' : 'Aplicar Ajuste'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
