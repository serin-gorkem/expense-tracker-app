import { Expense } from "@/models/expense.model";
import { Goal } from "@/models/goal.model";

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
      projectedRemainingDays: number;
    };

export default function dayEndCoordinator({
  dailyLimit,
  expenses,
  activeGoal,
}: DayEndCoordinatorProps): DayEndEvent {
  const spentToday = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingAmount = dailyLimit - spentToday;

  if (remainingAmount <= 0 || !activeGoal) {
    return { type: "NO_ACTION" };
  }

  // 🔥 Goal progress EXPENSE'TEN
  const savedAmount = expenses
    .filter((e) => e.isGoalBoost && e.goalId === activeGoal.id)
    .reduce((sum, e) => sum + (e.boostAmount ?? 0), 0);

  const dailyTarget =
    activeGoal.targetAmount / activeGoal.durationInDays;

  const remainingToSave =
    activeGoal.targetAmount - (savedAmount + remainingAmount);

  const projectedRemainingDays = Math.ceil(
    remainingToSave / dailyTarget
  );

  return {
    type: "ASK_GOAL_APPLY",
    remainingAmount,
    projectedRemainingDays,
  };
}