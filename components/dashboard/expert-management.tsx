"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExpertChat } from "./expert-chat";
import {
  Bot,
  MessageSquare,
  Trash2,
  Calendar,
  Hash,
  Loader2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Database,
  Zap,
} from "lucide-react";

interface Expert {
  id: string;
  name: string;
  description: string;
  episode_count: number;
  created_at: string;
  updated_at: string;
  namespace: string;
  processing_status: string;
}

interface ChatSession {
  sessionId: string;
  expert: Expert;
}

export function ExpertManagement() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isStartingChat, setIsStartingChat] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      setIsLoading(true);
      const response = await apiFetch("/api/experts");
      const data = await response.json();

      if (data.success) {
        setExperts(data.experts || []);
        setError("");
      } else {
        setError(data.error || "Failed to fetch experts from Pinecone");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartChat = async (expert: Expert) => {
    setIsStartingChat(expert.id);
    try {
      const response = await apiFetch(`/api/experts/${expert.id}/chat/start`, {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        setChatSession({
          sessionId: data.session_id,
          expert: data.expert,
        });
        setError("");
      } else {
        setError(data.error || "Failed to start chat session");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsStartingChat(null);
    }
  };

  const handleDeleteExpert = async (expertId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this expert? This will remove all associated data from Pinecone and cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(expertId);
    try {
      const response = await apiFetch(`/api/experts/${expertId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setExperts(experts.filter((expert) => expert.id !== expertId));
        if (selectedExpert?.id === expertId) {
          setSelectedExpert(null);
        }
        if (chatSession?.expert.id === expertId) {
          setChatSession(null);
        }
        setError("");
      } else {
        setError(data.error || "Failed to delete expert");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleBackToExperts = () => {
    setChatSession(null);
    setSelectedExpert(null);
  };

  if (chatSession) {
    return (
      <ExpertChat
        sessionId={chatSession.sessionId}
        expert={chatSession.expert}
        onBack={handleBackToExperts}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl flex items-center justify-center mx-auto">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
              Loading Experts
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Fetching your AI experts from Pinecone...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
        <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
        <AlertDescription className="text-red-700 dark:text-red-300 font-medium">
          {error}
        </AlertDescription>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchExperts}
          className="mt-3 border-red-200 text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/50 bg-transparent"
        >
          Try Again
        </Button>
      </Alert>
    );
  }

  if (experts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Bot className="w-12 h-12 text-slate-400" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          No Experts Found
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
          Create your first AI expert to start having intelligent conversations
          about your favorite podcast content. Each expert will have its own
          Pinecone namespace for optimal performance.
        </p>
        <Button
          onClick={() => (window.location.hash = "#create")}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Create Your First Expert
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {experts.map((expert) => (
          <Card
            key={expert.id}
            className="group relative overflow-hidden border-slate-200 dark:border-slate-800 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <CardHeader className="relative pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-white/20">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {expert.name}
                    </CardTitle>
                    {expert.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">
                        {expert.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative space-y-4">
              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Hash className="w-4 h-4" />
                  <span className="font-medium">
                    {expert.episode_count} episodes
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(expert.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Namespace Info */}
              <div className="flex items-center gap-2 text-xs">
                <Database className="w-3 h-3 text-blue-600" />
                <span className="text-slate-600 dark:text-slate-400 font-mono">
                  {expert.namespace}
                </span>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={`${
                    expert.processing_status === "completed"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
                  }`}
                >
                  <Zap className="w-3 h-3 mr-1" />
                  {expert.processing_status === "completed"
                    ? "Ready"
                    : "Processing"}
                </Badge>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <Button
                  onClick={() => handleStartChat(expert)}
                  disabled={
                    isStartingChat === expert.id ||
                    expert.processing_status !== "completed"
                  }
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200 group"
                >
                  {isStartingChat === expert.id ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <MessageSquare className="w-4 h-4 mr-2" />
                  )}
                  <span>Start Chat</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDeleteExpert(expert.id)}
                  disabled={isDeleting === expert.id}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 transition-colors"
                >
                  {isDeleting === expert.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
