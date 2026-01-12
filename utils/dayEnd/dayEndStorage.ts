import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@goal_apply_last_shown_day";

export async function getLastShownDay(): Promise<string | null> {
  return AsyncStorage.getItem(KEY);
}

export async function setLastShownDay(dayKey: string) {
  return AsyncStorage.setItem(KEY, dayKey);
}