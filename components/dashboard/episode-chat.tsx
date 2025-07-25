"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea";
import { ArrowLeft, Send, ExternalLink, Loader2 } from "lucide-react";
import { apiFetch } from "@/utils/api";
import { MessageBubble } from "@/components/ui/message-bubble";

interface EpisodeChatProps {
  sessionId: string;
  episode: {
    id: string;
    title: string;
    url: string;
    processed: boolean;
  };
  onBack: () => void;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  pending?: boolean;
  error?: boolean;
}

export function EpisodeChat({ sessionId, episode, onBack }: EpisodeChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello! I'm ready to discuss the episode "${episode.title}". What would you like to know about it?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Add pending message
    const pendingMessage: Message = {
      id: `${Date.now()}-pending`,
      role: "assistant",
      content: "",
      pending: true,
    };
    setMessages((prev) => [...prev, pendingMessage]);

    try {
      const response = await apiFetch(`/api/chat/${sessionId}/message`, {
        method: "POST",
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.pending
              ? {
                  ...msg,
                  content: data.response,
                  pending: false,
                }
              : msg
          )
        );
      } else {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.pending
              ? {
                  ...msg,
                  content: "Sorry, I encountered an error. Please try again.",
                  pending: false,
                  error: true,
                }
              : msg
          )
        );
      }
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.pending
            ? {
                ...msg,
                content: "Network error. Please check your connection.",
                pending: false,
                error: true,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{episode.title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Episode Chat</span>
            <a
              href={episode.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary"
            >
              <ExternalLink className="w-3 h-3" />
              View Original
            </a>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-4 p-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>

        {/* Input */}
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <AutoResizeTextarea
                placeholder="Ask about the episode content..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxRows={4}
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
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
