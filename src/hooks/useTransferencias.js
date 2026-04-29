import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transferenciasService } from '../services/transferenciasService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

/**
 * Hook para la gestión de las Transferencias de inventario entre sucursales.
 * 
 * @param {Object} params - Parámetros de listado y filtrado.
 * @returns {Object} Consultas y mutaciones de transferencias.
 */
export const useTransferencias = (params) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Lista de transferencias
  const transferenciasQuery = useQuery({
    queryKey: ['transferencias', params],
    queryFn: () => transferenciasService.getAll(params),
    staleTime: 30000,
  });

  // Detalle de una transferencia
  const getTransferenciaQuery = (id) => useQuery({
    queryKey: ['transferencias', id],
    queryFn: () => transferenciasService.getById(id),
    enabled: !!id && id !== 'nuevo',
  });

  // Crear una solicitud de transferencia
  const createMutation = useMutation({
    mutationFn: transferenciasService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transferencias'] });
      toast.success('Transferencia registrada exitosamente');
      navigate(`/transferencias/${data.id || data.data?.id}`);
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al registrar la transferencia';
      toast.error(msg);
    }
  });

  // Marcar transferencia como despachada/enviada
  const enviarMutation = useMutation({
    mutationFn: transferenciasService.enviar,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['transferencias'] });
      queryClient.invalidateQueries({ queryKey: ['transferencias', id] });
      toast.success('Transferencia enviada');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al enviar la transferencia';
      toast.error(msg);
    }
  });

  // Registrar despacho real de una transferencia
  const despacharMutation = useMutation({
    mutationFn: ({ id, payload }) => transferenciasService.despachar(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transferencias'] });
      queryClient.invalidateQueries({ queryKey: ['transferencias', variables.id] });
      toast.success('Despacho registrado');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al registrar el despacho';
      toast.error(msg);
    }
  });

  // Confirmar recepción de una transferencia
  const recibirMutation = useMutation({
    mutationFn: ({ id, payload }) => transferenciasService.recepcionar(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transferencias'] });
      queryClient.invalidateQueries({ queryKey: ['transferencias', variables.id] });
      toast.success('Transferencia recibida con éxito');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al recibir la transferencia';
      toast.error(msg);
    }
  });

  // Anular una transferencia no completada
  const cancelarMutation = useMutation({
    mutationFn: transferenciasService.cancelar,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['transferencias'] });
      queryClient.invalidateQueries({ queryKey: ['transferencias', id] });
      toast.success('Transferencia cancelada');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al cancelar la transferencia';
      toast.error(msg);
    }
  });

  // Aprobar una transferencia
  const aprobarMutation = useMutation({
    mutationFn: transferenciasService.aprobar,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['transferencias'] });
      queryClient.invalidateQueries({ queryKey: ['transferencias', id] });
      toast.success('Transferencia aprobada');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al aprobar la transferencia';
      toast.error(msg);
    }
  });

  // Rechazar una transferencia
  const rechazarMutation = useMutation({
    mutationFn: transferenciasService.rechazar,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['transferencias'] });
      queryClient.invalidateQueries({ queryKey: ['transferencias', id] });
      toast.success('Transferencia rechazada');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al rechazar la transferencia';
      toast.error(msg);
    }
  });

  return {
    transferenciasQuery,
    getTransferenciaQuery,
    createTransferencia: createMutation.mutate,
    isCreating: createMutation.isPending,
    enviarTransferencia: enviarMutation.mutate,
    isEnviando: enviarMutation.isPending,
    recibirTransferencia: recibirMutation.mutate,
    isRecibiendo: recibirMutation.isPending,
    recibirTransferenciaCompat: recibirMutation.mutate,
    cancelarTransferencia: cancelarMutation.mutate,
    isCancelando: cancelarMutation.isPending,
    aprobarTransferencia: aprobarMutation.mutate,
    isAprobando: aprobarMutation.isPending,
    rechazarTransferencia: rechazarMutation.mutate,
    isRechazando: rechazarMutation.isPending,
    despacharTransferencia: despacharMutation.mutate,
    isDespachando: despacharMutation.isPending,
  };
};
