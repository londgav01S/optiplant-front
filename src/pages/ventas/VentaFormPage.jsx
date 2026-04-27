import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '../../components/common/PageHeader';
import { FormField } from '../../components/common/FormField';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { useVentas } from '../../hooks/useVentas';
import { useProductos } from '../../hooks/useProductos';
import { CurrencyDisplay } from '../../components/common/CurrencyDisplay';
import { requiredString } from '../../utils/validators';
import { Trash2, Plus } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const ventaDetalleSchema = z.object({
  productoId: z.coerce.number().min(1, 'Producto requerido'),
  cantidad: z.coerce.number().min(1, 'Mínimo 1'),
  precioUnitario: z.coerce.number().min(0, 'Precio inválido'),
});

const ventaSchema = z.object({
  clienteNombre: requiredString,
  clienteDocumento: z.string().optional(),
  detalles: z.array(ventaDetalleSchema).min(1, 'Debe agregar al menos un producto'),
});

export const VentaFormPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createVenta, isCreating } = useVentas();
  // Idealmente se consultaría un endpoint que devuelva stock por sucursal,
  // por ahora usamos los productos.
  const { productosQuery } = useProductos({});
  const productos = productosQuery.data?.content || productosQuery.data || [];

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(ventaSchema),
    defaultValues: {
      clienteNombre: '',
      clienteDocumento: '',
      detalles: [{ productoId: '', cantidad: 1, precioUnitario: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "detalles"
  });

  const detallesWatch = watch('detalles');
  
  const calcularTotal = () => {
    return detallesWatch.reduce((acc, curr) => {
      const cant = Number(curr.cantidad) || 0;
      const precio = Number(curr.precioUnitario) || 0;
      return acc + (cant * precio);
    }, 0);
  };

  const handleProductoChange = (index, productoIdStr) => {
    const productoId = Number(productoIdStr);
    const prod = productos.find(p => p.id === productoId);
    if (prod) {
      setValue(`detalles.${index}.precioUnitario`, prod.precioBase);
    }
  };

  const onSubmit = (data) => {
    // La sucursal la toma el backend del token, o la podemos enviar:
    const payload = {
      ...data,
      sucursalId: user.sucursalId
    };
    createVenta(payload);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader 
        title="Nueva Venta" 
        breadcrumb="Operaciones › Ventas"
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Nombre del Cliente" required error={errors.clienteNombre?.message}>
                <Input placeholder="Ej. Consumidor Final" {...register('clienteNombre')} />
              </FormField>

              <FormField label="Documento del Cliente" error={errors.clienteDocumento?.message}>
                <Input placeholder="Ej. 123456789" {...register('clienteDocumento')} />
              </FormField>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Productos</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ productoId: '', cantidad: 1, precioUnitario: 0 })}>
                <Plus className="h-4 w-4 mr-1" /> Agregar Producto
              </Button>
            </div>

            {errors.detalles?.root && (
              <p className="text-sm text-danger-500 mb-4">{errors.detalles.root.message}</p>
            )}

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField label="Producto" required error={errors.detalles?.[index]?.productoId?.message}>
                      <select 
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...register(`detalles.${index}.productoId`)}
                        onChange={(e) => {
                          register(`detalles.${index}.productoId`).onChange(e);
                          handleProductoChange(index, e.target.value);
                        }}
                      >
                        <option value="">Seleccione...</option>
                        {productos.map(p => (
                          <option key={p.id} value={p.id}>{p.nombre}</option>
                        ))}
                      </select>
                    </FormField>

                    <FormField label="Cantidad" required error={errors.detalles?.[index]?.cantidad?.message}>
                      <Input type="number" min="1" {...register(`detalles.${index}.cantidad`)} />
                    </FormField>

                    <FormField label="Precio Unitario" required error={errors.detalles?.[index]?.precioUnitario?.message}>
                      <Input type="number" step="100" {...register(`detalles.${index}.precioUnitario`)} />
                    </FormField>
                  </div>
                  
                  <div className="pt-7">
                    <Button type="button" variant="ghost" className="text-danger-500 hover:text-danger-600 hover:bg-danger-50" onClick={() => remove(index)}>
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end text-xl">
              <span className="font-semibold text-gray-900 mr-4">Total:</span>
              <CurrencyDisplay amount={calcularTotal()} className="text-primary-600 font-bold" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate('/ventas')} disabled={isCreating}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-primary-600 hover:bg-primary-700" disabled={isCreating}>
            {isCreating ? 'Registrando...' : 'Registrar Venta'}
          </Button>
        </div>
      </form>
    </div>
  );
};
