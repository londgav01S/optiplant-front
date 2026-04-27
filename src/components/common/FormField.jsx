import React from 'react';
import { Label } from '../ui/label';

/**
 * Envoltorio para campos de formulario (inputs, selects, etc.).
 * Centraliza la lógica de renderizado de etiquetas (Labels), descripciones y mensajes de error.
 * 
 * @param {Object} props
 * @param {string} [props.label] - Etiqueta del campo.
 * @param {string} [props.error] - Mensaje de error a mostrar debajo del input (colorea label rojo).
 * @param {React.ReactNode} props.children - El elemento input/select en sí mismo.
 * @param {boolean} [props.required=false] - Muestra asterisco rojo si es obligatorio.
 * @param {string} [props.description] - Texto descriptivo extra debajo del input (si no hay error).
 */
export const FormField = ({ 
  label, 
  error, 
  children, 
  required = false,
  description
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <Label className={`text-sm font-medium ${error ? 'text-danger-500' : 'text-gray-900'}`}>
          {label} {required && <span className="text-danger-500">*</span>}
        </Label>
      )}
      
      {/* El Input o elemento de formulario va aquí */}
      {children}
      
      {description && !error && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      
      {error && (
        <p className="text-xs font-medium text-danger-500">{error}</p>
      )}
    </div>
  );
};
