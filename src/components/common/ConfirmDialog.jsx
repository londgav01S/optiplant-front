import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

/**
 * Modal de confirmación genérico reutilizable.
 * Se utiliza para pedir confirmación antes de acciones críticas (eliminar, cancelar, enviar, etc.).
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controla si el modal está visible.
 * @param {Function} props.onClose - Función para cerrar el modal.
 * @param {Function} props.onConfirm - Función que se ejecuta al confirmar la acción.
 * @param {string} props.title - Título del modal.
 * @param {string} props.description - Texto explicativo sobre lo que ocurrirá.
 * @param {string} [props.confirmText="Confirmar"] - Texto del botón de confirmación.
 * @param {string} [props.cancelText="Cancelar"] - Texto del botón de cancelación.
 * @param {boolean} [props.isDestructive=false] - Si es true, el botón de confirmar será rojo (peligro).
 * @param {boolean} [props.isLoading=false] - Si es true, deshabilita botones y muestra estado de carga.
 */
export const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  confirmText = "Confirmar", 
  cancelText = "Cancelar",
  isDestructive = false,
  isLoading = false
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button 
            variant={isDestructive ? "destructive" : "default"} 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
