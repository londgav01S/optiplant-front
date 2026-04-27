import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { comprasService } from '../services/comprasService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useCompras = (params) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const comprasQuery = useQuery({
    queryKey: ['compras', params],
    queryFn: () => comprasService.getAll(params),
    staleTime: 30000,
  });

  const getCompraQuery = (id) => useQuery({
    queryKey: ['compras', id],
    queryFn: () => comprasService.getById(id),
    enabled: !!id && id !== 'nuevo',
  });

  const createMutation = useMutation({
    mutationFn: comprasService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['compras'] });
      toast.success('Orden de compra registrada exitosamente');
      navigate(`/compras/${data.id || data.data?.id}`);
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al registrar la compra';
      toast.error(msg);
    }
  });

  const recibirMutation = useMutation({
    mutationFn: comprasService.recibir,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['compras'] });
      queryClient.invalidateQueries({ queryKey: ['compras', id] });
      toast.success('Compra recibida. Inventario actualizado.');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al recibir la compra';
      toast.error(msg);
    }
  });

  const cancelarMutation = useMutation({
    mutationFn: comprasService.cancelar,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['compras'] });
      queryClient.invalidateQueries({ queryKey: ['compras', id] });
      toast.success('Compra cancelada');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al cancelar la compra';
      toast.error(msg);
    }
  });

  return {
    comprasQuery,
    getCompraQuery,
    createCompra: createMutation.mutate,
    isCreating: createMutation.isPending,
    recibirCompra: recibirMutation.mutate,
    isRecibiendo: recibirMutation.isPending,
    cancelarCompra: cancelarMutation.mutate,
    isCancelando: cancelarMutation.isPending,
  };
};
