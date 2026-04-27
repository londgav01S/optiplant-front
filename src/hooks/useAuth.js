import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import useAuthStore from '../store/authStore';
import { toast } from 'sonner';

export const useAuth = () => {
  const { login } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Asumimos que el backend retorna { token: "...", user: { ... } }
      login(data.token, data.user);
      toast.success('Sesión iniciada correctamente');
    },
    onError: (error) => {
      // El mensaje de error no se muestra como toast aquí según la especificación,
      // se debe mostrar debajo del formulario en LoginPage,
      // pero podríamos registrarlo para debug.
      console.error('Login failed', error);
    }
  });

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error
  };
};
