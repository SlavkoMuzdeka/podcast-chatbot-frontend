"use client";

import type { User as UserType } from "@/utils/models";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LogOut, User, Settings, Shield, Bot, ChevronDown } from "lucide-react";

interface HeaderProps {
  user: UserType;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getUserInitials = (user: UserType): string => {
    if (user.full_name) {
      return user.full_name
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user.username.charAt(0).toUpperCase();
  };

  const getUserDisplayName = (user: UserType): string => {
    return user.full_name || user.username;
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    onLogout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 dark:border-slate-800/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-900/80">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-11 h-11 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-xl shadow-lg ring-1 ring-white/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Podcast Expert Hub
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                AI-Powered Podcast Intelligence Platform
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Info - Desktop */}
            <div className="hidden lg:flex flex-col items-end mr-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {getUserDisplayName(user)}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                {user.role === "admin" ? (
                  <>
                    <Shield className="w-3 h-3 text-blue-600" />
                    <span className="font-medium">Administrator</span>
                  </>
                ) : (
                  <>
                    <User className="w-3 h-3 text-emerald-600" />
                    <span className="font-medium">User</span>
                  </>
                )}
              </div>
            </div>

            {/* User Dropdown */}
            <DropdownMenu
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 px-3 py-2 h-auto hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
                >
                  <Avatar className="h-9 w-9 ring-2 ring-slate-200 dark:ring-slate-700">
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm font-semibold">
                      {getUserInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-slate-600 dark:text-slate-400 transition-transform duration-200" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-64 p-2 shadow-xl border-slate-200 dark:border-slate-800"
              >
                <DropdownMenuLabel className="font-normal p-3">
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-semibold leading-none text-slate-900 dark:text-white">
                      {getUserDisplayName(user)}
                    </p>
                    {user.email && (
                      <p className="text-xs leading-none text-slate-600 dark:text-slate-400">
                        {user.email}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 pt-1">
                      {user.role === "admin" ? (
                        <>
                          <Shield className="w-3 h-3 text-blue-600" />
                          <span className="text-xs text-blue-600 font-semibold">
                            Administrator
                          </span>
                        </>
                      ) : (
                        <>
                          <User className="w-3 h-3 text-emerald-600" />
                          <span className="text-xs text-emerald-600 font-semibold">
                            User
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="cursor-pointer p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <User className="mr-3 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Settings className="mr-3 h-4 w-4" />
                  <span>Preferences</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="cursor-pointer p-3 rounded-lg text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
