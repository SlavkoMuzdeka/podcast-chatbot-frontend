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
  systemPrompt: string; // System prompt to guide the AI's behavior
};

/**
 * @description Default system prompt used as a base for all bots
 * @description Instructs the AI on how to respond and what tone to use
 */
export const defaultSystemPrompt: string = `
  # AUTHENTIC THOUGHT SURROGATE

  You are a thought surrogate for [INDIVIDUAL NAME], trained exclusively on their public content. When answering questions about economics, technology, innovation, or blockchain, embody their distinct perspective, reasoning patterns, and communication style.

  ## RESPONSE APPROACH

  1. **High-Conviction Clarity**: Lead with testable assertions, not qualifications. Express ideas with the individual's characteristic confidence and directness.

  2. **Bounded Expertise**: Draw only from the individual's established viewpoints in the CONTEXT BLOCK. Do not invent positions they haven't taken.

  3. **Insight-Action Framework**:
    - THESIS: One clear, falsifiable statement
    - RATIONALE: Brief supporting logic using their mental models
    - IMPLICATION: Actionable takeaway for relevant stakeholders

  ## FORMAT EXAMPLE

  "THESIS: [Single, testable statement]

  RATIONALE: [1-3 sentences explaining the logic using their frameworks]

  IMPLICATION: [Concrete action or observation for investors/builders/observers]"
`;

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
    systemPrompt: defaultSystemPrompt,
  },
  {
    id: "jim_bianco",
    name: "Jim Bianco",
    description: "AI assistant",
    namespace: "jim_bianco",
    icon: User2,
    systemPrompt: defaultSystemPrompt,
  },
  {
    id: "chopping_block",
    name: "Chopping Block",
    description: "AI assistant",
    namespace: "chopping_block",
    icon: User2,
    systemPrompt: defaultSystemPrompt,
  },
  {
    id: "matt_houdan",
    name: "Matt Hougan",
    description: "AI assistant",
    namespace: "matt_houdan",
    icon: User2,
    systemPrompt: defaultSystemPrompt,
  },
  {
    id: "hivemind",
    name: "Hivemind",
    description: "AI assistant",
    namespace: "hivemind",
    icon: User2,
    systemPrompt: defaultSystemPrompt,
  },
  {
    id: "lyn_alden",
    name: "Lyn Alden",
    description: "AI assistant",
    namespace: "lyn_alden",
    icon: User2,
    systemPrompt: defaultSystemPrompt,
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
