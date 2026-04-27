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
import { useProveedores } from '../../hooks/useProveedores';
import { requiredString } from '../../utils/validators';

const proveedorSchema = z.object({
  nombre: requiredString,
  contacto: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email('Email inválido').or(z.literal('')),
  condicionesPago: z.string().optional(),
});

/**
 * Vista del Formulario de Proveedores.
 * Permite la creación y edición de datos de un proveedor.
 * Reutiliza el mismo componente leyendo el parámetro 'id' de la URL.
 */
export const ProveedorFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id && id !== 'nuevo';
  
  const { getProveedorQuery, createProveedor, updateProveedor, isCreating, isUpdating } = useProveedores({});
  const { data: proveedorActual, isLoading } = getProveedorQuery(id);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(proveedorSchema),
    defaultValues: {
      nombre: '',
      contacto: '',
      telefono: '',
      email: '',
      condicionesPago: ''
    }
  });

  useEffect(() => {
    if (proveedorActual && isEditing) {
      reset({
        nombre: proveedorActual.nombre || '',
        contacto: proveedorActual.contacto || '',
        telefono: proveedorActual.telefono || '',
        email: proveedorActual.email || '',
        condicionesPago: proveedorActual.condicionesPago || ''
      });
    }
  }, [proveedorActual, isEditing, reset]);

  const onSubmit = (data) => {
    if (isEditing) {
      updateProveedor({ id, data });
    } else {
      createProveedor(data);
    }
  };

  const isSaving = isCreating || isUpdating;

  if (isEditing && isLoading) return <div className="p-8">Cargando...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader 
        title={isEditing ? 'Editar Proveedor' : 'Nuevo Proveedor'} 
        breadcrumb="Configuración › Proveedores"
      />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField label="Nombre o Razón Social" required error={errors.nombre?.message}>
              <Input placeholder="Ej. Distribuidora ABC" {...register('nombre')} />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Persona de Contacto" error={errors.contacto?.message}>
                <Input placeholder="Ej. María López" {...register('contacto')} />
              </FormField>

              <FormField label="Teléfono" error={errors.telefono?.message}>
                <Input placeholder="Ej. 3001234567" {...register('telefono')} />
              </FormField>
            </div>

            <FormField label="Correo electrónico" error={errors.email?.message}>
              <Input type="email" placeholder="contacto@ejemplo.com" {...register('email')} />
            </FormField>

            <FormField label="Condiciones de pago (días)" error={errors.condicionesPago?.message}>
              <Input type="number" placeholder="Ej. 30" {...register('condicionesPago')} />
            </FormField>

            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => navigate('/proveedores')} disabled={isSaving}>
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
