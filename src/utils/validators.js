import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Debe ser un email válido' }),
  password: z.string().min(1, { message: 'La contraseña es requerida' }),
});

// Common fields to reuse
export const requiredString = z.string().min(1, { message: 'Este campo es requerido' });
export const requiredNumber = z.number({ invalid_type_error: 'Debe ser un número' }).positive({ message: 'Debe ser mayor a cero' });
export const percentageSchema = z.number().min(0, { message: 'Mínimo 0' }).max(100, { message: 'Máximo 100' });
