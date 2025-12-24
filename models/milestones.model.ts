// models/milestones.model.ts
import { Milestone } from "@/constants/streakMilestoneRegistry";

export type AchievedMilestone = Milestone & {
  achievedAt: string; // ISO date
};