import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { CurrencyDisplay } from '../../components/common/CurrencyDisplay';
import { useProductos } from '../../hooks/useProductos';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';

/**
 * Vista de Detalles del Producto.
 * Muestra la información completa de un producto específico,
 * su información general y, en el futuro, el desglose de inventario por sucursales.
 */
export const ProductoDetallePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductoQuery } = useProductos({});
  
  const { data: producto, isLoading } = getProductoQuery(id);

  if (isLoading) return <div className="p-8">Cargando detalles del producto...</div>;
  if (!producto) return <div className="p-8 text-danger-500">Producto no encontrado</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate('/productos')} className="-ml-4 text-gray-500">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a productos
      </Button>

      <PageHeader 
        title={`Producto: ${producto.nombre}`} 
        breadcrumb="Catálogo › Productos › Detalles"
        actionButton={
          <Button onClick={() => navigate(`/productos/${producto.id}/editar`)} variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Información General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">Descripción</p>
              <p className="mt-1 text-gray-900">{producto.descripcion || 'Sin descripción.'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-sm text-gray-500 font-medium">SKU</p>
                <p className="mt-1 font-mono text-gray-900">{producto.sku}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Precio Base (Detal)</p>
                <p className="mt-1">
                  {producto.precioBase != null
                    ? <CurrencyDisplay amount={producto.precioBase} />
                    : <span className="text-gray-400">Sin precio asignado</span>}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Estado</p>
                <Badge variant="outline" className={`mt-1 ${producto.activo ? 'bg-success-100 text-success-500 border-success-500/20' : 'bg-gray-100 text-gray-500'}`}>
                  {producto.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumen de Stock</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Aquí en fases futuras se mostrará el stock agregado por sucursal desde otro endpoint o como parte del detalle del producto */}
            <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <p className="text-sm">El módulo de inventario proporcionará esta información próximamente.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
