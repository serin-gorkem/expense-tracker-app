// utils/insights/selectAllFinancialInsights.ts

import { Expense } from "@/models/expense.model";
import { InsightItem } from "@/models/insight.model";
import {
  getMonthlyChangeInsightData,
  getTopCategoryInsightData,
  getWeeklyAverageInsightData,
} from "@/utils/expense/expenseInsights";
import { buildFXDifferenceInsight } from "@/utils/insights/buildFXDifferenceInsight";

import { CurrencyCode } from "@/models/currency.model";
import {
  getBaselineComparisonInsight,
  getDailyBaselineInsight,
} from "@/utils/insights/baselineInsights";
import { buildCurrencyExposureInsight } from "./currencyExposureInsight";

export function selectAllFinancialInsights({
  expenses,
  dailyBaseline,
  currentRates,
  baseCurrency,
}: {
  expenses: Expense[];
  dailyBaseline: number | null;
  currentRates: Record<string, number>;
  baseCurrency: CurrencyCode;
}): InsightItem[] {
  const weeklyAvg = getWeeklyAverageInsightData(expenses);
  if (!expenses || expenses.length === 0) return [];
  
  const items: (InsightItem | null)[] = [
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
        abs < 5 ? "neutral" : d.percentageChange > 0 ? "negative" : "positive";

      return {
        type: "monthly_change",
        titleKey: "insights.monthly_change.title",
        descriptionKey:
          d.percentageChange > 0
            ? "insights.monthly_change.more"
            : "insights.monthly_change.less",
        params: { percent: abs },
        tone,
      };
    })(),

    (() => {
      const d = getTopCategoryInsightData(expenses);
      if (!d) return null;

      return {
        type: "top_category",
        titleKey: "insights.top_category.title",
        descriptionKey: "insights.top_category.description",
        params: { category: d.category },
        tone: "neutral",
      };
    })(),

    (() => {
      if (!weeklyAvg || weeklyAvg.weeklyAverage < 1) return null;

      return {
        type: "weekly_average",
        titleKey: "insights.weekly_average.title",
        descriptionKey: "insights.weekly_average.description",
        params: { amount: Math.round(weeklyAvg.weeklyAverage) },
        tone: "neutral",
      };
    })(),

    (() => {
      return buildCurrencyExposureInsight({
        expenses,
        baseCurrency,
      });
    })(),

    (() => {
      return buildFXDifferenceInsight({
        expenses,
        currentRates,
        baseCurrency,
      });
    })(),
  ];

  return items.filter(Boolean) as InsightItem[];
}