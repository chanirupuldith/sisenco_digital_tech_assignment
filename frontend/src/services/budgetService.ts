import api from '../api/axiosInstance';
import type { Budget, CreateBudgetDTO } from '../types/budget';

export const budgetApi = {
  getBudgets: async (): Promise<Budget[]> => {
    const response = await api.get<Budget[]>('/budgets');
    return response.data;
  },

  create: async (
    data: CreateBudgetDTO
  ): Promise<{ id: number; message: string }> => {
    const response = await api.post('/budgets', data);
    return response.data;
  },

  update: async (id: number, amount: number): Promise<{ message: string }> => {
    const response = await api.put(`/budgets/${id}`, { amount });
    return response.data;
  },
};
