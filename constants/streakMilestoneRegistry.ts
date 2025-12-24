// constants/streakMilestoneRegistry.ts
import { StreakMilestone } from "./streakMilestones";

export type Milestone = {
  id: string;
  type: "streak";
  value: StreakMilestone;
  title: string;
  description: string;
  emoji: string;
};

export const STREAK_MILESTONE_REGISTRY: Record<StreakMilestone, Milestone> = {
  1: {
    id: "streak_1",
    type: "streak",
    value: 1,
    title: "First Step",
    description: "You completed your first safe day.",
    emoji: "🔥",
  },
  7: {
    id: "streak_7",
    type: "streak",
    value: 7,
    title: "One Week Strong",
    description: "7 days in a row within your limit.",
    emoji: "💪",
  },
  21: {
    id: "streak_21",
    type: "streak",
    value: 21,
    title: "Habit Formed",
    description: "21 day streak achieved.",
    emoji: "🧠",
  },
  30: {
    id: "streak_30",
    type: "streak",
    value: 30,
    title: "Monthly Discipline",
    description: "30 days of consistency.",
    emoji: "🏆",
  },
  60: {
    id: "streak_60",
    type: "streak",
    value: 60,
    title: "Unstoppable",
    description: "60 day streak. Impressive.",
    emoji: "🚀",
  },
  90: {
    id: "streak_90",
    type: "streak",
    value: 90,
    title: "Legendary",
    description: "90 days without breaking discipline.",
    emoji: "👑",
  },
};