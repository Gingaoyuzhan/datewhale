import axios from 'axios';
import type { ApiResponse } from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// 认证相关
export const authApi = {
  register: (data: { username: string; email: string; password: string; nickname?: string }) =>
    api.post<any, ApiResponse<{ user: any; token: string }>>('/auth/register', data),

  login: (data: { username: string; password: string }) =>
    api.post<any, ApiResponse<{ user: any; token: string }>>('/auth/login', data),

  getProfile: () =>
    api.get<any, ApiResponse<any>>('/auth/profile'),
};

// 日记相关
export const entryApi = {
  create: (data: { content: string; imageUrl?: string; images?: string[]; emotionPrimary?: string; emotionSecondary?: string[] }) =>
    api.post<any, ApiResponse<any>>('/entries', data),

  getList: (page = 1, limit = 20) =>
    api.get<any, ApiResponse<any>>('/entries', { params: { page, limit } }),

  getById: (id: number) =>
    api.get<any, ApiResponse<any>>(`/entries/${id}`),

  delete: (id: number) =>
    api.delete<any, ApiResponse<any>>(`/entries/${id}`),
};

// 花园相关
export const gardenApi = {
  getGarden: () =>
    api.get<any, ApiResponse<any>>('/garden'),

  getPlants: () =>
    api.get<any, ApiResponse<any>>('/garden/plants'),
};

// 统计相关
export const statsApi = {
  getOverview: () =>
    api.get<any, ApiResponse<any>>('/stats/overview'),

  getEmotionCurve: (days = 30) =>
    api.get<any, ApiResponse<any>>('/stats/emotion-curve', { params: { days } }),

  getTimeline: (page = 1, limit = 20) =>
    api.get<any, ApiResponse<any>>('/stats/timeline', { params: { page, limit } }),
};

// 文学相关
export const literatureApi = {
  getAuthors: () =>
    api.get<any, ApiResponse<any>>('/authors'),

  getAuthorById: (id: number) =>
    api.get<any, ApiResponse<any>>(`/authors/${id}`),

  getPassageById: (id: number) =>
    api.get<any, ApiResponse<any>>(`/passages/${id}`),
};

export default api;
