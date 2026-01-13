import { CurrencyCode } from "@/models/currency.model";
import { ExpenseFXSnapshot } from "@/models/expense.model";

type BuildFXInput = {
  amount: number;
  currency: CurrencyCode;
  baseCurrency: CurrencyCode;

  rate: number;
  status: "live" | "cached" | "locked";
};

export function buildFXSnapshot({
  amount,
  currency,
  baseCurrency,
  rate,
  status,
}: BuildFXInput): ExpenseFXSnapshot {
  const baseAmount =
    currency === baseCurrency
      ? amount
      : Number((amount * rate).toFixed(2));

  return {
    currency,
    fxRate: rate,
    baseAmount,
    fxStatus: status,
    fxDate: new Date().toISOString(),

    locked: status === "locked",
    manualRate: status === "locked" ? rate : undefined,
  };
}