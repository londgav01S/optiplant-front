import React from 'react';
import { formatCurrency } from '../../utils/formatters';

export const CurrencyDisplay = ({ amount, className = "" }) => {
  return (
    <span className={`font-mono font-medium ${className}`}>
      {formatCurrency(amount)}
    </span>
  );
};
