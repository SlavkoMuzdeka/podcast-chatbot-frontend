"use client";

import { useState } from "react";
import { User } from "@/utils/models";
import { apiLogin } from "@/utils/api";
import { useRouter } from "next/navigation";

const LOCAL_STORAGE_PREFIX = "inat-networks-chatbot-";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearAuthData = () => {
    localStorage.removeItem(LOCAL_STORAGE_PREFIX + "user");
    localStorage.removeItem(LOCAL_STORAGE_PREFIX + "access_token");
    setUser(null);
  };

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!username.trim() || !password.trim()) {
        return;
      }

      const resp = await apiLogin(username, password);

      if (resp.success) {
        const tempUser = resp.data.user;
        const tokens = resp.data.tokens;

        setUser(tempUser);

        localStorage.setItem(
          LOCAL_STORAGE_PREFIX + "user",
          JSON.stringify(tempUser)
        );
        localStorage.setItem(
          LOCAL_STORAGE_PREFIX + "access_token",
          tokens.access_token
        );

        router.push("/dashboard");
      } else {
        setError(resp.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  };

  const logout = async () => {
    clearAuthData();
  };

  return {
    user,
    error,
    login,
    logout,
    isLoading,
  };
}
