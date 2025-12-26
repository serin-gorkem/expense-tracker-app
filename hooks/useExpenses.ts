import { Expense } from "@/models/expense.model";
import { LimitPeriod, LimitsState } from "@/models/limit.model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const EXPENSES_KEY = "expenses";
const LIMITS_KEY = "limits";

const DEFAULT_LIMITS: LimitsState = {
  daily:   { period: "daily", amount: 100, active: true },
  weekly:  { period: "weekly", amount: 500, active: true },
  monthly: { period: "monthly", amount: 2000, active: true },
};

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [limits, setLimits] = useState<LimitsState>(DEFAULT_LIMITS);
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD ---------------- */

  useEffect(() => {
    (async () => {
      try {
        const storedExpenses = await AsyncStorage.getItem(EXPENSES_KEY);
        const storedLimits = await AsyncStorage.getItem(LIMITS_KEY);

        if (storedExpenses) {
          setExpenses(JSON.parse(storedExpenses));
        }

        if (storedLimits) {
          setLimits(JSON.parse(storedLimits));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------------- SAVE ---------------- */

  useEffect(() => {
    AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses)).catch(() => {});
  }, [expenses]);

  useEffect(() => {
    AsyncStorage.setItem(LIMITS_KEY, JSON.stringify(limits)).catch(() => {});
  }, [limits]);

  /* ---------------- ACTIONS ---------------- */

  const addExpense = (expense: Expense) =>
    setExpenses(prev => [...prev, expense]);

  const removeExpense = (id: string) =>
    setExpenses(prev => prev.filter(e => e.id !== id));

  const updateExpense = (expense: Expense) =>
    setExpenses(prev =>
      prev.map(e => (e.id === expense.id ? expense : e))
    );

  const setLimit = (period: LimitPeriod, amount: number) =>
    setLimits(prev => ({
      ...prev,
      [period]: {
        ...prev[period],
        amount,
      },
    }));

  return {
    expenses,
    limits,
    loading,

    addExpense,
    removeExpense,
    updateExpense,

    setLimit,
  };
}