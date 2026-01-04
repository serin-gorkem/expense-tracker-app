// utils/achievements/achievementUnlockers.ts
import { ACHIEVEMENT_REGISTRY } from "@/constants/achievementRegistry";
import { isAchievementUnlocked, unlockAchievement } from "./achievementStore";

/* =========================
   STREAK
========================= */

export async function checkStreakAchievements(currentStreak: number) {
  const candidates = Object.values(ACHIEVEMENT_REGISTRY).filter(
    (a) => a.category === "streak" && a.value === currentStreak
  );

  for (const achievement of candidates) {
    const unlocked = await isAchievementUnlocked(achievement.id);
    if (!unlocked) {
      await unlockAchievement(achievement);
    }
  }
}

/* =========================
   GOAL
========================= */

export async function checkGoalAchievements(completedGoalsCount: number) {
  const candidates = Object.values(ACHIEVEMENT_REGISTRY).filter(
    (a) =>
      a.category === "goal" &&
      completedGoalsCount >= a.value
  );

  for (const achievement of candidates) {
    const unlocked = await isAchievementUnlocked(achievement.id);
    if (!unlocked) {
      await unlockAchievement(achievement);
    }
  }
}