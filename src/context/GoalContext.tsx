import { Expense } from "@/models/expense.model";
import { Goal } from "@/models/goal.model";
import { createContext, useContext, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
/* =========================
   Types
========================= */
type GoalsStore = {
  goals: Goal[];
  activeGoal?: Goal;

  createGoal(goal: Goal): void;
  deleteGoal(id: string): void;
  setActiveGoal(id: string | null): void;
  updateGoal(id: string, patch: Partial<Goal>): void;
  archiveGoal(id:string): void;
  resetGoals(): void;

  toggleGoal(id: string): void;

  calculateGoalProgress(goalId: string, expenses: Expense[]): number;
};
type GoalsPersisted = {
  goals: (Omit<Goal, "startDate"> & { startDate: string })[];
  activeGoalId: string | null;
};

/* =========================
   STORAGE
========================= */


const STORAGE_KEY = "@goals_store_v1";

function serialize(goals: Goal[], activeGoalId: string | null): GoalsPersisted {
  return {
    goals: goals.map((g) => ({
      ...g,
      startDate: g.startDate instanceof Date ? g.startDate.toISOString() : new Date(g.startDate).toISOString(),
    })),
    activeGoalId,
  };
}

function deserialize(data: GoalsPersisted): { goals: Goal[]; activeGoalId: string | null } {
  return {
    goals: data.goals.map((g) => ({
      ...g,
      startDate: new Date(g.startDate),
    })),
    activeGoalId: data.activeGoalId,
  };
}

/* =========================
   Context
========================= */

const GoalsContext = createContext<GoalsStore | null>(null);

export function GoalsProvider({ children }: { children: React.ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  
  const activeGoal = goals.find((g) => g.id === activeGoalId);

  const value = {
    goals,
    activeGoal,
    createGoal,
    updateGoal,
    archiveGoal,
    deleteGoal,
    setActiveGoal,
    toggleGoal,
    calculateGoalProgress,
    resetGoals,
  };
    // LOAD
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) {
          setHydrated(true);
          return;
        }
        const parsed: GoalsPersisted = JSON.parse(raw);
        const restored = deserialize(parsed);

        setGoals(restored.goals);
        setActiveGoalId(restored.activeGoalId);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  // SAVE (hydrated olduktan sonra)
  useEffect(() => {
    if (!hydrated) return;
    (async () => {
      const payload = serialize(goals, activeGoalId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    })();
  }, [goals, activeGoalId, hydrated]);

  function toggleGoal(id: string) {
    const exists = goals.find((g) => g.id === id);
    if (!exists) return;

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
  function resetGoals() {
  setGoals([]);
  setActiveGoalId(null);
}
  function archiveGoal(id: string) {
  setGoals((prev) =>
    prev.map((g) =>
      g.id === id ? { ...g, status: "archived" as const } : g
    )
  );
  setActiveGoalId((prev) => (prev === id ? null : prev));
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
