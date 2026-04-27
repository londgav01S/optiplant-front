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
import { useSucursales } from '../../hooks/useSucursales';
import { requiredString } from '../../utils/validators';

const sucursalSchema = z.object({
  nombre: requiredString,
  direccion: z.string().optional(),
  telefono: z.string().optional(),
});

export const SucursalFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id && id !== 'nuevo';
  
  const { getSucursalQuery, createSucursal, updateSucursal, isCreating, isUpdating } = useSucursales();
  const { data: sucursalActual, isLoading } = getSucursalQuery(id);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(sucursalSchema),
    defaultValues: {
      nombre: '',
      direccion: '',
      telefono: ''
    }
  });

  useEffect(() => {
    if (sucursalActual && isEditing) {
      reset({
        nombre: sucursalActual.nombre || '',
        direccion: sucursalActual.direccion || '',
        telefono: sucursalActual.telefono || ''
      });
    }
  }, [sucursalActual, isEditing, reset]);

  const onSubmit = (data) => {
    if (isEditing) {
      updateSucursal({ id, data });
    } else {
      createSucursal(data);
    }
  };

  const isSaving = isCreating || isUpdating;

  if (isEditing && isLoading) return <div className="p-8">Cargando...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader 
        title={isEditing ? 'Editar Sucursal' : 'Nueva Sucursal'} 
        breadcrumb="Configuración › Sucursales"
      />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField label="Nombre" required error={errors.nombre?.message}>
              <Input placeholder="Ej. Sucursal Norte" {...register('nombre')} />
            </FormField>

            <FormField label="Dirección" error={errors.direccion?.message}>
              <Input placeholder="Ej. Calle 123 # 45-67" {...register('direccion')} />
            </FormField>

            <FormField label="Teléfono" error={errors.telefono?.message}>
              <Input placeholder="Ej. 3001234567" {...register('telefono')} />
            </FormField>

            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => navigate('/sucursales')} disabled={isSaving}>
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
