import { CurrencyCode } from "@/models/currency.model";
import { LimitsState } from "@/models/limit.model";

export function convertLimitsToNewBase(params: {
  limits: LimitsState;
  from: CurrencyCode;
  to: CurrencyCode;
  rates: Record<CurrencyCode, number> | null;
}): LimitsState {
  const { limits, from, to, rates } = params;

  if (from === to) return limits;
  if (!rates) return limits;

  const rateToNewBase = rates[to];
  if (!rateToNewBase || rateToNewBase <= 0) return limits;

  const convert = (amount: number) =>
    Number((amount / rateToNewBase).toFixed(2));

  return {
    daily: { ...limits.daily, amount: convert(limits.daily.amount) },
    weekly: { ...limits.weekly, amount: convert(limits.weekly.amount) },
    monthly: { ...limits.monthly, amount: convert(limits.monthly.amount) },
  };
}
