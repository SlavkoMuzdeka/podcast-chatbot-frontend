"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { useAuth } from "@/components/auth/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login, error, clearError, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await login(username, password);
      if (result.success) {
        router.push("/dashboard");
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginForm
      onLogin={handleLogin}
      error={error}
      onClearError={clearError}
      isLoading={isLoading}
    />
  );
}
