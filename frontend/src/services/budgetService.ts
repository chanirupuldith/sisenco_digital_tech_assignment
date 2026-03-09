import api from '../api/axiosInstance';
import type { Budget, CreateBudgetDTO } from '../types/budget';

/**
 * API service for managing monthly budgets.
 */
export const budgetApi = {
  /**
   * Fetches all budgets for the authenticated user.
   * Each budget includes the current amount spent for the given month.
   *
   * @returns A list of budgets with spending data.
   */
  getBudgets: async (): Promise<Budget[]> => {
    const response = await api.get<Budget[]>('/budgets');
    return response.data;
  },

  /**
   * Creates a new monthly budget for a category.
   *
   * @param data - Budget data including category, amount, month, and year.
   * @returns The created budget ID and a success message.
   */
  create: async (
    data: CreateBudgetDTO
  ): Promise<{ id: number; message: string }> => {
    const response = await api.post('/budgets', data);
    return response.data;
  },

  /**
   * Updates the amount of an existing budget.
   *
   * @param id - The ID of the budget to update.
   * @param amount - The new budget amount.
   * @returns A success message from the server.
   */
  update: async (id: number, amount: number): Promise<{ message: string }> => {
    const response = await api.put(`/budgets/${id}`, { amount });
    return response.data;
  },
};
