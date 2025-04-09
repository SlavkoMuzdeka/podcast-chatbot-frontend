"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Send, User, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { getBotById } from "@/lib/bots";
import { useRef, useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";

interface ChatProps {
  selectedBots: string[];
}

/**
 * @description Interface for chat messages with support for multiple bots
 */
interface MultiBotMessage {
  id: string; // Unique identifier for the message
  role: "user" | "assistant"; // Role of the message sender
  content: string; // Message content
  botId?: string; // ID of the bot that sent the message (for assistant messages)
  pending?: boolean; // Whether the message is pending (waiting for response)
  error?: boolean; // Whether there was an error generating the message
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
        selectedBots.map(async (botId, index) => {
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
                {group.map((message) => {
                  const bot = message.botId ? getBotById(message.botId) : null;

                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "flex flex-col gap-2",
                        message.role === "user" ? "items-end" : "items-start"
                      )}
                    >
                      {/* Bot label for multi-bot responses */}
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-1 ml-2 text-xs text-muted-foreground">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-[10px]">
                              {bot ? (
                                <bot.icon />
                              ) : (
                                <User className="h-3 w-3" />
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <span>{bot?.name || "AI Assistant"}</span>
                        </div>
                      )}

                      {/* Message bubble */}
                      <div
                        className={cn(
                          "flex w-max max-w-[90%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : message.error
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-muted text-foreground"
                        )}
                      >
                        {message.pending ? (
                          // Loading indicator for pending messages
                          <div className="flex gap-1">
                            <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/50"></div>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:0.2s]"></div>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:0.4s]"></div>
                          </div>
                        ) : message.error ? (
                          // Error message display
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            <span>{message.content}</span>
                          </div>
                        ) : (
                          // Regular message content with markdown rendering
                          <div
                            className={cn(
                              "prose prose-sm max-w-none",
                              message.role === "user"
                                ? "prose-invert"
                                : "dark:prose-invert"
                            )}
                          >
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeSanitize, rehypeHighlight]}
                              components={{
                                // Custom components for markdown rendering
                                p: ({ children }) => (
                                  <p className="mb-2 last:mb-0">{children}</p>
                                ),
                                a: ({ href, children }) => (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={
                                      message.role === "user"
                                        ? "text-primary-foreground underline"
                                        : "text-primary underline"
                                    }
                                  >
                                    {children}
                                  </a>
                                ),
                                pre: ({ children }) => (
                                  <pre className="bg-muted-foreground/10 p-2 rounded-md overflow-auto text-xs my-2">
                                    {children}
                                  </pre>
                                ),
                                code: ({
                                  node,
                                  inline,
                                  className,
                                  children,
                                  ...props
                                }) => {
                                  if (inline) {
                                    return (
                                      <code
                                        className={cn(
                                          "bg-muted-foreground/20 px-1 py-0.5 rounded text-xs",
                                          message.role === "user"
                                            ? "bg-primary-foreground/20"
                                            : "",
                                          className
                                        )}
                                        {...props}
                                      >
                                        {children}
                                      </code>
                                    );
                                  }
                                  return (
                                    <code className={cn(className)} {...props}>
                                      {children}
                                    </code>
                                  );
                                },
                              }}
                            >
                              {/* Ensure content is a string before passing to ReactMarkdown */}
                              {typeof message.content === "string"
                                ? message.content
                                : "Error: Invalid content"}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
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
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
