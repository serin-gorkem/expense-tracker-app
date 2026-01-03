// utils/goals/buildGoalInsights.ts
import { GoalInsight } from "@/models/goalInsight.model";
import { GoalProjection } from "./calculateGoalProjection";

export function buildGoalInsights(
  projection: GoalProjection
): GoalInsight[] {
  const insights: GoalInsight[] = [];

  // 1. Pace based
  if (projection.feasibility === "good") {
    insights.push({
      type: "ahead",
      title: "Ahead of schedule",
      description:
        "You are saving faster than required for this goal.",
    });
  }

  if (projection.feasibility === "tight") {
    insights.push({
      type: "on_track",
      title: "On track",
      description:
        "This goal is achievable, but consistency matters.",
    });
  }

  if (projection.feasibility === "heavy") {
    insights.push({
      type: "risk",
      title: "At risk",
      description:
        "At this pace, you may not reach the goal in time.",
    });
  }

  // 2. Time awareness
  if (projection.daysRemaining <= 5 && projection.feasibility !== "good") {
    insights.push({
      type: "behind",
      title: "Time is running out",
      description:
        "Only a few days left. Small daily changes could help.",
    });
  }

  // 3. Inactivity check
  if (projection.actualDaily === 0) {
    insights.push({
      type: "inactive",
      title: "No contributions yet",
      description:
        "This goal hasn’t received any contributions so far.",
    });
  }

  return insights;
}