"use client";

import type React from "react";
import { Button } from "./ui/button";
import { getBotById } from "@/lib/bots";
import { Send, User } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { MessageBubble } from "./ui/message-bubble";
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AutoResizeTextarea } from "./ui/auto-resize-textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface ChatProps {
  selectedBots: string[];
}

/**
 * @description Interface for chat messages with support for multiple bots
 */
interface MultiBotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  botId?: string;
  pending?: boolean;
  error?: boolean;
}

/**
 * @description Chat component that displays messages and handles interactions with multiple bots
 */
export function Chat({ selectedBots }: ChatProps) {
  // State for messages, input, and loading status
  const [messages, setMessages] = useState<MultiBotMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm ready to help. Ask me anything!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Reference to the end of the messages for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * @description Handle form submission and send messages to the API
   * @param e - Form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: MultiBotMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Create pending messages for each selected bot
      const pendingMessages = selectedBots.map((botId) => ({
        id: `${Date.now()}-${botId}`,
        role: "assistant" as const,
        content: "",
        botId,
        pending: true,
      }));

      setMessages((prev) => [...prev, ...pendingMessages]);

      // Request responses from all selected bots in parallel
      const botResponses = await Promise.all(
        selectedBots.map(async (botId) => {
          try {
            // Send the request to the API
            const response = await fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                botId,
                messages: [
                  ...messages.filter((m) => !m.botId || m.botId === botId),
                  userMessage,
                ].map(({ role, content }) => ({ role, content })),
              }),
            });

            // Try to parse the response as JSON
            let data;
            try {
              data = await response.json();
            } catch (jsonError) {
              console.error(`Error parsing JSON for bot ${botId}:`, jsonError);
              // If we can't parse JSON, get the text and use that as the error message
              const errorText = await response.text();
              throw new Error(errorText || "Failed to parse response");
            }

            // Check if the response was successful
            if (!response.ok) {
              throw new Error(
                data.error || `API responded with status: ${response.status}`
              );
            }

            return {
              botId,
              content: data.text || "Sorry, I couldn't generate a response.",
              error: false,
            };
          } catch (error) {
            console.error(`Error fetching response for bot ${botId}:`, error);
            return {
              botId,
              content: `Error: ${
                error instanceof Error
                  ? error.message
                  : "Failed to get response"
              }`,
              error: true,
            };
          }
        })
      );

      // Replace pending messages with actual responses
      setMessages((prev) => {
        const withoutPending = prev.filter((m) => !m.pending);
        const responseMessages = botResponses.map(
          ({ botId, content, error }) => ({
            id: `${Date.now()}-${botId}-response`,
            role: "assistant" as const,
            content,
            botId,
            error,
          })
        );

        return [...withoutPending, ...responseMessages];
      });
    } catch (error) {
      console.error("Error fetching responses:", error);
      // Handle error by updating pending messages
      setMessages((prev) =>
        prev.map((m) =>
          m.pending
            ? {
                ...m,
                content:
                  "Sorry, an error occurred while generating a response.",
                pending: false,
                error: true,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Group messages by their sequence in the conversation
  const messageGroups = messages.reduce((groups, message) => {
    if (message.role === "user") {
      // Each user message starts a new group
      groups.push([message]);
    } else if (groups.length > 0) {
      // If it's a bot message, check if it belongs to the current group
      const currentGroup = groups[groups.length - 1];
      const lastMessage = currentGroup[currentGroup.length - 1];

      if (lastMessage.role === "user" || message.botId) {
        // If last message was from user or this is a bot-specific message, add to current group
        currentGroup.push(message);
      } else {
        // Otherwise start a new group
        groups.push([message]);
      }
    } else {
      // If there are no groups yet (e.g., welcome message)
      groups.push([message]);
    }
    return groups;
  }, [] as MultiBotMessage[][]);

  return (
    <Card className="flex h-[calc(100vh-2rem)] flex-col">
      {/* Chat header showing selected bots */}
      <CardHeader className="border-b px-4 py-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex -space-x-2">
            {selectedBots.map((botId, index) => {
              const bot = getBotById(botId);
              return (
                <Avatar
                  key={botId}
                  className={`h-8 w-8 border-2 border-background ${
                    index > 0 ? "-ml-2" : ""
                  }`}
                >
                  <AvatarFallback>
                    {bot ? <bot.icon /> : <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
              );
            })}
          </div>
          <div className="flex flex-col">
            <span>
              {selectedBots.length === 1
                ? getBotById(selectedBots[0])?.name || "AI Assistant"
                : `${selectedBots.length} Bots Selected`}
            </span>
            <span className="text-xs text-muted-foreground">
              {selectedBots.length === 1
                ? getBotById(selectedBots[0])?.description ||
                  "A helpful AI assistant"
                : "Helpful AI assistants"}
            </span>
          </div>
        </CardTitle>
      </CardHeader>

      {/* Chat message area */}
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-6 p-4">
            {messageGroups.map((group, groupIndex) => (
              <div key={`group-${groupIndex}`} className="flex flex-col gap-3">
                {group.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </div>
            ))}

            {/* Global loading indicator */}
            {isLoading && !messages.some((m) => m.pending) && (
              <div className="flex w-max max-w-[80%] flex-col gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
                <div className="flex gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/50"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:0.2s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      {/* Message input form */}
      <CardFooter className="border-t p-4">
        <form
          onSubmit={handleSubmit}
          className="flex w-full items-center gap-2"
        >
          <div className="relative flex-1">
            <AutoResizeTextarea
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxRows={8}
              className="w-full rounded-2xl border bg-background px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim() && !isLoading) {
                    handleSubmit(e);
                  }
                }
              }}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full"
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}
