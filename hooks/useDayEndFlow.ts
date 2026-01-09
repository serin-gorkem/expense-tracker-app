import { Expense } from "@/models/expense.model";
import { Goal } from "@/models/goal.model";
import { dayChangeService } from "@/services/dayChange.service";
import { getLastShownDay, setLastShownDay } from "@/utils/dayEnd/dayEndStorage";
import { useEffect, useState } from "react";

function toDayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

type Params = {
  dailyLimit: number;
  expenses: Expense[];
  activeGoal?: Goal;
  lastExpenseDate: Date;
};

export function useDayEndFlow({
  dailyLimit,
  expenses,
  activeGoal,
  lastExpenseDate,
}: Params) {
  const [showModal, setShowModal] = useState(false);
  const [remainingAmount, setRemainingAmount] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const todayKey = toDayKey(new Date());
      const lastShown = await getLastShownDay();
      if (lastShown === todayKey) return;

      if (!activeGoal || activeGoal.status !== "active") return;

      const result = dayChangeService({
        dailyLimit,
        expenses,
        activeGoal,
        timeOfLatestDay: lastExpenseDate,
      });

      if (
        result.type === "ASK_GOAL_APPLY" &&
        result.remainingAmount > 0
      ) {
        setRemainingAmount(result.remainingAmount);
        setShowModal(true);
        await setLastShownDay(todayKey);
      }
    })();
  }, [expenses, activeGoal, dailyLimit, lastExpenseDate]);

  return {
    showModal,
    remainingAmount,
    closeModal: () => setShowModal(false),
  };
}