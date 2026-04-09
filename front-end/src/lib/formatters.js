import { API_URL } from './config.js';
import productPlaceholder from '../assets/product-placeholder.svg';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

export function formatCurrency(value) {
  return currencyFormatter.format(Number(value ?? 0));
}

export function formatDateTime(value) {
  if (!value) {
    return 'Não informado';
  }

  return dateFormatter.format(new Date(value));
}

export function resolveImageUrl(product) {
  if (!product) {
    return null;
  }

  if (product.imageUrl) {
    return product.imageUrl;
  }

  if (!product.imagePath) {
    return null;
  }

  if (/^https?:\/\//i.test(product.imagePath)) {
    return product.imagePath;
  }

  return `${API_URL}/${product.imagePath.replace(/^\/+/, '')}`;
}

export function resolveProductDisplayImageUrl(product) {
  return resolveImageUrl(product) ?? productPlaceholder;
}

export { productPlaceholder as defaultProductImageUrl };
