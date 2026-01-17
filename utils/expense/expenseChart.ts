// utils/expenseChart.ts
import { Category } from "@/models/expense.model";
import { GroupedExpenses } from "./expenseGrouping";
import { filterExpensesForLimit } from "./expenseLimitFilter";

export type LineChartPoint = {
  value: number;
  dayKey: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
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
      const amount =
        expense.fx?.baseAmount != null ? expense.fx.baseAmount : expense.amount;

      totals[expense.category] = (totals[expense.category] ?? 0) + amount;
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

const WEEK_KEYS: LineChartPoint["dayKey"][] = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
];

export function buildWeeklyLineChartData(
  groups: GroupedExpenses[]
): LineChartPoint[] {
  const totals = new Map<number, number>();

  groups.forEach((group) => {
    if (!group.startOfWeek) return;

    const filtered = filterExpensesForLimit(group.expenses, "weekly");

    filtered.forEach((expense) => {
      if (!expense.fx || expense.fx.baseAmount == null) return;

      const date = new Date(expense.date);
      if (isNaN(date.getTime())) return;

      const dayIndex = (date.getDay() + 6) % 7;
      const prev = totals.get(dayIndex) ?? 0;

      totals.set(dayIndex, prev + expense.fx.baseAmount);
    });
  });
  

  return WEEK_KEYS.map((dayKey, index) => ({
    dayKey,
    value: Math.round(totals.get(index) ?? 0),
  }));
}
