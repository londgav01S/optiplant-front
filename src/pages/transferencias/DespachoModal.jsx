import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
 * Modal para registrar la salida (despacho) de una transferencia.
 * Captura datos logísticos básicos (vehículo, conductor) antes de mover
 * la mercancía al estado "EN_TRANSITO".
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Visibilidad del modal.
 * @param {Function} props.onClose - Cierra el modal.
 * @param {Function} props.onSave - Callback que ejecuta la acción de despacho.
 * @param {Object} props.transferencia - Información de la transferencia actual.
 */
export const DespachoModal = ({ isOpen, onClose, onSave, transferencia }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (isOpen) {
      reset({ vehiculo: '', conductor: '', fechaEstimada: '' });
    }
  }, [isOpen, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Despacho</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSave)} className="space-y-4 mt-4">
          <p className="text-sm text-gray-500 mb-4">
            Al registrar el despacho, el inventario se descontará de <strong>{transferencia?.sucursalOrigenNombre}</strong> y la transferencia pasará a estar <strong>En Tránsito</strong>.
          </p>

          <FormField label="Vehículo (Placa)" required>
            <Input placeholder="Ej. FTR-456" {...register('vehiculo', { required: 'Requerido' })} />
          </FormField>

          <FormField label="Conductor" required>
            <Input placeholder="Ej. Juan Pérez" {...register('conductor', { required: 'Requerido' })} />
          </FormField>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="bg-primary-600 hover:bg-primary-700">Confirmar Despacho</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
