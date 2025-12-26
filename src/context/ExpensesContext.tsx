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
  source: "manual" | "auto";
}>;

type ExpensesStore = {
  expenses: Expense[];
  loading: boolean;

  addExpense(expense: Expense): void;
  removeExpense(id: string): void;
  updateExpense(expense: Expense): void;

  limits: LimitsState;
  applyLimitChange(
    period: LimitPeriod,
    patch: LimitPatch,
  ): void;

  financeProfile: FinanceProfile;
  updateFinanceProfile(patch: Partial<FinanceProfile>): void;
  enableAutoLimits(): void;
  disableAutoLimits(): void;
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
      const parsed = JSON.parse(raw);

      setFinanceProfile({
        monthlyIncome: parsed.monthlyIncome ?? null,
        fixedExpenses: parsed.fixedExpenses ?? null,
        autoLimitEnabled: parsed.autoLimitEnabled ?? false,
      });
    } catch {
      setFinanceProfile({
        monthlyIncome: null,
        fixedExpenses: null,
        autoLimitEnabled: false,
      });
    }
  });
}, []);

  useEffect(() => {
    AsyncStorage.setItem(
      "@finance_profile",
      JSON.stringify(financeProfile)
    );
  }, [financeProfile]);

  function updateFinanceProfile(patch: Partial<FinanceProfile>) {
    setFinanceProfile((prev) => ({ ...prev, ...patch }));
  }

  function enableAutoLimits() {
    setFinanceProfile((prev) => ({
      ...prev,
      autoLimitEnabled: true,
    }));
  }

  function disableAutoLimits() {
    setFinanceProfile((prev) => ({
      ...prev,
      autoLimitEnabled: false,
    }));
  }

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
      const parsed = JSON.parse(raw);

      setLimits({
        daily: {
          ...DEFAULT_LIMITS.daily,
          ...parsed.daily,
          source: parsed.daily?.source ?? "manual",
        },
        weekly: {
          ...DEFAULT_LIMITS.weekly,
          ...parsed.weekly,
          source: parsed.weekly?.source ?? "manual",
        },
        monthly: {
          ...DEFAULT_LIMITS.monthly,
          ...parsed.monthly,
          source: parsed.monthly?.source ?? "manual",
        },
      });
    } catch {
      setLimits(DEFAULT_LIMITS);
    }
  });
}, []);

  useEffect(() => {
    AsyncStorage.setItem("@limits", JSON.stringify(limits));
  }, [limits]);

  /* =========================
     USER ACTION → LIMIT CHANGE
  ========================= */

  function enforceLimitConstraints(
  next: LimitsState,
  changed: LimitPeriod
): LimitsState {
  const daily = next.daily.amount;
  const weekly = next.weekly.amount;
  const monthly = next.monthly.amount;

  if (changed === "daily") {
    if (daily > weekly) next.weekly.amount = daily;
    if (next.weekly.amount > monthly)
      next.monthly.amount = next.weekly.amount;
  }

  if (changed === "weekly") {
    if (weekly < daily) next.daily.amount = weekly;
    if (weekly > monthly) next.monthly.amount = weekly;
  }

  if (changed === "monthly") {
    if (monthly < weekly) next.weekly.amount = monthly;
    if (next.weekly.amount < daily)
      next.daily.amount = next.weekly.amount;
  }

  return next;
}

function applyLimitChange(period: LimitPeriod, patch: LimitPatch) {
  setLimits((prev) => {
    const next: LimitsState = {
      daily: { ...prev.daily },
      weekly: { ...prev.weekly },
      monthly: { ...prev.monthly },
    };

    const now = new Date();
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();

    const isAmountChange = patch.amount !== undefined;
    const isActiveChange = patch.active !== undefined;

    /* =========================
       AUTO MODE
    ========================= */

    if (financeProfile.autoLimitEnabled && isAmountChange) {
      if (period === "monthly") {
        const daily = Math.floor(patch.amount! / daysInMonth);
        next.monthly.amount = patch.amount!;
        next.weekly.amount = daily * 7;
        next.daily.amount = daily;
      }

      if (period === "weekly") {
        const daily = Math.floor(patch.amount! / 7);
        next.weekly.amount = patch.amount!;
        next.daily.amount = daily;
        next.monthly.amount = daily * daysInMonth;
      }

      if (period === "daily") {
        next.daily.amount = patch.amount!;
      }

      enforceLimitConstraints(next, period);

      (["daily", "weekly", "monthly"] as LimitPeriod[]).forEach((p) => {
        next[p].source = "auto";
      });

      return next;
    }

    /* =========================
       MANUAL MODE
    ========================= */

    if ((isAmountChange || isActiveChange) && financeProfile.autoLimitEnabled) {
      setFinanceProfile((fp) => ({
        ...fp,
        autoLimitEnabled: false,
      }));
    }

    if (isAmountChange) {
      next[period].amount = patch.amount!;
      enforceLimitConstraints(next, period);
    }

    if (isActiveChange) {
      next[period].active = patch.active!;
    }

    next[period].source = "manual";

    return next;
  });
}

  /* =========================
     AUTO LIMIT RECALC
     🔥 KEY PART
  ========================= */

  useEffect(() => {
    if (!financeProfile.autoLimitEnabled) return;

    const { monthlyIncome, fixedExpenses } = financeProfile;
    if (monthlyIncome == null || fixedExpenses == null) return;

    const auto = calculateAutoLimits({
      monthlyIncome,
      fixedExpenses,
    });

    setLimits((prev: LimitsState) => ({
      ...prev,
      daily: {
        ...prev.daily,
        amount: auto.daily,
        source: "auto",
      },
      weekly: {
        ...prev.weekly,
        amount: auto.weekly,
        source: "auto",
      },
      monthly: {
        ...prev.monthly,
        amount: auto.monthly,
        source: "auto",
      },
    }));
  }, [
    financeProfile.monthlyIncome,
    financeProfile.fixedExpenses,
    financeProfile.autoLimitEnabled,
  ]);

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
    }),
    [store.expenses, store.loading, limits, financeProfile]
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