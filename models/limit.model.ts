export type LimitPeriod = "daily" | "weekly" | "monthly";

export type LimitStatus = "safe" | "warning" | "exceeded";

export type LimitResult = {
  total: number;
  ratio: number; // total / limit
  status: LimitStatus;
};
export type LimitConfig = {
  period: LimitPeriod;
  amount: number;
  active: boolean;
};
export type LimitsState = {
  daily: LimitConfig;
  weekly: LimitConfig;
  monthly: LimitConfig;
};
const DEFAULT_LIMITS: LimitsState = {
  daily: { period: "daily", amount: 100, active: true },
  weekly: { period: "weekly", amount: 500, active: true },
  monthly: { period: "monthly", amount: 2000, active: true },
};
