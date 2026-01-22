import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { OnboardingData, OnboardingStep } from "@/models/onboarding.types";
import { NEXT_STEP, PREV_STEP } from "@/utils/onboarding/onboarding.flow";
import {
  clearOnboardingReturn,
  getOnboardingReturn,
} from "@/utils/onboarding/onboardingReturn";

const INITIAL_DATA: OnboardingData = {
  useAutoLimits: true,
  baseCurrency: null,
};

export function useOnboardingWizard() {
  const router = useRouter();

  const [step, setStep] = useState<OnboardingStep>(OnboardingStep.Welcome);
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);

  useEffect(() => {
    async function hydrate() {
      const ret = await getOnboardingReturn();
      if (!ret) return;

      setStep(ret.step);
      setData((prev) => ({
        ...prev,
        useAutoLimits: ret.useAutoLimits,
      }));

      await clearOnboardingReturn();
    }

    hydrate();
  }, []);

  async function finishOnboarding() {
    await AsyncStorage.setItem("@onboarding_completed", "true");
    router.replace("/home");
  }

  function resolve(
    map: typeof NEXT_STEP | typeof PREV_STEP,
    current: OnboardingStep,
  ) {
    const r = map[current];
    return typeof r === "function" ? r(data) : r;
  }

  function next() {
    const nextStep = resolve(NEXT_STEP, step);

    if (nextStep === OnboardingStep.Done) {
      finishOnboarding();
      return;
    }

    setStep(nextStep);
  }

  function back() {
    setStep(resolve(PREV_STEP, step));
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
