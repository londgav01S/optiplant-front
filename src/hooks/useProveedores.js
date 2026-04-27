import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { proveedoresService } from '../services/proveedoresService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useProveedores = (params) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const proveedoresQuery = useQuery({
    queryKey: ['proveedores', params],
    queryFn: () => proveedoresService.getAll(params),
    staleTime: 30000,
  });

  const getProveedorQuery = (id) => useQuery({
    queryKey: ['proveedores', id],
    queryFn: () => proveedoresService.getById(id),
    enabled: !!id && id !== 'nuevo',
  });

  const getHistorialQuery = (id, histParams) => useQuery({
    queryKey: ['proveedores', id, 'historial', histParams],
    queryFn: () => proveedoresService.getHistorial(id, histParams),
    enabled: !!id,
  });

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
