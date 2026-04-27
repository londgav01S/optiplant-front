import React from 'react';
import { Label } from '../ui/label';

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
