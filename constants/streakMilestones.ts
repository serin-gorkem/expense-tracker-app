/**
 * Streak milestone days.
 * Used for celebrations, achievements, notifications, etc.
 */
export const STREAK_MILESTONES = [
  1,   // first streak
  7,
  21,
  30,
  60,
  90,
] as const;

/**
 * Type-safe milestone value
 * (1 | 7 | 21 | 30 | 60 | 90)
 */
export type StreakMilestone = typeof STREAK_MILESTONES[number];

export function isStreakMilestone(value:number): value is StreakMilestone{
    return STREAK_MILESTONES.includes(value as StreakMilestone);
}