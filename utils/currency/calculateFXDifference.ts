import { CurrencyCode } from "@/models/currency.model";
import { Expense } from "@/models/expense.model";

type FXDiffResult = {
  snapshotBase: number;
  currentBase: number;
  difference: number;
};

export function calculateFXDifference(
  expense: Expense,
  currentRates: Record<CurrencyCode, number>,
  baseCurrency: CurrencyCode
): FXDiffResult | null {
  const fx = expense.fx;

  // Base currency expense → FX farkı yok
  if (!fx || fx.currency === baseCurrency) return null;

  // Locked expense → FX farkı anlamsız
  if (fx.locked) return null;

  const currentRate = currentRates[fx.currency];
  if (!currentRate) return null;

  const currentBase = Number(
    (expense.amount * currentRate).toFixed(2)
  );

  const difference = Number(
    (currentBase - fx.baseAmount).toFixed(2)
  );

  return {
    snapshotBase: fx.baseAmount,
    currentBase,
    difference,
  };
}