import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sucursalesService } from '../services/sucursalesService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

/**
 * Hook para la administración de Sucursales de la empresa.
 * 
 * @returns {Object} Consultas y mutaciones de sucursales.
 */
export const useSucursales = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Obtiene la lista general de sucursales
  const sucursalesQuery = useQuery({
    queryKey: ['sucursales'],
    queryFn: sucursalesService.getAll,
    staleTime: 30000,
  });

  // Obtiene el detalle de una sucursal específica
  const getSucursalQuery = (id) => useQuery({
    queryKey: ['sucursales', id],
    queryFn: () => sucursalesService.getById(id),
    enabled: !!id && id !== 'nuevo',
  });

  // Mutación para crear una nueva sucursal
  const createMutation = useMutation({
    mutationFn: sucursalesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sucursales'] });
      toast.success('Sucursal creada exitosamente');
      navigate('/sucursales');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al crear la sucursal';
      toast.error(msg);
    }
  });

  // Mutación para editar la información de una sucursal
  const updateMutation = useMutation({
    mutationFn: sucursalesService.update,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sucursales'] });
      queryClient.invalidateQueries({ queryKey: ['sucursales', variables.id] });
      toast.success('Sucursal actualizada exitosamente');
      navigate('/sucursales');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al actualizar la sucursal';
      toast.error(msg);
    }
  });

  // Mutación para dar de baja lógica a una sucursal
  const desactivarMutation = useMutation({
    mutationFn: sucursalesService.desactivar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sucursales'] });
      toast.success('Estado de sucursal actualizado');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al actualizar estado';
      toast.error(msg);
    }
  });

  return {
    sucursalesQuery,
    getSucursalQuery,
    createSucursal: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateSucursal: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    desactivarSucursal: desactivarMutation.mutate,
    isDesactivando: desactivarMutation.isPending,
  };
};
