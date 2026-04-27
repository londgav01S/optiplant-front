import React from 'react';

/**
 * Componente estructural utilizado en la parte superior de las páginas (vistas).
 * Muestra el título, posibles migas de pan (breadcrumbs) y botones de acción a la derecha.
 * 
 * @param {Object} props
 * @param {string} props.title - El título principal de la página.
 * @param {string|React.ReactNode} [props.breadcrumb] - Elemento superior al título para indicar ubicación.
 * @param {React.ReactNode} [props.actionButton] - Botón o grupo de botones de acción principal (ej. "Crear Nuevo").
 */
export const PageHeader = ({ title, breadcrumb, actionButton }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        {breadcrumb && (
          <p className="text-sm text-gray-400 mb-1">{breadcrumb}</p>
        )}
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>
      {actionButton && (
        <div className="shrink-0">
          {actionButton}
        </div>
      )}
    </div>
  );
};
