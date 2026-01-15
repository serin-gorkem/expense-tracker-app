import { CurrencyCode } from "@/models/currency.model";
import { Goal } from "@/models/goal.model";
import { GoalDraft } from "@/src/context/WizardContext";
import * as Crypto from "expo-crypto";

export function createGoalFromDraft(
  draft: GoalDraft,
  defaultTitle: string,
  baseCurrency: CurrencyCode,
  getRate: (currency: CurrencyCode) => number | null
): Goal {
  if (!draft.type || !draft.durationInDays || !draft.targetAmount) {
    throw new Error("Incomplete goal draft");
  }

  const goalCurrency = draft.currency ?? baseCurrency;

  let rate = 1;

  if (goalCurrency !== baseCurrency) {
    const r = getRate(goalCurrency);
    if (!r) {
      throw new Error("FX rate unavailable for goal currency");
    }
    rate = r;
  }

  const baseTargetAmount = Number((draft.targetAmount * rate).toFixed(2));

  return {
    id: Crypto.randomUUID(),
    title: draft.customTitle ?? defaultTitle,
    description: undefined,

    targetAmount: draft.targetAmount,
    currency: goalCurrency,

    baseCurrency,
    baseTargetAmount,

    startDate: new Date(),
    durationInDays: draft.durationInDays,
    category: draft.category,

    status: "active",
  };
}
