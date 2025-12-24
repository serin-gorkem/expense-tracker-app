import { STREAK_MILESTONE_REGISTRY } from "@/constants/streakMilestoneRegistry";
import { getAchievedMilestones, saveMilestone } from "@/utils/streak/streakMilestoneStore";
import { useEffect, useState } from "react";
import { Milestone } from "../models/milestones.model";

export function useStreakMilestones(currentStreak: number) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    getAchievedMilestones().then(setMilestones);
  }, []);

  useEffect(() => {
    const entry = STREAK_MILESTONE_REGISTRY[currentStreak as keyof typeof STREAK_MILESTONE_REGISTRY];
    if (!entry) return;

    const milestone: Milestone = {
      day: currentStreak,
      title: entry.title,
      description: entry.description,
      achievedAt: new Date().toISOString(),
    };

    saveMilestone(milestone).then(() => {
      setMilestones((prev) =>
        prev.some((m) => m.day === milestone.day)
          ? prev
          : [...prev, milestone]
      );
    });
  }, [currentStreak]);

  return milestones;
}