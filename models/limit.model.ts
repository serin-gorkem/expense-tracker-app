export type LimitPeriod = "daily"| "weekly" | "monthly";

export type LimitStatus = "safe" | "warning" | "exceeded";

export type LimitConfig = {
    period: LimitPeriod,
    amount: number
}