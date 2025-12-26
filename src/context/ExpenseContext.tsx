import { useExpenses } from "@/hooks/useExpenses";
import { LimitPeriod, LimitsState } from "@/models/limit.model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type ExpensesStore = ReturnType<typeof useExpenses> & {
  limits: LimitsState;
  updateLimit: (
    period: LimitPeriod,
    patch: Partial<{ amount: number; active: boolean }>
  ) => void;
};

const ExpensesContext = createContext<ExpensesStore | null>(null);

export function ExpensesProvider({ children }: { children: React.ReactNode }) {
  const store = useExpenses();

  const DEFAULT_LIMITS: LimitsState = {
    daily: { period: "daily", amount: 100, active: true },
    weekly: { period: "weekly", amount: 500, active: true },
    monthly: { period: "monthly", amount: 2000, active: true },
  };

  const [limits, setLimits] = useState<LimitsState>(DEFAULT_LIMITS);

  // 🔹 Load limits
  useEffect(() => {
    AsyncStorage.getItem("@limits").then((raw) => {
      if (raw) setLimits(JSON.parse(raw));
    });
  }, []);

  // 🔹 Persist limits
  useEffect(() => {
    AsyncStorage.setItem("@limits", JSON.stringify(limits));
  }, [limits]);

  // 🔹 Update API
  const updateLimit = (
    period: LimitPeriod,
    patch: Partial<{ amount: number; active: boolean }>
  ) => {
    setLimits((prev) => ({
      ...prev,
      [period]: {
        ...prev[period],
        ...patch,
      },
    }));
  };

  const value = useMemo(
    () => ({
      ...store,
      limits,
      updateLimit,
    }),
    [store.expenses, store.loading, limits]
  );

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpensesStore() {
  const ctx = useContext(ExpensesContext);
  if (!ctx) {
    throw new Error("useExpensesStore must be used within ExpensesProvider");
  }
  return ctx;
}