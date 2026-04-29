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
import { requiredString } from '../../utils/validators';

const configStockSchema = z.object({
  stockMinimo: z.coerce.number().min(0, 'El stock mínimo no puede ser menor a 0'),
  stockMaximo: z.coerce.number().min(0, 'El stock máximo no puede ser menor a 0'),
}).refine((data) => data.stockMaximo >= data.stockMinimo, {
  message: "El stock máximo debe ser mayor o igual al stock mínimo",
  path: ["stockMaximo"],
});

/**
 * Modal para configurar los niveles mínimo y máximo de stock.
 * Estos niveles se utilizan para generar alertas y determinar la cantidad
 * de reorden en los procesos de compra.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Visibilidad del modal.
 * @param {Function} props.onClose - Función para cerrar el modal.
 * @param {Object} props.inventario - Objeto con los datos del inventario a modificar.
 * @param {Function} props.onActualizar - Callback que envía los datos del formulario.
 * @param {boolean} props.isActualizando - Indica si la petición está en curso para deshabilitar controles.
 */
export const ConfigStockModal = ({ isOpen, onClose, inventario, onActualizar, isActualizando }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(configStockSchema),
    defaultValues: {
      stockMinimo: 0,
      stockMaximo: 0,
    }
  });

  useEffect(() => {
    if (inventario && isOpen) {
      reset({
        stockMinimo: Number(inventario.stockMinimo) || 0,
        stockMaximo: Number(inventario.stockMaximo) || 0,
      });
    }
  }, [inventario, isOpen, reset]);

  const onSubmit = (data) => {
    if (!inventario) return;
    
    onActualizar({
      id: inventario.id,
      config: {
        stockMinimo: data.stockMinimo,
        stockMaximo: data.stockMaximo,
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configurar Niveles de Stock</DialogTitle>
          <DialogDescription>
            Producto: <span className="font-semibold text-gray-900">{inventario?.productoNombre || inventario?.producto?.nombre}</span>
            <br />
            Sucursal: <span className="font-semibold text-gray-900">{inventario?.sucursalNombre || inventario?.sucursal?.nombre}</span>
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
            <p className="font-semibold mb-1">ℹ️ Valores de referencia</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li><strong>Stock Mínimo:</strong> Genera alerta cuando el stock cae por debajo de este nivel</li>
              <li><strong>Stock Máximo:</strong> Cantidad máxima recomendada en bodega</li>
            </ul>
          </div>

          <FormField label="Stock Mínimo" required error={errors.stockMinimo?.message}>
            <Input 
              type="number" 
              step="0.01"
              placeholder="Ej. 50"
              {...register('stockMinimo')} 
            />
          </FormField>

          <FormField label="Stock Máximo" required error={errors.stockMaximo?.message}>
            <Input 
              type="number" 
              step="0.01"
              placeholder="Ej. 200"
              {...register('stockMaximo')} 
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isActualizando}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary-600 hover:bg-primary-700" disabled={isActualizando}>
              {isActualizando ? 'Actualizando...' : 'Guardar Configuración'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
