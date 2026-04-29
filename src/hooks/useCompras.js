import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { comprasService } from '../services/comprasService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

/**
 * Hook para la gestión de Órdenes de Compra utilizando React Query.
 * Maneja la obtención de datos y las mutaciones para crear, recibir o cancelar compras.
 * 
 * @param {Object} params - Parámetros de consulta (filtros, paginación).
 * @returns {Object} Consultas y mutaciones de compras.
 */
export const useCompras = (params) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Consulta para obtener la lista de compras
  const comprasQuery = useQuery({
    queryKey: ['compras', params],
    queryFn: () => comprasService.getAll(params),
    staleTime: 30000,
  });

  // Consulta para obtener los detalles de una compra específica
  const getCompraQuery = (id) => useQuery({
    queryKey: ['compras', id],
    queryFn: () => comprasService.getById(id),
    enabled: !!id && id !== 'nuevo', // Evita ejecutarse si estamos en la vista de "crear nueva"
  });

  // Mutación para registrar una nueva orden de compra
  const createMutation = useMutation({
    mutationFn: comprasService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['compras'] });
      toast.success('Orden de compra registrada exitosamente');
      // Redirigir al detalle de la compra recién creada
      navigate(`/compras/${data.id || data.data?.id}`);
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al registrar la compra';
      toast.error(msg);
    }
  });

  // Mutación para marcar una compra como recibida (actualiza inventario internamente en backend)
  const recibirMutation = useMutation({
    mutationFn: comprasService.recibir,
    onSuccess: (_, id) => {
      // Invalida tanto la lista general como el detalle de la compra específica
      queryClient.invalidateQueries({ queryKey: ['compras'] });
      queryClient.invalidateQueries({ queryKey: ['compras', id] });
      // Refresca pantallas que dependen del stock tras la recepción
      queryClient.invalidateQueries({ queryKey: ['inventario'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
      toast.success('Compra recibida. Inventario actualizado.');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al recibir la compra';
      toast.error(msg);
    }
  });

  // Mutación para cancelar una orden de compra
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
