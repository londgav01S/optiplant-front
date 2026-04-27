import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

export const useDashboard = (params) => {
  const metricasQuery = useQuery({
    queryKey: ['dashboard', params],
    queryFn: () => dashboardService.getMetricas(params),
    staleTime: 60000,
  });

  return {
    metricasQuery
  };
};
