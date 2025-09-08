"use client";

import type React from "react";

import type { Expert, Message } from "@/utils/models";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea";
import {
  Bot,
  User,
  Send,
  Users,
  Loader2,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

interface ExpertChatProps {
  experts: Expert[];
  onBack: () => void;
}

// Chat endpoints
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const CHAT_WITH_EXPERT_URL = `${API_BASE_URL}/api/experts/chat`;
const CHAT_WITH_EXPERT_STREAM = `${API_BASE_URL}/api/experts/chat/stream`;

const LOCAL_STORAGE_PREFIX = "inat-networks-chatbot-";
const ACCESS_TOKEN = localStorage.getItem(
  LOCAL_STORAGE_PREFIX + "access_token"
);

export function ExpertChat({ experts, onBack }: ExpertChatProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      role: "assistant",
      content: `Hello! I'm ready to help you with insights from ${
        experts.length > 1 ? `${experts.length} experts` : experts[0].name
      }. Ask me anything about the podcast episodes!`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [experts]);

  useEffect(() => {
    if (messagesEndRef.current && scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSingleExpertStreaming = async (userMessage: Message) => {
    const expert = experts[0];

    const streamingMessageId = `${Date.now()}-streaming`;
    const streamingMessage: Message = {
      id: streamingMessageId,
      role: "assistant",
      content: "",
      expertId: expert.id,
      expertName: expert.name,
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, streamingMessage]);

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch(CHAT_WITH_EXPERT_STREAM, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          expertId: expert.id,
          message: userMessage.content,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === streamingMessageId
                    ? { ...msg, isStreaming: false }
                    : msg
                )
              );
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.token) {
                accumulatedContent += parsed.token;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === streamingMessageId
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  )
                );
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error("Streaming error:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === streamingMessageId
            ? {
                ...msg,
                content:
                  "Sorry, I encountered an error while processing your request.",
                isStreaming: false,
              }
            : msg
        )
      );
    }
  };

  const handleMultiExpertChat = async (userMessage: Message) => {
    const timestamp = Date.now();

    // Create pending messages for each expert with unique IDs
    const pendingMessages = experts.map((expert, index) => ({
      id: `${timestamp}-${expert.id}-pending-${index}`,
      role: "assistant" as const,
      content: "",
      expertId: expert.id,
      expertName: expert.name,
      timestamp: new Date(),
      isThinking: true,
    }));

    setMessages((prev) => [...prev, ...pendingMessages]);

    try {
      // Send requests to each expert
      const responses = await Promise.all(
        experts.map(async (expert, index) => {
          try {
            const response = await fetch(CHAT_WITH_EXPERT_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ACCESS_TOKEN}`,
              },
              body: JSON.stringify({
                expertId: expert.id,
                message: userMessage.content,
              }),
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(
                data.error || `API responded with status: ${response.status}`
              );
            }

            return {
              expertId: expert.id,
              expertName: expert.name,
              content:
                data.data?.response ||
                data.response ||
                "Sorry, I couldn't generate a response.",
              error: false,
              index,
            };
          } catch (error) {
            console.error(
              `Error fetching response for expert ${expert.name}:`,
              error
            );
            return {
              expertId: expert.id,
              expertName: expert.name,
              content: `Error: ${
                error instanceof Error
                  ? error.message
                  : "Failed to get response"
              }`,
              error: true,
              index,
            };
          }
        })
      );

      // Replace pending messages with actual responses
      setMessages((prev) => {
        const withoutPending = prev.filter((m) => !m.isThinking);
        const responseMessages = responses.map(
          ({ expertId, expertName, content, index }) => ({
            id: `${timestamp}-${expertId}-response-${index}`,
            role: "assistant" as const,
            content,
            expertId,
            expertName,
            timestamp: new Date(),
          })
        );

        return [...withoutPending, ...responseMessages];
      });
    } catch (error) {
      console.error("Error in multi-expert chat:", error);
      // Remove pending messages and show error
      setMessages((prev) => prev.filter((m) => !m.isThinking));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      if (experts.length === 1) {
        await handleSingleExpertStreaming(userMessage);
      } else {
        await handleMultiExpertChat(userMessage);
      }
    } catch (error) {
      console.error("Error in chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {experts.slice(0, 3).map((expert, index) => (
                  <Avatar
                    key={expert.id}
                    className={`h-10 w-10 border-2 border-white dark:border-slate-900 ${
                      index > 0 ? "-ml-2" : ""
                    }`}
                  >
                    <AvatarFallback className="bg-gradient-to-br from-corporate-600 to-corporate-700 text-white text-sm">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                ))}
                {experts.length > 3 && (
                  <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-900 -ml-2">
                    <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs">
                      +{experts.length - 3}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>

              <div>
                <h1 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  {experts.length === 1 ? (
                    <>
                      <Sparkles className="w-5 h-5 text-corporate-600" />
                      {experts[0].name}
                    </>
                  ) : (
                    <>
                      <Users className="w-5 h-5 text-corporate-600" />
                      Multi-Expert Chat
                    </>
                  )}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {experts.length === 1
                    ? `${experts[0].totalEpisodes} episodes available`
                    : `${experts.length} experts • ${experts.reduce(
                        (sum, e) => sum + e.totalEpisodes,
                        0
                      )} total episodes`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
            <div className="py-6 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-corporate-600 to-corporate-700 text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-[70%] ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-corporate-600 to-corporate-700 text-white rounded-2xl rounded-br-md"
                        : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl rounded-bl-md border border-slate-200 dark:border-slate-700"
                    } px-4 py-3 shadow-sm`}
                  >
                    {message.expertName && message.role === "assistant" && (
                      <div className="text-xs font-medium text-corporate-600 dark:text-corporate-400 mb-2 flex items-center gap-1">
                        <Bot className="w-3 h-3" />
                        {message.expertName}
                      </div>
                    )}
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.isThinking ? (
                        <div className="flex items-center gap-3 py-2">
                          <div className="flex gap-1">
                            <div className="h-2 w-2 animate-bounce rounded-full bg-corporate-500 [animation-delay:0ms]"></div>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-corporate-500 [animation-delay:150ms]"></div>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-corporate-500 [animation-delay:300ms]"></div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-3 w-3 animate-spin text-corporate-500" />
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                              {message.expertName} is thinking...
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          {message.content}
                          {message.isStreaming && (
                            <span className="inline-block w-2 h-4 bg-corporate-600 animate-pulse ml-1" />
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                      <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <div className="p-4">
              <form onSubmit={handleSubmit} className="relative">
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
                  <CardContent className="p-0">
                    <AutoResizeTextarea
                      placeholder={`Message ${
                        experts.length > 1 ? "your experts" : experts[0].name
                      }...`}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      maxRows={6}
                      className="w-full border-0 bg-transparent px-4 py-4 pr-12 text-sm resize-none focus:outline-none focus:ring-0 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (input.trim() && !isLoading) {
                            handleSubmit(e);
                          }
                        }
                      }}
                    />
                    <div className="absolute right-2 bottom-2 flex gap-2">
                      {isLoading && experts.length === 1 && (
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-lg bg-transparent"
                          onClick={handleStop}
                        >
                          <div className="h-3 w-3 bg-red-500 rounded-sm" />
                        </Button>
                      )}
                      <Button
                        type="submit"
                        size="icon"
                        className="h-8 w-8 rounded-lg bg-gradient-to-r from-corporate-600 to-corporate-700 hover:from-corporate-700 hover:to-corporate-800 transition-all duration-200 shadow-sm"
                        disabled={isLoading || !input.trim()}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </form>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
                Press Enter to send, Shift + Enter for new line
                {experts.length === 1 && " • Streaming enabled"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
