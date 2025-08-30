import { CreateEpisode, CreateExpert } from "./models";

const LOCAL_STORAGE_PREFIX = "inat-networks-chatbot-";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: Record<string, string>;
  requireAuth?: boolean;
}

// Auth endpoints
const LOGIN_URL = "/api/auth/login";

// Expert endpoints
const GET_EXPERTS_URL = "/api/experts/";
const CREATE_EXPERT_URL = "/api/experts/";
const DELETE_EXPERT_URL = (expertId: string) => `/api/experts/${expertId}`;

// Episode endpoints
const GET_EPISODES_URL = (id: string) => `/api/experts/${id}/episodes`;
const CREATE_EPISODE_URL = (expertId: string) =>
  `/api/experts/${expertId}/episodes`;
const UPDATE_EPISODE_URL = (expertId: string, episodeId: string) =>
  `/api/experts/${expertId}/episodes/${episodeId}`;
const DELETE_EPISODE_URL = (expertId: string, episodeId: string) =>
  `/api/experts/${expertId}/episodes/${episodeId}`;

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}access_token`);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const makeRequest = async (
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse> => {
  const { method = "GET", body, headers = {}, requireAuth = true } = options;

  try {
    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
      ...(requireAuth ? getAuthHeaders() : {}),
    };

    const config: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body && method !== "GET") {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: data.success,
        error: data.error || `HTTP ${response.status}`,
      };
    }

    return {
      success: data.success,
      data: data.data,
    };
  } catch (error) {
    console.error("API Request Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
};

// Auth endpoints
export const apiLogin = async (username: string, password: string) => {
  return await makeRequest(LOGIN_URL, {
    method: "POST",
    body: { username, password },
    requireAuth: false,
  });
};

// Expert endpoints
export const apiCreateExpert = async (data: CreateExpert) => {
  return await makeRequest(CREATE_EXPERT_URL, {
    method: "POST",
    body: data,
  });
};

export const apiGetExperts = async () => {
  return await makeRequest(GET_EXPERTS_URL);
};

export const apiDeleteExpert = async (expertId: string) => {
  return await makeRequest(DELETE_EXPERT_URL(expertId), {
    method: "DELETE",
  });
};

// Episode endpoints
export const apiGetEpisodes = async (expertId: string) => {
  return await makeRequest(GET_EPISODES_URL(expertId));
};

export const apiUpdateEpisode = async (
  expertId: string,
  episodeId: string,
  data: CreateEpisode
) => {
  return await makeRequest(UPDATE_EPISODE_URL(expertId, episodeId), {
    method: "PUT",
    body: data,
  });
};

export const apiDeleteEpisode = async (expertId: string, episodeId: string) => {
  return await makeRequest(DELETE_EPISODE_URL(expertId, episodeId), {
    method: "DELETE",
  });
};

export const apiCreateEpisode = async (
  expertId: string,
  data: CreateEpisode
) => {
  return await makeRequest(CREATE_EPISODE_URL(expertId), {
    method: "POST",
    body: data,
  });
};
