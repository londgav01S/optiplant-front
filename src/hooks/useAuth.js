import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import useAuthStore from '../store/authStore';
import { toast } from 'sonner';

/**
 * Hook personalizado para manejar la lógica de autenticación en la interfaz de usuario.
 * Utiliza React Query para gestionar el ciclo de vida de la petición asíncrona y
 * Zustand (useAuthStore) para mantener el estado de la sesión de manera global.
 * 
 * @returns {Object} Un objeto que expone la función de inicio de sesión y los estados de la petición:
 * - login: Función para ejecutar la mutación de inicio de sesión con las credenciales dadas.
 * - isLoggingIn: Booleano que indica si la petición de inicio de sesión está en progreso.
 * - loginError: Objeto de error capturado en caso de que la petición falle.
 */
export const useAuth = () => {
  // Extraemos la acción de login del store global de Zustand
  const { login } = useAuthStore();

  // Configuración de la mutación de React Query para la solicitud de inicio de sesión
  const loginMutation = useMutation({
    mutationFn: authService.login, // Función del servicio encargada de realizar la petición al backend
    onSuccess: (data) => {
      // Se ejecuta al completarse la petición de forma exitosa.
      // Asumimos que el backend retorna la estructura { token: "...", user: { ... } }.
      // Se guardan los datos en el store global para habilitar la sesión en la app.
      login(data.token, data.user);
      toast.success('Sesión iniciada correctamente');
    },
    onError: (error) => {
      // Se ejecuta si ocurre un error durante la petición.
      // El mensaje de error no se muestra como toast aquí según la especificación,
      // sino que se mostrará debajo del formulario en LoginPage.
      // Se registra en la consola para propósitos de depuración.
      console.error('Login failed', error);
    }
  });

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error
  };
};
