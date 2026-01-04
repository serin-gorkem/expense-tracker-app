import { Milestone } from "@/constants/streakMilestoneRegistry";

type ProgressResult = {
  current: number;
  target: number;
  ratio: number; // 0..1
};

export function getStreakProgress(
  milestone: Milestone,
  currentStreak: number
): ProgressResult {
  const target = milestone.value;
  const current = Math.min(currentStreak, target);

  return {
    current,
    target,
    ratio: Math.min(current / target, 1),
  };
}