import { INAT_NETWORKS_JWT_TOKEN_KEY, API_BASE_URL } from "@/lib/constants";

const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(INAT_NETWORKS_JWT_TOKEN_KEY);
};

const setStoredToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(INAT_NETWORKS_JWT_TOKEN_KEY, token);
};

const removeStoredToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(INAT_NETWORKS_JWT_TOKEN_KEY);
};

export class APIError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
    this.name = "APIError";
  }
}

export class NetworkError extends Error {
  constructor(message = "Network connection failed") {
    super(message);
    this.name = "NetworkError";
  }
}

export class AuthenticationError extends Error {
  constructor(message = "Authentication failed") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token && !endpoint.includes("/auth/login")) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      removeStoredToken();
      throw new AuthenticationError(
        "Authentication failed. Please log in again."
      );
    }

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }

      throw new APIError(errorMessage, response.status);
    }

    return response;
  } catch (error) {
    if (error instanceof APIError || error instanceof AuthenticationError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new NetworkError("Request timeout. Please try again.");
      }
      if (error.message.includes("fetch")) {
        throw new NetworkError(
          "Network connection failed. Please check your internet connection."
        );
      }
    }

    throw new NetworkError("An unexpected error occurred. Please try again.");
  }
};

export const apiGet = async (endpoint: string): Promise<any> => {
  const response = await apiFetch(endpoint, { method: "GET" });
  return response.json();
};

export const apiPost = async (endpoint: string, data: any): Promise<any> => {
  const response = await apiFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
};

export const apiPut = async (endpoint: string, data: any): Promise<any> => {
  const response = await apiFetch(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response.json();
};

export const apiDelete = async (endpoint: string): Promise<any> => {
  const response = await apiFetch(endpoint, { method: "DELETE" });
  return response.json();
};

export { setStoredToken, removeStoredToken };
