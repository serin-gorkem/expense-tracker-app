import { Goal } from "@/models/goal.model";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type WizardStep = "type" | "duration" | "target" | "review";

export type GoalDraft = {
  type?: "savings" | "purchase" | "budget";
  durationInDays?: number;
  targetAmount?: number;
  categoryId?: string;
  customTitle?: string;
};

type WizardContextType = {
  step: WizardStep;
  draft: GoalDraft;

  isEditMode: boolean;
  editingGoalId: string | null;

  canGoBack: boolean;
  canGoNext: boolean;

  next(): void;
  back(): void;
  reset(): void;

  setType(type: GoalDraft["type"]): void;
  setTitle(customTitle: string): void;
  setDurationInDays(days: number): void;
  setTargetAmount(amount: number): void;

  startFromGoal(goal: Goal): void;
};

const WizardContext = createContext<WizardContextType | null>(null);

const ORDER: WizardStep[] = ["type", "duration", "target", "review"];

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<WizardStep>("type");
  const [draft, setDraft] = useState<GoalDraft>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  const stepIndex = useMemo(() => ORDER.indexOf(step), [step]);

  const canGoBack = stepIndex > 0;

  const canGoNext = useMemo(() => {
    if (step === "type") return !!draft.type;
    if (step === "duration") return !!draft.durationInDays;
    if (step === "target") return !!draft.targetAmount;
    return true;
  }, [step, draft]);

  const next = useCallback(() => {
    setStep((s) => ORDER[Math.min(ORDER.indexOf(s) + 1, ORDER.length - 1)]);
  }, []);

  const back = useCallback(() => {
    setStep((s) => ORDER[Math.max(ORDER.indexOf(s) - 1, 0)]);
  }, []);

  const reset = useCallback(() => {
    setDraft({});
    setStep("type");
    setIsEditMode(false);
    setEditingGoalId(null);
  }, []);

  const setType = useCallback((type: GoalDraft["type"]) => {
    setDraft((d) => ({ ...d, type }));
  }, []);

  const setDurationInDays = useCallback((durationInDays: number) => {
    setDraft((d) => ({ ...d, durationInDays }));
  }, []);

  const setTargetAmount = useCallback((targetAmount: number) => {
    setDraft((d) => ({ ...d, targetAmount }));
  }, []);
  const setTitle = (customTitle: string) => {
    setDraft((d) => ({ ...d, customTitle }));
  };
  function startFromGoal(goal: Goal) {
    setDraft({
      type: "savings",
      durationInDays: goal.durationInDays,
      targetAmount: goal.targetAmount,
      customTitle: goal.title,
    });

    setEditingGoalId(goal.id);
    setIsEditMode(true);
    setStep("type");
  }

  return (
    <WizardContext.Provider
      value={{
        step,
        draft,

        isEditMode,
        editingGoalId,

        canGoBack,
        canGoNext,

        next,
        back,
        reset,

        setType,
        setDurationInDays,
        setTargetAmount,
        setTitle,

        startFromGoal,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used inside WizardProvider");
  return ctx;
}
