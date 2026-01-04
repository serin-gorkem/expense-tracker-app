// constants/achievementRegistry.ts

import { Achievement } from "@/models/achievement.model.ts";

/**
 * Achievement registry
 * Stable ids — NEVER change once released
 */
export const ACHIEVEMENT_REGISTRY: Record<string, Achievement> = {
  /* =====================
     STREAK
  ===================== */

  streak_1: {
    id: "streak_1",
    category: "streak",
    value: 1,
    title: "First Step",
    description: "Complete your first safe day.",
    emoji: "🔥",
    rarity: "common",
  },

  streak_7: {
    id: "streak_7",
    category: "streak",
    value: 7,
    title: "One Week Strong",
    description: "7 days in a row within your daily limit.",
    emoji: "💪",
    rarity: "rare",
  },

  streak_30: {
    id: "streak_30",
    category: "streak",
    value: 30,
    title: "Monthly Discipline",
    description: "30-day spending streak achieved.",
    emoji: "🏆",
    rarity: "epic",
  },

  streak_90: {
    id: "streak_90",
    category: "streak",
    value: 90,
    title: "Legendary Consistency",
    description: "90 days without breaking discipline.",
    emoji: "👑",
    rarity: "legendary",
  },

  /* =====================
     GOAL
  ===================== */

  goal_first: {
    id: "goal_first",
    category: "goal",
    value: 1,
    title: "Goal Setter",
    description: "Create and complete your first goal.",
    emoji: "🎯",
    rarity: "common",
  },

  goal_5: {
    id: "goal_5",
    category: "goal",
    value: 5,
    title: "Focused Planner",
    description: "Complete 5 financial goals.",
    emoji: "📈",
    rarity: "rare",
  },

  /* =====================
     CONSISTENCY
  ===================== */

  consistency_14: {
    id: "consistency_14",
    category: "consistency",
    value: 14,
    title: "Two-Week Control",
    description: "Stay consistent for 14 days.",
    emoji: "🧠",
    rarity: "rare",
  },
};