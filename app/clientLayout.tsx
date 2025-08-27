"use client";

import type React from "react";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/";

  return (
    <>
      {children}
      {!isLoginPage && <Footer />}
    </>
  );
}
