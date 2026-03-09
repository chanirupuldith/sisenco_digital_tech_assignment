import api from '../api/axiosInstance';
import type { Transaction, CreateTransactionDTO } from '../types/transaction';

/**
 * API service for managing user transactions.
 */
export const transactionApi = {
  /**
   * Fetches all transactions for the authenticated user.
   * Supports optional filters: date range, type, and category.
   *
   * @param filters - Optional query parameters to filter results.
   * @returns A list of transactions matching the filters.
   */
  getTransactions: async (filters?: {
    startDate?: string;
    endDate?: string;
    type?: string;
    category?: string;
  }) => {
    const response = await api.get<Transaction[]>('/transactions', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Creates a new transaction.
   *
   * @param data - Transaction data to submit.
   * @returns The created transaction object.
   */
  create: async (data: CreateTransactionDTO) => {
    const response = await api.post('/transactions', data);
    return response.data;
  },

  /**
   * Updates an existing transaction by ID.
   *
   * @param id - The ID of the transaction to update.
   * @param data - Updated transaction data.
   * @returns A success message from the server.
   */
  update: async (id: number, data: CreateTransactionDTO) => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data;
  },

  /**
   * Soft-deletes a transaction by ID.
   *
   * @param id - The ID of the transaction to delete.
   * @returns A success message from the server.
   */
  delete: async (id: number) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },
};
