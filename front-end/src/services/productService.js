import { api } from './api.js';

export async function getProducts(filters) {
  const response = await api.get('/products', { params: filters });
  return response.data;
}

export async function getProductById(productId) {
  const response = await api.get(`/products/${productId}`);
  return response.data;
}

export async function createProduct(payload) {
  const response = await api.post('/products', payload);
  return response.data;
}

export async function updateProduct(productId, payload) {
  const response = await api.put(`/products/${productId}`, payload);
  return response.data;
}

export async function deleteProduct(productId) {
  await api.delete(`/products/${productId}`);
}

export async function uploadProductImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/products/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}
