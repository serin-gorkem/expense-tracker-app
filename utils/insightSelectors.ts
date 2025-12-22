// utils/insightSelectors.ts

import { Expense } from "@/models/expense.model";
import { InsightItem, InsightType } from "@/models/insight.model";
import {
  getMonthlyChangeInsightData,
  getTopCategoryInsightData,
  getWeeklyAverageInsightData,
} from "@/utils/expenseInsights";
import {
  INSIGHT_PRIORITY,
  MAX_VISIBLE_INSIGHTS,
  isInsightEligible,
} from "@/utils/insightRules";

/**
 * Builds UI-ready insights from raw expense data.
 */
export function selectInsights(expenses: Expense[]): InsightItem[] {
  // 1️⃣ Calculate raw insight data
  const rawInsights: {
    type: InsightType;
    data: unknown;
  }[] = [
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
      data: getWeeklyAverageInsightData(expenses),
    },
  ];

  // 2️⃣ Filter eligible insights
  const eligibleInsights = rawInsights.filter((item) =>
    isInsightEligible(item.type, item.data)
  );

  // 3️⃣ Sort by priority
  const sortedInsights = [...eligibleInsights].sort(
    (a, b) =>
      INSIGHT_PRIORITY.indexOf(a.type) - INSIGHT_PRIORITY.indexOf(b.type)
  );

  // 4️⃣ Limit count
  const visibleInsights = sortedInsights.slice(0, MAX_VISIBLE_INSIGHTS);

  return visibleInsights.map(({ type, data }) => {
    switch (type) {
      case "monthly_change": {
        const d = data as {
          percentageChange: number;
        };
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
              ? `You spent ${Math.abs(
                  d.percentageChange
                )}% more than last month.`
              : `You spent ${Math.abs(
                  d.percentageChange
                )}% less than last month.`,
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
          description: `Your weekly average is ${Math.round(d.weeklyAverage)}.`,
          tone: "neutral",
        };
      }
      default:
        return {
          type,
          title: "Insight",
          description: "",
          tone: "neutral",
        };
    }
  });
}
