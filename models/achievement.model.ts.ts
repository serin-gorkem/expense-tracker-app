// models/achievement.model.ts

export type AchievementCategory =
  | "streak"
  | "goal"
  | "consistency"
  | "behavior"
  | "system";

export type AchievementRarity =
  | "common"
  | "rare"
  | "epic"
  | "legendary";

export type Achievement = {
  /** unique id (stable, version-safe) */
  readonly id: string;

  /** high-level category */
  readonly category: AchievementCategory;

  /** semantic value (e.g. 7-day streak, 30-day goal) */
  readonly value: number;

  /** user-facing content */
  titleKey: string;
  descriptionKey: string;
  readonly emoji: string;

  /** progression metadata */
  readonly rarity: AchievementRarity;

  /** unlock rules are evaluated elsewhere */
};