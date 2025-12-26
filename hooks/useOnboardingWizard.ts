import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
export type OnboardingData = {
  monthlyIncome: number | null;
  fixedExpenses: number | null;
  useAutoLimits: boolean;
};

const INITIAL: OnboardingData = {
  monthlyIncome: null,
  fixedExpenses: null,
  useAutoLimits: true,
};



export function useOnboardingWizard() {
  const router = useRouter();

  async function finishOnboarding() {
  await AsyncStorage.setItem("@onboarding_completed", "true");
  router.replace("/home");
}

  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(INITIAL);

function next() {
  /**
   * step === 1 → AutoLimitStep
   * Burada branch kararı verilir
   */
  if (step === 1) {
    if (data.useAutoLimits) {
      setStep(2); // Income
    } else {
      setStep(4); // ManualLimits
    }
    return;
  }

  /**
   * step === 4 → ManualLimits bitti
   * step === 5 → Preview bitti
   */
  if (step === 4 || step === 5) {
    router.replace("/home");
    finishOnboarding();
    return;
  }

  /**
   * Default linear flow
   * 0 → 1
   * 2 → 3
   * 3 → 5 (çünkü AutoLimit true ise 3'e gelinir)
   */
  if (step === 3 && data.useAutoLimits) {
    setStep(5); // Preview
    return;
  }

  setStep((s) => s + 1);
}

function back() {
  /**
   * ManualLimitsStep'ten geri
   * → AutoLimitStep'e dön
   */
  if (step === 4) {
    setStep(1);
    return;
  }

  /**
   * PreviewStep'ten geri
   * → FixedExpenses veya ManualLimits
   */
  if (step === 5) {
    if (data.useAutoLimits) {
      setStep(3); // FixedExpenses
    } else {
      setStep(4); // ManualLimits
    }
    return;
  }

  setStep((s) => Math.max(0, s - 1));
}

  function update(patch: Partial<OnboardingData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  return {
    step,
    data,
    next,
    back,
    update,
  };
}