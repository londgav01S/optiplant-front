import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productosService } from '../services/productosService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useProductos = (params) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const productosQuery = useQuery({
    queryKey: ['productos', params],
    queryFn: () => productosService.getAll(params),
    staleTime: 30000,
  });

  const getProductoQuery = (id) => useQuery({
    queryKey: ['productos', id],
    queryFn: () => productosService.getById(id),
    enabled: !!id && id !== 'nuevo',
  });

  const createMutation = useMutation({
    mutationFn: productosService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      toast.success('Producto creado exitosamente');
      navigate('/productos');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al crear el producto';
      toast.error(msg);
    }
  });

  const updateMutation = useMutation({
    mutationFn: productosService.update,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      queryClient.invalidateQueries({ queryKey: ['productos', variables.id] });
      toast.success('Producto actualizado exitosamente');
      navigate('/productos');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al actualizar el producto';
      toast.error(msg);
    }
  });

  const desactivarMutation = useMutation({
    mutationFn: productosService.desactivar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      toast.success('Estado del producto actualizado');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al cambiar estado';
      toast.error(msg);
    }
  });

  return {
    productosQuery,
    getProductoQuery,
    createProducto: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateProducto: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    desactivarProducto: desactivarMutation.mutate,
    isDesactivando: desactivarMutation.isPending,
  };
};
