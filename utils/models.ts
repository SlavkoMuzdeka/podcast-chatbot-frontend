export interface User {
  id: string;
  username: string;
  email?: string;
  full_name?: string;
}

export interface CreateEpisode {
  title: string;
  content: string;
}

export interface Episode extends CreateEpisode {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpert {
  name: string;
  description: string;
  episodes: CreateEpisode[];
}

export interface Expert extends CreateExpert {
  id: string;
  totalEpisodes: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  total_experts: number;
  total_episodes: number;
  total_chats: number;
  recent_activity: number;
}

export interface ChatSession {
  experts: Expert[];
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  expertId?: string;
  expertName?: string;
  timestamp: Date;
  isStreaming?: boolean;
}
