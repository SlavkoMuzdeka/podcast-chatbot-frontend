"use client";

import type { DashboardStats } from "@/utils/models";

import { apiGetStats } from "@/utils/api";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { ExpertManagement } from "./expert-management";
import { motion, AnimatePresence } from "framer-motion";
import { CreateExpertForm } from "./create-expert-form";
import { UpdateExpertForm } from "./update-expert-form";
import { Bot, Plus, Users, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function MainDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("experts-tab");
  const [stats, setStats] = useState<DashboardStats>({
    total_experts: 0,
    total_episodes: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoadingStats(true);
      const response = await apiGetStats(user?.id || "");

      if (response.success && response.data?.stats) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const refreshStats = () => {
    fetchDashboardStats();
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    gradient,
    delay = 0,
  }: {
    title: string;
    value: number;
    icon: any;
    trend?: string;
    gradient: string;
    delay?: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group"
    >
      <Card className="relative overflow-hidden border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl hover:shadow-2xl hover:shadow-corporate-500/10 transition-all duration-500 rounded-2xl">
        {/* Animated Border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
          <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-200">
            {title}
          </CardTitle>
          <motion.div
            className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Icon className="h-5 w-5 text-white" />
          </motion.div>
        </CardHeader>
        <CardContent className="relative z-10">
          <motion.div
            className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
          >
            {isLoadingStats ? (
              <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-8 w-16 rounded" />
            ) : (
              value.toLocaleString()
            )}
          </motion.div>
          {trend && (
            <motion.p
              className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: delay + 0.4 }}
            >
              {trend}
            </motion.p>
          )}
        </CardContent>

        {/* Hover Glow Effect */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 -z-10`}
        />
      </Card>
    </motion.div>
  );

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 relative overflow-hidden">
      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Stats Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 mb-12">
          <StatCard
            title="AI Experts"
            value={stats.total_experts}
            icon={Bot}
            trend="Active specialists"
            gradient="from-corporate-600 to-corporate-700"
            delay={0.1}
          />
          <StatCard
            title="Episodes Processed"
            value={stats.total_episodes}
            icon={BarChart3}
            trend="Content analyzed"
            gradient="from-emerald-600 to-emerald-700"
            delay={0.2}
          />
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Card className="border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="border-b border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-r from-slate-50/80 via-white/80 to-slate-50/80 dark:from-slate-800/50 dark:via-slate-900/50 dark:to-slate-800/50 backdrop-blur-sm">
                <div className="px-8 py-6">
                  <TabsList className="grid w-full grid-cols-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl rounded-2xl border-0 p-2 h-16">
                    <TabsTrigger
                      value="experts-tab"
                      className="flex items-center gap-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-corporate-600 data-[state=active]:to-corporate-700 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-corporate-500/25 rounded-xl transition-all duration-300 font-semibold h-12 text-sm"
                    >
                      <Users className="w-4 h-4" />
                      <span className="hidden sm:inline">My Experts</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="create-tab"
                      className="flex items-center gap-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-700 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-emerald-500/25 rounded-xl transition-all duration-300 font-semibold h-12 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">Create Expert</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="update-tab"
                      className="flex items-center gap-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-purple-500/25 rounded-xl transition-all duration-300 font-semibold h-12 text-sm"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span className="hidden sm:inline">Update Expert</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <div className="p-8">
                <AnimatePresence mode="wait">
                  <TabsContent
                    value="experts-tab"
                    className="mt-0"
                    key="experts-tab"
                  >
                    <motion.div
                      variants={tabVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.5 }}
                      className="space-y-8"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                            Your AI Experts
                          </h2>
                          <p className="text-slate-600 dark:text-slate-400 text-lg mt-1">
                            Manage and chat with your podcast experts
                          </p>
                        </div>
                      </div>
                      <ExpertManagement setActiveTab={setActiveTab} />
                    </motion.div>
                  </TabsContent>

                  <TabsContent
                    value="create-tab"
                    className="mt-0"
                    key="create-tab"
                  >
                    <motion.div
                      variants={tabVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.5 }}
                      className="space-y-8"
                    >
                      <CreateExpertForm
                        onSuccess={() => {
                          setActiveTab("experts-tab");
                          refreshStats();
                        }}
                      />
                    </motion.div>
                  </TabsContent>

                  <TabsContent
                    value="update-tab"
                    className="mt-0"
                    key="update-tab"
                  >
                    <motion.div
                      variants={tabVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.5 }}
                      className="space-y-8"
                    >
                      <UpdateExpertForm
                        onSuccess={() => {
                          setActiveTab("experts-tab");
                          refreshStats();
                        }}
                      />
                    </motion.div>
                  </TabsContent>
                </AnimatePresence>
              </div>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
