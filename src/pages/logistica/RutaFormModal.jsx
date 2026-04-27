import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { FormField } from '../../components/common/FormField';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { requiredString } from '../../utils/validators';

const rutaSchema = z.object({
  transferenciaId: z.coerce.number().min(1, 'Transferencia requerida'),
  vehiculo: requiredString,
  conductor: requiredString,
});

/**
 * Modal para asignar una nueva ruta a una transferencia.
 * Captura datos del vehículo y del conductor encargado del traslado.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Define si el modal es visible.
 * @param {Function} props.onClose - Cierra el modal.
 * @param {Function} props.onSave - Callback al enviar el formulario válido.
 * @param {boolean} props.isSaving - Estado de carga durante el guardado.
 */
export const RutaFormModal = ({ isOpen, onClose, onSave, isSaving }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(rutaSchema),
    defaultValues: {
      transferenciaId: '',
      vehiculo: '',
      conductor: '',
    }
  });

  useEffect(() => {
    if (isOpen) {
      reset({ transferenciaId: '', vehiculo: '', conductor: '' });
    }
  }, [isOpen, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Asignar Nueva Ruta</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSave)} className="space-y-4 mt-4">
          <FormField label="ID Transferencia" required error={errors.transferenciaId?.message}>
            <Input type="number" placeholder="Ej. 12" {...register('transferenciaId')} />
          </FormField>

          <FormField label="Vehículo (Placa / Descripción)" required error={errors.vehiculo?.message}>
            <Input placeholder="Ej. FTR-456 Camión" {...register('vehiculo')} />
          </FormField>

          <FormField label="Conductor" required error={errors.conductor?.message}>
            <Input placeholder="Ej. Juan Pérez" {...register('conductor')} />
          </FormField>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary-600 hover:bg-primary-700" disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar Ruta'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
