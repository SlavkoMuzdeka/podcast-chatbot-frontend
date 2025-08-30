"use client";

import type { User as UserType } from "@/utils/models";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Brain, LogOut, Sparkles, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  user: UserType;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    onLogout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/30 dark:border-slate-800/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-corporate-50/20 via-white/40 to-corporate-100/20 dark:from-slate-900/40 dark:via-slate-800/40 dark:to-slate-900/40" />

      <div className="container mx-auto px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-corporate-600 via-corporate-700 to-corporate-800 rounded-2xl shadow-xl shadow-corporate-500/25 ring-1 ring-white/20"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Brain className="w-6 h-6 text-white" />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent font-heading">
                AI Podcast Expert Hub
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <Sparkles className="w-3 h-3 text-corporate-600 dark:text-corporate-400" />
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Intelligent Podcast Analysis Platform
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Section */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Theme Toggle */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ThemeToggle />
            </motion.div>

            {/* User Info - Desktop */}
            <div className="hidden lg:flex flex-col items-end mr-3">
              <span className="text-sm font-semibold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                {user.username || "Guest"}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                <User className="w-3 h-3 text-emerald-600" />
                <span className="font-medium">User</span>
              </div>
            </div>

            {/* User Dropdown */}
            <DropdownMenu
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 px-4 py-2 h-auto hover:bg-white/60 dark:hover:bg-slate-800/60 rounded-2xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm shadow-lg hover:shadow-xl"
                  >
                    <Avatar className="h-9 w-9 ring-2 ring-corporate-200 dark:ring-corporate-700 shadow-lg">
                      <AvatarFallback className="bg-gradient-to-br from-corporate-600 via-corporate-700 to-corporate-800 text-white text-sm font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-slate-600 dark:text-slate-400 transition-transform duration-200" />
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-72 p-3 shadow-2xl border-slate-200/50 dark:border-slate-800/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl"
              >
                <DropdownMenuLabel className="font-normal p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 ring-2 ring-corporate-200 dark:ring-corporate-700">
                      <AvatarFallback className="bg-gradient-to-br from-corporate-600 via-corporate-700 to-corporate-800 text-white font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                        {user.username}
                      </p>
                      {user.email && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          {user.email}
                        </p>
                      )}
                      <div className="flex items-center gap-1.5 text-xs">
                        <User className="w-3 h-3 text-emerald-600" />
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                          User
                        </span>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="my-3 bg-slate-200 dark:bg-slate-700" />

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <DropdownMenuItem
                    className="cursor-pointer p-4 rounded-xl text-red-600 hover:text-red-700 focus:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 focus:bg-red-50 dark:focus:bg-red-950/30 transition-all duration-200 font-medium"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </motion.div>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
