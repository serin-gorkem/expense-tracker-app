// constants/streakMilestoneRegistry.ts
import { StreakMilestone } from "./streakMilestones";

export type Milestone = {
  id: string;
  type: "streak";
  value: StreakMilestone;

  // 🔑 i18n keys
  titleKey: string;
  descriptionKey: string;

  emoji: string;
};

export const STREAK_MILESTONE_REGISTRY: Record<StreakMilestone, Milestone> = {
  1: {
    id: "streak_1",
    type: "streak",
    value: 1,
    titleKey: "milestones.streak_1.title",
    descriptionKey: "milestones.streak_1.description",
    emoji: "🔥",
  },
  7: {
    id: "streak_7",
    type: "streak",
    value: 7,
    titleKey: "milestones.streak_7.title",
    descriptionKey: "milestones.streak_7.description",
    emoji: "💪",
  },
  21: {
    id: "streak_21",
    type: "streak",
    value: 21,
    titleKey: "milestones.streak_21.title",
    descriptionKey: "milestones.streak_21.description",
    emoji: "🧠",
  },
  30: {
    id: "streak_30",
    type: "streak",
    value: 30,
    titleKey: "milestones.streak_30.title",
    descriptionKey: "milestones.streak_30.description",
    emoji: "🏆",
  },
  60: {
    id: "streak_60",
    type: "streak",
    value: 60,
    titleKey: "milestones.streak_60.title",
    descriptionKey: "milestones.streak_60.description",
    emoji: "🚀",
  },
  90: {
    id: "streak_90",
    type: "streak",
    value: 90,
    titleKey: "milestones.streak_90.title",
    descriptionKey: "milestones.streak_90.description",
    emoji: "👑",
  },
};