import { useQuery } from '@tanstack/react-query';
import { listasPreciosService } from '../services/listasPreciosService';

/**
 * Hook para consultar las listas de precios activas.
 *
 * @returns {Object} Consulta de listas de precios.
 */
export const useListasPrecios = () => {
  const listasPreciosQuery = useQuery({
    queryKey: ['listas-precios'],
    queryFn: listasPreciosService.getAll,
    staleTime: 30000,
  });

  return {
    listasPreciosQuery,
  };
};