"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, X, CheckCircle } from "lucide-react";
import { apiFetch } from "@/utils/api";

export function CreateExpertForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [episodeUrls, setEpisodeUrls] = useState<string[]>([""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const addEpisodeUrl = () => {
    setEpisodeUrls([...episodeUrls, ""]);
  };

  const removeEpisodeUrl = (index: number) => {
    if (episodeUrls.length > 1) {
      setEpisodeUrls(episodeUrls.filter((_, i) => i !== index));
    }
  };

  const updateEpisodeUrl = (index: number, value: string) => {
    const newUrls = [...episodeUrls];
    newUrls[index] = value;
    setEpisodeUrls(newUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validUrls = episodeUrls.filter((url) => url.trim());
    if (!name.trim() || validUrls.length === 0) {
      setError("Please provide a name and at least one episode URL");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await apiFetch("/api/experts", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          episode_urls: validUrls,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setName("");
        setDescription("");
        setEpisodeUrls([""]);
      } else {
        setError(data.error || "Failed to create expert");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="expert-name">Expert Name *</Label>
            <Input
              id="expert-name"
              placeholder="e.g., AI Expert, Marketing Guru"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expert-description">Description</Label>
            <Input
              id="expert-description"
              placeholder="Brief description of the expert's expertise"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Episode URLs *</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addEpisodeUrl}
              disabled={isLoading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Episode
            </Button>
          </div>

          <div className="space-y-3">
            {episodeUrls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://youtube.com/watch?v=... or RSS episode link"
                  value={url}
                  onChange={(e) => updateEpisodeUrl(index, e.target.value)}
                  disabled={isLoading}
                  className="flex-1"
                />
                {episodeUrls.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeEpisodeUrl(index)}
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
            <AlertDescription className="text-red-700 dark:text-red-300">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50">
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-700 dark:text-green-300">
              Expert created successfully! You can now find it in the "My
              Experts" tab.
            </AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          disabled={
            isLoading ||
            !name.trim() ||
            episodeUrls.filter((url) => url.trim()).length === 0
          }
          className="w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Expert...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Create Expert
            </>
          )}
        </Button>
      </form>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">
            How it works
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li className="flex gap-2">
              <span className="font-medium">1.</span>
              Add multiple podcast episode URLs from YouTube or RSS feeds
            </li>
            <li className="flex gap-2">
              <span className="font-medium">2.</span>
              Our system processes and transcribes each episode
            </li>
            <li className="flex gap-2">
              <span className="font-medium">3.</span>
              Knowledge is aggregated and indexed for your custom expert
            </li>
            <li className="flex gap-2">
              <span className="font-medium">4.</span>
              Chat with your expert who answers based on all episode content
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
