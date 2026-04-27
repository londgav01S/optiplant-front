import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';

export const ErrorState = ({ 
  title = "Ocurrió un error", 
  message = "No pudimos cargar esta información. Por favor, intenta de nuevo.",
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-danger-100 rounded-lg border border-danger-500/20">
      <AlertTriangle className="h-10 w-10 text-danger-500 mb-3" />
      <h3 className="text-lg font-semibold text-danger-500 mb-1">{title}</h3>
      <p className="text-sm text-danger-500/80 max-w-sm mb-4">
        {message}
      </p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="border-danger-500 text-danger-500 hover:bg-danger-500 hover:text-white">
          Reintentar
        </Button>
      )}
    </div>
  );
};
