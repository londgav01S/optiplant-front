import React from 'react';
import { formatStock } from '../../utils/formatters';

export const StockIndicator = ({ current, min, max }) => {
  // Calculamos el porcentaje relativo al máximo. Si no hay máximo, usamos un múltiplo del mínimo.
  const maxVal = max || (min * 3) || (current * 2) || 100;
  const percentage = Math.min(100, Math.max(0, (current / maxVal) * 100));
  
  let colorClass = "bg-success-500";
  if (current <= min) {
    colorClass = "bg-danger-500";
  } else if (current <= min * 1.5) {
    colorClass = "bg-warning-500";
  }

  return (
    <div className="flex flex-col gap-1 w-full min-w-[120px]">
      <div className="flex justify-between items-end">
        <span className="font-mono font-medium text-gray-900">{formatStock(current)}</span>
        <span className="text-[10px] text-gray-500">Min: {formatStock(min)}</span>
      </div>
      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClass} transition-all duration-300`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
