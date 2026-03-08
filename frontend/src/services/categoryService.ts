import api from '../api/axiosInstance';
import { getStoredUser } from './authService';
import type { Category, CreateCategoryDTO } from '../types/category';

const getAuthHeaders = () => {
  const auth = getStoredUser();
  return {
    headers: {
      Authorization: `Bearer ${auth?.token}`,
      'Content-Type': 'application/json',
    },
  };
};

export const categoryApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/categories', getAuthHeaders());
    return response.data;
  },

  create: async (data: CreateCategoryDTO): Promise<Category> => {
    const response = await api.post('/categories', data, getAuthHeaders());
    return response.data;
  },

  update: async (
    id: number,
    data: CreateCategoryDTO
  ): Promise<{ message: string }> => {
    const response = await api.put(`/categories/${id}`, data, getAuthHeaders());
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/categories/${id}`, getAuthHeaders());
    return response.data;
  },
};
