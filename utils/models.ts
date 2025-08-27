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
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEpisode {
  title: string;
  content: string;
}

export interface CreateExpert {
  name: string;
  description: string;
  episodes: CreateEpisode[];
}

export interface Expert {
  id: string;
  name: string;
  description: string;
  episodes: Episode[];
  totalEpisodes: number;
  createdAt: string;
  updatedAt: string;
}
