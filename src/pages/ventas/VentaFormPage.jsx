import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
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
import { inventarioService } from '../../services/inventarioService';

const ventaDetalleSchema = z.object({
  productoId: z.coerce.number().min(1, 'Producto requerido'),
  cantidad: z.coerce.number().positive('La cantidad debe ser mayor a cero'),
  precioUnitario: z.coerce.number().min(0, 'Precio inválido'),
});

const ventaSchema = z.object({
  clienteNombre: requiredString,
  clienteDocumento: z.string().optional(),
  idSucursal: z.coerce.number().min(1, 'Sucursal requerida'),
  idListaPrecios: z.coerce.number().nullable().optional(),
  detalles: z.array(ventaDetalleSchema).min(1, 'Debe agregar al menos un producto'),
});

/**
 * Formulario para el Registro de una Nueva Venta.
 * Utiliza `useFieldArray` para manejar una lista dinámica de productos.
 * Autocompleta el precio base de los productos seleccionados y calcula el total.
 */
export const VentaFormPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createVenta, isCreating } = useVentas();
  const { productosQuery } = useProductos({});
  const productos = productosQuery.data?.content || productosQuery.data || [];
  const { data: inventarioData, isLoading: isLoadingInventario } = useQuery({
    queryKey: ['inventario', 'sucursal', user?.sucursalId],
    queryFn: () => inventarioService.getBySucursal(user.sucursalId),
    enabled: !!user?.sucursalId,
    staleTime: 30000,
  });

  const inventario = inventarioData || [];
  const stockPorProductoId = inventario.reduce((acc, item) => {
    acc[item.productoId] = Number(item.stockActual) || 0;
    return acc;
  }, {});
  const productosVendibles = productos.filter((producto) => (stockPorProductoId[producto.id] || 0) > 0);

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(ventaSchema),
    defaultValues: {
      clienteNombre: '',
      clienteDocumento: '',
      idSucursal: user?.sucursalId ?? '',
      idListaPrecios: user?.listaPreciosId ?? '',
      detalles: [{ productoId: '', cantidad: 1, precioUnitario: 0 }]
    }
  });

  useEffect(() => {
    if (user?.sucursalId) {
      setValue('idSucursal', user.sucursalId);
    }
    if (user?.listaPreciosId) {
      setValue('idListaPrecios', user.listaPreciosId);
    }
  }, [user, setValue]);

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
    } else {
      setValue(`detalles.${index}.precioUnitario`, 0);
    }
  };

  const onSubmit = (data) => {
    const payload = {
      clienteNombre: data.clienteNombre,
      clienteDocumento: data.clienteDocumento,
      idSucursal: Number(data.idSucursal),
      idListaPrecios: data.idListaPrecios ? Number(data.idListaPrecios) : null,
      lineas: data.detalles.map((detalle) => ({
        idProducto: Number(detalle.productoId),
        cantidad: Number(detalle.cantidad),
      }))
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

        <input type="hidden" {...register('idSucursal')} />
        <input type="hidden" {...register('idListaPrecios')} />

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
              {fields.map((field, index) => {
                const productoIdSeleccionado = Number(watch(`detalles.${index}.productoId`));
                const stockDisponible = stockPorProductoId[productoIdSeleccionado] || 0;

                return (
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
                          disabled={isLoadingInventario}
                        >
                          <option value="">Seleccione...</option>
                          {productosVendibles.map(p => (
                            <option key={p.id} value={p.id}>{p.nombre} {stockPorProductoId[p.id] != null ? `(Stock: ${stockPorProductoId[p.id]})` : ''}</option>
                          ))}
                        </select>
                        {!isLoadingInventario && productosVendibles.length === 0 && (
                          <p className="mt-1 text-xs text-gray-500">No hay productos con stock disponible en esta sucursal.</p>
                        )}
                      </FormField>

                      <FormField label="Cantidad" required error={errors.detalles?.[index]?.cantidad?.message}>
                        <Input 
                          type="number" 
                          min="1" 
                          step="1"
                          max={stockDisponible || undefined}
                          {...register(`detalles.${index}.cantidad`, {
                            validate: (value) => {
                              const cantidad = Number(value) || 0;
                              if (!productoIdSeleccionado) {
                                return 'Seleccione un producto';
                              }
                              if (cantidad > stockDisponible) {
                                return `Solo hay ${stockDisponible} unidades disponibles`;
                              }
                              return true;
                            }
                          })} 
                        />
                        {stockPorProductoId[productoIdSeleccionado] != null && (
                          <p className="mt-1 text-xs text-gray-500">Stock disponible: {stockDisponible}</p>
                        )}
                      </FormField>

                      <FormField label="Precio Unitario" required error={errors.detalles?.[index]?.precioUnitario?.message}>
                        <Input
                          type="number"
                          step="100"
                          readOnly
                          className="bg-gray-50 text-gray-700"
                          {...register(`detalles.${index}.precioUnitario`)}
                        />
                        <p className="mt-1 text-xs text-gray-500">Se completa automáticamente según el producto seleccionado.</p>
                      </FormField>
                    </div>
                    
                    <div className="pt-7">
                      <Button type="button" variant="ghost" className="text-danger-500 hover:text-danger-600 hover:bg-danger-50" onClick={() => remove(index)}>
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
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
