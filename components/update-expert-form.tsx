"use client";

import type React from "react";

import type { Expert, Episode } from "@/utils/models";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { DeleteExpertDialog } from "./delete-expert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

  const handleDeleteExpert = async (expertId: string) => {
    setIsDeletingExpert(true);
    setError("");

    try {
      const response = await apiDeleteExpert(expertId);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
        <motion.div
          className="text-center space-y-6 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-20 h-20 bg-gradient-to-br from-corporate-600 via-corporate-700 to-corporate-800 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-corporate-500/25"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Loader2 className="w-10 h-10 animate-spin text-white" />
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent mb-2">
              Loading Experts
            </h3>
            <p className="text-slate-600 dark:text-slate-300 font-medium">
              Fetching your AI experts...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Expert Selection View
  if (!selectedExpert) {
    return (
      <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
        <motion.div
          className="w-full max-w-6xl relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-corporate-600 via-corporate-700 to-corporate-800 rounded-2xl mb-6 shadow-xl shadow-corporate-500/25"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <TrendingUp className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent font-heading mb-2">
              Update Expert Knowledge
            </h1>

            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-corporate-600 dark:text-corporate-400" />
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                Manage Your AI Experts
              </p>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Powered by{" "}
              <span className="text-corporate-600 dark:text-corporate-400 font-semibold">
                Inat Networks
              </span>
            </p>
          </motion.div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="shadow-2xl border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl overflow-hidden">
              {experts.length > 0 && (
                <CardHeader className="pb-6 pt-8 px-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-heading mb-2">
                      Select Expert to Update
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      Choose an expert to manage episodes and content
                    </p>
                  </div>
                </CardHeader>
              )}

              <CardContent className="px-8 pb-8">
                {/* Error Alert */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-8"
                    >
                      <Alert className="border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50 rounded-xl">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        <AlertDescription className="text-red-700 dark:text-red-300 font-medium ml-2">
                          {error}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                {experts.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Bot className="w-12 h-12 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      No Experts Found
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Create your first expert to start managing episodes
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {experts.map((expert, index) => (
                      <motion.div
                        key={expert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card
                          className={`group relative overflow-hidden border-slate-200 dark:border-slate-800 hover:shadow-xl hover:shadow-corporate-500/10 dark:hover:shadow-corporate-500/5 transition-all duration-300 hover:-translate-y-1 cursor-pointer backdrop-blur-sm bg-white/80 dark:bg-slate-900/80`}
                          onClick={() => handleSelectExpert(expert)}
                        >
                          <div
                            className={
                              "absolute inset-0 bg-gradient-to-br from-corporate-50/20 to-white/20 dark:from-corporate-950/10 dark:to-slate-900/10 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                            }
                          />
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-corporate-600 to-corporate-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-corporate-500/25 transition-all duration-300">
                                <Bot className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-corporate-600 dark:group-hover:text-corporate-400 transition-colors">
                                  {expert.name}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mt-2">
                                  {expert.description}
                                </p>
                                <div className="flex items-center gap-4 mt-4 text-xs text-slate-500 dark:text-slate-400">
                                  <div className="flex items-center gap-1">
                                    <Hash className="w-3 h-3" />
                                    <span>{expert.totalEpisodes} episodes</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Database className="w-3 h-3" />
                                    <span className="font-mono">
                                      {expert.name
                                        .toLowerCase()
                                        .replace(" ", "_")}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Expert Detail View with Episodes
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-2xl border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl overflow-hidden">
            <CardHeader className="pb-6 pt-8 px-8">
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="ghost"
                  onClick={handleBackToExperts}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Experts
                </Button>
                <DeleteExpertDialog
                  dialogText="Delete Expert"
                  deleteExpertDialog={deleteExpertDialog}
                  setDeleteExpertDialog={setDeleteExpertDialog}
                  selectedExpert={selectedExpert}
                  isDeletingExpert={isDeletingExpert}
                  handleDeleteExpert={handleDeleteExpert}
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-corporate-600 via-corporate-700 to-corporate-800 rounded-2xl flex items-center justify-center shadow-xl shadow-corporate-500/25">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
                    {selectedExpert.name}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    {selectedExpert.description}
                  </p>
                  <div className="flex items-center gap-6 mt-3 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Hash className="w-4 h-4" />
                      <span>{episodes.length} episodes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{selectedExpert.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Database className="w-4 h-4" />
                      <span className="font-mono">
                        {selectedExpert.name.toLowerCase().replace(" ", "_")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert className="border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50 rounded-xl">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-700 dark:text-red-300 font-medium ml-2">
                  {error}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert className="border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl">
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <AlertDescription className="text-emerald-700 dark:text-emerald-300 font-medium ml-2">
                  {success}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create New Episode Button */}
        {!isCreatingEpisode && !editingEpisode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-2xl border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl">
              <CardContent className="p-6">
                <Button
                  onClick={startCreatingEpisode}
                  className="w-full bg-gradient-to-r from-corporate-600 via-corporate-700 to-corporate-800 hover:from-corporate-700 hover:via-corporate-800 hover:to-corporate-900 text-white font-semibold shadow-xl hover:shadow-2xl hover:shadow-corporate-500/25 transition-all duration-300 rounded-xl border-0 h-14 text-lg group"
                >
                  <div className="flex items-center justify-center space-x-3 group-hover:space-x-4 transition-all duration-200">
                    <Plus className="w-5 h-5" />
                    <span>Create New Episode</span>
                    <Sparkles className="w-5 h-5" />
                  </div>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Create Episode Form */}
        {isCreatingEpisode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-2xl border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl overflow-hidden">
              <CardHeader className="pb-6 pt-8 px-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                        Create New Episode
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Add new content to expand your expert's knowledge
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={cancelCreating}
                    className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <form onSubmit={handleCreateEpisode} className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="new-title"
                      className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Episode Title *
                    </Label>
                    <Input
                      id="new-title"
                      value={newEpisodeTitle}
                      onChange={(e) => setNewEpisodeTitle(e.target.value)}
                      placeholder="Enter episode title"
                      className="h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-corporate-500 dark:focus:border-corporate-400 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all duration-200 focus:shadow-lg focus:shadow-corporate-500/10"
                      required
                      autoComplete="off"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="new-content"
                      className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Episode Content *
                    </Label>
                    <Textarea
                      id="new-content"
                      value={newEpisodeContent}
                      onChange={(e) => setNewEpisodeContent(e.target.value)}
                      placeholder="Paste your podcast transcript, summary, or any text content that will train this expert..."
                      rows={8}
                      className="border-2 border-slate-200 dark:border-slate-700 focus:border-corporate-500 dark:focus:border-corporate-400 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all duration-200 focus:shadow-lg focus:shadow-corporate-500/10 resize-none"
                      required
                      autoComplete="off"
                      spellCheck="false"
                      data-gramm="false"
                      data-gramm_editor="false"
                      data-enable-grammarly="false"
                    />
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>
                        The more detailed content you provide, the smarter your
                        expert becomes
                      </span>
                      <span>{newEpisodeContent.length} characters</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-corporate-600 via-corporate-700 to-corporate-800 hover:from-corporate-700 hover:via-corporate-800 hover:to-corporate-900 text-white font-semibold shadow-xl hover:shadow-2xl hover:shadow-corporate-500/25 transition-all duration-300 rounded-xl border-0 h-12 px-8"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          Create Episode
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelCreating}
                      disabled={isSubmitting}
                      className="h-12 px-6 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Edit Episode Form */}
        {editingEpisode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-2xl border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl overflow-hidden">
              <CardHeader className="pb-6 pt-8 px-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Edit3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                        Edit Episode
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Update existing episode content
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={cancelEditing}
                    className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <form onSubmit={handleUpdateEpisode} className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-title"
                      className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Episode Title *
                    </Label>
                    <Input
                      id="edit-title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Enter episode title"
                      className="h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-corporate-500 dark:focus:border-corporate-400 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all duration-200 focus:shadow-lg focus:shadow-corporate-500/10"
                      required
                      autoComplete="off"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-content"
                      className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Episode Content *
                    </Label>
                    <Textarea
                      id="edit-content"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="Enter episode content or transcript"
                      rows={8}
                      className="border-2 border-slate-200 dark:border-slate-700 focus:border-corporate-500 dark:focus:border-corporate-400 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all duration-200 focus:shadow-lg focus:shadow-corporate-500/10 resize-none"
                      required
                      autoComplete="off"
                      spellCheck="false"
                      data-gramm="false"
                      data-gramm_editor="false"
                      data-enable-grammarly="false"
                    />
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>
                        Update the content to improve your expert's knowledge
                      </span>
                      <span>{editContent.length} characters</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-corporate-600 via-corporate-700 to-corporate-800 hover:from-corporate-700 hover:via-corporate-800 hover:to-corporate-900 text-white font-semibold shadow-xl hover:shadow-2xl hover:shadow-corporate-500/25 transition-all duration-300 rounded-xl border-0 h-12 px-8"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          Update Episode
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelEditing}
                      disabled={isSubmitting}
                      className="h-12 px-6 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Episodes List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="shadow-2xl border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl">
            <CardHeader className="border-b border-slate-200 dark:border-slate-800 pb-6 pt-8 px-8">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                  Episodes ({episodes.length})
                </h2>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingEpisodes ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin text-corporate-600 mx-auto" />
                    <p className="text-slate-600 dark:text-slate-400">
                      Loading episodes...
                    </p>
                  </div>
                </div>
              ) : episodes.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    No Episodes Found
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    This expert doesn't have any episodes yet
                  </p>
                  <Button
                    onClick={startCreatingEpisode}
                    className="bg-gradient-to-r from-corporate-600 via-corporate-700 to-corporate-800 hover:from-corporate-700 hover:via-corporate-800 hover:to-corporate-900 text-white font-semibold shadow-xl hover:shadow-2xl hover:shadow-corporate-500/25 transition-all duration-300 rounded-xl border-0"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Episode
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {episodes.map((episode, index) => (
                    <motion.div
                      key={episode.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-8 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1 mb-3 text-lg">
                            {episode.title}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                            {episode.content}
                          </p>
                          <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Created {episode.createdAt}</span>
                            </div>
                            {episode.updatedAt !== episode.createdAt && (
                              <div className="flex items-center gap-2">
                                <Edit3 className="w-4 h-4" />
                                <span>Updated {episode.updatedAt}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditingEpisode(episode)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20 border-blue-200 dark:border-blue-800 bg-transparent rounded-xl h-10 px-4"
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
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-800 bg-transparent rounded-xl h-10 px-4"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-red-600">
                                  <AlertTriangle className="w-5 h-5" />
                                  Delete Episode
                                </DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete "
                                  {episode.title}"? This action cannot be
                                  undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setDeleteEpisodeDialog(null)}
                                  disabled={isDeletingEpisode === episode.id}
                                  className="border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-xl"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() =>
                                    handleDeleteEpisode(episode.id)
                                  }
                                  disabled={isDeletingEpisode === episode.id}
                                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-0 rounded-xl"
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
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
