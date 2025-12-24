// utils/streak/streakMilestoneStore.ts
import { AchievedMilestone } from "@/models/milestones.model";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@streak_milestones_v1";

export async function getUnlockedMilestones(): Promise<AchievedMilestone[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as AchievedMilestone[];
  } catch {
    return [];
  }
}

export async function isMilestoneUnlocked(id: string): Promise<boolean> {
  const all = await getUnlockedMilestones();
  return all.some((m) => m.id === id);
}

export async function unlockMilestone(milestone: AchievedMilestone) {
  const all = await getUnlockedMilestones();

  if (all.some((m) => m.id === milestone.id)) return;

  const updated = [...all, milestone];
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
}