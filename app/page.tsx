"use client";

import { useState, useEffect } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { MainDashboard } from "@/components/dashboard/main-dashboard";
import { Header } from "@/components/layout/header";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { useAuth } from "@/components/auth/hooks/useAuth";
import { Loader2, Bot } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, error, login, logout, clearError } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  if (isInitializing) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950 flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-3xl flex items-center justify-center mx-auto shadow-2xl ring-1 ring-white/20">
              <Bot className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Podcast Expert Hub
                </h1>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Loading your AI-powered podcast intelligence platform...
              </p>
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        {isAuthenticated && user ? (
          <>
            <Header user={user} onLogout={logout} />
            <MainDashboard />
          </>
        ) : (
          <LoginForm onLogin={login} error={error} onClearError={clearError} />
        )}
      </div>
    </ThemeProvider>
  );
}
