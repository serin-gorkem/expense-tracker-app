import { Expense } from "@/models/expense.model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const STORAGE_KEY = "expenses";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);


  // Load on startup.
  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const value = await AsyncStorage.getItem(STORAGE_KEY);
        if (value !== null) {
          const parsed: Expense[] = JSON.parse(value);
          setExpenses(parsed);
        }
      } catch (error) {
        console.log("Failed to load expenses", error);
      } finally {
        setLoading(false);
      }
    };
    loadExpenses();
  }, []);


// Save on change
  useEffect(() => {
    const saveExpenses = async () =>{
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
      } catch (error) {
        console.log("Failed to save expenses", error);
      }
    }
    saveExpenses();
  }, [expenses]);


// Add expense.
  const addExpense = (expense: Expense) => {
    setExpenses((prev) => [...prev, expense]);
  };

// Delete expense.
  const removeExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

// Update expense.
  const updateExpense = (updated: Expense) => {
    setExpenses((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  }
  

  return {
    expenses,
    addExpense,
    removeExpense,
    updateExpense,
    loading,
  };
}
