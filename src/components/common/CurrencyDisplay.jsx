import React from 'react';
import { formatCurrency } from '../../utils/formatters';

/**
 * Componente para mostrar cantidades de dinero con formato.
 * Usa la utilidad `formatCurrency` para dar el formato local correcto.
 * 
 * @param {Object} props
 * @param {number} props.amount - La cantidad monetaria a formatear.
 * @param {string} [props.className] - Clases CSS adicionales para personalizar el estilo.
 */
export const CurrencyDisplay = ({ amount, className = "" }) => {
  return (
    <span className={`font-mono font-medium ${className}`}>
      {formatCurrency(amount)}
    </span>
  );
};
