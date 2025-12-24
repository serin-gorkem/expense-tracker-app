import AsyncStorage from "@react-native-async-storage/async-storage";
import { Milestone } from "../../models/milestones.model";

const KEY = "@streak_milestones_v1";

export async function getAchievedMilestones(): Promise<Milestone[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Milestone[];
  } catch {
    return [];
  }
}

export async function saveMilestone(milestone: Milestone) {
  const existing = await getAchievedMilestones();
  const alreadyExists = existing.some((m) => m.day === milestone.day);
  if (alreadyExists) return;

  await AsyncStorage.setItem(
    KEY,
    JSON.stringify([...existing, milestone])
  );
}