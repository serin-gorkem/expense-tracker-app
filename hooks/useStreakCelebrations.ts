// hooks/useStreakCelebrations.ts
import { haptic } from "@/utils/haptics";
import { StreakCelebrationResult, streakCelebrationRules } from "@/utils/streak/streakCelebrationRules";
import {
  clearCelebrationShown,
  markCelebrationShown,
  wasCelebrationShown,
} from "@/utils/streak/streakCelebrationStore";
import { useEffect, useRef, useState } from "react";

export function useStreakCelebration(currentStreak: number, totalExpenseCount: number) {
  const prevStreakRef = useRef<number>(0);
  const prevTotalExpenseRef = useRef<number>(0);

  const [celebration, setCelebration] = useState<StreakCelebrationResult | null>(null);

  useEffect(() => {
    const prevStreak = prevStreakRef.current;
    const prevTotal = prevTotalExpenseRef.current;

    const currentTotal = totalExpenseCount;

    // 1) full reset: expenses > 0 iken 0'a düşerse
    const fullReset = prevTotal > 0 && currentTotal === 0;

    // reset olduysa: bir sonraki start'ta tekrar new_streak göstersin diye store'u temizle
    if (fullReset) {
      clearCelebrationShown().catch(() => {});
    }

    // 2) streak broke haptic
    if (prevStreak > 0 && currentStreak === 0) {
      haptic.warning();
    }

    // 3) rule-based result
    const result = streakCelebrationRules({
      prevStreak,
      currentStreak,
    });

    (async () => {
      if (!result) return;

      const already = await wasCelebrationShown(result.type, result.count);
      if (already) return;

      setCelebration(result);
      haptic.success();
      await markCelebrationShown(result.type, result.count);
    })().catch(() => {});

    prevStreakRef.current = currentStreak;
    prevTotalExpenseRef.current = currentTotal;
  }, [currentStreak, totalExpenseCount]);

  return {
    celebration,
    dismiss: () => setCelebration(null),
  };
}