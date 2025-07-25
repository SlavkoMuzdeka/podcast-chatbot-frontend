"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  MessageSquare,
  Edit,
  Trash2,
  Users,
  Calendar,
} from "lucide-react";
import { apiFetch } from "@/utils/api";
import { ExpertChat } from "./expert-chat";

interface Expert {
  id: string;
  name: string;
  description: string;
  episode_count: number;
  created_at: string;
  updated_at: string;
}

export function ExpertManagement() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [chatSession, setChatSession] = useState<{
    sessionId: string;
    expert: Expert;
  } | null>(null);

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      const response = await apiFetch("/api/experts");
      const data = await response.json();

      if (data.success) {
        setExperts(data.experts);
      } else {
        setError(data.error || "Failed to fetch experts");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartChat = async (expert: Expert) => {
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
      } else {
        setError(data.error || "Failed to start chat");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  const handleDeleteExpert = async (expertId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this expert? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await apiFetch(`/api/experts/${expertId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setExperts(experts.filter((expert) => expert.id !== expertId));
      } else {
        setError(data.error || "Failed to delete expert");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  if (chatSession) {
    return (
      <ExpertChat
        sessionId={chatSession.sessionId}
        expert={chatSession.expert}
        onBack={() => setChatSession(null)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading experts...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
          <AlertDescription className="text-red-700 dark:text-red-300">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {experts.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Experts Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first AI expert by aggregating knowledge from podcast
              episodes.
            </p>
            <Button onClick={() => (window.location.hash = "#create-expert")}>
              Create Your First Expert
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {experts.map((expert) => (
            <Card key={expert.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{expert.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {expert.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {expert.episode_count} episodes
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(expert.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleStartChat(expert)}
                    className="flex-1"
                    size="sm"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedExpert(expert)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteExpert(expert.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
