// utils/currency/calculateCurrencyExposure.ts

import { CurrencyCode, CurrencyExposure } from "@/models/currency.model";
import { Expense } from "@/models/expense.model";

export function calculateCurrencyExposure(
  expenses: Expense[],
  baseCurrency: CurrencyCode
): CurrencyExposure[] {
  if (!expenses || expenses.length === 0) return [];

const totals: Partial<Record<CurrencyCode, { native: number; base: number }>> =
  {};

  for (const e of expenses) {
    const currency = e.fx?.currency ?? baseCurrency;

    if (!totals[currency]) {
      totals[currency] = { native: 0, base: 0 };
    }

    totals[currency].native += e.amount;
    totals[currency].base += e.fx?.baseAmount ?? e.amount;
  }

  const grandTotalBase = Object.values(totals).reduce(
    (sum, v) => sum + v.base,
    0
  );

  if (grandTotalBase <= 0) return [];

  return Object.entries(totals).map(([currency, v]) => ({
    currency: currency as CurrencyCode,
    totalAmount: Number(v.native.toFixed(2)),
    totalBaseAmount: Number(v.base.toFixed(2)),
    percentage: Number(
      ((v.base / grandTotalBase) * 100).toFixed(1)
    ),
  }));
}