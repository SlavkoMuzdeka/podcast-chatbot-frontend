"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Bot, User, Loader2, Database } from "lucide-react";

interface Expert {
  id: string;
  name: string;
  description: string;
  episode_count: number;
  namespace: string;
}

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

interface ExpertChatProps {
  sessionId: string;
  expert: Expert;
  onBack: () => void;
}

export function ExpertChat({ sessionId, expert, onBack }: ExpertChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeChat();
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    try {
      // Add welcome message
      const welcomeMessage: Message = {
        id: "welcome",
        content: `Hello! I'm your AI expert for ${expert.name}. I have knowledge from ${expert.episode_count} episodes. What would you like to discuss?`,
        role: "assistant",
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      // Handle initialization error
    } finally {
      setIsInitializing(false);
    }
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  const sendMessage = async () => {
    // if (!inputMessage.trim() || isLoading) return;
    // const userMessage: Message = {
    //   id: Date.now().toString(),
    //   content: inputMessage.trim(),
    //   role: "user",
    //   timestamp: new Date().toISOString(),
    // };
    // setMessages((prev) => [...prev, userMessage]);
    // setInputMessage("");
    // setIsLoading(true);
    // try {
    //   const response = await apiFetch(`/api/experts/${expert.id}/chat`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       message: userMessage.content,
    //       session_id: sessionId,
    //     }),
    //   });
    //   const data = await response.json();
    //   if (data.success) {
    //     const assistantMessage: Message = {
    //       id: (Date.now() + 1).toString(),
    //       content: data.response,
    //       role: "assistant",
    //       timestamp: new Date().toISOString(),
    //     };
    //     setMessages((prev) => [...prev, assistantMessage]);
    //   } else {
    //     const errorMessage: Message = {
    //       id: (Date.now() + 1).toString(),
    //       content: "Sorry, I encountered an error. Please try again.",
    //       role: "assistant",
    //       timestamp: new Date().toISOString(),
    //     };
    //     setMessages((prev) => [...prev, errorMessage]);
    //   }
    // } catch (error) {
    //   const errorMessage: Message = {
    //     id: (Date.now() + 1).toString(),
    //     content: "Network error. Please check your connection and try again.",
    //     role: "assistant",
    //     timestamp: new Date().toISOString(),
    //   };
    //   setMessages((prev) => [...prev, errorMessage]);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl flex items-center justify-center mx-auto">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
              Initializing Chat
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Connecting to {expert.name}...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Header */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-lg mb-4">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-white/20">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                  {expert.name}
                </CardTitle>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {expert.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                    >
                      <Database className="w-3 h-3 mr-1" />
                      {expert.episode_count} episodes
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <Card className="flex-1 border-slate-200 dark:border-slate-800 shadow-lg">
        <CardContent className="p-0 h-full">
          <ScrollArea ref={scrollAreaRef} className="h-full p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xs">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-2 ${
                        message.role === "user"
                          ? "text-blue-100"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarFallback className="bg-slate-600 text-white text-xs">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xs">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Input */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-lg mt-4">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about the podcast episodes..."
              className="flex-1 border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
