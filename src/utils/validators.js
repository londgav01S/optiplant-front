import { z } from 'zod';

/**
 * Esquema de validación para el formulario de inicio de sesión.
 * Asegura que el email tenga un formato válido y la contraseña no esté vacía.
 */
export const loginSchema = z.object({
  email: z.string().email({ message: 'Debe ser un email válido' }),
  password: z.string().min(1, { message: 'La contraseña es requerida' }),
});

// Campos comunes para reutilizar en otros esquemas de validación

/** Validador para cadenas de texto obligatorias (no vacías) */
export const requiredString = z.string().min(1, { message: 'Este campo es requerido' });

/** Validador para números obligatorios que deben ser positivos (> 0) */
export const requiredNumber = z.number({ invalid_type_error: 'Debe ser un número' }).positive({ message: 'Debe ser mayor a cero' });

/** Validador para porcentajes (restringido a un rango entre 0 y 100) */
export const percentageSchema = z.number().min(0, { message: 'Mínimo 0' }).max(100, { message: 'Máximo 100' });
