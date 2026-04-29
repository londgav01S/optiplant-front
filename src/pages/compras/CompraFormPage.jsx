import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '../../components/common/PageHeader';
import { FormField } from '../../components/common/FormField';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { useCompras } from '../../hooks/useCompras';
import { useProductos } from '../../hooks/useProductos';
import { useProveedores } from '../../hooks/useProveedores';
import { useSucursales } from '../../hooks/useSucursales';
import { CurrencyDisplay } from '../../components/common/CurrencyDisplay';
import { Trash2, Plus } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { ROLES } from '../../utils/constants';


const compraDetalleSchema = z.object({
  productoId: z.coerce.number().min(1, 'Producto requerido'),
  cantidad: z.coerce.number().min(1, 'Mínimo 1'),
  precioUnitario: z.coerce.number().min(0, 'Precio inválido'),
});

const compraSchema = z.object({
  proveedorId: z.coerce.number().min(1, 'Debe seleccionar un proveedor'),
  sucursalId: z.coerce.number().min(1, 'Debe seleccionar una sucursal'),
  detalles: z.array(compraDetalleSchema).min(1, 'Debe agregar al menos un producto'),
});

/**
 * Formulario para el Registro de una Nueva Orden de Compra.
 * Permite seleccionar al proveedor e ingresar los productos mediante un formulario dinámico.
 * Calcula el total en tiempo real.
 */
export const CompraFormPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = user?.rolNombre === ROLES.ADMIN;
  const { createCompra, isCreating } = useCompras();

  const { proveedoresQuery } = useProveedores({});
  const proveedores = proveedoresQuery.data?.content || proveedoresQuery.data || [];

  const { productosQuery } = useProductos({});
  const productos = productosQuery.data?.content || productosQuery.data || [];

  const { sucursalesQuery } = useSucursales();
  const sucursales = sucursalesQuery.data?.content || sucursalesQuery.data || [];

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(compraSchema),
    defaultValues: {
      proveedorId: '',
      sucursalId: user?.sucursalId ?? '',
      detalles: [{ productoId: '', cantidad: 1, precioUnitario: 0 }],
    },
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
      // Usar precioBase de catálogo o precio de compra si existiera
      setValue(`detalles.${index}.precioUnitario`, prod.precioBase);
    }
  };

  const onSubmit = (data) => {
    const payload = {
      idProveedor: Number(data.proveedorId),
      idSucursal: Number(data.sucursalId),
      lineas: data.detalles.map((d) => ({
        idProducto: Number(d.productoId),
        cantidadPedida: Number(d.cantidad),
        precioUnitario: Number(d.precioUnitario),
        descuento: 0,
      })),
    };
    createCompra(payload);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader 
        title="Nueva Orden de Compra" 
        breadcrumb="Operaciones › Compras"
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mb-6">
          <CardContent className="pt-6 space-y-4">
            <div className={`grid gap-4 ${isAdmin ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
              <FormField label="Proveedor" required error={errors.proveedorId?.message}>
                <select
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register('proveedorId')}
                >
                  <option value="">Seleccione un proveedor...</option>
                  {proveedores.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </FormField>

              {isAdmin && (
                <FormField label="Sucursal" required error={errors.sucursalId?.message}>
                  <select
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register('sucursalId')}
                  >
                    <option value="">Seleccione una sucursal...</option>
                    {sucursales.map(s => (
                      <option key={s.id} value={s.id}>{s.nombre}</option>
                    ))}
                  </select>
                </FormField>
              )}
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

                    <FormField label="Costo Unitario" required error={errors.detalles?.[index]?.precioUnitario?.message}>
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
          <Button type="button" variant="outline" onClick={() => navigate('/compras')} disabled={isCreating}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-primary-600 hover:bg-primary-700" disabled={isCreating}>
            {isCreating ? 'Registrando...' : 'Registrar Compra'}
          </Button>
        </div>
      </form>
    </div>
  );
};
