import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transferenciasService } from '../services/transferenciasService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useTransferencias = (params) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const transferenciasQuery = useQuery({
    queryKey: ['transferencias', params],
    queryFn: () => transferenciasService.getAll(params),
    staleTime: 30000,
  });

  const getTransferenciaQuery = (id) => useQuery({
    queryKey: ['transferencias', id],
    queryFn: () => transferenciasService.getById(id),
    enabled: !!id && id !== 'nuevo',
  });

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

  const recibirMutation = useMutation({
    mutationFn: transferenciasService.recibir,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['transferencias'] });
      queryClient.invalidateQueries({ queryKey: ['transferencias', id] });
      toast.success('Transferencia recibida con éxito');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al recibir la transferencia';
      toast.error(msg);
    }
  });

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

  return {
    transferenciasQuery,
    getTransferenciaQuery,
    createTransferencia: createMutation.mutate,
    isCreating: createMutation.isPending,
    enviarTransferencia: enviarMutation.mutate,
    isEnviando: enviarMutation.isPending,
    recibirTransferencia: recibirMutation.mutate,
    isRecibiendo: recibirMutation.isPending,
    cancelarTransferencia: cancelarMutation.mutate,
    isCancelando: cancelarMutation.isPending,
  };
};
