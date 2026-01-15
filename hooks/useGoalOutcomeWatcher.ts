import { Expense } from "@/models/expense.model";
import { Goal } from "@/models/goal.model";
import { useGoalsStore } from "@/src/context/GoalContext";
import {
  calculateGoalOutcome,
  GoalOutcome,
} from "@/utils/goals/calculateGoalOutcome";
import { useEffect, useRef } from "react";

type Params = {
  activeGoal?: Goal;
  expenses: Expense[];
  onSuccess?: (goal: Goal) => void;
  onFailure?: (goal: Goal) => void;
};

export function useGoalOutcomeWatcher({
  activeGoal,
  expenses,
  onSuccess,
  onFailure,
}: Params) {
  const { calculateGoalProgress } = useGoalsStore();

  const lastOutcomeRef = useRef<GoalOutcome>("ongoing");
  const lastGoalIdRef = useRef<string | null>(null);

  useEffect(() => {
    // 1️⃣ Goal değiştiyse reset
    if (activeGoal?.id !== lastGoalIdRef.current) {
      lastOutcomeRef.current = "ongoing";
      lastGoalIdRef.current = activeGoal?.id ?? null;
    }

    // 2️⃣ Guard
    if (!activeGoal || activeGoal.status !== "active") {
      return;
    }

    // 3️⃣ ✅ BASE CURRENCY PROGRESS
    const savedAmount = calculateGoalProgress(
      activeGoal.id,
      expenses
    );

    // 4️⃣ Outcome
    const currentOutcome = calculateGoalOutcome({
      goal: activeGoal,
      savedAmount,
    });

    const previousOutcome = lastOutcomeRef.current;

    // 5️⃣ Transition-only trigger
    if (previousOutcome !== currentOutcome) {
      if (currentOutcome === "succeeded") {
        onSuccess?.(activeGoal);
      }

      if (currentOutcome === "failed") {
        onFailure?.(activeGoal);
      }

      lastOutcomeRef.current = currentOutcome;
    }
  }, [activeGoal, expenses, onSuccess, onFailure, calculateGoalProgress]);
}