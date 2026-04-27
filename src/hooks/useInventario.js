import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventarioService } from '../services/inventarioService';
import { toast } from 'sonner';

/**
 * Hook personalizado para manejar las consultas y modificaciones directas de Inventario.
 * 
 * @param {Object} params - Parámetros de filtro y paginación para el inventario.
 * @returns {Object} Métodos y estados relacionados con el inventario.
 */
export const useInventario = (params) => {
  const queryClient = useQueryClient();

  // Consulta para obtener el listado actual del inventario
  const inventarioQuery = useQuery({
    queryKey: ['inventario', params],
    queryFn: () => inventarioService.getAll(params),
    staleTime: 30000, // Caché de 30 segundos
  });

  // Mutación para ajustar manualmente el stock de un producto
  const ajustarStockMutation = useMutation({
    mutationFn: inventarioService.ajustarStock,
    onSuccess: () => {
      // Se invalida la caché del inventario para que la tabla se actualice con los nuevos valores
      queryClient.invalidateQueries({ queryKey: ['inventario'] });
      // También podríamos invalidar productos o alertas si fuese necesario
      toast.success('Stock ajustado exitosamente');
    },
    onError: (error) => {
      // Manejo de errores globalizando la notificación
      const msg = error.response?.data?.message || 'Error al ajustar el stock';
      toast.error(msg);
    }
  });

  return {
    inventarioQuery,
    ajustarStock: ajustarStockMutation.mutate,
    isAjustando: ajustarStockMutation.isPending,
  };
};
