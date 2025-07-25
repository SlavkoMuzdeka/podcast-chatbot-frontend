import { INAT_NETWORKS_JWT_TOKEN_KEY, API_BASE_URL } from "@/lib/constants";
import { SECURITY_HEADERS, sanitizeInput, RateLimiter } from "@/lib/security";

// Rate limiter instance
const rateLimiter = new RateLimiter();

// Token management
const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(INAT_NETWORKS_JWT_TOKEN_KEY);
};

const setStoredToken = (token: string): void => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(INAT_NETWORKS_JWT_TOKEN_KEY, token);
  sessionStorage.setItem(
    `${INAT_NETWORKS_JWT_TOKEN_KEY}_timestamp`,
    Date.now().toString()
  );
};

const removeStoredToken = (): void => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(INAT_NETWORKS_JWT_TOKEN_KEY);
  sessionStorage.removeItem(`${INAT_NETWORKS_JWT_TOKEN_KEY}_timestamp`);
};

const isTokenValid = (): boolean => {
  if (typeof window === "undefined") return false;

  const token = getStoredToken();
  const timestamp = sessionStorage.getItem(
    `${INAT_NETWORKS_JWT_TOKEN_KEY}_timestamp`
  );

  if (!token || !timestamp) return false;

  // Check if token is expired (24 hours)
  const tokenAge = Date.now() - Number.parseInt(timestamp);
  return tokenAge < 24 * 60 * 60 * 1000;
};

// API Error types
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

// Secure API fetch with comprehensive error handling
export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  // Validate token before making request
  if (!isTokenValid() && !endpoint.includes("/auth/")) {
    removeStoredToken();
    throw new AuthenticationError("Session expired. Please log in again.");
  }

  // Rate limiting check
  const clientId =
    typeof window !== "undefined"
      ? window.location.hostname + (getStoredToken()?.slice(-10) || "anonymous")
      : "server";

  if (rateLimiter.isRateLimited(clientId, 100)) {
    // 100 requests per window
    throw new APIError("Too many requests. Please try again later.", 429);
  }

  const token = getStoredToken();
  const headers: Record<string, string> = {
    ...SECURITY_HEADERS,
    ...((options.headers as Record<string, string>) || {}),
  };

  // Add authentication header if token exists
  if (token && !endpoint.includes("/auth/login")) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Sanitize request body if it's JSON
  let body = options.body;
  if (body && typeof body === "string") {
    try {
      const parsed = JSON.parse(body);
      // Sanitize string values in the request
      const sanitized = sanitizeRequestData(parsed);
      body = JSON.stringify(sanitized);
    } catch {
      // If not JSON, treat as string and sanitize
      body = sanitizeInput(body);
    }
  }

  const requestOptions: RequestInit = {
    ...options,
    headers,
    body,
    credentials: "same-origin", // Security: only send cookies to same origin
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...requestOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle authentication errors
    if (response.status === 401) {
      removeStoredToken();
      throw new AuthenticationError(
        "Authentication failed. Please log in again."
      );
    }

    // Handle other HTTP errors
    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // If response is not JSON, use status text
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

// Sanitize request data recursively
const sanitizeRequestData = (data: any): any => {
  if (typeof data === "string") {
    return sanitizeInput(data);
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeRequestData);
  }

  if (data && typeof data === "object") {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[sanitizeInput(key)] = sanitizeRequestData(value);
    }
    return sanitized;
  }

  return data;
};

// Secure API methods
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

// Token management exports
export { setStoredToken, removeStoredToken, isTokenValid };
