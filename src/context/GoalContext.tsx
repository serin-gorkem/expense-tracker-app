import { Expense } from "@/models/expense.model";
import { Goal } from "@/models/goal.model";
import { createContext, useContext, useState } from "react";

/* =========================
   Types
========================= */
type GoalsStore = {
  goals: Goal[];
  activeGoal?: Goal;

  createGoal(goal: Goal): void;
  deleteGoal(id: string): void;
  setActiveGoal(id: string): void;
  updateGoal(id: string,patch: Partial<Goal>): void;
  
  toggleGoal(id: string): void;

  calculateGoalProgress(goalId: string, expenses: Expense[]): number;
};

/* =========================
   Context
========================= */

const GoalsContext = createContext<GoalsStore | null>(null);

export function GoalsProvider({ children }: { children: React.ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);

  const activeGoal = goals.find((g) => g.id === activeGoalId);

  const value = {
    goals,
    activeGoal,
    createGoal,
    updateGoal,
    deleteGoal,
    setActiveGoal,
    toggleGoal,
    calculateGoalProgress,
  };

  function toggleGoal(id: string) {
    const exists = goals.find((g) => g.id === id);
    if (!exists || exists.status === "completed") return;

    const mappedGoals = goals.map((goal) => {
      if (goal.id === id) {
        return {
          ...goal,
          status:
            goal.status === "active"
              ? ("paused" as const)
              : ("active" as const),
        };
      }

      if (goal.status === "active") {
        return { ...goal, status: "paused" as const };
      }

      return goal;
    });

    setGoals(mappedGoals);
    setActiveGoalId(exists.status === "active" ? null : id);
  }
function updateGoal(id: string, patch: Partial<Goal>) {
  setGoals((prev) =>
    prev.map((g) =>
      g.id === id
        ? {
            ...g,
            ...patch,
          }
        : g
    )
  );
}
  function calculateGoalProgress(goalId: string, expenses: Expense[]) {
    return expenses
      .filter((e) => e.isGoalBoost && e.goalId === goalId)
      .reduce((sum, e) => sum + (e.boostAmount ?? e.amount), 0);
  }

  function deleteGoal(id: string) {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    setActiveGoalId((prev) => (prev === id ? null : prev));
  }

  function createGoal(goal: Goal) {
    if (
      goals.find((g) => {
        return g.id === goal.id;
      })
    ) {
      throw new Error("This goal already exist.");
    }
    const mappedGoals = goals.map((g) => {
      if (g.status === "active") {
        return { ...g, status: "paused" as const };
      } else {
        return { ...g };
      }
    });

    const newGoal = { ...goal, status: "active" as const };

    const newGoals = [...mappedGoals, newGoal];

    setGoals(newGoals);
    setActiveGoalId(goal.id);
  }

  function setActiveGoal(id: string | null) {
    if (id !== null && !goals.some((g) => g.id === id)) {
      throw new Error("Goal not found");
    }
    const mappedGoals = goals.map((goal) => {
      if (id !== null) {
        if (goal.id === id) {
          return { ...goal, status: "active" as const };
        } else {
          return { ...goal, status: "paused" as const };
        }
      } else {
        return { ...goal, status: "paused" as const };
      }
    });
    setGoals(mappedGoals);
    setActiveGoalId(id);
  }

  return (
    <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>
  );
}

export function useGoalsStore() {
  const ctx = useContext(GoalsContext);
  if (!ctx) {
    throw new Error("useGoalsStore must be used within GoalsProvider");
  }
  return ctx;
}