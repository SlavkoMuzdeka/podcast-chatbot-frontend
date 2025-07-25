"use client";

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
import {
  LogOut,
  User,
  Settings,
  Shield,
  Podcast,
  ChevronDown,
} from "lucide-react";
import type { User as UserType } from "../hooks/useAuth";

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
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and App Name */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <Podcast className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Podcast Chatbot
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                AI-Powered Podcast Analysis
              </p>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {/* User Info - Hidden on mobile */}
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {getUserDisplayName(user)}
              </span>
              <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                {user.role === "admin" && (
                  <>
                    <Shield className="w-3 h-3" />
                    <span>Administrator</span>
                  </>
                )}
                {user.role === "user" && (
                  <>
                    <User className="w-3 h-3" />
                    <span>User</span>
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
                  className="flex items-center gap-2 px-2 py-1 h-auto hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
                      {getUserInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {getUserDisplayName(user)}
                    </p>
                    {user.email && (
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    )}
                    <div className="flex items-center gap-1 pt-1">
                      {user.role === "admin" ? (
                        <>
                          <Shield className="w-3 h-3 text-blue-600" />
                          <span className="text-xs text-blue-600 font-medium">
                            Administrator
                          </span>
                        </>
                      ) : (
                        <>
                          <User className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-green-600 font-medium">
                            User
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
