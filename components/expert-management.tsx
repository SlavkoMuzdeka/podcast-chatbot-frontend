"use client";

import type { Expert } from "@/utils/models";

import { ExpertChat } from "./expert-chat";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiDeleteExpert, apiGetExperts } from "@/utils/api";
import { DeleteExpertDialog } from "./delete-expert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bot,
  Zap,
  Hash,
  Users,
  Check,
  Loader2,
  Calendar,
  Sparkles,
  Database,
  ArrowRight,
  AlertCircle,
  MessageSquare,
} from "lucide-react";

interface ChatSession {
  sessionId: string;
  experts: Expert[];
}

export function ExpertManagement({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void;
}) {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [selectedExperts, setSelectedExperts] = useState<Expert[]>([]);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingExpert, setIsDeletingExpert] = useState<boolean>(false);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [error, setError] = useState("");
  const [deleteExpertDialog, setDeleteExpertDialog] = useState(false);

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      setIsLoading(true);
      const response = await apiGetExperts();

      if (response.success) {
        setExperts(response.data.experts || []);
        setError("");
      } else {
        setError(response.error || "Failed to fetch experts");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpertSelection = (expert: Expert) => {
    setSelectedExperts((prev) => {
      const isSelected = prev.some((e) => e.id === expert.id);
      if (isSelected) {
        return prev.filter((e) => e.id !== expert.id);
      } else {
        return [...prev, expert];
      }
    });
  };

  const handleStartChat = async () => {
    if (selectedExperts.length === 0) return;

    setIsStartingChat(true);
    try {
      const sessionId = `session_${Date.now()}`;

      setChatSession({
        sessionId,
        experts: selectedExperts,
      });
      setError("");
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsStartingChat(false);
    }
  };

  const handleDeleteExpert = async (expertId: string) => {
    setIsDeletingExpert(true);
    try {
      const response = await apiDeleteExpert(expertId);

      if (response.success) {
        setExperts(experts.filter((expert) => expert.id !== expertId));
        setSelectedExperts((prev) =>
          prev.filter((expert) => expert.id !== expertId)
        );
        setError("");
      } else {
        setError(response.error || "Failed to delete expert");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsDeletingExpert(false);
    }
  };

  const handleBackToExperts = () => {
    setChatSession(null);
    setSelectedExperts([]);
  };

  if (chatSession) {
    return (
      <ExpertChat
        sessionId={chatSession.sessionId}
        experts={chatSession.experts}
        onBack={handleBackToExperts}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-corporate-100 to-corporate-200 dark:from-corporate-900/20 dark:to-corporate-800/20 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm border border-white/20">
            <Loader2 className="w-8 h-8 animate-spin text-corporate-600" />
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
      <Alert className="border-red-200 bg-red-50/80 dark:border-red-800 dark:bg-red-950/50 backdrop-blur-sm">
        <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
        <AlertDescription className="text-red-700 dark:text-red-300 font-medium">
          {error}
        </AlertDescription>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchExperts}
          className="mt-3 border-red-200 text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/50 bg-transparent backdrop-blur-sm"
        >
          Try Again
        </Button>
      </Alert>
    );
  }

  if (experts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gradient-to-br from-corporate-100 to-corporate-200 dark:from-corporate-800 dark:to-corporate-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg backdrop-blur-sm border border-white/20">
          <Bot className="w-12 h-12 text-corporate-400" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          No Experts Found
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
          Create your first AI expert to start having intelligent conversations
          about your favorite podcast content.
        </p>
        <Button
          onClick={() => setActiveTab("create-tab")}
          className="bg-gradient-to-r from-corporate-600 to-corporate-700 hover:from-corporate-700 hover:to-corporate-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
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
      {/* Selection Summary and Chat Button */}
      {selectedExperts.length > 0 && (
        <Card className="border-corporate-200 bg-gradient-to-br from-corporate-50/30 to-white/50 dark:border-corporate-800 dark:from-corporate-950/10 dark:to-slate-900/50 backdrop-blur-sm shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-corporate-600 to-corporate-700 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/20">
                  {selectedExperts.length === 1 ? (
                    <MessageSquare className="w-6 h-6 text-white" />
                  ) : (
                    <Users className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    {selectedExperts.length} Expert
                    {selectedExperts.length > 1 ? "s" : ""} Selected
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {selectedExperts.map((e) => e.name).join(", ")}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleStartChat}
                disabled={isStartingChat}
                className="bg-gradient-to-r from-corporate-600 to-corporate-700 hover:from-corporate-700 hover:to-corporate-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                {isStartingChat ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : selectedExperts.length === 1 ? (
                  <MessageSquare className="w-4 h-4 mr-2" />
                ) : (
                  <Users className="w-4 h-4 mr-2" />
                )}
                {selectedExperts.length === 1
                  ? "Start Chat"
                  : "Start Multi-Expert Chat"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Experts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {experts.map((expert) => {
          const isSelected = selectedExperts.some((e) => e.id === expert.id);

          return (
            <Card
              key={expert.id}
              className={`group relative overflow-hidden border-slate-200 dark:border-slate-800 hover:shadow-xl hover:shadow-corporate-500/10 dark:hover:shadow-corporate-500/5 transition-all duration-300 hover:-translate-y-1 cursor-pointer backdrop-blur-sm ${
                isSelected
                  ? "ring-2 ring-corporate-500 border-corporate-300 dark:border-corporate-600 bg-gradient-to-br from-corporate-50/20 to-white/60 dark:from-corporate-950/10 dark:to-slate-900/60"
                  : "bg-white/80 dark:bg-slate-900/80"
              }`}
              onClick={() => handleExpertSelection(expert)}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br from-corporate-50/20 to-white/20 dark:from-corporate-950/10 dark:to-slate-900/10 transition-opacity duration-300 ${
                  isSelected
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              />

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-corporate-600 rounded-full flex items-center justify-center z-10 shadow-lg backdrop-blur-sm border border-white/20">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              <CardHeader className="relative pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br from-corporate-600 via-corporate-700 to-corporate-800 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-white/20 backdrop-blur-sm ${
                        isSelected ? "scale-110" : ""
                      } transition-transform duration-300`}
                    >
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle
                        className={`text-lg font-bold text-slate-900 dark:text-white line-clamp-1 transition-colors duration-300 ${
                          isSelected
                            ? "text-corporate-600 dark:text-corporate-400"
                            : "group-hover:text-corporate-600 dark:group-hover:text-corporate-400"
                        }`}
                      >
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
                      {expert.totalEpisodes} episodes
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(expert.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Namespace Info */}
                <div className="flex items-center gap-2 text-xs">
                  <Database className="w-3 h-3 text-corporate-600" />
                  <span className="text-slate-600 dark:text-slate-400 font-mono">
                    {expert.name.toLowerCase().replace(/\s+/g, "_")}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 backdrop-blur-sm"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Ready
                  </Badge>

                  {/* Delete Button */}
                  {/* <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteExpert(expert.id);
                    }}
                    disabled={isDeleting === expert.id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 transition-colors backdrop-blur-sm"
                  >
                    {isDeleting === expert.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button> */}
                  <DeleteExpertDialog
                    deleteExpertDialog={deleteExpertDialog}
                    setDeleteExpertDialog={setDeleteExpertDialog}
                    selectedExpert={expert}
                    isDeletingExpert={isDeletingExpert}
                    handleDeleteExpert={handleDeleteExpert}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
