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
    title: "Your daily baseline",
    description: `A balanced day for you is around ₺${dailyBaseline}. This is a reference point, not a limit.`,
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
      title: "Below your baseline",
      description:
        "Your recent daily spending is below your baseline. This usually means you're being conservative or saving.",
      tone: "positive",
    };
  }

  if (weeklyAverage < dailyBaseline * 1.25) {
    return {
      type: "baseline_vs_spending",
      title: "Slightly above baseline",
      description:
        "Your recent spending is slightly above your baseline. This may be fine, but it's worth being aware.",
      tone: "neutral",
    };
  }

  return {
    type: "baseline_vs_spending",
    title: "Above your baseline",
    description:
      "Your recent spending is noticeably above your baseline. You may want to check where the extra spending is coming from.",
    tone: "negative",
  };
}