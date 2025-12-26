// utils/expenseChart.ts
import { Category } from "@/models/expense.model";
import { GroupedExpenses } from "./expenseGrouping";

export type LineChartPoint = {
  label: string;
  value: number;
};

export type DonutChartItem = {
  label: string;
  value: number;
  color: string;
};

export const CATEGORY_COLORS: Record<string, string> = {
  food: "#4FA6A1",
  transport: "#5B728C",
  entertainment: "#6F6AD8",
  shopping: "#C9A24D",
  health: "#5FAF8E",
  bills: "#8A6F5E",
  education: "#4B7DBF",
  other: "#8B9098",
};

export function buildMonthlyCategoryDonutData(
  groups: GroupedExpenses[]
): DonutChartItem[] {
  const totals: Record<string, number> = {};

  groups.forEach((group) => {
    group.expenses.forEach((expense) => {
      totals[expense.category] =
        (totals[expense.category] ?? 0) + expense.amount;
    });
  });

  return Object.entries(totals)
    .map(([category, value]) => ({
      label: category as Category, // 🔥 FIX
      value: Math.round(value),
      color: CATEGORY_COLORS[category] ?? "#94A3B8",
    }))
    .sort((a, b) => b.value - a.value);
}

const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function buildWeeklyLineChartData(
  groups: GroupedExpenses[]
): LineChartPoint[] {
  const totals = new Map<number, number>();

  groups.forEach((group) => {
    if (!group.startOfWeek) return;

    group.expenses.forEach((expense) => {
      const date = new Date(expense.date);
      if (isNaN(date.getTime())) return;

      const dayIndex = (date.getDay() + 6) % 7; // Mon = 0
      const prev = totals.get(dayIndex) ?? 0;
      totals.set(dayIndex, prev + expense.amount);
    });
  });

  return WEEK_LABELS.map((label, i) => ({
    label,
    value: Math.round(totals.get(i) ?? 0),
  }));
}