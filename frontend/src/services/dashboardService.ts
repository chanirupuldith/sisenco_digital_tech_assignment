import api from '../api/axiosInstance';
import type { DashboardData } from '../types/dashboard';

export const dashboardApi = {
  getDashboardData: async (): Promise<DashboardData> => {
    const response = await api.get<DashboardData>(`/dashboard`);
    return response.data;
  },
};
