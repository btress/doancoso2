const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

type RequestOptions = {
  method?: string;
  body?: any;
  token?: string;
};

async function request(path: string, options: RequestOptions = {}) {
  const { method = 'GET', body, token } = options;
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

export const authApi = {
  register: (payload: { name: string; email: string; password: string }) =>
    request('/auth/register', { method: 'POST', body: payload }),
  login: (payload: { email: string; password: string }) =>
    request('/auth/login', { method: 'POST', body: payload }),
  me: (token: string) => request('/auth/me', { token })
};

export const productApi = {
  list: () => request('/products'),
  featured: () => request('/products/featured'),
  detail: (id: string) => request(`/products/${id}`),
  create: (token: string, payload: any) => request('/products', { method: 'POST', body: payload, token }),
  update: (token: string, id: string, payload: any) => request(`/products/${id}`, { method: 'PUT', body: payload, token }),
  remove: (token: string, id: string) => request(`/products/${id}`, { method: 'DELETE', token })
};

export const cartApi = {
  get: (token: string) => request('/cart', { token }),
  upsert: (
    token: string,
    payload: { productId: string; quantity: number; color?: string; storage?: string }
  ) => request('/cart', { method: 'POST', body: payload, token }),
  remove: (token: string, itemId: string) => request(`/cart/${itemId}`, { method: 'DELETE', token }),
  clear: (token: string) => request('/cart', { method: 'DELETE', token })
};

export const commentApi = {
  list: (productId: string) => request(`/comments/${productId}`),
  add: (token: string, productId: string, payload: { content: string; rating?: number }) =>
    request(`/comments/${productId}`, { method: 'POST', body: payload, token })
};

export const orderApi = {
  list: (token?: string) => request('/orders', token ? { token } : {}),
  create: (payload: any) => request('/orders', { method: 'POST', body: payload }),
  stats: () => request('/orders/stats')
};

export const messageApi = {
  list: (userId?: string) => request(`/messages${userId ? `?userId=${userId}` : ''}`),
  send: (payload: { senderName: string; senderEmail: string; content: string; senderType: string; userId?: string }) =>
    request('/messages', { method: 'POST', body: payload }),
  markAsRead: (messageId: string) => request(`/messages/${messageId}/read`, { method: 'PUT' }),
  delete: (messageId: string) => request(`/messages/${messageId}`, { method: 'DELETE' })
};

