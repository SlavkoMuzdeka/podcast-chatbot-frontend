"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { bots } from "@/lib/bots";
import { Search, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

/**
 * @description Props for the ChatSidebar component
 */
interface ChatSidebarProps {
  selectedBots: string[]; // Array of currently selected bot IDs
  onToggleBot: (botId: string) => void; // Function to toggle bot selection
}

/**
 * @description Sidebar component for selecting and managing bots
 * @description Allows users to search for bots and select multiple bots to chat with
 */
export function ChatSidebar({ selectedBots, onToggleBot }: ChatSidebarProps) {
  // State for the search query
  const [searchQuery, setSearchQuery] = useState("");

  // Filter bots based on the search query
  const filteredBots = bots.filter(
    (bot) =>
      bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col">
      {/* Header section with title and search */}
      <div className="border-b p-4">
        <h2 className="mb-2 text-lg font-bold">Choose Bots</h2>
        <p className="text-xs text-muted-foreground mb-2">
          Select multiple bots to compare their responses
        </p>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search bots..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
      </div>

      {/* Bot selection list */}
      <div className="flex-1 overflow-auto p-2">
        <div className="grid gap-2">
          {filteredBots.map((bot) => {
            const isSelected = selectedBots.includes(bot.id);
            return (
              <Button
                key={bot.id}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "flex w-full justify-start gap-2 px-3 py-6",
                  isSelected && "bg-primary text-primary-foreground"
                )}
                onClick={() => onToggleBot(bot.id)}
              >
                {/* Bot avatar with selection indicator */}
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback
                      className={
                        isSelected ? "bg-primary-foreground text-primary" : ""
                      }
                    >
                      <bot.icon />
                    </AvatarFallback>
                  </Avatar>
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                {/* Bot name and description */}
                <div className="flex flex-col items-start text-left">
                  <span className="font-medium">{bot.name}</span>
                  <span className="text-xs opacity-80">{bot.description}</span>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
