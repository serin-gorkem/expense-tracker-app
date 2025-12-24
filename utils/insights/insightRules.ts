// utils/insightRules.ts

import { InsightType } from "@/models/insight.model";
import { Expense } from "../../models/expense.model";

/**
 * Maximum number of insights shown at once
 */
export const MAX_VISIBLE_INSIGHTS = 2;

/**
 * Insight priority order (highest → lowest)
 */
export const INSIGHT_PRIORITY: InsightType[] = [
  "monthly_change",
  "behavioral_weekend_spike",
  "top_category",
  "weekly_average",
  "behavioral_over_limit_frequency",
  "behavioral_inconsistent_days",
  "behavioral_post_streak_break",
];

/**
 * Determines whether an insight is eligible to be shown.
 * This function does NOT calculate insight data.
 */
export function isInsightEligible(_type: InsightType, data: unknown): boolean {
  return data != null;
}

export function isWeekend(date: Date):boolean {
  return (date.getDay() === 0 || date.getDay() === 6)
}
function toDayKey(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function getExpensesByDay(expenses: Expense[]): Map<string, Expense[]> {
 const map = new Map<string, Expense[]>();
   for (const expense of expenses) {
    const key = toDayKey(new Date(expense.date));
    const list = map.get(key) ?? [];
    list.push(expense);
    map.set(key, list);
  }
  return map;
}

export function isOverLimitForDay(
  dayExpenses: Expense[],
  limit: number
): boolean {
  const total = dayExpenses.reduce((sum,e) => sum + Number(e.amount), 0 )
  return total > limit;
}

export function getDailyTotals(expenses: Expense[]): Map<string, number> {
  const byDay = getExpensesByDay(expenses);
  const totals = new Map<string,number>();


  for(const [key,dayExpenses] of byDay.entries()){
    const total = dayExpenses.reduce((sum,e) => sum + Number(e.amount),0);
    totals.set(key,total);
  }
  return totals;
}

export function getDaysWithOverLimit(
  expenses: Expense[],
  limit: number
): string[] {
  const byDay = getExpensesByDay(expenses);
  const result: string[] = [];

  for(const [key,dayExpenses] of byDay.entries()){
    if(isOverLimitForDay(dayExpenses,limit)){
      result.push(key);
    }
  }
  result.sort((a,b) => (a < b ? -1 : a > b ? 1 : 0));
  return result;
}

export function getSpendingByWeekday(
  expenses: Expense[]
): Record<number, number> {
  const totals: Record<number,number> = {
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0,
  }
  for(const e of expenses){
    const d = new Date(e.date);
    const day = d.getDay();
    totals[day] += Number(e.amount);
  }

  return totals;
}
