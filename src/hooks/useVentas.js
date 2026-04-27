import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ventasService } from '../services/ventasService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

/**
 * Hook para manejar la lógica de negocio y estado de las Ventas.
 * 
 * @param {Object} params - Filtros y parámetros de consulta.
 * @returns {Object} Consultas y mutaciones de ventas.
 */
export const useVentas = (params) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Consulta para el listado general de ventas
  const ventasQuery = useQuery({
    queryKey: ['ventas', params],
    queryFn: () => ventasService.getAll(params),
    staleTime: 30000,
  });

  // Consulta para obtener la información detallada de una venta
  const getVentaQuery = (id) => useQuery({
    queryKey: ['ventas', id],
    queryFn: () => ventasService.getById(id),
    enabled: !!id && id !== 'nuevo',
  });

  // Mutación para registrar una nueva venta
  const createMutation = useMutation({
    mutationFn: ventasService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
      toast.success('Venta registrada exitosamente');
      // asumiendo que el backend retorna el id creado
      navigate(`/ventas/${data.id || data.data?.id}`); 
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al registrar la venta';
      toast.error(msg);
    }
  });

  // Mutación para confirmar la venta (ej. despacho final, actualización de inventario)
  const confirmarMutation = useMutation({
    mutationFn: ventasService.confirmar,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
      queryClient.invalidateQueries({ queryKey: ['ventas', id] });
      toast.success('Venta confirmada');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al confirmar la venta';
      toast.error(msg);
    }
  });

  // Mutación para cancelar o anular una venta
  const cancelarMutation = useMutation({
    mutationFn: ventasService.cancelar,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
      queryClient.invalidateQueries({ queryKey: ['ventas', id] });
      toast.success('Venta cancelada');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al cancelar la venta';
      toast.error(msg);
    }
  });

  return {
    ventasQuery,
    getVentaQuery,
    createVenta: createMutation.mutate,
    isCreating: createMutation.isPending,
    confirmarVenta: confirmarMutation.mutate,
    isConfirmando: confirmarMutation.isPending,
    cancelarVenta: cancelarMutation.mutate,
    isCancelando: cancelarMutation.isPending,
  };
};
