import { Expense } from "@/models/expense.model";
import { LimitPeriod } from "@/models/limit.model";

export function filterExpensesForLimit(
  expenses: Expense[],
  period: LimitPeriod
): Expense[] {
  if (period === "monthly") {
    // monthly = behavioral + structural
    return expenses;
  }

  // daily & weekly = sadece behavioral
  return expenses.filter((e) => e.kind === "behavioral");
}