import { Expense } from "@/models/expense.model";
import { LimitPeriod, LimitStatus } from "@/models/limit.model";

type CalculateLimitStatusProps = {
  expenses: Expense[];
  period: LimitPeriod;
  limitAmount: number;
};

function getDateRangeForPeriod(period: LimitPeriod): {
  start: Date;
  end: Date;
} {
  let start = new Date();
  let end = new Date();
  switch (period) {
    case "daily":
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    case "weekly":
      start.setHours(0, 0, 0, 0);

      const day = start.getDay();
      const diff = day === 0 ? -6 : 1 - day;

      start.setDate(start.getDate() + diff);

      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    case "monthly":
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      start = new Date(start.getFullYear(), start.getMonth(), 1);
      end = new Date(end.getFullYear(), start.getMonth() + 1, 0);
      return { start, end };
    default:
      break;
  }
  return { start, end };
}

function calculateTotalForRange(
  expenses: Expense[],
  range: { start: Date; end: Date }
): number {
  const filtred = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= range.start && expenseDate <= range.end;
  });
  const total = filtred.reduce((sum, d) => sum + d.amount, 0);
  return total;
}

export function calculateLimitStatus({
  expenses,
  period,
  limitAmount,
}: CalculateLimitStatusProps): {
  total: number;
  ratio: number;
  status: LimitStatus;
} | null {
  const { start, end } = getDateRangeForPeriod(period);

  const total = calculateTotalForRange(expenses, { start, end });

  if (limitAmount <= 0) return null;
  const ratio = total / limitAmount;

  let status: LimitStatus;

  if (ratio < 0.5) {
    status = "safe";
  } else if (ratio < 1) {
    status = "warning";
  } else {
    status = "exceeded";
  }
  return {
    total,
    ratio,
    status,
  };
}