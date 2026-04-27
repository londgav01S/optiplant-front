import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertasService } from '../services/alertasService';

/**
 * Hook para gestionar las alertas del sistema mediante React Query.
 * Maneja la obtención periódica de alertas y la mutación para marcarlas como leídas.
 * 
 * @param {Object} params - Parámetros de consulta (ej. página, filtros).
 * @returns {Object} Datos de la query y mutaciones disponibles.
 */
export const useAlertas = (params) => {
  const queryClient = useQueryClient();

  // Consulta para obtener la lista de alertas.
  const alertasQuery = useQuery({
    queryKey: ['alertas', params],
    queryFn: () => alertasService.getAlertas(params),
    staleTime: 60000, // Los datos se consideran "frescos" por 1 minuto
    refetchInterval: 120000, // Actualización automática cada 2 minutos en segundo plano
  });

  // Mutación para marcar una alerta específica como leída.
  const marcarLeidaMutation = useMutation({
    mutationFn: alertasService.marcarLeida,
    onSuccess: () => {
      // Invalida la query de alertas para forzar una actualización y reflejar el nuevo estado
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
    }
  });

  return {
    alertasQuery,
    marcarLeida: marcarLeidaMutation.mutate,
    isMarcando: marcarLeidaMutation.isPending,
  };
};
