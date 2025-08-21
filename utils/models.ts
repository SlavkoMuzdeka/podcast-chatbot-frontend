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
  error: string | null;
}

export interface Episode {
  title: string;
  content: string;
}
