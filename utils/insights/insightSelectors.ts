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

/**
 * Builds UI-ready insights from raw expense data.
 */
export function selectInsights({
  expenses,
  dailyLimit,
}: {
  expenses: Expense[];
  dailyLimit: number;
}): InsightItem[] {
  /**
   * 1️⃣ Financial insight candidates
   */
  const financialCandidates: {
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

  /**
   * 2️⃣ Behavioral insights (already UI-ready)
   */
  const behavioral = behavioralInsights({
    expenses,
    dailyLimit,
  });

  const behavioralCandidates = behavioral.map((item) => ({
    type: item.type,
    data: item,
  }));

  /**
   * 3️⃣ Merge all candidates
   */
  const allCandidates = [
    ...financialCandidates,
    ...behavioralCandidates,
  ];

  /**
   * 4️⃣ Eligibility filter
   */
  const eligible = allCandidates.filter((item) =>
    isInsightEligible(item.type, item.data)
  );

  /**
   * 5️⃣ Sort by priority
   */
  const sorted = [...eligible].sort(
    (a, b) =>
      INSIGHT_PRIORITY.indexOf(a.type) -
      INSIGHT_PRIORITY.indexOf(b.type)
  );

  /**
   * 6️⃣ Limit visible count
   */
  const visible = sorted.slice(0, MAX_VISIBLE_INSIGHTS);

  /**
   * 7️⃣ Normalize to InsightItem
   */
  return visible.map(({ type, data }) => {
    // Behavioral insights already return InsightItem
    if (
      typeof data === "object" &&
      data !== null &&
      "title" in data &&
      "description" in data
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