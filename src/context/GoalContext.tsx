import { Goal } from "@/models/goal.model";
import { createContext, useContext, useState } from "react";

/* =========================
   Types
========================= */

type GoalsStore = {
  goals: Goal[];
  activeGoal?: Goal | undefined;

  createGoal(goal: Goal): void;
  updateGoal(goal: Goal): void;
  deleteGoal(id: string): void;
  setActiveGoal(id: string): void;
  applyDailyRemainingToGoal(amount: number): void;
  toggleGoal(id: string): void;
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
    applyDailyRemainingToGoal,
    toggleGoal,
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
  function updateGoal(updated: Goal) {
    setGoals((prev) =>
      prev.map((g) => (g.id === updated.id ? { ...g, ...updated } : g))
    );
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

  function applyDailyRemainingToGoal(amount: number) {
    if (amount <= 0) {
      return;
    }
    if (
      !goals.find((goal) => {
        return goal.status === "active";
      })
    ) {
      return;
    }
    let didCompleted = false;
    const mappedGoals = goals.map((goal) => {
      if (goal.status === "active") {
        const newAmount = goal.savedAmount + amount;
        if (newAmount >= goal.targetAmount) {
          didCompleted = true;
          return {
            ...goal,
            status: "completed" as const,
            savedAmount: newAmount as number,
          };
        } else {
          return { ...goal, status: "active" as const };
        }
      } else {
        return { ...goal };
      }
    });

    setGoals(mappedGoals);
    if (didCompleted) {
      setActiveGoalId(null);
    }
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