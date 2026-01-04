// utils/achievements/achievementStore.ts
import { Achievement } from "@/models/achievement.model.ts";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@achievements_unlocked_v1";

export type UnlockedAchievement = Achievement & {
  unlockedAt: string;
};

export async function getUnlockedAchievements(): Promise<UnlockedAchievement[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as UnlockedAchievement[];
  } catch {
    return [];
  }
}

export async function isAchievementUnlocked(id: string): Promise<boolean> {
  const all = await getUnlockedAchievements();
  return all.some((a) => a.id === id);
}

export async function unlockAchievement(achievement: Achievement) {
  const all = await getUnlockedAchievements();

  if (all.some((a) => a.id === achievement.id)) return;

  const unlocked: UnlockedAchievement = {
    ...achievement,
    unlockedAt: new Date().toISOString(),
  };

  const updated = [...all, unlocked];
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
}