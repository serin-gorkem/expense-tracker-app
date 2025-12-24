import { Expense } from "@/models/expense.model";

// utils/streak/dateHelpers.ts
export function normalizeDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function isSameDay(a: Date, b: Date): boolean {
  return normalizeDay(a).getTime() === normalizeDay(b).getTime();
}
export function getOldestExpenseDate(expenses: Expense[]): Date | null {
  if (expenses.length === 0) return null;

  let oldest = normalizeDay(new Date(expenses[0].date));

  for (let i = 1; i < expenses.length; i++) {
    const current = normalizeDay(new Date(expenses[i].date));
    if (current.getTime() < oldest.getTime()) {
      oldest = current;
    }
  }

  return oldest;
}