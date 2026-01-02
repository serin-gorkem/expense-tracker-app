import { Expense } from "@/models/expense.model";

type DailyRemainingResult = {
  totalSpent: number;
  remaining: number;
};

export function calculateDailyRemaining(
  dailyLimit: number,
  expenses: Expense[]
): DailyRemainingResult {
    if (expenses.length === 0) {
        return {
            totalSpent: 0,
            remaining: dailyLimit,
        };
    }
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  if (dailyLimit <= 0) {
    return {
      totalSpent,
      remaining: 0,
    };
  }
  const remaining = Math.max(dailyLimit - totalSpent, 0);
  return {
    totalSpent,
    remaining,
  };
}
