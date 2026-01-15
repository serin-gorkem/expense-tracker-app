import { CurrencyCode } from "./currency.model";
import { Category } from "./expense.model";

export type GoalApplyDecision = "APPLY_TO_GOAL" | "SKIP_FOR_TODAY";

export type GoalApplyPayload = {
  amount: number;                 // native amount
  currency: CurrencyCode;         // seçilen currency
  fxStatus?: "live" | "cached" | "locked";
};
export type Goal = {
  id: string;
  title: string;
  description?: string;
  targetAmount: number;
  startDate: Date;
  durationInDays: number;
  status: "active" | "archived" | "paused";

  // 🧠 Contextual
  category?: Category;

  // 🔥 UX için
  lastBoostAt?: string;
  lastBoostAmount?: number;

  //Currency
  currency: CurrencyCode; // goal target currency
  baseCurrency: CurrencyCode;
  baseTargetAmount: number;
};