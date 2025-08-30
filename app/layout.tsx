import "./globals.css";

import type React from "react";

import type { Metadata } from "next";

import { Inter } from "next/font/google";
import { ClientLayout } from "./clientLayout";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Podcast Chatbot - Inat Networks",
  description: "AI-powered podcast analysis and chat interface",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
