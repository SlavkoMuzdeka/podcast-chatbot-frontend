import type React from "react";
import { User2 } from "lucide-react";

/**
 * @description Type definition for a bot configuration
 */
export type Bot = {
  id: string; // Unique identifier for the bot
  name: string; // Display name
  description: string; // Short description
  namespace: string; // Pinecone namespace to query for this bot
  icon: React.ComponentType; // Icon component to display
  systemPromptBeforeContext: string; // System prompt before the context
  systemPromptAfterContext: string; // System prompt after the context
};

export const promptBeforeContext: string =
  process.env.SYSTEM_PROMPT_BEFORE_CONTEXT!;
export const promptAfterContext: string =
  process.env.SYSTEM_PROMPT_AFTER_CONTEXT!;

/**
 * @description Array of bot configurations.
  Each bot represents a different persona or knowledge base
 */
export const bots: Bot[] = [
  {
    id: "empire",
    name: "Empire Podcast",
    description: "AI assistant",
    namespace: "empire",
    icon: User2,
    systemPromptBeforeContext: promptBeforeContext,
    systemPromptAfterContext: promptAfterContext,
  },
  {
    id: "jim_bianco",
    name: "Jim Bianco",
    description: "AI assistant",
    namespace: "jim_bianco",
    icon: User2,
    systemPromptBeforeContext: promptBeforeContext,
    systemPromptAfterContext: promptAfterContext,
  },
  {
    id: "chopping_block",
    name: "Chopping Block",
    description: "AI assistant",
    namespace: "chopping_block",
    icon: User2,
    systemPromptBeforeContext: promptBeforeContext,
    systemPromptAfterContext: promptAfterContext,
  },
  {
    id: "matt_houdan",
    name: "Matt Hougan",
    description: "AI assistant",
    namespace: "matt_houdan",
    icon: User2,
    systemPromptBeforeContext: promptBeforeContext,
    systemPromptAfterContext: promptAfterContext,
  },
  {
    id: "hivemind",
    name: "Hivemind",
    description: "AI assistant",
    namespace: "hivemind",
    icon: User2,
    systemPromptBeforeContext: promptBeforeContext,
    systemPromptAfterContext: promptAfterContext,
  },
  {
    id: "lyn_alden",
    name: "Lyn Alden",
    description: "AI assistant",
    namespace: "lyn_alden",
    icon: User2,
    systemPromptBeforeContext: promptBeforeContext,
    systemPromptAfterContext: promptAfterContext,
  },
  {
    id: "on_the_brink",
    name: "On the Brink",
    description: "AI assistant",
    namespace: "on_the_brink",
    icon: User2,
    systemPromptBeforeContext: promptBeforeContext,
    systemPromptAfterContext: promptAfterContext,
  },
  {
    id: "bell_curve",
    name: "Bell Curve",
    description: "AI assistant",
    namespace: "bell_curve",
    icon: User2,
    systemPromptBeforeContext: promptBeforeContext,
    systemPromptAfterContext: promptAfterContext,
  },
];

/**
 * @description Helper function to get a bot by its ID
 * @param id - The ID of the bot to find
 * @returns The bot configuration or undefined if not found
 */
export function getBotById(id: string): Bot | undefined {
  return bots.find((bot) => bot.id === id);
}
