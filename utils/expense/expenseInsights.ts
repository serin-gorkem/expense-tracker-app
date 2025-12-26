// utils/expenseInsights.ts

import { Category, Expense } from "@/models/expense.model";
import { groupExpensesByMonth, groupExpensesByWeek } from "./expenseGrouping";
import { calculateTotal } from "./expenseSummary";

/**
 * Calculates month-over-month spending change.
 * Returns null if comparison is not possible.
 */
export function getMonthlyChangeInsightData(expenses: Expense[]): {
  currentMonthTotal: number;
  previousMonthTotal: number;
  percentageChange: number;
} | null {
  const groups = groupExpensesByMonth(expenses);

  if (groups.length < 2) return null;

  const current = groups[groups.length - 1];
  const previous = groups[groups.length - 2];

  const currentTotal = calculateTotal(current.expenses);
  const previousTotal = calculateTotal(previous.expenses);

  if (previousTotal === 0) return null;

  const percentageChange =
    ((currentTotal - previousTotal) / previousTotal) * 100;
  return {
    currentMonthTotal: currentTotal,
    previousMonthTotal: previousTotal,
    percentageChange: Math.round(percentageChange),
  };
}

/**
 * Finds the top spending category for the current month.
 */
export function getTopCategoryInsightData(expenses: Expense[]): {
  category: Category;
  total: number;
} | null {
  const groups = groupExpensesByMonth(expenses);
  if (groups.length === 0) return null;

  const currentMonth = groups[groups.length - 1];

  const totals: Record<Category, number> = {} as Record<Category, number>;

currentMonth.expenses.forEach((expense) => {
  totals[expense.category] = (totals[expense.category] ?? 0) + expense.amount;
});

  let topCategory: Category | null = null;
  let max = 0;

  Object.entries(totals).forEach(([category, total]) => {
    if (total > max) {
      max = total;
      topCategory = category as Category;
    }
  });

  if (!topCategory) return null;

  return {
    category: topCategory,
    total: Math.round(max),
  };
}

/**
 * Calculates weekly average spending.
 */
export function getWeeklyAverageInsightData(expenses: Expense[]): {
  weeklyAverage: number;
} | null {
  const groups = groupExpensesByWeek(expenses);
  if (groups.length === 0) return null;

  const weeklyTotals = groups.map((group) => {
    return calculateTotal(group.expenses);
  });

  const sum = weeklyTotals.reduce((a, b) => a + b, 0);
  const average = sum / weeklyTotals.length;

  return {
    weeklyAverage: average,
  };
}
