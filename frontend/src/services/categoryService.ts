import api from '../api/axiosInstance';
import { getStoredUser } from './authService';
import type { Category, CreateCategoryDTO } from '../types/category';

/**
 * Returns the Authorization headers using the stored user token.
 * Used for endpoints that require explicit header injection.
 */
const getAuthHeaders = () => {
  const auth = getStoredUser();
  return {
    headers: {
      Authorization: `Bearer ${auth?.token}`,
      'Content-Type': 'application/json',
    },
  };
};

/**
 * API service for managing user categories.
 */
export const categoryApi = {
  /**
   * Fetches all active categories for the authenticated user.
   *
   * @returns A list of categories.
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/categories', getAuthHeaders());
    return response.data;
  },

  /**
   * Creates a new category.
   *
   * @param data - Category name and type.
   * @returns The newly created category.
   */
  create: async (data: CreateCategoryDTO): Promise<Category> => {
    const response = await api.post('/categories', data, getAuthHeaders());
    return response.data;
  },

  /**
   * Updates an existing category by ID.
   *
   * @param id - The ID of the category to update.
   * @param data - Updated category data.
   * @returns A success message from the server.
   */
  update: async (
    id: number,
    data: CreateCategoryDTO
  ): Promise<{ message: string }> => {
    const response = await api.put(`/categories/${id}`, data, getAuthHeaders());
    return response.data;
  },

  /**
   * Soft-deletes a category by ID.
   *
   * @param id - The ID of the category to delete.
   * @returns A success message from the server.
   */
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/categories/${id}`, getAuthHeaders());
    return response.data;
  },
};
