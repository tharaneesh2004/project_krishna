import { getToken, removeToken } from './auth';

const API_BASE = '/api'; // Using proxy in development, or relative in production

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async (res) => {
  if (res.status === 401) {
    removeToken();
    window.location.href = '/admin/login';
    throw new Error('Unauthorized');
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'API request failed');
  return data;
};

export const adminApi = {
  // Auth
  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },
  verify: async () => {
    const res = await fetch(`${API_BASE}/admin/verify`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Dashboard
  getDashboard: async () => {
    const res = await fetch(`${API_BASE}/admin/dashboard`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Products
  getProducts: async () => {
    const res = await fetch(`${API_BASE}/admin/products`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
  getProduct: async (id) => {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
  createProduct: async (data) => {
    const res = await fetch(`${API_BASE}/admin/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateProduct: async (id, data) => {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteProduct: async (id) => {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Categories
  getCategories: async () => {
    const res = await fetch(`${API_BASE}/admin/categories`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Orders
  getOrders: async () => {
    const res = await fetch(`${API_BASE}/admin/orders`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
  updateOrderStatus: async (id, status) => {
    const res = await fetch(`${API_BASE}/admin/orders/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },

  // File Upload
  uploadImage: async (file) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('image', file);
    
    const res = await fetch(`${API_BASE}/admin/products/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    return handleResponse(res);
  }
};
