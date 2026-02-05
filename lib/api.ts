import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper to extract first name
export const getFirstName = (fullName: string): string => {
  if (!fullName) return 'User';
  const spaceIndex = fullName.indexOf(' ');
  return spaceIndex > 0 ? fullName.substring(0, spaceIndex) : fullName;
};

export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
};

export const profileAPI = {
  create: (data: any) => api.post('/profile', data),
  get: () => api.get('/profile'),
  update: (data: any) => api.put('/profile', data),
};

export const recommendAPI = {
  // Accept optional axios config (e.g., { signal }) so callers can abort long requests
  get: (formData: FormData, config: any = {}) => api.post('/api/recommend', formData, config),
};