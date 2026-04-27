import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

/**
 * Hook para obtener las métricas y estadísticas del Dashboard.
 * 
 * @param {Object} params - Filtros para las métricas (rango de fechas, etc.).
 * @returns {Object} Query con los datos de métricas consolidadas.
 */
export const useDashboard = (params) => {
  // Consulta de React Query para traer las métricas principales del sistema
  const metricasQuery = useQuery({
    queryKey: ['dashboard', params],
    queryFn: () => dashboardService.getMetricas(params),
    staleTime: 60000, // Evita re-consultas innecesarias si los datos tienen menos de 1 min de antigüedad
  });

  return {
    metricasQuery
  };
};
