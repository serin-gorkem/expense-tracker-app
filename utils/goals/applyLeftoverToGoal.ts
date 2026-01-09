import { Expense } from "@/models/expense.model";
import { Goal } from "@/models/goal.model";
import * as Crypto from "expo-crypto";

export function buildGoalBoostExpense(
  amount: number,
  goal: Goal
): Expense {
  return {
    id: Crypto.randomUUID(),
    title: `Goal boost: ${goal.title}`,
    amount,
    category: "other",
    isGoalBoost: true,
    boostAmount: amount,
    goalId: goal.id,
    date: new Date().toISOString(),
    kind: "goal",
  };
}