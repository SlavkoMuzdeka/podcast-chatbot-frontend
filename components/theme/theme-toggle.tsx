"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
      ) : (
        <Sun className="h-4 w-4 text-slate-600 dark:text-slate-400" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
