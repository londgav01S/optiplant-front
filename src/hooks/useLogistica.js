import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { logisticaService } from '../services/logisticaService';
import { toast } from 'sonner';

/**
 * Hook encargado de la lógica de negocio y las peticiones a la API para el módulo de Logística.
 * 
 * @param {Object} params - Opciones de filtrado para el listado de rutas.
 * @returns {Object} Query de logística y funciones de mutación.
 */
export const useLogistica = (params) => {
  const queryClient = useQueryClient();

  // Consulta para obtener las rutas y estados de envíos
  const logisticaQuery = useQuery({
    queryKey: ['logistica', params],
    queryFn: () => logisticaService.getAll(params),
    staleTime: 30000, // Tiempo de validez en caché
  });

  // Mutación para planificar y crear una nueva ruta logística
  const createRutaMutation = useMutation({
    mutationFn: logisticaService.createRuta,
    onSuccess: () => {
      // Refresca la tabla de logística al crear una nueva ruta
      queryClient.invalidateQueries({ queryKey: ['logistica'] });
      toast.success('Ruta creada exitosamente');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al crear la ruta';
      toast.error(msg);
    }
  });

  // Mutación para cambiar o actualizar el estado de una ruta existente
  const updateEstadoMutation = useMutation({
    mutationFn: logisticaService.updateEstado,
    onSuccess: () => {
      // Refresca el listado de rutas para reflejar el nuevo estado (ej. "En Tránsito")
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
