// models/insight.model.ts

export type InsightType =
  | "daily_baseline"
  | "baseline_vs_spending"
  | "monthly_change"
  | "top_category"
  | "weekly_average"
  | "streak_current"
  | "streak_longest"
  | "behavioral_weekend_spike"
  | "behavioral_inconsistent_days"
  | "behavioral_over_limit_frequency";
  
export type InsightTone =
  | "positive"
  | "negative"
  | "neutral";

export type InsightItem = {
  readonly type: InsightType;
  readonly title: string;
  readonly description: string;
  readonly tone: InsightTone;
};