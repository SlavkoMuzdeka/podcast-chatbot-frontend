"use client";

import { useState } from "react";
import { Chat } from "@/components/chat";
import { ChatSidebar } from "@/components/sidebar";

/**
 * @description Main page component for the chatbot application
Manages the state of selected bots and renders the chat interface
 */
export default function Home() {
  // State for tracking which bots are currently selected
  const [selectedBots, setSelectedBots] = useState<string[]>(["empire"]);

  /**
   * @description Toggle a bot's selection status
  Ensures at least one bot remains selected at all times
   * @param botId - The ID of the bot to toggle
   */
  const toggleBotSelection = (botId: string) => {
    setSelectedBots((prev) => {
      if (prev.includes(botId)) {
        // If removing a bot, ensure at least one remains selected
        const newSelection = prev.filter((id) => id !== botId);
        return newSelection.length > 0 ? newSelection : prev;
      }
      // Add the bot to the selection
      return [...prev, botId];
    });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r bg-background">
        <ChatSidebar
          selectedBots={selectedBots}
          onToggleBot={toggleBotSelection}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto h-full max-w-4xl p-4">
          <Chat selectedBots={selectedBots} />
        </div>
      </div>
    </div>
  );
}
