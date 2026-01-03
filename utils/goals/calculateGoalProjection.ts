import { Expense } from "@/models/expense.model";
import { Goal } from "@/models/goal.model";

export type GoalProjection = {
  totalSaved: number;

  daysPassed: number;
  daysRemaining: number;
  totalDays: number;

  requiredDaily: number;   // bundan sonra gereken
  actualDaily: number;     // şimdiye kadarki ortalama

  baselineDaily?: number;  // kullanıcının günlük kapasitesi

  paceRatio: number;       // actual / required
  baselineRatio?: number;  // baseline / required

  feasibility: "good" | "tight" | "heavy";
  riskLevel: "low" | "medium" | "high";

  willMissGoal: boolean;

  message: string;
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

  /* =========================
     Risk & Feasibility
  ========================= */

  let feasibility: GoalProjection["feasibility"];
  let riskLevel: GoalProjection["riskLevel"];
  let message: string;

  if (paceRatio >= 1.1) {
    feasibility = "good";
    riskLevel = "low";
    message = "You are ahead of schedule. Keep this pace.";
  } else if (paceRatio >= 0.8) {
    feasibility = "tight";
    riskLevel = "medium";
    message = "You’re slightly behind, but this goal is still realistic.";
  } else {
    feasibility = "heavy";
    riskLevel = "high";
    message =
      "At this pace, reaching this goal may be difficult without adjustments.";
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

    message,
  };
}