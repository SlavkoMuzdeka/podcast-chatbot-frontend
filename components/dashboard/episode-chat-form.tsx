"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, MessageSquare, CheckCircle } from "lucide-react";
import { apiFetch } from "@/utils/api";
import { EpisodeChat } from "./episode-chat";

export function EpisodeChatForm() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [chatSession, setChatSession] = useState<{
    sessionId: string;
    episode: {
      id: string;
      title: string;
      url: string;
      processed: boolean;
    };
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await apiFetch("/api/episodes/chat/start", {
        method: "POST",
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setChatSession({
          sessionId: data.session_id,
          episode: data.episode,
        });
      } else {
        setError(data.error || "Failed to start episode chat");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setChatSession(null);
    setUrl("");
  };

  if (chatSession) {
    return (
      <EpisodeChat
        sessionId={chatSession.sessionId}
        episode={chatSession.episode}
        onBack={handleBackToForm}
      />
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="episode-url">Episode URL</Label>
          <Input
            id="episode-url"
            type="url"
            placeholder="https://youtube.com/watch?v=... or RSS episode link"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full"
            disabled={isLoading}
          />
        </div>

        {error && (
          <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
            <AlertDescription className="text-red-700 dark:text-red-300">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          disabled={!url.trim() || isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing Episode...
            </>
          ) : (
            <>
              <MessageSquare className="w-4 h-4 mr-2" />
              Start Chat
            </>
          )}
        </Button>
      </form>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Supported Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3" />
                YouTube videos
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3" />
                RSS feed episodes
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3" />
                Podcast platform links
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100">
              Chat Features
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-1 text-sm text-green-800 dark:text-green-200">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3" />
                Ask follow-up questions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3" />
                Reference timestamps
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3" />
                Clarify concepts
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
