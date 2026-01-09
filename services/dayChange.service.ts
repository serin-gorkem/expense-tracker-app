import { Expense } from "@/models/expense.model";
import { Goal } from "@/models/goal.model";
import dayEndCoordinator from "@/utils/dayEnd/dayEndCoordinator";
import { getExpensesByDay } from "@/utils/insights/insightRules";

type ServiceProps = {
  dailyLimit: number;
  expenses: Expense[];
  activeGoal: Goal | null;
  timeOfLatestDay: Date;
};
export type DayChangeResult =
  | { type: "NO_ACTION" }
  | { type: "ASK_GOAL_APPLY"; remainingAmount: number };

function toDayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function dayChangeService({
  dailyLimit,
  expenses,
  activeGoal,
  timeOfLatestDay,
}: ServiceProps): DayChangeResult {
  const today = new Date();

  // ❌ Gün değişmediyse hiçbir şey yapma
  if (today.toDateString() === timeOfLatestDay.toDateString()) {
    return { type: "NO_ACTION" };
  }

  if (!activeGoal || activeGoal.status !== "active") {
    return { type: "NO_ACTION" };
  }

  const expensesByDay = getExpensesByDay(expenses);

  const yesterdayKey = toDayKey(timeOfLatestDay);
  const yesterdayExpenses = expensesByDay.get(yesterdayKey) ?? [];

  const result = dayEndCoordinator({
    dailyLimit,
    expenses: yesterdayExpenses,
    activeGoal,
  });

  if (result.type === "ASK_GOAL_APPLY") {
    return { type: "ASK_GOAL_APPLY", remainingAmount: result.remainingAmount };
  } else {
    return { type: "NO_ACTION" };
  }
}