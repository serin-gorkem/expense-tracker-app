import { Expense } from "@/models/expense.model";
import { Goal } from "@/models/goal.model";
import { calculateDailyRemaining } from "@/utils/daily/calculateDailyRemaning";

type DayEndCoorinatorProps = {
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
}: DayEndCoorinatorProps): DayEndEvent {
  const remainingAmount = calculateDailyRemaining(
    dailyLimit,
    expenses
  ).remaining;
  if (remainingAmount <= 0 || !activeGoal) {
    return { type: "NO_ACTION" };
  } else{
    const dailyTarget = activeGoal.targetAmount / activeGoal.durationInDays;
    const remainingToSave = activeGoal.targetAmount - (activeGoal.savedAmount + remainingAmount);
    const projectedRemainingDays = Math.ceil(remainingToSave / dailyTarget);
    return {
      type: "ASK_GOAL_APPLY",
      remainingAmount,
      projectedRemainingDays,
    };
  }
}
