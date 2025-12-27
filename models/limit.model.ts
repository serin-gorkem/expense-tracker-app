export type LimitPeriod = "daily" | "weekly" | "monthly";

export type LimitStatus = "safe" | "warning" | "exceeded";

export type LimitSource = "manual" | "auto";

export type LimitResult = {
  total: number;
  ratio: number; // total / limit
  status: LimitStatus;
};
export type LimitConfig = {
  period: LimitPeriod;
  amount: number;
  active: boolean;

  source: LimitSource;
  graceDaysPerMonth?: number;
};
export type LimitsState = {
  daily: LimitConfig;
  weekly: LimitConfig;
  monthly: LimitConfig;
};
