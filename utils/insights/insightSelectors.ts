import { Expense } from "@/models/expense.model";
import { InsightItem, InsightType } from "@/models/insight.model";

import {
  getMonthlyChangeInsightData,
  getTopCategoryInsightData,
  getWeeklyAverageInsightData,
} from "@/utils/expense/expenseInsights";

import { behavioralInsights } from "@/utils/insights/behavioralInsights";

import {
  INSIGHT_PRIORITY,
  MAX_VISIBLE_INSIGHTS,
  isInsightEligible,
} from "@/utils/insights/insightRules";

import {
  getBaselineComparisonInsight,
  getDailyBaselineInsight,
} from "./baselineInsights";

/* =========================
   Types
========================= */

type InsightCandidate = {
  type: InsightType;
  data: unknown;
};

/* =========================
   Selector
========================= */

export function selectInsights({
  expenses,
  dailyLimit,
  dailyBaseline,
}: {
  expenses: Expense[];
  dailyLimit: number;
  dailyBaseline: number | null;
}): InsightItem[] {
  /* =========================
     Financial insight candidates
  ========================= */

  const weeklyAvgData = getWeeklyAverageInsightData(expenses);

  const financialCandidates: InsightCandidate[] = [
    {
      type: "daily_baseline",
      data: getDailyBaselineInsight(dailyBaseline),
    },
    {
      type: "baseline_vs_spending",
      data: getBaselineComparisonInsight({
        dailyBaseline,
        weeklyAverage: weeklyAvgData?.weeklyAverage ?? null,
      }),
    },
    {
      type: "monthly_change",
      data: getMonthlyChangeInsightData(expenses),
    },
    {
      type: "top_category",
      data: getTopCategoryInsightData(expenses),
    },
    {
      type: "weekly_average",
      data: weeklyAvgData,
    },
  ];

  /* =========================
     Behavioral insights
  ========================= */

  const behavioral = behavioralInsights({
    expenses,
    dailyLimit,
  });

  const behavioralCandidates: InsightCandidate[] = behavioral.map((item) => ({
    type: item.type,
    data: item,
  }));

  /* =========================
     Merge candidates
  ========================= */

  const allCandidates: InsightCandidate[] = [
    ...financialCandidates,
    ...behavioralCandidates,
  ];

  /* =========================
     Eligibility filter
  ========================= */

  const eligible = allCandidates.filter((item) =>
    isInsightEligible(item.type, item.data)
  );

  /* =========================
     Priority sorting
  ========================= */

  const sorted = [...eligible].sort(
    (a, b) =>
      INSIGHT_PRIORITY.indexOf(a.type) -
      INSIGHT_PRIORITY.indexOf(b.type)
  );

  /* =========================
     Limit visible insights
  ========================= */

  const visible = sorted.slice(0, MAX_VISIBLE_INSIGHTS);

  /* =========================
     Normalize to InsightItem
  ========================= */

  return visible.map(({ type, data }): InsightItem => {
    // Behavioral & baseline insights already return InsightItem
    if (
      typeof data === "object" &&
      data !== null &&
      "title" in data &&
      "description" in data &&
      "tone" in data
    ) {
      return data as InsightItem;
    }

    // Financial insight mapping
    switch (type) {
      case "monthly_change": {
        const d = data as { percentageChange: number };
        const abs = Math.abs(d.percentageChange);

        const tone =
          abs < 5
            ? "neutral"
            : d.percentageChange > 0
            ? "negative"
            : "positive";

        return {
          type,
          title: "Monthly change",
          description:
            d.percentageChange > 0
              ? `You spent ${abs}% more than last month.`
              : `You spent ${abs}% less than last month.`,
          tone,
        };
      }

      case "top_category": {
        const d = data as {
          category: string;
          total: number;
        };

        return {
          type,
          title: "Top category",
          description: `Most of your spending went to ${d.category}.`,
          tone: "neutral",
        };
      }

      case "weekly_average": {
        const d = data as {
          weeklyAverage: number;
        };

        if (d.weeklyAverage < 1) {
          return {
            type,
            title: "Weekly average",
            description: "Not enough data to calculate weekly average.",
            tone: "neutral",
          };
        }

        return {
          type,
          title: "Weekly average",
          description: `Your weekly average is ${Math.round(
            d.weeklyAverage
          )}.`,
          tone: "neutral",
        };
      }

      default: {
        // Bu noktaya düşmemeli
        throw new Error(`Unhandled insight type: ${type}`);
      }
    }
  });
}