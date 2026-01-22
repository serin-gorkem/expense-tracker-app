import { CurrencyCode } from "@/models/currency.model";
import { Expense } from "@/models/expense.model";

type FXDiffResult = {
  snapshotBase: number;
  currentBase: number;
  difference: number;
};

export function calculateFXDifference(
  expense: Expense,
  currentRates: Record<CurrencyCode, number>, // currency -> base
  baseCurrency: CurrencyCode,
): FXDiffResult | null {
  const fx = expense.fx;

  if (!fx || fx.currency === baseCurrency) return null;
  if (fx.locked) return null;

  const rate = currentRates[fx.currency];
  if (!rate) return null;

  const currentBase = Number((expense.amount * rate).toFixed(2));
  const difference = Number((currentBase - fx.baseAmount).toFixed(2));

  return {
    snapshotBase: fx.baseAmount,
    currentBase,
    difference,
  };
}
