import { Expense } from "@/models/expense.model";
import { Goal } from "@/models/goal.model";

export type GoalProjection = {
  totalSaved: number;

  daysPassed: number;
  daysRemaining: number;
  totalDays: number;

  requiredDaily: number;
  actualDaily: number;

  baselineDaily?: number;

  paceRatio: number;
  baselineRatio?: number;

  feasibility: "good" | "tight" | "heavy";
  riskLevel: "low" | "medium" | "high";

  willMissGoal: boolean;
};

export function calculateGoalProjection(
  goal: Goal,
  expenses: Expense[],
  baselineDaily?: number,
  today: Date = new Date()
): GoalProjection {
  const msPerDay = 1000 * 60 * 60 * 24;
  const start = new Date(goal.startDate);

  const daysPassed = Math.max(
    1,
    Math.floor((today.getTime() - start.getTime()) / msPerDay)
  );

  const totalDays = goal.durationInDays;
  const daysRemaining = Math.max(totalDays - daysPassed, 0);

  const totalSaved = expenses
    .filter((e) => e.isGoalBoost && e.goalId === goal.id)
    .reduce((sum, e) => sum + (e.boostAmount ?? 0), 0);

  const remainingAmount = Math.max(goal.targetAmount - totalSaved, 0);

  const requiredDaily =
    daysRemaining > 0 ? remainingAmount / daysRemaining : 0;

  const actualDaily = totalSaved / daysPassed;

  const paceRatio =
    requiredDaily > 0 ? actualDaily / requiredDaily : 1;

  const baselineRatio =
    baselineDaily && requiredDaily > 0
      ? baselineDaily / requiredDaily
      : undefined;

  let feasibility: GoalProjection["feasibility"];
  let riskLevel: GoalProjection["riskLevel"];

  if (paceRatio >= 1.1) {
    feasibility = "good";
    riskLevel = "low";
  } else if (paceRatio >= 0.8) {
    feasibility = "tight";
    riskLevel = "medium";
  } else {
    feasibility = "heavy";
    riskLevel = "high";
  }

  const willMissGoal =
    daysRemaining === 0 && remainingAmount > 0
      ? true
      : baselineRatio !== undefined && baselineRatio < 0.9;

  return {
    totalSaved,

    daysPassed,
    daysRemaining,
    totalDays,

    requiredDaily: Math.ceil(requiredDaily),
    actualDaily: Math.ceil(actualDaily),

    baselineDaily,

    paceRatio: Number(paceRatio.toFixed(2)),
    baselineRatio:
      baselineRatio !== undefined
        ? Number(baselineRatio.toFixed(2))
        : undefined,

    feasibility,
    riskLevel,
    willMissGoal,
  };
}