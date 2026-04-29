import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '../../components/common/PageHeader';
import { FormField } from '../../components/common/FormField';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { useProductos } from '../../hooks/useProductos';
import { requiredString } from '../../utils/validators';

const productoSchema = z.object({
  sku: requiredString,
  nombre: requiredString,
  descripcion: z.string().optional(),
  precioBase: z.coerce.number().min(0, 'El precio debe ser mayor o igual a 0').optional().nullable(),
});

/**
 * Vista del Formulario de Productos.
 * Reutilizable tanto para Crear (nuevo) como para Editar (id existente).
 * Carga automáticamente los datos actuales si es modo edición.
 */
export const ProductoFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id && id !== 'nuevo';
  
  const { getProductoQuery, createProducto, updateProducto, isCreating, isUpdating } = useProductos({});
  const { data: productoActual, isLoading } = getProductoQuery(id);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      sku: '',
      nombre: '',
      descripcion: '',
      precioBase: '',
    }
  });

  useEffect(() => {
    if (productoActual && isEditing) {
      reset({
        sku: productoActual.sku || '',
        nombre: productoActual.nombre || '',
        descripcion: productoActual.descripcion || '',
        precioBase: productoActual.precioBase ?? '',
      });
    }
  }, [productoActual, isEditing, reset]);

  const onSubmit = (data) => {
    const payload = {
      sku: data.sku,
      nombre: data.nombre,
      descripcion: data.descripcion || null,
      precioBase: data.precioBase !== '' && data.precioBase != null ? Number(data.precioBase) : null,
      unidades: [],
    };
    if (isEditing) {
      updateProducto({ id, data: payload });
    } else {
      createProducto(payload);
    }
  };

  const isSaving = isCreating || isUpdating;

  if (isEditing && isLoading) return <div className="p-8">Cargando...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader 
        title={isEditing ? 'Editar Producto' : 'Nuevo Producto'} 
        breadcrumb="Catálogo › Productos"
      />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="SKU" required error={errors.sku?.message}>
                <Input placeholder="Ej. PROD-001" {...register('sku')} />
              </FormField>

              <FormField label="Nombre del Producto" required error={errors.nombre?.message}>
                <Input placeholder="Ej. Fertilizante NPK" {...register('nombre')} />
              </FormField>
            </div>

            <FormField label="Descripción" error={errors.descripcion?.message}>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Descripción detallada del producto..."
                {...register('descripcion')}
              />
            </FormField>

            <FormField label="Precio Base (COP)" error={errors.precioBase?.message} description="Precio de referencia en la lista Precio Detal. Puede variar en compras o listas especiales.">
              <Input type="number" step="100" min="0" placeholder="Ej. 25000" {...register('precioBase')} />
            </FormField>

            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => navigate('/productos')} disabled={isSaving}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary-600 hover:bg-primary-700" disabled={isSaving}>
                {isSaving ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
