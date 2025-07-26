export interface User {
  id: string;
  username: string;
  email?: string;
  full_name?: string;
  role: string;
  is_active: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
