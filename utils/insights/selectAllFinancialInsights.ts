// utils/insights/selectAllFinancialInsights.ts

import { Expense } from "@/models/expense.model";
import { InsightItem } from "@/models/insight.model";

import {
    getMonthlyChangeInsightData,
    getTopCategoryInsightData,
    getWeeklyAverageInsightData,
} from "@/utils/expense/expenseInsights";

import {
    getBaselineComparisonInsight,
    getDailyBaselineInsight,
} from "@/utils/insights/baselineInsights";

export function selectAllFinancialInsights({
  expenses,
  dailyBaseline,
}: {
  expenses: Expense[];
  dailyBaseline: number | null;
}): InsightItem[] {
  const weeklyAvg = getWeeklyAverageInsightData(expenses);

  const candidates: (InsightItem | null)[] = [
    getDailyBaselineInsight(dailyBaseline),
    getBaselineComparisonInsight({
      dailyBaseline,
      weeklyAverage: weeklyAvg?.weeklyAverage ?? null,
    }),
    (() => {
      const d = getMonthlyChangeInsightData(expenses);
      if (!d) return null;

      const abs = Math.abs(d.percentageChange);
      const tone =
        abs < 5
          ? "neutral"
          : d.percentageChange > 0
          ? "negative"
          : "positive";

      return {
        type: "monthly_change",
        title: "Monthly change",
        description:
          d.percentageChange > 0
            ? `You spent ${abs}% more than last month.`
            : `You spent ${abs}% less than last month.`,
        tone,
      };
    })(),
    (() => {
      const d = getTopCategoryInsightData(expenses);
      if (!d) return null;

      return {
        type: "top_category",
        title: "Top category",
        description: `Most of your spending went to ${d.category}.`,
        tone: "neutral",
      };
    })(),
    (() => {
      const d = weeklyAvg;
      if (!d || d.weeklyAverage < 1) return null;

      return {
        type: "weekly_average",
        title: "Weekly average",
        description: `Your weekly average is ₺${Math.round(
          d.weeklyAverage
        )}.`,
        tone: "neutral",
      };
    })(),
  ];

  return candidates.filter(Boolean) as InsightItem[];
}