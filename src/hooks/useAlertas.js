import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertasService } from '../services/alertasService';

export const useAlertas = (params) => {
  const queryClient = useQueryClient();

  const alertasQuery = useQuery({
    queryKey: ['alertas', params],
    queryFn: () => alertasService.getAlertas(params),
    staleTime: 60000, // 1 minuto, las alertas pueden no necesitar tanto refetch
    refetchInterval: 120000, // opcional, refrescar cada 2 minutos
  });

  const marcarLeidaMutation = useMutation({
    mutationFn: alertasService.marcarLeida,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
    }
  });

  return {
    alertasQuery,
    marcarLeida: marcarLeidaMutation.mutate,
    isMarcando: marcarLeidaMutation.isPending,
  };
};
