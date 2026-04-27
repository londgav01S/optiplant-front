/**
 * URL base de la API.
 * Se obtiene de las variables de entorno (VITE_API_URL) o utiliza el localhost por defecto.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Clave utilizada para almacenar el token de sesión en el almacenamiento local (localStorage).
 */
export const TOKEN_KEY = 'inventario_token';

/**
 * Roles de usuario disponibles en el sistema y sus identificadores.
 */
export const ROLES = {
  ADMIN: 'ADMIN',
  GERENTE: 'GERENTE',
  OPERADOR: 'OPERADOR',
};

/**
 * Estados posibles para una venta registrada en el sistema.
 * Contiene el texto descriptivo y la variante de color para la interfaz gráfica.
 */
export const ESTADOS_VENTA = {
  CONFIRMADA: { texto: "Confirmada", color: "success" },
  ANULADA: { texto: "Anulada", color: "danger" },
};

/**
 * Diferentes etapas por las que pasa una transferencia de mercancía entre ubicaciones.
 * Contiene el texto descriptivo y la variante de color para la interfaz gráfica.
 */
export const ESTADOS_TRANSFERENCIA = {
  PENDIENTE_APROBACION: { texto: "Pendiente de aprobación", color: "warning" },
  EN_PREPARACION: { texto: "En preparación", color: "info" },
  EN_TRANSITO: { texto: "En tránsito", color: "info" },
  RECIBIDA: { texto: "Recibida", color: "success" },
  RECIBIDA_CON_FALTANTES: { texto: "Recibida con faltantes", color: "warning" },
  RECHAZADA: { texto: "Rechazada", color: "danger" },
};

/**
 * Estados posibles para una orden de compra a proveedores.
 * Contiene el texto descriptivo y la variante de color para la interfaz gráfica.
 */
export const ESTADOS_COMPRA = {
  PENDIENTE: { texto: "Pendiente", color: "warning" },
  RECIBIDA: { texto: "Recibida", color: "success" },
  RECIBIDA_CON_FALTANTES: { texto: "Recibida con faltantes", color: "warning" },
  CANCELADA: { texto: "Cancelada", color: "danger" },
};

/**
 * Tipos de alertas que se muestran en el módulo de alertas (ej. de inventario).
 */
export const TIPOS_ALERTA = {
  STOCK_MINIMO: { texto: "Stock Mínimo", color: "danger" },
  SOBRE_STOCK: { texto: "Sobre Stock", color: "warning" },
};

/**
 * Niveles de prioridad o urgencia para notificaciones y alertas.
 */
export const NIVELES_URGENCIA = {
  NORMAL: { texto: "Normal", color: "info" },
  ALTA: { texto: "Alta", color: "warning" },
};
