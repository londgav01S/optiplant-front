import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../utils/validators';
import { FormField } from '../../components/common/FormField';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useAuth } from '../../hooks/useAuth';
import useAuthStore from '../../store/authStore';
import { Package } from 'lucide-react';

/**
 * Vista de inicio de sesión.
 * Contiene el formulario de autenticación, validación con Zod/React Hook Form,
 * e integración con el hook `useAuth` para comunicarse con el backend.
 */
export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoggingIn, loginError } = useAuth();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  // Si ya está autenticado, redirigir al dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = (data) => {
    login(data);
  };

  const errorMessage = loginError?.response?.data?.message || 
    (loginError ? "Credenciales incorrectas o error de conexión." : null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <Package className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          OptiPlant
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sistema de Inventario Multi-Sucursal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Iniciar sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder al sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField label="Correo electrónico" error={errors.email?.message}>
                <Input 
                  type="email" 
                  placeholder="usuario@optiplant.com" 
                  autoComplete="email"
                  {...register('email')} 
                />
              </FormField>

              <FormField label="Contraseña" error={errors.password?.message}>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  autoComplete="current-password"
                  {...register('password')} 
                />
              </FormField>

              {/* AVISO TEMPORAL PARA MOCK LOGIN */}
              <div className="bg-blue-50 p-3 rounded-md border border-blue-200 mt-4 text-sm text-blue-700">
                <p className="font-semibold mb-1">Acceso Temporal (Mock):</p>
                <p>Email: <strong>admin@optiplant.com</strong></p>
                <p>Clave: <strong>admin</strong></p>
              </div>

              {errorMessage && (
                <div className="text-sm font-medium text-danger-500 bg-danger-100 p-3 rounded-md">
                  {errorMessage}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-primary-600 hover:bg-primary-700" 
                disabled={isLoggingIn}
              >
                {isLoggingIn ? 'Ingresando...' : 'Ingresar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
