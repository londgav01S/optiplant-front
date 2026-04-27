import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '../../components/common/PageHeader';
import { FormField } from '../../components/common/FormField';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useUsuarios } from '../../hooks/useUsuarios';
import { useSucursales } from '../../hooks/useSucursales';
import { requiredString } from '../../utils/validators';
import { ROLES as ROLES_CONSTANTS } from '../../utils/constants';

// Zod schema dinámico porque password es requerido solo en creación
const getUsuarioSchema = (isEditing) => z.object({
  nombre: requiredString,
  apellido: requiredString,
  email: z.string().email('Email inválido'),
  password: isEditing ? z.string().optional() : z.string().min(8, 'Mínimo 8 caracteres'),
  rolNombre: requiredString,
  sucursalId: z.any().optional() // Opcional porque ADMIN no requiere sucursal
}).superRefine((data, ctx) => {
  if (data.rolNombre !== 'ADMIN' && !data.sucursalId) {
    ctx.addIssue({
      path: ['sucursalId'],
      message: 'La sucursal es requerida para este rol',
      code: z.ZodIssueCode.custom,
    });
  }
});

export const UsuarioFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id && id !== 'nuevo';
  
  const { getUsuarioQuery, createUsuario, updateUsuario, isCreating, isUpdating } = useUsuarios({});
  const { sucursalesQuery } = useSucursales();
  
  const { data: usuarioActual, isLoading } = getUsuarioQuery(id);
  const sucursales = sucursalesQuery.data || [];

  const schema = getUsuarioSchema(isEditing);

  const { register, handleSubmit, control, watch, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      rolNombre: '',
      sucursalId: ''
    }
  });

  const rolSeleccionado = watch('rolNombre');

  useEffect(() => {
    if (usuarioActual && isEditing) {
      reset({
        nombre: usuarioActual.nombre || '',
        apellido: usuarioActual.apellido || '',
        email: usuarioActual.email || '',
        rolNombre: usuarioActual.rolNombre || '',
        sucursalId: usuarioActual.sucursalId ? String(usuarioActual.sucursalId) : ''
      });
    }
  }, [usuarioActual, isEditing, reset]);

  const onSubmit = (data) => {
    // Convertir sucursalId a número si existe
    const payload = {
      ...data,
      sucursalId: data.sucursalId ? Number(data.sucursalId) : null
    };

    if (isEditing) {
      // Remover password si viene vacío en edición
      if (!payload.password) delete payload.password;
      updateUsuario({ id, data: payload });
    } else {
      createUsuario(payload);
    }
  };

  const isSaving = isCreating || isUpdating;

  if (isEditing && isLoading) return <div className="p-8">Cargando...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader 
        title={isEditing ? 'Editar Usuario' : 'Nuevo Usuario'} 
        breadcrumb="Configuración › Usuarios"
      />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Nombre" required error={errors.nombre?.message}>
                <Input placeholder="Ej. Juan" {...register('nombre')} />
              </FormField>

              <FormField label="Apellido" required error={errors.apellido?.message}>
                <Input placeholder="Ej. Pérez" {...register('apellido')} />
              </FormField>
            </div>

            <FormField label="Correo electrónico" required error={errors.email?.message}>
              <Input type="email" placeholder="juan.perez@ejemplo.com" {...register('email')} />
            </FormField>

            <FormField 
              label="Contraseña" 
              required={!isEditing} 
              description={isEditing ? "Déjalo en blanco para mantener la contraseña actual." : ""}
              error={errors.password?.message}
            >
              <Input type="password" placeholder="••••••••" {...register('password')} />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Rol" required error={errors.rolNombre?.message}>
                <Controller
                  name="rolNombre"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ROLES_CONSTANTS).map(rol => (
                          <SelectItem key={rol} value={rol}>{rol}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              {rolSeleccionado !== 'ADMIN' && (
                <FormField label="Sucursal" required={rolSeleccionado !== 'ADMIN'} error={errors.sucursalId?.message}>
                  <Controller
                    name="sucursalId"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una sucursal" />
                        </SelectTrigger>
                        <SelectContent>
                          {sucursales.map(sucursal => (
                            <SelectItem key={sucursal.id} value={String(sucursal.id)}>
                              {sucursal.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
              )}
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => navigate('/usuarios')} disabled={isSaving}>
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
