import { Expense } from "@/models/expense.model";
import { LimitPeriod, LimitResult } from "@/models/limit.model";
import { filterExpensesForLimit } from "@/utils/expense/expenseLimitFilter";

function getDateRange(period: LimitPeriod) {
  const start = new Date();
  const end = new Date();

  if (period === "daily") {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  }

  if (period === "weekly") {
    start.setHours(0, 0, 0, 0);
    const day = start.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + diff);

    end.setTime(start.getTime());
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
  }

  if (period === "monthly") {
    start.setHours(0, 0, 0, 0);
    start.setDate(1);

    end.setMonth(start.getMonth() + 1);
    end.setDate(0);
    end.setHours(23, 59, 59, 999);
  }

  return { start, end };
}

export function calculateLimitStatus({
  expenses,
  period,
  limitAmount,
}: {
  expenses: Expense[];
  period: LimitPeriod;
  limitAmount: number;
}): LimitResult | null {
  if (limitAmount <= 0) return null;

  const { start, end } = getDateRange(period);
  
const relevantExpenses = filterExpensesForLimit(expenses, period);

const total = relevantExpenses
  .filter((e) => {
    const d = new Date(e.date);
    return d >= start && d <= end;
  })
  .reduce((sum, e) => sum + e.amount, 0);

  const ratio = total / limitAmount;
  const remaining = Math.max(limitAmount - total,0);

  let status: LimitResult["status"] = "safe";
  if (ratio >= 1) status = "exceeded";
  else if (ratio >= 0.6) status = "warning";

  return { total, ratio, status, remaining };
}
