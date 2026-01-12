import { Expense } from "@/models/expense.model";
import { InsightItem, InsightType } from "@/models/insight.model";

import {
  getMonthlyChangeInsightData,
  getTopCategoryInsightData,
  getWeeklyAverageInsightData,
} from "@/utils/expense/expenseInsights";

import {
  INSIGHT_PRIORITY,
  MAX_VISIBLE_INSIGHTS,
  isInsightEligible,
} from "@/utils/insights/insightRules";

import {
  getBaselineComparisonInsight,
  getDailyBaselineInsight,
} from "@/utils/insights/baselineInsights";

/* =========================
   Types
========================= */

type InsightCandidate = {
  type: InsightType;
  item: InsightItem | null;
};

/* =========================
   Selector
========================= */

export function insightSelectors({
  expenses,
  dailyLimit,
  dailyBaseline,
}: {
  expenses: Expense[];
  dailyLimit: number;
  dailyBaseline: number | null;
}): InsightItem[] {
  const weeklyAvgData = getWeeklyAverageInsightData(expenses);

  /* =========================
     Build candidates
  ========================= */

  const candidates: InsightCandidate[] = [
    {
      type: "daily_baseline",
      item: getDailyBaselineInsight(dailyBaseline),
    },

    {
      type: "baseline_vs_spending",
      item: getBaselineComparisonInsight({
        dailyBaseline,
        weeklyAverage: weeklyAvgData?.weeklyAverage ?? null,
      }),
    },

    {
      type: "monthly_change",
      item: (() => {
        const d = getMonthlyChangeInsightData(expenses);
        if (!d) return null;

        const abs = Math.abs(d.percentageChange);

        return {
          type: "monthly_change",
          titleKey: "insights.monthly_change.title",
          descriptionKey:
            d.percentageChange > 0
              ? "insights.monthly_change.more"
              : "insights.monthly_change.less",
          params: { percent: abs },
          tone:
            abs < 5
              ? "neutral"
              : d.percentageChange > 0
              ? "negative"
              : "positive",
        };
      })(),
    },

    {
      type: "top_category",
      item: (() => {
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
    },

    {
      type: "weekly_average",
      item: (() => {
        if (!weeklyAvgData || weeklyAvgData.weeklyAverage < 1) return null;

        return {
          type: "weekly_average",
          titleKey: "insights.weekly_average.title",
          descriptionKey: "insights.weekly_average.description",
          params: {
            amount: Math.round(weeklyAvgData.weeklyAverage),
          },
          tone: "neutral",
        };
      })(),
    },
  ];

  /* =========================
     Eligibility filter
  ========================= */

  const eligible = candidates
    .filter(
      (c) => c.item && isInsightEligible(c.type, c.item)
    )
    .map((c) => c.item as InsightItem);

  /* =========================
     Priority sorting
  ========================= */

  const sorted = eligible.sort(
    (a, b) =>
      INSIGHT_PRIORITY.indexOf(a.type) -
      INSIGHT_PRIORITY.indexOf(b.type)
  );

  /* =========================
     Limit visible insights
  ========================= */

  return sorted.slice(0, MAX_VISIBLE_INSIGHTS);
}