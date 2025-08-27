import "./globals.css";

import type React from "react";

import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/theme/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider>
          <div className="flex-1">{children}</div>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
