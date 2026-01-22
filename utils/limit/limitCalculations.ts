import { CurrencyCode } from "@/models/currency.model";
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
  rates,
  baseCurrency,
}: {
  expenses: Expense[];
  period: LimitPeriod;
  limitAmount: number;
  rates: Record<CurrencyCode, number> | null;
  baseCurrency: CurrencyCode;
}): LimitResult | null {
  if (limitAmount <= 0) return null;

  const { start, end } = getDateRange(period);
  const relevantExpenses = filterExpensesForLimit(expenses, period);

  const total = relevantExpenses
    .filter((e) => {
      const d = new Date(e.date);
      return d >= start && d <= end;
    })
    .reduce((sum, e) => {
      // ✅ expense zaten base currency ise
      if (e.fx.currency === baseCurrency) {
        return sum + e.amount;
      }

      // ✅ FX yoksa fallback (güvenlik)
      if (!rates) {
        return sum + e.fx.baseAmount;
      }

      const rate = rates[e.fx.currency];
      if (!rate || rate <= 0) {
        return sum + e.fx.baseAmount;
      }

      // 🔥 ASIL KRİTİK SATIR
      // expense amount → new base currency
      const converted = e.amount * rate;

      return sum + converted;
    }, 0);

  const ratio = total / limitAmount;
  const remaining = Math.max(limitAmount - total, 0);

  let status: LimitResult["status"] = "safe";
  if (ratio >= 1) status = "exceeded";
  else if (ratio >= 0.6) status = "warning";

  return {
    total: Number(total.toFixed(2)),
    ratio,
    remaining: Number(remaining.toFixed(2)),
    status,
  };
}
