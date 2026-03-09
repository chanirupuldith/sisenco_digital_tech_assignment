import api from '../api/axiosInstance';
import type { DashboardData } from '../types/dashboard';

/**
 * API service for fetching dashboard metrics.
 */
export const dashboardApi = {
  /**
   * Fetches aggregated dashboard data for the authenticated user.
   * Includes financial summary, chart data, and recent transactions.
   *
   * @returns A promise resolving to the full dashboard data object.
   */
  getDashboardData: async (): Promise<DashboardData> => {
    const response = await api.get<DashboardData>(`/dashboard`);
    return response.data;
  },
};
