export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  errors?: Array<{ msg: string; path: string }>;
}
