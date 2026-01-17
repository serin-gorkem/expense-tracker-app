import { CurrencyCode } from "@/models/currency.model";
import {
  clearOnboardingReturn,
  getOnboardingReturn,
} from "@/utils/onboarding/onboardingReturn";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
export type OnboardingData = {
  useAutoLimits: boolean;

  baseCurrency: CurrencyCode | null; // ✅ NEW
};

const INITIAL: OnboardingData = {
  useAutoLimits: true,
  baseCurrency: null,
};

export function useOnboardingWizard() {
  const router = useRouter();

  async function finishOnboarding() {
    await AsyncStorage.setItem("@onboarding_completed", "true");
    router.replace("/home");
  }

  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(INITIAL);

  useEffect(() => {
    async function hydrateReturn() {
      const ret = await getOnboardingReturn();
      if (ret) {
        setStep(ret.step);
        setData((prev) => ({
          ...prev,
          useAutoLimits: ret.useAutoLimits,
          ...(ret.flow === "auto"
            ? {
                monthlyIncome: ret.monthlyIncome,
                fixedExpenses: ret.fixedExpenses,
              }
            : {}),
        }));
        await clearOnboardingReturn();
      }
    }

    hydrateReturn();
  }, []);

  function next() {
    /**
     * TERMINAL STEPS
     * Wizard’dan veya normal flow’dan gelen final adımlar
     */
    if (step === 5 || step === 6) {
      finishOnboarding();
      return;
    }

    /**
     * AUTO / MANUAL DECISION POINT
     * Sadece onboarding içindeyken çalışır
     */
    if (step === 4) {
      setStep(data.useAutoLimits ? 6 : 5);
      return;
    }

    /**
     * AUTO LIMIT ENABLED?
     * AutoLimitStep sonrası routing
     */
    if (step === 1) {
      setStep(data.useAutoLimits ? 2 : 4);
      return;
    }

    /**
     * DEFAULT LINEAR FLOW
     */
    setStep((s) => s + 1);
  }
  function back() {
    /**
     * Back from GoalWizardStep
     */
    if (step === 4) {
      if (data.useAutoLimits) {
        setStep(3); // FixedExpensesStep
      } else {
        setStep(1); // AutoLimitStep
      }
      return;
    }

    /**
     * Back from PreviewStep
     */
    if (step === 6) {
      if (data.useAutoLimits) {
        setStep(4); // GoalWizardStep
      } else {
        setStep(5); // ManualLimitStep
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
    finishOnboarding,
  };
}
