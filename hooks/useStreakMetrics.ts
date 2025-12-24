// hooks/useStreakMetrics.ts
import { Expense } from "@/models/expense.model";
import { calculateStreakMetrics } from "@/utils/streak/streakMetrics";
import { useMemo } from "react";

export type UseStreakMetricsProps = {
  expenses: Expense[];
  dailyLimit: number;
};

export function useStreakMetrics({ expenses, dailyLimit }: UseStreakMetricsProps) {
  return useMemo(() => {
    return calculateStreakMetrics({ expenses, dailyLimit });
  }, [expenses, dailyLimit]);
}