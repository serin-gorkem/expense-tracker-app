// utils/insightRules.ts

import { InsightType } from "@/models/insight.model";

/**
 * Maximum number of insights shown at once
 */
export const MAX_VISIBLE_INSIGHTS = 2;

/**
 * Insight priority order (highest → lowest)
 */
export const INSIGHT_PRIORITY: InsightType[] = [
  "monthly_change",
  "top_category",
  "weekly_average",
];

/**
 * Determines whether an insight is eligible to be shown.
 * This function does NOT calculate insight data.
 */
export function isInsightEligible(
  _type: InsightType,
  data: unknown
): boolean {
  return data != null;
}