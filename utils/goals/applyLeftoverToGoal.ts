import { CurrencyCode } from "@/models/currency.model";
import { Expense } from "@/models/expense.model";
import { Goal } from "@/models/goal.model";
import * as Crypto from "expo-crypto";

type GoalBoostFXInput = {
  amount: number;
  goal: Goal;
  fx: {
    currency: CurrencyCode;
    rate: number;
    baseAmount: number;
    status: "live" | "cached" | "locked";
    date: string;
  };
};
export function buildGoalBoostExpense({
  amount,
  goal,
  fx,
}: GoalBoostFXInput): Expense {
  return {
    id: Crypto.randomUUID(),
    title: `Goal: ${goal.title}`,
    amount, // native amount (örn. 90 USD)
    category: "other",
    date: new Date().toISOString(),

    kind: "goal",
    isGoalBoost: true,
    goalId: goal.id,

    fx: {
      currency: fx.currency,
      fxRate: fx.rate,
      baseAmount: fx.baseAmount, // 🔒 TEK GERÇEK
      fxStatus: fx.status,
      fxDate: fx.date,
    },
  };
}