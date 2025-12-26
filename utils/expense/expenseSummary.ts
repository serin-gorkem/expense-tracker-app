import { Expense } from "@/models/expense.model";

export function calculateTotal(expenses: Expense[]): number {
    return expenses.reduce((total, expense) => {
      return total + expense.amount;
    }, 0);
}