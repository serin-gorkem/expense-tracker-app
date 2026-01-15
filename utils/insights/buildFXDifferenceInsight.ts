import { CurrencyCode } from "@/models/currency.model";
import { Expense } from "@/models/expense.model";
import { InsightItem } from "@/models/insight.model";
import { calculateFXDifference } from "@/utils/currency/calculateFXDifference";

export function buildFXDifferenceInsight({
  expenses,
  currentRates,
  baseCurrency,
}: {
  expenses?: Expense[];
  currentRates: Record<CurrencyCode, number>;
  baseCurrency: CurrencyCode;
}): InsightItem | null {
  // 🔒 HARD GUARDS
  if (!expenses || expenses.length === 0) return null;
  if (!currentRates || Object.keys(currentRates).length === 0) return null;

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const monthlyExpenses = expenses.filter((e) => {
    if (!e?.date || !e.fx) return false;
    const d = new Date(e.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  if (monthlyExpenses.length === 0) return null;

  const totalDifference = monthlyExpenses.reduce((sum, expense) => {
    const diff = calculateFXDifference(
      expense,
      currentRates,
      baseCurrency
    );
    if (!diff) return sum;
    return sum + diff.difference;
  }, 0);

  const rounded = Number(totalDifference.toFixed(2));

  // Anlamsız fark → insight üretme
  if (Math.abs(rounded) < 1) return null;

  const positive = rounded < 0;

  return {
    type: "fx_difference",
    titleKey: "insights.fx_difference.title",
    descriptionKey: positive
      ? "insights.fx_difference.less"
      : "insights.fx_difference.more",
    params: {
      amount: Math.abs(rounded),
    },
    tone: positive ? "positive" : "negative",
  };
}