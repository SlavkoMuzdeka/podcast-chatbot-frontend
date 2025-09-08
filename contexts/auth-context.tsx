"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { User } from "@/utils/models";
import { apiLogin } from "@/utils/api";
import { useRouter } from "next/navigation";

const LOCAL_STORAGE_PREFIX = "inat-networks-chatbot-";

type AuthContextType = {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(LOCAL_STORAGE_PREFIX + "user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data:", error);
        clearAuthData();
      }
    }
  }, []);

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

  const logout = () => {
    clearAuthData();
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, error, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
