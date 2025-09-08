"use client";

import type React from "react";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/";

  return (
    <AuthProvider>
      {children}
      {!isLoginPage && <Footer />}
      <Toaster />
    </AuthProvider>
  );
}
