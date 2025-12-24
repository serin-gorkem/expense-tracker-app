// utils/streak/streakCelebrationRules.ts
import { isStreakMilestone, StreakMilestone } from "@/constants/streakMilestones";

type Props = {
  prevStreak: number;
  currentStreak: number;
};

export type StreakCelebrationResult =
  | { type: "new_streak"; count: number }
  | { type: "milestone"; count: number; milestone: StreakMilestone };

export function streakCelebrationRules({ prevStreak, currentStreak }: Props): StreakCelebrationResult | null {
  if (currentStreak <= 0 || currentStreak <= prevStreak) return null;

  if (prevStreak === 0 && currentStreak === 1) {
    return { type: "new_streak", count: 1 };
  }

  if (isStreakMilestone(currentStreak) && currentStreak > prevStreak) {
    return { type: "milestone", count: currentStreak, milestone: currentStreak };
  }

  return null;
}