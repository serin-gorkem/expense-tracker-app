// models/insight.model.ts

export type InsightType =
  | "monthly_change"
  | "top_category"
  | "weekly_average";

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