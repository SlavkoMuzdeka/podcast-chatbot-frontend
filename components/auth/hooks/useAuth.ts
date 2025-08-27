"use client";

import { apiLogin } from "@/utils/api";
import { AuthState } from "@/utils/models";
import { useState, useCallback } from "react";

const LOCAL_STORAGE_PREFIX = "inat-networks-chatbot-";

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    error: null,
  });

  const clearAuthData = () => {
    localStorage.removeItem(LOCAL_STORAGE_PREFIX + "user");
    localStorage.removeItem(LOCAL_STORAGE_PREFIX + "access_token");
    setAuthState({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  };

  const login = async (
    username: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const resp = await apiLogin(username, password);

      if (resp.success && resp.data?.user && resp.data?.tokens) {
        const user = resp.data.user;
        const tokens = resp.data.tokens;

        setAuthState({
          user: resp.data.user,
          isAuthenticated: true,
          error: null,
        });

        localStorage.setItem(
          LOCAL_STORAGE_PREFIX + "user",
          JSON.stringify(user)
        );
        localStorage.setItem(
          LOCAL_STORAGE_PREFIX + "access_token",
          tokens.access_token
        );
        return { success: resp.success };
      } else {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: resp.error || "Login failed",
        }));
        return { success: resp.success, error: resp.error };
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Login failed",
      }));
      return { success: false, error: "Login failed" };
    }
  };

  const logout = async () => {
    clearAuthData();
  };

  const clearError = useCallback(() => {
    setAuthState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...authState,
    login,
    logout,
    clearError,
  };
}
