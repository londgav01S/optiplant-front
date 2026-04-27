import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';

/**
 * Componente visual para mostrar mensajes de error cuando falla una petición o carga de datos.
 * Incluye opcionalmente un botón de reintento.
 * 
 * @param {Object} props
 * @param {string} [props.title] - Título principal del error.
 * @param {string} [props.message] - Detalle del error ocurrido.
 * @param {Function} [props.onRetry] - Función a ejecutar cuando el usuario haga clic en "Reintentar".
 */
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
