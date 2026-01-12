import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@onboarding_return"
export type OnboardingReturn =
  | {
      flow: "auto";
      step: 6;
      useAutoLimits: true;
      monthlyIncome: number;
      fixedExpenses: number;
    }
  | {
      flow: "manual";
      step: 5;
      useAutoLimits: false;
    };

export async function setOnboardingReturn(value: OnboardingReturn) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch (e) {
    console.warn("setOnboardingReturn failed", e);
  }
}

export async function getOnboardingReturn(): Promise<OnboardingReturn | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<OnboardingReturn>;

    // minimal runtime guard
    if (
      (parsed.flow === "auto" && parsed.step === 6) ||
      (parsed.flow === "manual" && parsed.step === 5)
    ) {
      return parsed as OnboardingReturn;
    }

    return null;
  } catch (e) {
    console.warn("getOnboardingReturn failed", e);
    return null;
  }
}

export async function clearOnboardingReturn() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn("clearOnboardingReturn failed", e);
  }
}