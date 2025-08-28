"use client";

import type React from "react";

import type { CreateEpisode } from "@/utils/models";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { apiCreateExpert } from "@/utils/api";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Bot,
  Plus,
  User,
  Trash2,
  Loader2,
  FileText,
  Sparkles,
  AlertCircle,
} from "lucide-react";

interface UpdateExpertFormProps {
  onSuccess: () => void;
}

export function CreateExpertForm({ onSuccess }: UpdateExpertFormProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [episodes, setEpisodes] = useState<CreateEpisode[]>([
    { title: "", content: "" },
  ]);

  const addEpisode = () => {
    setEpisodes([...episodes, { title: "", content: "" }]);
  };

  const removeEpisode = (index: number) => {
    if (episodes.length > 1) {
      setEpisodes(episodes.filter((_, i) => i !== index));
    }
  };

  const updateEpisode = (
    index: number,
    field: keyof CreateEpisode,
    value: string
  ) => {
    const updatedEpisodes = episodes.map((episode, i) =>
      i === index ? { ...episode, [field]: value } : episode
    );
    setEpisodes(updatedEpisodes);
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Expert name is required");
      return;
    }

    if (!description.trim()) {
      setError("Expert description is required");
      return;
    }

    const validEpisodes = episodes.filter(
      (ep) => ep.title.trim() && ep.content.trim()
    );

    if (validEpisodes.length === 0) {
      setError("At least one episode with title and content is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const resp = await apiCreateExpert({
        name: name.trim(),
        description: description.trim(),
        episodes: validEpisodes,
      });

      if (resp.success) {
        resetForm();
        toast({
          title: "Expert Created Successfully!",
          description: `${name} has been created and is ready to chat.`,
          duration: 5000,
          variant: "success",
        });
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          onSuccess();
        }, 1500);
      } else {
        setError(resp.error || "Failed to create expert");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setEpisodes([{ title: "", content: "" }]);
    setError("");
  };

  const isFormValid =
    name.trim().length > 0 &&
    description.trim().length > 0 &&
    episodes.some((ep) => ep.title.trim() && ep.content.trim());

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        className="w-full max-w-4xl relative z-10"
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
            <Bot className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent font-heading mb-2">
            Create AI Expert
          </h1>

          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-corporate-600 dark:text-corporate-400" />
            <p className="text-slate-600 dark:text-slate-300 font-medium">
              Transform Content into Intelligence
            </p>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Powered by{" "}
            <span className="text-corporate-600 dark:text-corporate-400 font-semibold">
              Inat Networks
            </span>
          </p>
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="shadow-2xl border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl overflow-hidden">
            <CardHeader className="pb-6 pt-8 px-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-heading mb-2">
                  Expert Configuration
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Build your intelligent conversational expert
                </p>
              </div>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Expert Details */}
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-corporate-600 dark:text-corporate-400" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Expert Details
                    </h3>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Expert Name *
                      </Label>
                      <div className="relative group">
                        <Input
                          id="name"
                          type="text"
                          placeholder="e.g., Joe Rogan Expert, Tech Podcast Guru"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-corporate-500 dark:focus:border-corporate-400 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all duration-200 focus:shadow-lg focus:shadow-corporate-500/10"
                          required
                          autoComplete="off"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Description *
                      </Label>
                      <div className="relative group">
                        <Input
                          id="description"
                          type="text"
                          placeholder="Brief description of expertise area"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-corporate-500 dark:focus:border-corporate-400 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all duration-200 focus:shadow-lg focus:shadow-corporate-500/10"
                          required
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Episodes Section */}
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-corporate-600 dark:text-corporate-400" />
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Training Content
                      </h3>
                    </div>
                    <Button
                      type="button"
                      onClick={addEpisode}
                      variant="outline"
                      size="sm"
                      className="border-2 border-corporate-200 dark:border-corporate-800 text-corporate-600 dark:text-corporate-400 hover:bg-corporate-50 dark:hover:bg-corporate-950/20 bg-transparent rounded-xl"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Episode
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {episodes.map((episode, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-xl overflow-hidden">
                          <CardHeader className="pb-3 bg-gradient-to-r from-slate-100/50 to-slate-50/50 dark:from-slate-800/50 dark:to-slate-800/30">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-corporate-600 to-corporate-700 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                                  {index + 1}
                                </div>
                                <h4 className="font-semibold text-slate-900 dark:text-white">
                                  Episode {index + 1}
                                </h4>
                              </div>
                              {episodes.length > 1 && (
                                <Button
                                  type="button"
                                  onClick={() => removeEpisode(index)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4 p-6">
                            <div className="space-y-2">
                              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Episode Title *
                              </Label>
                              <Input
                                value={episode.title}
                                onChange={(e) =>
                                  updateEpisode(index, "title", e.target.value)
                                }
                                placeholder="Enter a descriptive title for this content"
                                className="h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-corporate-500 dark:focus:border-corporate-400 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all duration-200 focus:shadow-lg focus:shadow-corporate-500/10"
                                required
                                autoComplete="off"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Content (Summary or Full Transcript) *
                              </Label>
                              <Textarea
                                value={episode.content}
                                onChange={(e) =>
                                  updateEpisode(
                                    index,
                                    "content",
                                    e.target.value
                                  )
                                }
                                placeholder="Paste your podcast transcript, summary, or any text content that will train this expert..."
                                rows={6}
                                className="border-2 border-slate-200 dark:border-slate-700 focus:border-corporate-500 dark:focus:border-corporate-400 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all duration-200 focus:shadow-lg focus:shadow-corporate-500/10 resize-none"
                                required
                                autoComplete="off"
                                spellCheck="false"
                                data-gramm="false"
                                data-gramm_editor="false"
                                data-enable-grammarly="false"
                              />
                              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                                <span>
                                  The more detailed content you provide, the
                                  smarter your expert becomes
                                </span>
                                <span>{episode.content.length} characters</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Error Alert */}
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

                {/* Action Buttons */}
                <motion.div
                  className="flex items-center gap-4 pt-6 border-t border-slate-200 dark:border-slate-800"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={isSubmitting}
                    className="h-12 px-6 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
                  >
                    Reset Form
                  </Button>
                  <Button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="flex-1 h-12 bg-gradient-to-r from-corporate-600 via-corporate-700 to-corporate-800 hover:from-corporate-700 hover:via-corporate-800 hover:to-corporate-900 text-white font-semibold shadow-xl hover:shadow-2xl hover:shadow-corporate-500/25 transition-all duration-300 rounded-xl border-0 group"
                  >
                    <div className="flex items-center justify-center space-x-2 group-hover:space-x-3 transition-all duration-200">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Creating Expert...</span>
                        </>
                      ) : (
                        <>
                          <Bot className="w-5 h-5" />
                          <span>Create AI Expert</span>
                        </>
                      )}
                    </div>
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
