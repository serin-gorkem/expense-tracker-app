// hooks/useAchievements.ts
import {
    getUnlockedAchievements,
    UnlockedAchievement,
} from "@/utils/achievements/achievementStore";
import { useEffect, useState } from "react";

export function useAchievements() {
  const [achievements, setAchievements] = useState<UnlockedAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const all = await getUnlockedAchievements();
      setAchievements(
        [...all].sort(
          (a, b) =>
            new Date(b.unlockedAt).getTime() -
            new Date(a.unlockedAt).getTime()
        )
      );
      setLoading(false);
    })();
  }, []);

  return {
    achievements,
    loading,
    count: achievements.length,
  };
}