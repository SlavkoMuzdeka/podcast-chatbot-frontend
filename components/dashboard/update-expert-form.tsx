"use client";

import type React from "react";

import type { Expert, Episode } from "@/utils/models";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  apiGetExperts,
  apiGetEpisodes,
  apiDeleteExpert,
  apiDeleteEpisode,
  apiCreateEpisode,
  apiUpdateEpisode,
} from "@/utils/api";
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  X,
  Bot,
  Hash,
  Plus,
  Save,
  Edit3,
  Trash2,
  Loader2,
  FileText,
  Calendar,
  Sparkles,
  Database,
  ArrowLeft,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";

interface UpdateExpertFormProps {
  onSuccess: () => void;
}

export function UpdateExpertForm({ onSuccess }: UpdateExpertFormProps) {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isCreatingEpisode, setIsCreatingEpisode] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);

  // Form states
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [newEpisodeTitle, setNewEpisodeTitle] = useState("");
  const [newEpisodeContent, setNewEpisodeContent] = useState("");

  // Loading states
  const [isLoadingExperts, setIsLoadingExperts] = useState(true);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingExpert, setIsDeletingExpert] = useState(false);
  const [isDeletingEpisode, setIsDeletingEpisode] = useState<string | null>(
    null
  );

  // UI states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteExpertDialog, setDeleteExpertDialog] = useState(false);
  const [deleteEpisodeDialog, setDeleteEpisodeDialog] = useState<string | null>(
    null
  );

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      setIsLoadingExperts(true);
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
      setIsLoadingExperts(false);
    }
  };

  const fetchEpisodes = async (expertId: string) => {
    try {
      setIsLoadingEpisodes(true);
      const response = await apiGetEpisodes(expertId);
      console.log(response);
      if (response.success) {
        setEpisodes(response.data.episodes || []);
        setError("");
      } else {
        setError(response.error || "Failed to fetch episodes");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoadingEpisodes(false);
    }
  };

  const handleSelectExpert = (expert: Expert) => {
    setSelectedExpert(expert);
    setEpisodes([]);
    setError("");
    setSuccess("");
    fetchEpisodes(expert.id);
  };

  const handleBackToExperts = () => {
    setSelectedExpert(null);
    setEpisodes([]);
    setEditingEpisode(null);
    setIsCreatingEpisode(false);
    setError("");
    setSuccess("");
    resetForms();
  };

  const resetForms = () => {
    setNewEpisodeTitle("");
    setNewEpisodeContent("");
    setEditTitle("");
    setEditContent("");
  };

  const handleCreateEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExpert) return;

    setError("");
    setSuccess("");

    if (!newEpisodeTitle.trim() || !newEpisodeContent.trim()) {
      setError("Both title and content are required");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiCreateEpisode(selectedExpert.id, {
        title: newEpisodeTitle.trim(),
        content: newEpisodeContent.trim(),
      });

      if (response.success) {
        setSuccess("Episode created successfully!");
        setNewEpisodeTitle("");
        setNewEpisodeContent("");
        setIsCreatingEpisode(false);
        fetchEpisodes(selectedExpert.id);
      } else {
        setError(response.error || "Failed to create episode");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEpisode || !selectedExpert) return;

    setError("");
    setSuccess("");

    if (!editTitle.trim() || !editContent.trim()) {
      setError("Both title and content are required");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiUpdateEpisode(
        selectedExpert.id,
        editingEpisode.id,
        {
          title: editTitle.trim(),
          content: editContent.trim(),
        }
      );

      if (response.success) {
        setSuccess("Episode updated successfully!");
        setEditingEpisode(null);
        resetForms();
        fetchEpisodes(selectedExpert.id);
      } else {
        setError(response.error || "Failed to update episode");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpert = async () => {
    if (!selectedExpert) return;

    setIsDeletingExpert(true);
    setError("");

    try {
      const response = await apiDeleteExpert(selectedExpert.id);

      console.log("Response:", response);

      if (response.success) {
        setSuccess("Expert deleted successfully!");
        handleBackToExperts();
        fetchExperts();
        onSuccess();
      } else {
        setError(response.error || "Failed to delete expert");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsDeletingExpert(false);
    }
  };

  const handleDeleteEpisode = async (episodeId: string) => {
    if (!selectedExpert) return;

    setIsDeletingEpisode(episodeId);
    setError("");

    try {
      const response = await apiDeleteEpisode(selectedExpert.id, episodeId);

      if (response.success) {
        setSuccess("Episode deleted successfully!");
        setDeleteEpisodeDialog(null);
        fetchEpisodes(selectedExpert?.id);
      } else {
        setError(response.error || "Failed to delete episode");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsDeletingEpisode(null);
    }
  };

  const startEditingEpisode = (episode: Episode) => {
    setEditingEpisode(episode);
    setEditTitle(episode.title);
    setEditContent(episode.content);
    setIsCreatingEpisode(false);
  };

  const cancelEditing = () => {
    setEditingEpisode(null);
    resetForms();
  };

  const startCreatingEpisode = () => {
    setIsCreatingEpisode(true);
    setEditingEpisode(null);
    resetForms();
  };

  const cancelCreating = () => {
    setIsCreatingEpisode(false);
    resetForms();
  };

  if (isLoadingExperts) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl flex items-center justify-center mx-auto">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
              Loading Experts
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Fetching your AI experts...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Expert Selection View
  if (!selectedExpert) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
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
                  Select an expert to manage episodes and content
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

            {experts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  No Experts Found
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Create your first expert to start managing episodes
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {experts.map((expert) => (
                  <Card
                    key={expert.id}
                    className="group cursor-pointer border-slate-200 dark:border-slate-800 hover:shadow-lg hover:shadow-purple-500/10 dark:hover:shadow-purple-500/5 transition-all duration-300 hover:-translate-y-1"
                    onClick={() => handleSelectExpert(expert)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {expert.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">
                            {expert.description}
                          </p>
                          <div className="flex items-center gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-1">
                              <Hash className="w-3 h-3" />
                              <span>{expert.totalEpisodes} episodes</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Database className="w-3 h-3" />
                              <span className="font-mono">
                                {expert.name.toLowerCase().replace(" ", "_")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Expert Detail View with Episodes
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToExperts}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Experts
              </Button>
            </div>
            <Dialog
              open={deleteExpertDialog}
              onOpenChange={setDeleteExpertDialog}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-800 bg-transparent"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Expert
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="w-5 h-5" />
                    Delete Expert
                  </DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete "{selectedExpert.name}"?
                    This will permanently remove the expert and all associated
                    episodes from your knowledge base. This action cannot be
                    undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteExpertDialog(false)}
                    disabled={isDeletingExpert}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteExpert}
                    disabled={isDeletingExpert}
                  >
                    {isDeletingExpert ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Expert
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                {selectedExpert.name}
              </CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {selectedExpert.description}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  <span>{episodes.length} episodes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{selectedExpert.createdAt}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  <span className="font-mono">
                    {selectedExpert.name.toLowerCase().replace(" ", "_")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Alerts */}
      {error && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-700 dark:text-red-300 font-medium">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/50">
          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <AlertDescription className="text-emerald-700 dark:text-emerald-300 font-medium">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {/* Create New Episode Button */}
      {!isCreatingEpisode && !editingEpisode && (
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-6">
            <Button
              onClick={startCreatingEpisode}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Episode
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Episode Form */}
      {isCreatingEpisode && (
        <Card className="border-slate-200 dark:border-slate-800 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                  Create New Episode
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={cancelCreating}
                className="text-slate-600 dark:text-slate-400"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleCreateEpisode} className="space-y-4">
              <div>
                <Label
                  htmlFor="new-title"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Episode Title *
                </Label>
                <Input
                  id="new-title"
                  value={newEpisodeTitle}
                  onChange={(e) => setNewEpisodeTitle(e.target.value)}
                  placeholder="Enter episode title"
                  className="mt-1 border-slate-300 dark:border-slate-700 focus:border-green-500 dark:focus:border-green-400"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="new-content"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Episode Content *
                </Label>
                <Textarea
                  id="new-content"
                  value={newEpisodeContent}
                  onChange={(e) => setNewEpisodeContent(e.target.value)}
                  placeholder="Enter episode content or transcript"
                  rows={6}
                  className="mt-1 border-slate-300 dark:border-slate-700 focus:border-green-500 dark:focus:border-green-400 resize-none"
                  required
                />
              </div>
              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Episode
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelCreating}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Edit Episode Form */}
      {editingEpisode && (
        <Card className="border-slate-200 dark:border-slate-800 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Edit3 className="w-4 h-4 text-white" />
                </div>
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                  Edit Episode
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={cancelEditing}
                className="text-slate-600 dark:text-slate-400"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleUpdateEpisode} className="space-y-4">
              <div>
                <Label
                  htmlFor="edit-title"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Episode Title *
                </Label>
                <Input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Enter episode title"
                  className="mt-1 border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="edit-content"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Episode Content *
                </Label>
                <Textarea
                  id="edit-content"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Enter episode content or transcript"
                  rows={6}
                  className="mt-1 border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 resize-none"
                  required
                />
              </div>
              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Episode
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelEditing}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Episodes List */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
              Episodes ({episodes.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoadingEpisodes ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
                <p className="text-slate-600 dark:text-slate-400">
                  Loading episodes...
                </p>
              </div>
            </div>
          ) : episodes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No Episodes Found
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                This expert doesn't have any episodes yet
              </p>
              <Button
                onClick={startCreatingEpisode}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Episode
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {episodes.map((episode) => (
                <div
                  key={episode.id}
                  className="p-6 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1 mb-2">
                        {episode.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-3">
                        {episode.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Created {episode.createdAt}</span>
                        </div>
                        {episode.updatedAt !== episode.createdAt && (
                          <div className="flex items-center gap-1">
                            <Edit3 className="w-3 h-3" />
                            <span>Updated {episode.updatedAt}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditingEpisode(episode)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Dialog
                        open={deleteEpisodeDialog === episode.id}
                        onOpenChange={(open) =>
                          setDeleteEpisodeDialog(open ? episode.id : null)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-800 bg-transparent"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-red-600">
                              <AlertTriangle className="w-5 h-5" />
                              Delete Episode
                            </DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete "{episode.title}"?
                              This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setDeleteEpisodeDialog(null)}
                              disabled={isDeletingEpisode === episode.id}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteEpisode(episode.id)}
                              disabled={isDeletingEpisode === episode.id}
                            >
                              {isDeletingEpisode === episode.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                <>
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Episode
                                </>
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
