import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventarioService } from '../services/inventarioService';
import { toast } from 'sonner';

export const useInventario = (params) => {
  const queryClient = useQueryClient();

  const inventarioQuery = useQuery({
    queryKey: ['inventario', params],
    queryFn: () => inventarioService.getAll(params),
    staleTime: 30000,
  });

  const ajustarStockMutation = useMutation({
    mutationFn: inventarioService.ajustarStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventario'] });
      // También podríamos invalidar productos o alertas si fuese necesario
      toast.success('Stock ajustado exitosamente');
    },
    onError: (error) => {
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
