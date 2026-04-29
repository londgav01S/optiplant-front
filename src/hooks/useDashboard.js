import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

/**
 * Hook para obtener las métricas y estadísticas del Dashboard.
 * 
 * @param {Object} params - Filtros para las métricas (rango de fechas, etc.).
 * @returns {Object} Query con los datos de métricas consolidadas.
 */
export const useDashboard = (params) => {
  const metricasQuery = useQuery({
    queryKey: ['dashboard', params],
    queryFn: () => dashboardService.getMetricas(params),
    staleTime: 30000,
    retry: 1,
    onError: (error) => {
      console.error('[Dashboard] Error al cargar métricas:', error?.response?.status, error?.response?.data);
    },
  });

  if (metricasQuery.data !== undefined) {
    console.log('[Dashboard] Datos recibidos:', metricasQuery.data);
  }

  return {
    metricasQuery
  };
};
