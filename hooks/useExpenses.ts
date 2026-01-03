import { Expense } from "@/models/expense.model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const EXPENSES_KEY = "expenses";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  /* LOAD */
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(EXPENSES_KEY);
        if (stored) setExpenses(JSON.parse(stored));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* SAVE */
  useEffect(() => {
    AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses)).catch(
      () => {}
    );
  }, [expenses]);

  const addExpense = (expense: Expense) =>
    setExpenses((prev) => [...prev, expense]);

  const removeExpense = (id: string) =>
    setExpenses((prev) => prev.filter((e) => e.id !== id));

  const updateExpense = (expense: Expense) =>
    setExpenses((prev) =>
      prev.map((e) => (e.id === expense.id ? { ...e, ...expense } : e))
    );

  return {
    expenses,
    loading,
    addExpense,
    removeExpense,
    updateExpense,
  };
}
