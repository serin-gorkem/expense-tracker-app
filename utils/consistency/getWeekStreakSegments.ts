import { DayInfo } from "./buildDailyConsistencyMap";

export type StreakSegment = {
  startIndex: number; // 0..6
  endIndex: number;   // 0..6
};

/**
 * Given a week (7 days), returns gold streak segments.
 */
export function getWeekStreakSegments(
  weekDays: (DayInfo | undefined)[]
): StreakSegment[] {
  const segments: StreakSegment[] = [];

  let currentStart: number | null = null;
  

  weekDays.forEach((day, index) => {
    const isGold = day?.status === "gold";

    if (isGold && currentStart === null) {
      currentStart = index;
    }

    if (!isGold && currentStart !== null) {
      segments.push({
        startIndex: currentStart,
        endIndex: index - 1,
      });
      currentStart = null;
    }
  });

  // close open segment
  if (currentStart !== null) {
    segments.push({
      startIndex: currentStart,
      endIndex: weekDays.length - 1,
    });
  }

  return segments;
}