import AutoLimitStep from "./steps/AutoLimitStep";
import DoneStep from "./steps/DoneStep";
import FixedExpensesStep from "./steps/FixedExpensesStep";
import IncomeStep from "./steps/IncomeStep";
import ManualLimitsStep from "./steps/ManuelLimitStep";
import PreviewStep from "./steps/PreviewStep";
import WelcomeStep from "./steps/WelcomeStep";

import { useOnboardingWizard } from "@/hooks/useOnboardingWizard";

export default function Onboarding() {
  const { step, data, next, back, update } = useOnboardingWizard();

  if (step === 0) return <WelcomeStep onNext={next} />;

  if (step === 1)
    return (
      <AutoLimitStep
        enabled={data.useAutoLimits}
        onChange={(v) => update({ useAutoLimits: v })}
        onNext={next}
        onBack={back}
      />
    );

  if (step === 2)
    return (
      <IncomeStep
        monthlyIncome={data.monthlyIncome}
        onChange={(v) => update({ monthlyIncome: v })}
        onNext={next}
        onBack={back}
      />
    );

  if (step === 3)
    return (
      <FixedExpensesStep
        fixedExpenses={data.fixedExpenses}
        onChange={(v) => update({ fixedExpenses: v })}
        monthlyIncome={data.monthlyIncome}
        onNext={next}
        onBack={back}
      />
    );

  if (step === 4)
  return <ManualLimitsStep onFinish={next} onBack={back} />;

  if (step === 5)
    return (
      <PreviewStep
        monthlyIncome={data.monthlyIncome!}
        fixedExpenses={data.fixedExpenses!}
        useAutoLimits={data.useAutoLimits}
        onFinish={next}
      />
    );

  return <DoneStep />;
}
