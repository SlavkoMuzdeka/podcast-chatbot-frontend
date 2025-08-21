"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Bot,
  FileText,
  TrendingUp,
  Plus,
} from "lucide-react";
import { apiFetch } from "@/utils/api";

interface Expert {
  id: string;
  name: string;
  description: string;
  episode_count: number;
}

interface UpdateExpertFormProps {
  onSuccess: () => void;
}

export function UpdateExpertForm({ onSuccess }: UpdateExpertFormProps) {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [selectedExpertId, setSelectedExpertId] = useState("");
  const [episodeTitle, setEpisodeTitle] = useState("");
  const [episodeContent, setEpisodeContent] = useState("");
  const [isLoadingExperts, setIsLoadingExperts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      const response = await apiFetch("/api/experts");
      const data = await response.json();

      if (data.success) {
        setExperts(data.experts || []);
      } else {
        setError("Failed to fetch experts");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoadingExperts(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedExpertId) {
      setError("Please select an expert to update");
      return;
    }

    if (!episodeTitle.trim()) {
      setError("Episode title is required");
      return;
    }

    if (!episodeContent.trim()) {
      setError("Episode content is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiFetch(
        `/api/experts/${selectedExpertId}/episodes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: episodeTitle.trim(),
            content: episodeContent.trim(),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess("Episode added successfully! Expert updated.");
        setEpisodeTitle("");
        setEpisodeContent("");
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setError(data.error || "Failed to update expert");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedExpertId("");
    setEpisodeTitle("");
    setEpisodeContent("");
    setError("");
    setSuccess("");
  };

  const selectedExpert = experts.find(
    (expert) => expert.id === selectedExpertId
  );

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="border-slate-200 dark:border-slate-800 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                Update Expert Knowledge
              </CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Add new episode content to expand your expert's knowledge base
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-700 dark:text-red-300 font-medium">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/50">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <AlertDescription className="text-emerald-700 dark:text-emerald-300 font-medium">
                {success}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Expert Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Select Expert
                </h3>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="expert"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Choose Expert to Update *
                </Label>
                {isLoadingExperts ? (
                  <div className="flex items-center gap-2 p-3 border border-slate-300 dark:border-slate-700 rounded-lg">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-slate-600 dark:text-slate-400">
                      Loading experts...
                    </span>
                  </div>
                ) : (
                  <Select
                    value={selectedExpertId}
                    onValueChange={setSelectedExpertId}
                  >
                    <SelectTrigger className="border-slate-300 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-400">
                      <SelectValue placeholder="Select an expert to update" />
                    </SelectTrigger>
                    <SelectContent>
                      {experts.map((expert) => (
                        <SelectItem key={expert.id} value={expert.id}>
                          <div className="flex items-center gap-2">
                            <Bot className="w-4 h-4 text-purple-600" />
                            <div>
                              <div className="font-medium">{expert.name}</div>
                              <div className="text-xs text-slate-500">
                                {expert.episode_count} episodes
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {selectedExpert && (
                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-slate-900 dark:text-white">
                      {selectedExpert.name}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {selectedExpert.description}
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    Current episodes: {selectedExpert.episode_count}
                  </p>
                </div>
              )}
            </div>

            {/* Episode Content */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  New Episode Content
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="title"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Episode Title *
                  </Label>
                  <Input
                    id="title"
                    value={episodeTitle}
                    onChange={(e) => setEpisodeTitle(e.target.value)}
                    placeholder="Enter the new episode title"
                    className="mt-1 border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="content"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Episode Content *
                  </Label>
                  <Textarea
                    id="content"
                    value={episodeContent}
                    onChange={(e) => setEpisodeContent(e.target.value)}
                    placeholder="Paste the episode summary or full transcript here..."
                    rows={8}
                    className="mt-1 border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 resize-none"
                    required
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    This content will be processed and added to the expert's
                    knowledge base in Pinecone.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <Button
                type="submit"
                disabled={isSubmitting || !selectedExpertId}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding Episode...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Episode
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isSubmitting}
                className="border-slate-300 dark:border-slate-700 bg-transparent"
              >
                Reset Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
