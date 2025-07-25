"use client";

import { useState, useEffect, useCallback } from "react";
import {
  apiPost,
  setStoredToken,
  removeStoredToken,
  isTokenValid,
  AuthenticationError,
  APIError,
} from "@/utils/api";
import { sanitizeInput, validatePassword, RateLimiter } from "@/lib/security";

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

// Rate limiter for login attempts
const loginRateLimiter = new RateLimiter();

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Auto-logout on token expiration
  useEffect(() => {
    if (authState.isAuthenticated) {
      const interval = setInterval(() => {
        if (!isTokenValid()) {
          logout();
        }
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [authState.isAuthenticated]);

  const checkAuthStatus = useCallback(async () => {
    try {
      if (!isTokenValid()) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      // Verify token with server
      const response = await apiPost("/api/auth/verify", {});

      if (response.success && response.user) {
        setAuthState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        removeStoredToken();
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      removeStoredToken();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<{ success: true } | { success: false; error: string }> => {
    // Input validation and sanitization
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedPassword = password; // Don't sanitize password as it might contain special chars

    if (!sanitizedUsername || !sanitizedPassword) {
      return { success: false, error: "Username and password are required" };
    }

    if (sanitizedUsername.length < 3 || sanitizedUsername.length > 50) {
      return {
        success: false,
        error: "Username must be between 3 and 50 characters",
      };
    }

    // Rate limiting
    const clientId =
      typeof window !== "undefined" ? window.location.hostname : "unknown";
    if (loginRateLimiter.isRateLimited(clientId)) {
      return {
        success: false,
        error: "Too many login attempts. Please try again in 15 minutes.",
      };
    }

    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apiPost("/api/auth/login", {
        username: sanitizedUsername,
        password: sanitizedPassword,
      });

      if (response.success && response.token && response.user) {
        // Reset rate limiter on successful login
        loginRateLimiter.reset(clientId);

        setStoredToken(response.token);
        setAuthState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return { success: true };
      } else {
        const error = response.error || "Login failed";
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error,
        }));
        return { success: false, error };
      }
    } catch (error) {
      let errorMessage = "Network error. Please try again.";

      if (error instanceof AuthenticationError) {
        errorMessage = "Invalid username or password";
      } else if (error instanceof APIError) {
        errorMessage = error.message;
      }

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  };

  const register = async (
    username: string,
    password: string,
    email?: string,
    fullName?: string
  ): Promise<{ success: true } | { success: false; error: string }> => {
    // Input validation
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedEmail = email ? sanitizeInput(email) : undefined;
    const sanitizedFullName = fullName ? sanitizeInput(fullName) : undefined;

    if (!sanitizedUsername || !password) {
      return { success: false, error: "Username and password are required" };
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        error: passwordValidation.errors.join(". "),
      };
    }

    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apiPost("/api/auth/register", {
        username: sanitizedUsername,
        password,
        email: sanitizedEmail,
        full_name: sanitizedFullName,
      });

      if (response.success && response.token && response.user) {
        setStoredToken(response.token);
        setAuthState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return { success: true };
      } else {
        const error = response.error || "Registration failed";
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error,
        }));
        return { success: false, error };
      }
    } catch (error) {
      let errorMessage = "Network error. Please try again.";

      if (error instanceof APIError) {
        errorMessage = error.message;
      }

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  };

  const logout = useCallback(async (): Promise<void> => {
    try {
      // Call logout endpoint to invalidate token on server
      await apiPost("/api/auth/logout", {});
    } catch (error) {
      // Continue with logout even if server call fails
      console.warn("Logout API call failed:", error);
    } finally {
      removeStoredToken();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  const clearError = useCallback(() => {
    setAuthState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...authState,
    login,
    register,
    logout,
    clearError,
    checkAuthStatus,
  };
}
