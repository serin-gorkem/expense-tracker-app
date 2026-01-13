import { CurrencyCode } from "./currency.model";

export type FinanceProfile = {
  monthlyIncome: number | null;
  fixedExpenses: number | null;
  autoLimitEnabled: boolean;
  baseCurrency:CurrencyCode;
};