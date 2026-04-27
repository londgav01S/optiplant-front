import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '../../components/common/PageHeader';
import { FormField } from '../../components/common/FormField';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { useTransferencias } from '../../hooks/useTransferencias';
import { useProductos } from '../../hooks/useProductos';
import { useSucursales } from '../../hooks/useSucursales';
import { Trash2, Plus, ArrowRight, AlertCircle } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const transferenciaDetalleSchema = z.object({
  productoId: z.coerce.number().min(1, 'Producto requerido'),
  cantidad: z.coerce.number().min(1, 'Mínimo 1'),
});

const transferenciaSchema = z.object({
  sucursalOrigenId: z.coerce.number().min(1, 'Origen requerido'),
  sucursalDestinoId: z.coerce.number().min(1, 'Destino requerido'),
  urgencia: z.enum(['NORMAL', 'ALTA']),
  observaciones: z.string().optional(),
  detalles: z.array(transferenciaDetalleSchema).min(1, 'Debe agregar al menos un producto'),
}).refine(data => data.sucursalOrigenId !== data.sucursalDestinoId, {
  message: "El origen y destino no pueden ser la misma sucursal",
  path: ["sucursalDestinoId"]
});

/**
 * Formulario para Solicitar una Nueva Transferencia de Inventario.
 * Captura las sucursales de origen y destino (evitando que sean la misma)
 * y la lista de productos solicitados. Solo ADMIN puede cambiar el origen.
 */
export const TransferenciaFormPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = user?.rolNombre === 'ADMIN';

  const { createTransferencia, isCreating } = useTransferencias({});
  const { sucursalesQuery } = useSucursales();
  const { productosQuery } = useProductos({});
  
  const sucursales = sucursalesQuery.data || [];
  const productos = productosQuery.data?.content || productosQuery.data || [];

  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(transferenciaSchema),
    defaultValues: {
      sucursalOrigenId: isAdmin ? '' : user.sucursalId,
      sucursalDestinoId: '',
      urgencia: 'NORMAL',
      observaciones: '',
      detalles: [{ productoId: '', cantidad: 1 }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "detalles" });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      sucursalOrigenId: isAdmin ? data.sucursalOrigenId : user.sucursalId
    };
    createTransferencia(payload);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <PageHeader 
        title="Solicitar Transferencia" 
        breadcrumb="Operaciones › Transferencias › Nueva Solicitud"
      />

      {Object.keys(errors).length > 0 && (
        <div className="mb-4 p-4 bg-danger-50 border border-danger-200 text-danger-700 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold">Hay errores en el formulario</h4>
            <ul className="list-disc pl-5 text-sm mt-1">
              {Object.values(errors).map((err, i) => (
                <li key={i}>{err.message}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Información de la Ruta</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative mb-6">
              <FormField label="Sucursal Origen" required error={errors.sucursalOrigenId?.message}>
                <select 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register('sucursalOrigenId')}
                  disabled={!isAdmin}
                >
                  <option value="">Seleccione origen...</option>
                  {sucursales.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                </select>
              </FormField>

              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-2 z-10 bg-white px-2">
                <ArrowRight className="h-6 w-6 text-gray-400" />
              </div>

              <FormField label="Sucursal Destino" required error={errors.sucursalDestinoId?.message}>
                <select 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register('sucursalDestinoId')}
                >
                  <option value="">Seleccione destino...</option>
                  {sucursales.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                </select>
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Urgencia" required>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="NORMAL" {...register('urgencia')} className="text-primary-600 focus:ring-primary-500 h-4 w-4" />
                    <span className="text-sm">Normal</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-warning-700">
                    <input type="radio" value="ALTA" {...register('urgencia')} className="text-warning-600 focus:ring-warning-500 h-4 w-4" />
                    <span className="text-sm font-medium">Alta Urgencia</span>
                  </label>
                </div>
              </FormField>

              <FormField label="Observaciones">
                <Input placeholder="Ej. Solicitud urgente por desabastecimiento..." {...register('observaciones')} />
              </FormField>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Productos a Solicitar</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ productoId: '', cantidad: 1 })}>
                <Plus className="h-4 w-4 mr-1" /> Agregar Línea
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Producto" required error={errors.detalles?.[index]?.productoId?.message}>
                      <select 
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        {...register(`detalles.${index}.productoId`)}
                      >
                        <option value="">Seleccione...</option>
                        {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                      </select>
                    </FormField>

                    <FormField label="Cantidad solicitada" required error={errors.detalles?.[index]?.cantidad?.message}>
                      <Input type="number" min="1" {...register(`detalles.${index}.cantidad`)} />
                    </FormField>
                  </div>
                  
                  <div className="pt-7">
                    <Button type="button" variant="ghost" className="text-danger-500 hover:text-danger-600 hover:bg-danger-50" onClick={() => remove(index)} disabled={fields.length === 1}>
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate('/transferencias')} disabled={isCreating}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-primary-600 hover:bg-primary-700" disabled={isCreating}>
            {isCreating ? 'Enviando Solicitud...' : 'Solicitar Transferencia'}
          </Button>
        </div>
      </form>
    </div>
  );
};
