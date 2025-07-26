"use client";

import { AuthState } from "@/lib/models";
import { sanitizeInput } from "@/lib/security";
import { useState, useEffect, useCallback } from "react";
import {
  apiPost,
  APIError,
  isTokenValid,
  setStoredToken,
  removeStoredToken,
  AuthenticationError,
} from "@/utils/api";

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

    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apiPost("/api/auth/login", {
        username: sanitizedUsername,
        password: sanitizedPassword,
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

  const logout = useCallback(async (): Promise<void> => {
    try {
      await apiPost("/api/auth/logout", {});
    } catch (error) {
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
    logout,
    clearError,
    checkAuthStatus,
  };
}
