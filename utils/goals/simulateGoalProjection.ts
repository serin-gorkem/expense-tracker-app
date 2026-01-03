// utils/goals/simulateGoalProjection.ts
import { GoalProjection } from "./calculateGoalProjection";

export function simulateGoalProjection(
  base: GoalProjection,
  extraDaily: number
) {
  const simulatedActualDaily = base.actualDaily + extraDaily;

  const paceRatio =
    base.requiredDaily > 0
      ? simulatedActualDaily / base.requiredDaily
      : 1;

  let feasibility: GoalProjection["feasibility"];
  let message: string;

  if (paceRatio >= 1.1) {
    feasibility = "good";
    message = `With +${extraDaily}/day, this goal becomes comfortably achievable.`;
  } else if (paceRatio >= 0.7) {
    feasibility = "tight";
    message = `With +${extraDaily}/day, this goal is still achievable with focus.`;
  } else {
    feasibility = "heavy";
    message = `Even with +${extraDaily}/day, this goal remains challenging.`;
  }

  return {
    ...base,
    actualDaily: simulatedActualDaily,
    paceRatio: Number(paceRatio.toFixed(2)),
    feasibility,
    message,
  };
}