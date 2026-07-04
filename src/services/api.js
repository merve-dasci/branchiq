import axios from 'axios';

const apiClient = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  login: (credentials) => apiClient.post('/api/login', credentials),
};

export const branchesApi = {
  getAll: () => apiClient.get('/api/branches'),
  create: (data) => apiClient.post('/api/branches', data),
  update: (id, data) => apiClient.put(`/api/branches/${id}`, data),
  delete: (id) => apiClient.delete(`/api/branches/${id}`),
};

export const employeesApi = {
  getAll: () => apiClient.get('/api/staff'),
  create: (data) => apiClient.post('/api/staff', data),
  update: (id, data) => apiClient.put(`/api/staff/${id}`, data),
  delete: (id) => apiClient.delete(`/api/staff/${id}`),
};

export const menuApi = {
  getAll: () => apiClient.get('/api/menuItems'),
  create: (data) => apiClient.post('/api/menuItems', data),
  update: (id, data) => apiClient.put(`/api/menuItems/${id}`, data),
  delete: (id) => apiClient.delete(`/api/menuItems/${id}`),
};

export const inventoryApi = {
  getAll: () => apiClient.get('/api/inventory'),
  create: (data) => apiClient.post('/api/inventory', data),
  update: (id, data) => apiClient.put(`/api/inventory/${id}`, data),
  delete: (id) => apiClient.delete(`/api/inventory/${id}`),
};

export const ordersApi = {
  getAll: () => apiClient.get('/api/orders'),
  create: (data) => apiClient.post('/api/orders', data),
  update: (id, data) => apiClient.put(`/api/orders/${id}`, data),
  delete: (id) => apiClient.delete(`/api/orders/${id}`),
};

export const reservationsApi = {
  getAll: () => apiClient.get('/api/reservations'),
  create: (data) => apiClient.post('/api/reservations', data),
  update: (id, data) => apiClient.put(`/api/reservations/${id}`, data),
  delete: (id) => apiClient.delete(`/api/reservations/${id}`),
};

export const tablesApi = {
  getAll: () => apiClient.get('/api/tables'),
  create: (data) => apiClient.post('/api/tables', data),
  update: (id, data) => apiClient.put(`/api/tables/${id}`, data),
  delete: (id) => apiClient.delete(`/api/tables/${id}`),
};

export const campaignsApi = {
  getAll: () => apiClient.get('/api/campaigns'),
  create: (data) => apiClient.post('/api/campaigns', data),
  update: (id, data) => apiClient.put(`/api/campaigns/${id}`, data),
  delete: (id) => apiClient.delete(`/api/campaigns/${id}`),
};

export const reportsApi = {
  getAll: () => apiClient.get('/api/reports'),
  create: (data) => apiClient.post('/api/reports', data),
  update: (id, data) => apiClient.put(`/api/reports/${id}`, data),
  delete: (id) => apiClient.delete(`/api/reports/${id}`),
};

export const announcementsApi = {
  getAll: () => apiClient.get('/api/announcements'),
  create: (data) => apiClient.post('/api/announcements', data),
  delete: (id) => apiClient.delete(`/api/announcements/${id}`),
};
