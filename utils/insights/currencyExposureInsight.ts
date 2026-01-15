// utils/insights/currencyExposureInsight.ts

import { CurrencyCode } from "@/models/currency.model";
import { Expense } from "@/models/expense.model";
import { InsightItem } from "@/models/insight.model";
import { calculateCurrencyExposure } from "@/utils/currency/calculateCurrencyExposure";

export function buildCurrencyExposureInsight({
  expenses,
  baseCurrency,
}: {
  expenses: Expense[];
  baseCurrency: CurrencyCode;
}): InsightItem | null {
  const exposure = calculateCurrencyExposure(expenses, baseCurrency);

  if (exposure.length <= 1) return null;

  const top = exposure.sort(
    (a, b) => b.percentage - a.percentage
  )[0];

  return {
    type: "currency_exposure",
    titleKey: "insights.currency_exposure.title",
    descriptionKey: "insights.currency_exposure.description",
    params: {
      currency: top.currency,
      percent: top.percentage,
    },
    tone: "neutral",
  };
}