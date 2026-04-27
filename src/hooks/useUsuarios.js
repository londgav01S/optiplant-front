import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usuariosService } from '../services/usuariosService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

/**
 * Hook para la administración del personal y Usuarios del sistema.
 * 
 * @param {Object} params - Parámetros de consulta y paginación.
 * @returns {Object} Consultas y mutaciones de usuarios.
 */
export const useUsuarios = (params) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Consulta para el listado de usuarios
  const usuariosQuery = useQuery({
    queryKey: ['usuarios', params],
    queryFn: () => usuariosService.getAll(params),
    staleTime: 30000,
  });

  // Consulta de perfil de usuario específico
  const getUsuarioQuery = (id) => useQuery({
    queryKey: ['usuarios', id],
    queryFn: () => usuariosService.getById(id),
    enabled: !!id && id !== 'nuevo',
  });

  // Crear un nuevo usuario en la base de datos
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

  // Modificar permisos o datos de un usuario
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

  // Activar/Desactivar el acceso de un usuario
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
