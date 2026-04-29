import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '$0 COP';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' COP';
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return format(new Date(dateStr), "dd MMM yyyy, HH:mm", { locale: es });
};

export const formatDateShort = (dateStr) => {
  if (!dateStr) return '';
  return format(new Date(dateStr), "dd/MM/yyyy", { locale: es });
};

export const formatStock = (amount) => {
  if (amount === null || amount === undefined) return '0,00';
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPercent = (n) => {
  if (n === null || n === undefined) return '0,00 %';
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n) + ' %';
};

export const formatCurrencyCompact = (amount) => {
  if (amount === null || amount === undefined) return '$0';
  
  let displayAmount = amount;
  let suffix = '';
  
  if (amount >= 1000000000) {
    displayAmount = amount / 1000000000;
    suffix = 'B';
  } else if (amount >= 1000000) {
    displayAmount = amount / 1000000;
    suffix = 'M';
  } else if (amount >= 1000) {
    displayAmount = amount / 1000;
    suffix = 'K';
  }
  
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: suffix ? 1 : 0,
    maximumFractionDigits: suffix ? 1 : 0,
  }).format(displayAmount) + suffix;
};
