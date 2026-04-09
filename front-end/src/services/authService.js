import { api } from './api.js';

export async function login(payload) {
  const response = await api.post('/auth/login', payload);
  return response.data;
}

export async function register(payload) {
  const response = await api.post('/auth/register', payload);
  return response.data;
}

export async function updateProfile(payload) {
  const response = await api.put('/auth/profile', payload);
  return response.data;
}

export async function getUsers() {
  const response = await api.get('/auth/users');
  return response.data;
}

export async function updateUserRole(userId, payload) {
  const response = await api.put(`/auth/users/${userId}/role`, payload);
  return response.data;
}
