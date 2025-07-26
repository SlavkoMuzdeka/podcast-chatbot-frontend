"use client";

import { useState } from "react";
import { User } from "@/utils/models";
import { Header } from "@/components/layout/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Users, Plus, Bot } from "lucide-react";
import { EpisodeChatForm } from "./episode-chat-form";
import { ExpertManagement } from "./expert-management";
import { CreateExpertForm } from "./create-expert-form";

interface MainDashboardProps {
  user: User;
  onLogout: () => void;
}

export function MainDashboard({ user, onLogout }: MainDashboardProps) {
  const [activeTab, setActiveTab] = useState("episode-chat");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Header user={user} onLogout={onLogout} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px] mx-auto">
            <TabsTrigger
              value="episode-chat"
              className="flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Episode Chat</span>
            </TabsTrigger>
            <TabsTrigger value="experts" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">My Experts</span>
            </TabsTrigger>
            <TabsTrigger
              value="create-expert"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create Expert</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="episode-chat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Chat with Single Episode
                </CardTitle>
                <CardDescription>
                  Enter a podcast episode URL to start an AI-powered
                  conversation about its content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EpisodeChatForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-600" />
                  My AI Experts
                </CardTitle>
                <CardDescription>
                  Manage your custom AI experts created from multiple podcast
                  episodes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExpertManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create-expert" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-green-600" />
                  Create New Expert
                </CardTitle>
                <CardDescription>
                  Create a custom AI expert by aggregating knowledge from
                  multiple podcast episodes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreateExpertForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
