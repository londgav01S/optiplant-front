import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { logisticaService } from '../services/logisticaService';
import { transferenciasService } from '../services/transferenciasService';
import { toast } from 'sonner';

/**
 * Hook encargado de la lógica de negocio y las peticiones a la API para el módulo de Logística.
 *
 * @param {Object} params - Opciones de filtrado para el listado de rutas.
 * @returns {Object} Query de logística y funciones de mutación.
 */
export const useLogistica = (params) => {
  const queryClient = useQueryClient();

  const logisticaQuery = useQuery({
    queryKey: ['logistica', params],
    queryFn: () => logisticaService.getAll(params),
    staleTime: 30000,
  });

  const enTransitoQuery = useQuery({
    queryKey: ['logistica', 'en-transito'],
    queryFn: () => logisticaService.getEnTransito(),
    staleTime: 30000,
  });

  const pendientesDespachoQuery = useQuery({
    queryKey: ['transferencias', { estado: 'EN_PREPARACION' }],
    queryFn: () => transferenciasService.getAll({ estado: 'EN_PREPARACION' }),
    staleTime: 30000,
  });

  const createRutaMutation = useMutation({
    mutationFn: logisticaService.createRuta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistica'] });
      toast.success('Ruta creada exitosamente');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al crear la ruta';
      toast.error(msg);
    }
  });

  const updateEstadoMutation = useMutation({
    mutationFn: logisticaService.updateEstado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistica'] });
      toast.success('Estado de ruta actualizado');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al actualizar el estado';
      toast.error(msg);
    }
  });

  const despacharMutation = useMutation({
    mutationFn: ({ id, payload }) => transferenciasService.despachar(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transferencias'] });
      queryClient.invalidateQueries({ queryKey: ['logistica'] });
      toast.success('Despacho registrado correctamente');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al registrar el despacho';
      toast.error(msg);
    }
  });

  const recibirMutation = useMutation({
    mutationFn: ({ id, payload }) => transferenciasService.recepcionar(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transferencias'] });
      queryClient.invalidateQueries({ queryKey: ['logistica'] });
      toast.success('Recepción registrada correctamente');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al registrar la recepción';
      toast.error(msg);
    }
  });

  return {
    logisticaQuery,
    enTransitoQuery,
    pendientesDespachoQuery,
    createRuta: createRutaMutation.mutate,
    isCreating: createRutaMutation.isPending,
    updateEstado: updateEstadoMutation.mutate,
    isUpdating: updateEstadoMutation.isPending,
    despacharTransferencia: despacharMutation.mutate,
    isDespachando: despacharMutation.isPending,
    recibirTransferencia: recibirMutation.mutate,
    isRecibiendo: recibirMutation.isPending,
  };
};
