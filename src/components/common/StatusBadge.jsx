import React from 'react';
import { Badge } from '../ui/badge';
import { 
  ESTADOS_VENTA, 
  ESTADOS_TRANSFERENCIA, 
  ESTADOS_COMPRA, 
  TIPOS_ALERTA, 
  NIVELES_URGENCIA 
} from '../../utils/constants';

// Combinamos todos los mapeos de estados en un solo objeto para búsqueda rápida
const ALL_STATUSES = {
  ...ESTADOS_VENTA,
  ...ESTADOS_TRANSFERENCIA,
  ...ESTADOS_COMPRA,
  ...TIPOS_ALERTA,
  ...NIVELES_URGENCIA,
};

/**
 * Componente visual de etiqueta (Badge) coloreada que representa el estado de una entidad.
 * Mapea la constante string (ej. "EN_TRANSITO") a su texto legible y color correspondiente.
 * 
 * @param {Object} props
 * @param {string} props.status - Código o identificador del estado (viene del backend).
 */
export const StatusBadge = ({ status }) => {
  if (!status) return null;
  
  const statusInfo = ALL_STATUSES[status];
  
  if (!statusInfo) {
    return <Badge variant="outline">{status}</Badge>;
  }

  // Mapeamos los colores al sistema de variantes de Tailwind configurado en tailwind.config.js
  const colorClasses = {
    success: 'bg-success-100 text-success-500 hover:bg-success-100/80 border-success-500/20',
    warning: 'bg-warning-100 text-warning-500 hover:bg-warning-100/80 border-warning-500/20',
    danger: 'bg-danger-100 text-danger-500 hover:bg-danger-100/80 border-danger-500/20',
    info: 'bg-info-100 text-info-500 hover:bg-info-100/80 border-info-500/20',
  };

  const className = colorClasses[statusInfo.color] || 'bg-gray-100 text-gray-900 border-gray-200';

  return (
    <Badge variant="outline" className={className}>
      {statusInfo.texto}
    </Badge>
  );
};
