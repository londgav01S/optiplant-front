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
import { useListasPrecios } from '../../hooks/useListasPrecios';
import { requiredString } from '../../utils/validators';

const sucursalSchema = z.object({
  nombre: requiredString,
  direccion: z.string().optional(),
  telefono: z.string().optional(),
  idListaPrecios: z.preprocess(
    (value) => {
      if (value === '' || value == null) return null;
      const parsed = Number(value);
      return Number.isNaN(parsed) ? null : parsed;
    },
    z.number().int().positive().nullable().optional()
  ),
});

/**
 * Vista del Formulario de Sucursales.
 * Permite registrar nuevas sedes o editar la información básica de las existentes.
 * Solo debe ser accesible para administradores.
 */
export const SucursalFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id && id !== 'nuevo';
  
  const { getSucursalQuery, createSucursal, updateSucursal, isCreating, isUpdating } = useSucursales();
  const { listasPreciosQuery } = useListasPrecios();
  const { data: sucursalActual, isLoading } = getSucursalQuery(id);
  const listasPrecios = listasPreciosQuery.data?.content || listasPreciosQuery.data || [];

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(sucursalSchema),
    defaultValues: {
      nombre: '',
      direccion: '',
      telefono: '',
      idListaPrecios: ''
    }
  });

  useEffect(() => {
    if (sucursalActual && isEditing) {
      reset({
        nombre: sucursalActual.nombre || '',
        direccion: sucursalActual.direccion || '',
        telefono: sucursalActual.telefono || '',
        idListaPrecios: sucursalActual.listaPreciosId ? String(sucursalActual.listaPreciosId) : ''
      });
    }
  }, [sucursalActual, isEditing, reset]);

  const onSubmit = (data) => {
    const payload = {
      ...data,
      idListaPrecios: data.idListaPrecios ? Number(data.idListaPrecios) : null,
    };

    if (isEditing) {
      updateSucursal({ id, data: payload });
    } else {
      createSucursal(payload);
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

            <FormField label="Lista de precios" error={errors.idListaPrecios?.message} description="Define qué precio se usará por defecto en las ventas de esta sucursal.">
              <select
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register('idListaPrecios')}
              >
                <option value="">Sin lista asignada</option>
                {listasPrecios.map((lista) => (
                  <option key={lista.id} value={lista.id}>
                    {lista.nombre}
                  </option>
                ))}
              </select>
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
