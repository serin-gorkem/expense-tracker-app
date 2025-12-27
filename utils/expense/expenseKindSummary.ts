import { Expense, ExpenseKind } from "@/models/expense.model";

export function calculateByKind(expenses: Expense[]) {
  return expenses.reduce(
    (acc, e) => {
      acc[e.kind] += e.amount;
      return acc;
    },
    {
      behavioral: 0,
      structural: 0,
    } as Record<ExpenseKind, number>
  );
}