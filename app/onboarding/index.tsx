import { useOnboardingWizard } from "@/hooks/useOnboardingWizard";
import { OnboardingStep } from "@/models/onboarding.types";
import { useFinanceProfile } from "@/src/context/FinanceProfileContext";

import AutoLimitStep from "./steps/AutoLimitStep";
import DoneStep from "./steps/DoneStep";
import FixedExpensesStep from "./steps/FixedExpensesStep";
import GoalWizardStep from "./steps/GoalWizardStep";
import IncomeStep from "./steps/IncomeStep";
import ManualLimitsStep from "./steps/ManuelLimitStep";
import PreviewStep from "./steps/PreviewStep";
import WelcomeStep from "./steps/WelcomeStep";

export default function Onboarding() {
  const { step, data, next, back, update, finishOnboarding } =
    useOnboardingWizard();

  const { profile, setBaseCurrency, updateProfile } = useFinanceProfile();
  const baseCurrency = profile.baseCurrency!;
  const monthlyIncome = profile.monthlyIncome!;
  const fixedExpenses = profile.fixedExpenses!;

  switch (step) {
    case OnboardingStep.Welcome:
      return <WelcomeStep onNext={next} />;

    case OnboardingStep.AutoLimit:
      return (
        <AutoLimitStep
          enabled={data.useAutoLimits}
          onChange={(v) => update({ useAutoLimits: v })}
          onNext={next}
          onBack={back}
        />
      );

    case OnboardingStep.Income:
      return (
        <IncomeStep
          monthlyIncome={monthlyIncome}
          baseCurrency={baseCurrency}
          onCurrencyChange={setBaseCurrency}
          onChange={(v) => updateProfile({ monthlyIncome: v })}
          onNext={next}
          onBack={back}
        />
      );

    case OnboardingStep.FixedExpenses:
      return (
        <FixedExpensesStep
          fixedExpenses={fixedExpenses}
          monthlyIncome={monthlyIncome}
          baseCurrency={baseCurrency}
          onChange={(v) => updateProfile({ fixedExpenses: v })}
          onNext={next}
          onBack={back}
        />
      );

    case OnboardingStep.GoalWizard:
      return (
        <GoalWizardStep
          useAutoLimits={data.useAutoLimits}
          monthlyIncome={monthlyIncome}
          fixedExpenses={fixedExpenses}
          onNext={next}
          onBack={back}
        />
      );

    case OnboardingStep.ManualLimits:
      return <ManualLimitsStep onFinish={finishOnboarding} onBack={back} />;

    case OnboardingStep.Preview:
      return (
        <PreviewStep
          monthlyIncome={monthlyIncome}
          fixedExpenses={fixedExpenses}
          useAutoLimits={data.useAutoLimits}
          baseCurrency={baseCurrency}
          onFinish={finishOnboarding}
        />
      );

    default:
      return <DoneStep />;
  }
}
