import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ventasService } from '../services/ventasService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useVentas = (params) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const ventasQuery = useQuery({
    queryKey: ['ventas', params],
    queryFn: () => ventasService.getAll(params),
    staleTime: 30000,
  });

  const getVentaQuery = (id) => useQuery({
    queryKey: ['ventas', id],
    queryFn: () => ventasService.getById(id),
    enabled: !!id && id !== 'nuevo',
  });

  const createMutation = useMutation({
    mutationFn: ventasService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
      toast.success('Venta registrada exitosamente');
      navigate(`/ventas/${data.id || data.data?.id}`); // asumiendo que retorna el id creado
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al registrar la venta';
      toast.error(msg);
    }
  });

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
