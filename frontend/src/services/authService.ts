import type { AuthResponse, User } from '../types/auth';
import api from '../api/axiosInstance';

const API_URL = 'http://localhost:5000/api/auth';

export const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    `${API_URL}/register`,
    userData
  );
  return response.data;
};

export const loginUser = async (
  credentials: Pick<User, 'email'> & { password: string }
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    `${API_URL}/login`,
    credentials
  );

  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem('user');
};

export const getStoredUser = (): AuthResponse | null => {
  const stored = localStorage.getItem('user');
  return stored ? JSON.parse(stored) : null;
};
