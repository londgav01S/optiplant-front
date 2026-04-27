import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usuariosService } from '../services/usuariosService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useUsuarios = (params) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const usuariosQuery = useQuery({
    queryKey: ['usuarios', params],
    queryFn: () => usuariosService.getAll(params),
    staleTime: 30000,
  });

  const getUsuarioQuery = (id) => useQuery({
    queryKey: ['usuarios', id],
    queryFn: () => usuariosService.getById(id),
    enabled: !!id && id !== 'nuevo',
  });

  const createMutation = useMutation({
    mutationFn: usuariosService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast.success('Usuario creado exitosamente');
      navigate('/usuarios');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al crear el usuario';
      toast.error(msg);
    }
  });

  const updateMutation = useMutation({
    mutationFn: usuariosService.update,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['usuarios', variables.id] });
      toast.success('Usuario actualizado exitosamente');
      navigate('/usuarios');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al actualizar el usuario';
      toast.error(msg);
    }
  });

  const toggleEstadoMutation = useMutation({
    mutationFn: usuariosService.toggleEstado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast.success('Estado de usuario actualizado');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al actualizar estado';
      toast.error(msg);
    }
  });

  return {
    usuariosQuery,
    getUsuarioQuery,
    createUsuario: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateUsuario: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    toggleEstado: toggleEstadoMutation.mutate,
    isToggling: toggleEstadoMutation.isPending,
  };
};
