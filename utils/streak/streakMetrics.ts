// utils/streak/streakMetrics.ts
import { Expense } from "@/models/expense.model";
import { calculateLimitStatus } from "@/utils/limitCalculations";
import { normalizeDay } from "./dateHelpers";

export type StreakMetrics = {
  currentStreak: number;
  longestStreak: number;
  hasActiveStreak: boolean;
  lastBrokenAt: Date | null;
};

function getExpensesForDay(expenses: Expense[], day: Date): Expense[] {
  const target = normalizeDay(day);
  return expenses.filter((e) => {
    const d = normalizeDay(new Date(e.date));
    return d.getTime() === target.getTime();
  });
}

function isSafeDay(expenses: Expense[], day: Date, limitAmount: number): boolean {
  const dayExpenses = getExpensesForDay(expenses, day);
  if (dayExpenses.length === 0) return false;

  const status = calculateLimitStatus({
    expenses: dayExpenses,
    period: "daily",
    limitAmount,
  })?.status;

  return status === "safe";
}

function getOldestDay(expenses: Expense[]): Date | null {
  if (expenses.length === 0) return null;

  let oldest = normalizeDay(new Date(expenses[0].date));
  for (let i = 1; i < expenses.length; i++) {
    const d = normalizeDay(new Date(expenses[i].date));
    if (d.getTime() < oldest.getTime()) oldest = d;
  }
  return oldest;
}

export function calculateStreakMetrics({
  expenses,
  dailyLimit,
}: {
  expenses: Expense[];
  dailyLimit: number;
}): StreakMetrics {
  const today = normalizeDay(new Date());

  // 1) current streak: today -> backwards
  let currentStreak = 0;
  let lastBrokenAt: Date | null = null;

  let cursor = new Date(today);
  while (true) {
    const safe = isSafeDay(expenses, cursor, dailyLimit);

    if (!safe) {
      lastBrokenAt = cursor;
      break;
    }

    currentStreak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  // 2) longest streak: oldest day -> today (day-based, not expense-based)
  const oldest = getOldestDay(expenses);
  let longestStreak = 0;

  if (oldest) {
    let run = 0;
    const cur = new Date(oldest);

    while (normalizeDay(cur).getTime() <= today.getTime()) {
      if (isSafeDay(expenses, cur, dailyLimit)) {
        run += 1;
        if (run > longestStreak) longestStreak = run;
      } else {
        run = 0;
      }
      cur.setDate(cur.getDate() + 1);
    }
  }

  return {
    currentStreak,
    longestStreak,
    hasActiveStreak: currentStreak > 0,
    lastBrokenAt,
  };
}