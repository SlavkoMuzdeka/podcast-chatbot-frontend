"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpertManagement } from "./expert-management";
import { CreateExpertForm } from "./create-expert-form";
import { UpdateExpertForm } from "./update-expert-form";
import {
  Bot,
  Plus,
  Users,
  MessageSquare,
  TrendingUp,
  Sparkles,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import { apiFetch } from "@/utils/api";

interface DashboardStats {
  total_experts: number;
  total_episodes: number;
  total_chats: number;
  recent_activity: number;
}

export function MainDashboard() {
  const [activeTab, setActiveTab] = useState("experts");
  const [stats, setStats] = useState<DashboardStats>({
    total_experts: 0,
    total_episodes: 0,
    total_chats: 0,
    recent_activity: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await apiFetch("/api/dashboard/stats");
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      // Fallback to default stats if API fails
    } finally {
      setIsLoadingStats(false);
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    color = "blue",
  }: {
    title: string;
    value: number;
    icon: any;
    trend?: string;
    color?: string;
  }) => (
    <Card className="relative overflow-hidden border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {title}
        </CardTitle>
        <div
          className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/20`}
        >
          <Icon
            className={`h-4 w-4 text-${color}-600 dark:text-${color}-400`}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">
          {isLoadingStats ? "..." : value.toLocaleString()}
        </div>
        {trend && (
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {trend}
          </p>
        )}
      </CardContent>
      <div
        className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-${color}-500 to-${color}-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
      />
    </Card>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Manage your AI podcast experts and analyze conversations
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Experts"
            value={stats.total_experts}
            icon={Bot}
            trend="Active AI experts"
            color="blue"
          />
          <StatCard
            title="Episodes Processed"
            value={stats.total_episodes}
            icon={BarChart3}
            trend="Content analyzed"
            color="emerald"
          />
          <StatCard
            title="Conversations"
            value={stats.total_chats}
            icon={MessageSquare}
            trend="Total interactions"
            color="purple"
          />
          <StatCard
            title="Recent Activity"
            value={stats.recent_activity}
            icon={TrendingUp}
            trend="Last 7 days"
            color="orange"
          />
        </div>

        {/* Main Content */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-xl">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div className="px-6 py-4">
                <TabsList className="grid w-full grid-cols-3 bg-white dark:bg-slate-900 shadow-sm">
                  <TabsTrigger
                    value="experts"
                    className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:inline">My Experts</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="create"
                    className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Create Expert</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="update"
                    className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span className="hidden sm:inline">Update Expert</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <div className="p-6">
              <TabsContent value="experts" className="mt-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                        Your AI Experts
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400">
                        Manage and chat with your podcast experts
                      </p>
                    </div>
                    <Button
                      onClick={() => setActiveTab("create")}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Expert
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                  <ExpertManagement />
                </div>
              </TabsContent>

              <TabsContent value="create" className="mt-0">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                      Create New Expert
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      Build an AI expert from podcast episode content
                    </p>
                  </div>
                  <CreateExpertForm />
                </div>
              </TabsContent>

              <TabsContent value="update" className="mt-0">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                      Update Expert
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      Add new content to existing experts
                    </p>
                  </div>
                  <UpdateExpertForm onSuccess={() => setActiveTab("experts")} />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
