// utils/goals/calculateGoalHealth.ts
import { Expense } from "@/models/expense.model";
import { Goal } from "@/models/goal.model";
import { GoalHealth } from "@/models/goalHealth.model";

export function calculateGoalHealth(
  goal: Goal,
  expenses: Expense[],
  period: "weekly" | "monthly",
  today: Date = new Date()
): {
  health: GoalHealth;
  expected: number;
  actual: number;
} {
  const msPerDay = 1000 * 60 * 60 * 24;

  const start = new Date(goal.startDate);
  const daysPassed = Math.max(
    1,
    Math.floor((today.getTime() - start.getTime()) / msPerDay)
  );

  const totalSaved = expenses
    .filter((e) => e.isGoalBoost && e.goalId === goal.id)
    .reduce((s, e) => s + (e.boostAmount ?? 0), 0);

  const actualDaily = totalSaved / daysPassed;

  const daysInPeriod = period === "weekly" ? 7 : 30;
  const expected = actualDaily * daysInPeriod;

  const actual = expenses
    .filter((e) => e.isGoalBoost && e.goalId === goal.id)
    .filter((e) => {
      const d = new Date(e.date);
      const diff = (today.getTime() - d.getTime()) / msPerDay;
      return diff <= daysInPeriod;
    })
    .reduce((s, e) => s + (e.boostAmount ?? 0), 0);

  const ratio = actual / Math.max(expected, 1);

  let health: GoalHealth;

  if (ratio >= 1.2) health = "excellent";
  else if (ratio >= 0.9) health = "good";
  else if (ratio >= 0.6) health = "warning";
  else health = "bad";

  return {
    health,
    expected: Math.round(expected),
    actual: Math.round(actual),
  };
}