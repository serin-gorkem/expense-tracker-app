import { InsightItem } from "@/models/insight.model";

/**
 * Shows the user's calculated daily baseline.
 * This is informational, NOT a limit.
 */
export function getDailyBaselineInsight(
  dailyBaseline: number | null
): InsightItem | null {
  if (dailyBaseline == null || dailyBaseline <= 0) return null;

  return {
    type: "daily_baseline",
    titleKey: "insights.baseline.daily.title",
    descriptionKey: "insights.baseline.daily.desc",
    params: {
      amount: dailyBaseline, // 🔥 KRİTİK SATIR
    },
    tone: "neutral",
  };
}

/**
 * Compares baseline with recent spending behavior (weekly average).
 */
export function getBaselineComparisonInsight({
  dailyBaseline,
  weeklyAverage,
}: {
  dailyBaseline: number | null;
  weeklyAverage: number | null;
}): InsightItem | null {
  if (
    dailyBaseline == null ||
    dailyBaseline <= 0 ||
    weeklyAverage == null ||
    weeklyAverage <= 0
  ) {
    return null;
  }

  const diffRatio = weeklyAverage / dailyBaseline;

  // Very close → no insight, no noise
  if (diffRatio > 0.9 && diffRatio < 1.1) {
    return null;
  }
  if (weeklyAverage < dailyBaseline) {
    return {
      type: "baseline_vs_spending",
      titleKey: "insights.baseline.below.title",
      descriptionKey: "insights.baseline.below.desc",
      tone: "positive",
    };
  }

  if (weeklyAverage < dailyBaseline * 1.25) {
    return {
      type: "baseline_vs_spending",
      titleKey: "insights.baseline.slightlyAbove.title",
      descriptionKey: "insights.baseline.slightlyAbove.desc",
      tone: "neutral",
    };
  }

  return {
    type: "baseline_vs_spending",
    titleKey: "insights.baseline.above.title",
    descriptionKey: "insights.baseline.above.desc",
    tone: "negative",
  };
}
