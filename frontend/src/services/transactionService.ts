import api from '../api/axiosInstance';
import type { Transaction, CreateTransactionDTO } from '../types/transaction';

export const transactionApi = {
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

  create: async (data: CreateTransactionDTO) => {
    const response = await api.post('/transactions', data);
    return response.data;
  },

  update: async (id: number, data: CreateTransactionDTO) => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },
};
