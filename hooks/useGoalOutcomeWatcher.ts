import { Expense } from "@/models/expense.model";
import { Goal } from "@/models/goal.model";
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
  const lastOutcomeRef = useRef<GoalOutcome>("ongoing");
  const lastGoalIdRef = useRef<string | null>(null);

  useEffect(() => {
    // 1️⃣ Active goal değiştiyse transition state sıfırlanır
    if (activeGoal?.id !== lastGoalIdRef.current) {
      lastOutcomeRef.current = "ongoing";
      lastGoalIdRef.current = activeGoal?.id ?? null;
    }

    // 2️⃣ Active goal yoksa veya lifecycle uygun değilse çık
    if (!activeGoal || activeGoal.status !== "active") {
      return;
    }

    // 3️⃣ Saved amount hesapla (goal boost'ları)
    const savedAmount = expenses
      .filter(
        (e) => e.isGoalBoost && e.goalId === activeGoal.id
      )
      .reduce(
        (sum, e) => sum + (e.boostAmount ?? e.amount),
        0
      );

    // 4️⃣ Outcome hesapla
    const currentOutcome = calculateGoalOutcome({
      goal: activeGoal,
      savedAmount,
    });

    const previousOutcome = lastOutcomeRef.current;

    // 5️⃣ SADECE TRANSITION ANINDA
    if (previousOutcome !== currentOutcome) {
      if (currentOutcome === "succeeded") {
        onSuccess?.(activeGoal);
      }

      if (currentOutcome === "failed") {
        onFailure?.(activeGoal);
      }

      lastOutcomeRef.current = currentOutcome;
    }
  }, [activeGoal, expenses, onSuccess, onFailure]);
}