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

  if (paceRatio >= 1.1) {
    feasibility = "good";
  } else if (paceRatio >= 0.7) {
    feasibility = "tight";
  } else {
    feasibility = "heavy";
  }

  return {
    ...base,
    actualDaily: simulatedActualDaily,
    paceRatio: Number(paceRatio.toFixed(2)),
    feasibility,
    extraDaily,
  };
}