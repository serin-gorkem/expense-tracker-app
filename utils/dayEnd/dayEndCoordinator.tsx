import { Expense } from "@/models/expense.model";
import { Goal } from "@/models/goal.model";
import { calculateDailyRemaining } from "@/utils/daily/calculateDailyRemaning";

type DayEndCoordinatorProps = {
  dailyLimit: number;
  expenses: Expense[];
  activeGoal: Goal | null;
};

type DayEndEvent =
  | { type: "NO_ACTION" }
  | {
      type: "ASK_GOAL_APPLY";
      remainingAmount: number;
    };

export default function dayEndCoordinator({
  dailyLimit,
  expenses,
  activeGoal,
}: DayEndCoordinatorProps): DayEndEvent {
  const { remaining } = calculateDailyRemaining(
    dailyLimit,
    expenses
  );

  if (!Number.isFinite(remaining) || remaining <= 0) {
    return { type: "NO_ACTION" };
  }

  if (!activeGoal || activeGoal.status !== "active") {
    return { type: "NO_ACTION" };
  }

  return {
    type: "ASK_GOAL_APPLY",
    remainingAmount: remaining,
  };
}