import { useFinanceProfile } from "@/src/context/FinanceProfileContext";
import AutoLimitStep from "./steps/AutoLimitStep";
import DoneStep from "./steps/DoneStep";
import FixedExpensesStep from "./steps/FixedExpensesStep";
import GoalWizardStep from "./steps/GoalWizardStep";
import IncomeStep from "./steps/IncomeStep";
import ManualLimitsStep from "./steps/ManuelLimitStep";
import PreviewStep from "./steps/PreviewStep";
import WelcomeStep from "./steps/WelcomeStep";

import { useOnboardingWizard } from "@/hooks/useOnboardingWizard";

export default function Onboarding() {
  const { step, data, next, finishOnboarding, back, update } =
    useOnboardingWizard();
  const { profile, setBaseCurrency, updateProfile } = useFinanceProfile();
  const baseCurrency = profile.baseCurrency!;

const monthlyIncome = profile.monthlyIncome!;
const fixedExpenses = profile.fixedExpenses!;

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
        monthlyIncome={monthlyIncome}
        baseCurrency={baseCurrency} // ✅ single source
        onCurrencyChange={setBaseCurrency} // ✅ direct write
        onChange={(v) => updateProfile({ monthlyIncome: v })}
        onNext={next}
        onBack={back}
      />
    );

  if (step === 3)
    return (
      <FixedExpensesStep
        fixedExpenses={profile.fixedExpenses} // ✅ single source
        monthlyIncome={profile.monthlyIncome}
        baseCurrency={baseCurrency}
        onChange={
          (v) => updateProfile({ fixedExpenses: v }) // ✅ write-through
        }
        onNext={next}
        onBack={back}
      />
    );

  if (step === 4)
    return (
      <GoalWizardStep
        onBack={back}
        onNext={next}
        useAutoLimits={data.useAutoLimits}
        monthlyIncome={monthlyIncome}
        fixedExpenses={fixedExpenses}
      />
    );

  if (step === 5)
    return <ManualLimitsStep onFinish={finishOnboarding} onBack={back} />;

  if (step === 6)
    return (
      <PreviewStep
        monthlyIncome={monthlyIncome}
        fixedExpenses={fixedExpenses}
        useAutoLimits={data.useAutoLimits}
        baseCurrency={baseCurrency}
        onFinish={finishOnboarding}
      />
    );

  return <DoneStep />;
}
