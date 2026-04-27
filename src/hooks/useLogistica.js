import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { logisticaService } from '../services/logisticaService';
import { toast } from 'sonner';

export const useLogistica = (params) => {
  const queryClient = useQueryClient();

  const logisticaQuery = useQuery({
    queryKey: ['logistica', params],
    queryFn: () => logisticaService.getAll(params),
    staleTime: 30000,
  });

  const createRutaMutation = useMutation({
    mutationFn: logisticaService.createRuta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistica'] });
      toast.success('Ruta creada exitosamente');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al crear la ruta';
      toast.error(msg);
    }
  });

  const updateEstadoMutation = useMutation({
    mutationFn: logisticaService.updateEstado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistica'] });
      toast.success('Estado de ruta actualizado');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al actualizar el estado';
      toast.error(msg);
    }
  });

  return {
    logisticaQuery,
    createRuta: createRutaMutation.mutate,
    isCreating: createRutaMutation.isPending,
    updateEstado: updateEstadoMutation.mutate,
    isUpdating: updateEstadoMutation.isPending,
  };
};
