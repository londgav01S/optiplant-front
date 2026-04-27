import React from 'react';
import { PackageX } from 'lucide-react';

export const EmptyState = ({ 
  title = "No hay resultados", 
  description = "No encontramos elementos que coincidan con tu búsqueda.",
  icon = <PackageX className="h-12 w-12 text-gray-300" />
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm">
        {description}
      </p>
    </div>
  );
};
