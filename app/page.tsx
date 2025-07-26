"use client";

import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/hooks/useAuth";
import { LoginForm } from "@/components/auth/login-form";
import { MainDashboard } from "@/components/dashboard/main-dashboard";

export default function Home() {
  const { user, isAuthenticated, isLoading, error, login, logout, clearError } =
    useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <LoginForm
        onLogin={login}
        isLoading={isLoading}
        error={error}
        onClearError={clearError}
      />
    );
  }

  // Show main dashboard if authenticated
  return <MainDashboard user={user} onLogout={logout} />;
}
