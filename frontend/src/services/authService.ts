import type { AuthResponse, User } from '../types/auth';
import api from '../api/axiosInstance';

/**
 * Registers a new user account.
 *
 * @param userData - Object containing username, email, and password.
 * @returns The authentication response including the token and user details.
 */
export const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(`auth/register`, userData);
  return response.data;
};

/**
 * Authenticates a user with email and password.
 * Persists the token and user info to localStorage on success.
 *
 * @param credentials - Object containing email and password.
 * @returns The authentication response including the token and user details.
 */
export const loginUser = async (
  credentials: Pick<User, 'email'> & { password: string }
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(`auth/login`, credentials);

  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

/**
 * Logs the user out by removing their session from localStorage.
 */
export const logout = (): void => {
  localStorage.removeItem('user');
};

/**
 * Retrieves the currently authenticated user from localStorage.
 *
 * @returns The stored authentication response, or null if not authenticated.
 */
export const getStoredUser = (): AuthResponse | null => {
  const stored = localStorage.getItem('user');
  return stored ? JSON.parse(stored) : null;
};
