import { CurrencyCode } from "@/models/currency.model";

export enum OnboardingStep {
  Welcome = 0,
  AutoLimit = 1,
  Income = 2,
  FixedExpenses = 3,
  GoalWizard = 4,
  ManualLimits = 5,
  Preview = 6,
  Done = 7,
}

export type OnboardingData = {
  useAutoLimits: boolean;
  baseCurrency: CurrencyCode | null;
};
