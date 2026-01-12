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
      titleKey: "goalInsights.ahead.title",
      descriptionKey: "goalInsights.ahead.description",
    });
  }

  if (projection.feasibility === "tight") {
    insights.push({
      type: "on_track",
      titleKey: "goalInsights.on_track.title",
      descriptionKey: "goalInsights.on_track.description",
    });
  }

  if (projection.feasibility === "heavy") {
    insights.push({
      type: "risk",
      titleKey: "goalInsights.risk.title",
      descriptionKey: "goalInsights.risk.description",
    });
  }

  // 2. Time awareness
  if (projection.daysRemaining <= 5 && projection.feasibility !== "good") {
    insights.push({
      type: "behind",
      titleKey: "goalInsights.behind.title",
      descriptionKey: "goalInsights.behind.description",
    });
  }

  // 3. Inactivity check
  if (projection.actualDaily === 0) {
    insights.push({
      type: "inactive",
      titleKey: "goalInsights.inactive.title",
      descriptionKey: "goalInsights.inactive.description",
    });
  }

  return insights;
}