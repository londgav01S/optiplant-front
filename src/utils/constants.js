export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export const TOKEN_KEY = 'inventario_token';

export const ROLES = {
  ADMIN: 'ADMIN',
  GERENTE: 'GERENTE',
  OPERADOR: 'OPERADOR',
};

export const ESTADOS_VENTA = {
  CONFIRMADA: { texto: "Confirmada", color: "success" },
  ANULADA: { texto: "Anulada", color: "danger" },
};

export const ESTADOS_TRANSFERENCIA = {
  PENDIENTE_APROBACION: { texto: "Pendiente de aprobación", color: "warning" },
  EN_PREPARACION: { texto: "En preparación", color: "info" },
  EN_TRANSITO: { texto: "En tránsito", color: "info" },
  RECIBIDA: { texto: "Recibida", color: "success" },
  RECIBIDA_CON_FALTANTES: { texto: "Recibida con faltantes", color: "warning" },
  RECHAZADA: { texto: "Rechazada", color: "danger" },
};

export const ESTADOS_COMPRA = {
  PENDIENTE: { texto: "Pendiente", color: "warning" },
  RECIBIDA: { texto: "Recibida", color: "success" },
  RECIBIDA_CON_FALTANTES: { texto: "Recibida con faltantes", color: "warning" },
  CANCELADA: { texto: "Cancelada", color: "danger" },
};

export const TIPOS_ALERTA = {
  STOCK_MINIMO: { texto: "Stock Mínimo", color: "danger" },
  SOBRE_STOCK: { texto: "Sobre Stock", color: "warning" },
};

export const NIVELES_URGENCIA = {
  NORMAL: { texto: "Normal", color: "info" },
  ALTA: { texto: "Alta", color: "warning" },
};
