// constants/achievementRegistry.ts

import { Achievement } from "@/models/achievement.model.ts";

/**
 * Achievement registry
 * Stable ids — NEVER change once released
 * Texts are resolved via i18n
 */
export const ACHIEVEMENT_REGISTRY: Record<string, Achievement> = {
  /* =====================
     STREAK
  ===================== */

  streak_1: {
    id: "streak_1",
    category: "streak",
    value: 1,
    titleKey: "achievements.streak.first.title",
    descriptionKey: "achievements.streak.first.desc",
    emoji: "🔥",
    rarity: "common",
  },

  streak_7: {
    id: "streak_7",
    category: "streak",
    value: 7,
    titleKey: "achievements.streak.week.title",
    descriptionKey: "achievements.streak.week.desc",
    emoji: "💪",
    rarity: "rare",
  },

  streak_30: {
    id: "streak_30",
    category: "streak",
    value: 30,
    titleKey: "achievements.streak.month.title",
    descriptionKey: "achievements.streak.month.desc",
    emoji: "🏆",
    rarity: "epic",
  },

  streak_90: {
    id: "streak_90",
    category: "streak",
    value: 90,
    titleKey: "achievements.streak.legend.title",
    descriptionKey: "achievements.streak.legend.desc",
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
    titleKey: "achievements.goal.first.title",
    descriptionKey: "achievements.goal.first.desc",
    emoji: "🎯",
    rarity: "common",
  },

  goal_5: {
    id: "goal_5",
    category: "goal",
    value: 5,
    titleKey: "achievements.goal.five.title",
    descriptionKey: "achievements.goal.five.desc",
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
    titleKey: "achievements.consistency.twoWeeks.title",
    descriptionKey: "achievements.consistency.twoWeeks.desc",
    emoji: "🧠",
    rarity: "rare",
  },
};