import { useExpenses } from "@/hooks/useExpenses";
import { Expense } from "@/models/expense.model";
import { FinanceProfile } from "@/models/financeProfile.model";
import { LimitPeriod, LimitsState } from "@/models/limit.model";
import { calculateAutoLimits } from "@/utils/limit/calculateAutoLimits";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/* =========================
   Types
========================= */

type LimitPatch = Partial<{
  amount: number;
  active: boolean;
}>;

type ExpensesStore = {
  expenses: Expense[];
  loading: boolean;

  addExpense(expense: Expense): void;
  removeExpense(id: string): void;
  updateExpense(expense: Expense): void;

  limits: LimitsState;
  applyLimitChange(period: LimitPeriod, patch: LimitPatch): void;

  financeProfile: FinanceProfile;
  updateFinanceProfile(patch: Partial<FinanceProfile>): void;

  enableAutoLimits(): void;
  disableAutoLimits(): void;
  applySuggestedLimits(): void;

  disposableIncome: number | null;
  dailyBaseline: number | null;
};

const ExpensesContext = createContext<ExpensesStore | null>(null);

/* =========================
   Provider
========================= */

export function ExpensesProvider({ children }: { children: React.ReactNode }) {
  const store = useExpenses();

  /* =========================
     Finance Profile
  ========================= */

  const [financeProfile, setFinanceProfile] = useState<FinanceProfile>({
    monthlyIncome: null,
    fixedExpenses: null,
    autoLimitEnabled: false,
  });

  useEffect(() => {
    AsyncStorage.getItem("@finance_profile").then((raw) => {
      if (!raw) return;
      try {
        setFinanceProfile(JSON.parse(raw));
      } catch {}
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("@finance_profile", JSON.stringify(financeProfile));
  }, [financeProfile]);

  function updateFinanceProfile(patch: Partial<FinanceProfile>) {
    setFinanceProfile((prev) => ({ ...prev, ...patch }));
  }

  function enableAutoLimits() {
    setFinanceProfile((p) => ({ ...p, autoLimitEnabled: true }));
  }

  function disableAutoLimits() {
    setFinanceProfile((p) => ({ ...p, autoLimitEnabled: false }));
  }

  /* =========================
     Baseline Math (Phase 1)
  ========================= */

  const disposableIncome =
    financeProfile.monthlyIncome != null &&
    financeProfile.fixedExpenses != null
      ? Math.max(
          financeProfile.monthlyIncome - financeProfile.fixedExpenses,
          0
        )
      : null;

  const dailyBaseline =
    disposableIncome != null
      ? Math.floor(
          disposableIncome /
            new Date(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              0
            ).getDate()
        )
      : null;

  /* =========================
     Limits
  ========================= */

  const DEFAULT_LIMITS: LimitsState = {
    daily: { period: "daily", amount: 100, active: true, source: "manual" },
    weekly: { period: "weekly", amount: 500, active: true, source: "manual" },
    monthly: { period: "monthly", amount: 2000, active: true, source: "manual" },
  };

  const [limits, setLimits] = useState<LimitsState>(DEFAULT_LIMITS);

  useEffect(() => {
    AsyncStorage.getItem("@limits").then((raw) => {
      if (!raw) return;
      try {
        setLimits({ ...DEFAULT_LIMITS, ...JSON.parse(raw) });
      } catch {}
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("@limits", JSON.stringify(limits));
  }, [limits]);

  /* =========================
     Constraint Logic
  ========================= */

  function enforceConstraints(next: LimitsState, changed: LimitPeriod) {
    const d = next.daily.amount;
    const w = next.weekly.amount;
    const m = next.monthly.amount;

    if (changed === "daily") {
      if (d > w) next.weekly.amount = d;
      if (next.weekly.amount > m)
        next.monthly.amount = next.weekly.amount;
    }

    if (changed === "weekly") {
      if (w < d) next.daily.amount = w;
      if (w > m) next.monthly.amount = w;
    }

    if (changed === "monthly") {
      if (m < w) next.weekly.amount = m;
      if (next.weekly.amount < d)
        next.daily.amount = next.weekly.amount;
    }

    return next;
  }

  /* =========================
     User Limit Change
  ========================= */

  function applyLimitChange(period: LimitPeriod, patch: LimitPatch) {
    setLimits((prev) => {
      if (financeProfile.autoLimitEnabled && patch.amount !== undefined) {
        return prev;
      }

      const next: LimitsState = {
        daily: { ...prev.daily },
        weekly: { ...prev.weekly },
        monthly: { ...prev.monthly },
      };

      if (patch.amount !== undefined) {
        next[period].amount = patch.amount;
        enforceConstraints(next, period);
        next[period].source = "manual";
      }

      if (patch.active !== undefined) {
        next[period].active = patch.active;
      }

      return next;
    });
  }

  /* =========================
     Auto Limit Recalc
  ========================= */

  useEffect(() => {
    if (!financeProfile.autoLimitEnabled) return;

    const { monthlyIncome, fixedExpenses } = financeProfile;
    if (monthlyIncome == null || fixedExpenses == null) return;

    const auto = calculateAutoLimits({ monthlyIncome, fixedExpenses });

    setLimits((prev) => ({
      ...prev,
      daily: { ...prev.daily, amount: auto.daily, source: "auto" },
      weekly: { ...prev.weekly, amount: auto.weekly, source: "auto" },
      monthly: { ...prev.monthly, amount: auto.monthly, source: "auto" },
    }));
  }, [
    financeProfile.monthlyIncome,
    financeProfile.fixedExpenses,
    financeProfile.autoLimitEnabled,
  ]);

  /* =========================
     Suggested Limits CTA
  ========================= */

  function applySuggestedLimits() {
    const { monthlyIncome, fixedExpenses } = financeProfile;
    if (monthlyIncome == null || fixedExpenses == null) return;

    const auto = calculateAutoLimits({ monthlyIncome, fixedExpenses });

    setLimits((prev) => ({
      ...prev,
      daily: { ...prev.daily, amount: auto.daily, source: "auto" },
      weekly: { ...prev.weekly, amount: auto.weekly, source: "auto" },
      monthly: { ...prev.monthly, amount: auto.monthly, source: "auto" },
    }));

    enableAutoLimits();
  }

  /* =========================
     Context Value
  ========================= */

  const value = useMemo(
    () => ({
      ...store,
      limits,
      applyLimitChange,
      financeProfile,
      updateFinanceProfile,
      enableAutoLimits,
      disableAutoLimits,
      applySuggestedLimits,
      disposableIncome,
      dailyBaseline,
    }),
    [store.expenses, store.loading, limits, financeProfile, disposableIncome, dailyBaseline]
  );

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
}

/* =========================
   Hook
========================= */

export function useExpensesStore() {
  const ctx = useContext(ExpensesContext);
  if (!ctx) {
    throw new Error("useExpensesStore must be used within ExpensesProvider");
  }
  return ctx;
}