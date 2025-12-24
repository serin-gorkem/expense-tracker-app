// hooks/useStreakMilestones.ts
import { STREAK_MILESTONE_REGISTRY } from "@/constants/streakMilestoneRegistry";
import { isStreakMilestone } from "@/constants/streakMilestones";
import { AchievedMilestone } from "@/models/milestones.model";
import {
  isMilestoneUnlocked,
  unlockMilestone
} from "@/utils/streak/streakMilestoneStore";
import { useEffect, useState } from "react";

export function useStreakMilestones(currentStreak: number) {
  const [newMilestone, setNewMilestone] =
    useState<AchievedMilestone | null>(null);

  useEffect(() => {
    if (!isStreakMilestone(currentStreak)) return;

    const base = STREAK_MILESTONE_REGISTRY[currentStreak];
    if (!base) return;

    (async () => {
      const alreadyUnlocked = await isMilestoneUnlocked(base.id);
      if (alreadyUnlocked) return;

      const achieved: AchievedMilestone = {
        ...base,
        achievedAt: new Date().toISOString(),
      };

      await unlockMilestone(achieved);
      setNewMilestone(achieved);
    })();
  }, [currentStreak]);

  return {
    newMilestone,
  };
}