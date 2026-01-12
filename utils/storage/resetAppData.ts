import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Keys that will be removed when user chooses
 * "Reset all data & start over"
 *
 * ❗ Language and other global preferences are NOT included.
 */
const RESET_KEYS = [
  // --- Finance core ---
  "@limits",
  "@finance_profile",
  "expenses",
  "@goals_store_v1",

  // --- Progress / gamification ---
  "@streak_milestones_v1",
  "@achievements_unlocked_v1",
  "@streak_celebration_last_shown_v1",
  "@goal_apply_last_shown_day",

  // --- Onboarding & UX state ---
  "@onboarding_completed",
  "@expense_list_hint_seen",
  "@goal_list_hint_seen",
  "@app_language",
  "@onboarding_return"
] as const;

/**
 * Removes all user financial and progress data
 * while keeping global preferences (e.g. language).
 */
export async function resetAppData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(RESET_KEYS);
  } catch (error) {
    console.error("Failed to reset app data", error);
    throw error;
  }
}