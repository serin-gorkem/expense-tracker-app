// utils/streak/streakCelebrationStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@streak_celebration_last_shown_v1";

type StoredCelebration = {
  streakCount: number;
  type: "new_streak" | "milestone";
  shownAt: string;
};

export async function wasCelebrationShown(type: StoredCelebration["type"], streakCount: number) {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return false;

  try {
    const parsed = JSON.parse(raw) as StoredCelebration;
    return parsed.type === type && parsed.streakCount === streakCount;
  } catch {
    return false;
  }
}

export async function markCelebrationShown(type: StoredCelebration["type"], streakCount: number) {
  const payload: StoredCelebration = {
    type,
    streakCount,
    shownAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(KEY, JSON.stringify(payload));
}

export async function clearCelebrationShown() {
  await AsyncStorage.removeItem(KEY);
}