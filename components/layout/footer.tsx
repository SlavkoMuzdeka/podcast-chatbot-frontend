"use client";

import { motion } from "framer-motion";
import { Brain, Globe, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative mt-auto border-t border-white/10 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-purple-900/95 backdrop-blur-xl"
    >
      {/* Animated Background Blobs - Matching Login Page */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 5,
          }}
          className="absolute top-1/2 right-10 w-32 h-32 bg-gradient-to-r from-purple-500/25 to-pink-500/25 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 10,
          }}
          className="absolute -bottom-8 left-1/3 w-36 h-36 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-full blur-2xl"
        />
      </div>

      {/* Gradient Overlay - Matching Login Page */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{
                  rotate: [0, -10, 10, -10, 0],
                  scale: 1.1,
                }}
                transition={{ duration: 0.6 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-2 rounded-xl shadow-2xl">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </motion.div>
              <div>
                <motion.h3
                  className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  AI Expert Hub
                </motion.h3>
                <p className="text-gray-300 text-sm">Powered by Intelligence</p>
              </div>
            </div>

            <motion.p
              className="text-gray-400 text-sm leading-relaxed max-w-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Transform your conversations with AI-powered expertise. Create and
              chat with intelligent experts.
            </motion.p>

            {/* Compact Stats */}
            <motion.div
              className="flex space-x-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="text-center">
                <div className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  1000+
                </div>
                <div className="text-gray-400 text-xs">Experts</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  50K+
                </div>
                <div className="text-gray-400 text-xs">Chats</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  99.9%
                </div>
                <div className="text-gray-400 text-xs">Uptime</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-4"
          >
            <div>
              <motion.h4
                className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Inat Networks
              </motion.h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Innovation in AI Technology. Building the future of intelligent
                conversations.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-400 hover:text-gray-300 transition-colors">
                <Globe className="w-4 h-4 text-blue-400" />
                <span className="text-sm">www.inatnetworks.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 hover:text-gray-300 transition-colors">
                <Mail className="w-4 h-4 text-purple-400" />
                <span className="text-sm">contact@inatnetworks.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 hover:text-gray-300 transition-colors">
                <MapPin className="w-4 h-4 text-pink-400" />
                <span className="text-sm">Global Operations</span>
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Key Features
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                "Custom AI Experts",
                "Real-time Chat",
                "Knowledge Base",
                "Analytics",
                "Enterprise Security",
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  className="flex items-center space-x-2 text-gray-400 hover:text-gray-300 transition-colors cursor-default"
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{ transitionDelay: `${0.6 + index * 0.05}s` }}
                >
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section with Gradient Border */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="pt-4 relative"
        >
          {/* Gradient Border */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <span className="text-gray-300 text-sm font-medium">
                © 2025 Inat Networks
              </span>
              <div className="h-3 w-px bg-gray-600" />
              <span className="text-gray-400 text-sm">All rights reserved</span>
            </motion.div>

            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <span className="text-gray-400 text-sm hover:text-gray-300 transition-colors cursor-default">
                Privacy
              </span>
              <div className="h-3 w-px bg-gray-600" />
              <span className="text-gray-400 text-sm hover:text-gray-300 transition-colors cursor-default">
                Terms
              </span>
              <div className="h-3 w-px bg-gray-600" />
              <span className="text-gray-400 text-sm hover:text-gray-300 transition-colors cursor-default">
                Security
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Glow Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50 blur-sm" />
    </motion.footer>
  );
}
