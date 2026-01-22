import { OnboardingData, OnboardingStep } from "@/models/onboarding.types";

type Resolver = (ctx: OnboardingData) => OnboardingStep;

export const NEXT_STEP: Record<OnboardingStep, OnboardingStep | Resolver> = {
  [OnboardingStep.Welcome]: OnboardingStep.AutoLimit,

  [OnboardingStep.AutoLimit]: (ctx) =>
    ctx.useAutoLimits ? OnboardingStep.Income : OnboardingStep.GoalWizard,

  [OnboardingStep.Income]: OnboardingStep.FixedExpenses,

  [OnboardingStep.FixedExpenses]: OnboardingStep.GoalWizard,

  [OnboardingStep.GoalWizard]: (ctx) =>
    ctx.useAutoLimits ? OnboardingStep.Preview : OnboardingStep.ManualLimits,

  [OnboardingStep.ManualLimits]: OnboardingStep.Done,

  [OnboardingStep.Preview]: OnboardingStep.Done,

  [OnboardingStep.Done]: OnboardingStep.Done,
};

export const PREV_STEP: Record<OnboardingStep, OnboardingStep | Resolver> = {
  [OnboardingStep.Welcome]: OnboardingStep.Welcome,

  [OnboardingStep.AutoLimit]: OnboardingStep.Welcome,

  [OnboardingStep.Income]: OnboardingStep.AutoLimit,

  [OnboardingStep.FixedExpenses]: OnboardingStep.Income,

  [OnboardingStep.GoalWizard]: (ctx) =>
    ctx.useAutoLimits ? OnboardingStep.FixedExpenses : OnboardingStep.AutoLimit,

  [OnboardingStep.ManualLimits]: OnboardingStep.GoalWizard,

  [OnboardingStep.Preview]: OnboardingStep.GoalWizard,

  [OnboardingStep.Done]: OnboardingStep.Done,
};
