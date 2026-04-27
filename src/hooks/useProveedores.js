import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { proveedoresService } from '../services/proveedoresService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

/**
 * Hook para la gestión del directorio de Proveedores.
 * 
 * @param {Object} params - Parámetros de listado (filtros, paginación).
 * @returns {Object} Consultas y mutaciones asociadas a proveedores.
 */
export const useProveedores = (params) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Listado de proveedores
  const proveedoresQuery = useQuery({
    queryKey: ['proveedores', params],
    queryFn: () => proveedoresService.getAll(params),
    staleTime: 30000,
  });

  // Detalle de un proveedor específico
  const getProveedorQuery = (id) => useQuery({
    queryKey: ['proveedores', id],
    queryFn: () => proveedoresService.getById(id),
    enabled: !!id && id !== 'nuevo',
  });

  // Historial de compras o interacciones de un proveedor
  const getHistorialQuery = (id, histParams) => useQuery({
    queryKey: ['proveedores', id, 'historial', histParams],
    queryFn: () => proveedoresService.getHistorial(id, histParams),
    enabled: !!id,
  });

  // Crear un nuevo proveedor
  const createMutation = useMutation({
    mutationFn: proveedoresService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] });
      toast.success('Proveedor creado exitosamente');
      navigate('/proveedores');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al crear el proveedor';
      toast.error(msg);
    }
  });

  // Modificar información de un proveedor existente
  const updateMutation = useMutation({
    mutationFn: proveedoresService.update,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] });
      queryClient.invalidateQueries({ queryKey: ['proveedores', variables.id] });
      toast.success('Proveedor actualizado exitosamente');
      navigate('/proveedores');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al actualizar el proveedor';
      toast.error(msg);
    }
  });

  return {
    proveedoresQuery,
    getProveedorQuery,
    getHistorialQuery,
    createProveedor: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateProveedor: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};
