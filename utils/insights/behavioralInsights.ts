import { Expense } from "@/models/expense.model";
import { InsightItem } from "@/models/insight.model";
import { getDailyTotals, getExpensesByDay, isWeekend } from "./insightRules";
const SPIKE_MULTIPLIER = 2.5;
const DROP_MULTIPLIER = 0.3;
const WEEKEND_SPIKE_MULTIPLIER = 1.3;

type BehavioralInsightsProps = {
  expenses: Expense[];
  dailyLimit: number;
};

function getWeekendSpendingInsight({
  expenses,
  dailyLimit,
}: BehavioralInsightsProps): InsightItem | null {
  const weekendExpenses = expenses.filter((expense) => {
    const day = new Date(expense.date);
    return isWeekend(day);
  });
  const weekdayExpenses = expenses.filter((expense) => {
    const day = new Date(expense.date);
    return !isWeekend(day);
  });

  const weekendDays = getExpensesByDay(weekendExpenses);
  const weekDays = getExpensesByDay(weekdayExpenses);

  if (weekDays.size < 2 || weekendDays.size < 2) return null;

  const weekdayTotals = weekdayExpenses.reduce(
    (sum, d) => sum + Number(d.amount),
    0
  );
  const weekendTotals = weekendExpenses.reduce(
    (sum, d) => sum + Number(d.amount),
    0
  );

  const weekdayAverage = weekdayTotals / weekDays.size;
  const weekendAverage = weekendTotals / weekendDays.size;

  if (weekendAverage >= weekdayAverage * WEEKEND_SPIKE_MULTIPLIER) {
    const isOverDailyLimit = weekendAverage > dailyLimit;
    return {
      type: "behavioral_weekend_spike",
      titleKey: "insights.behavioral.weekendSpike.title",
      descriptionKey: isOverDailyLimit
        ? "insights.behavioral.weekendSpike.descOverLimit"
        : "insights.behavioral.weekendSpike.desc",
      tone: isOverDailyLimit ? "negative" : "neutral",
    };
  }
  return null;
}
function getOverLimitFrequencyInsight({
  expenses,
  dailyLimit,
}: BehavioralInsightsProps): InsightItem | null {
  const dailyExpenses = getExpensesByDay(expenses);

  const totalDays = dailyExpenses.size;
  if (totalDays < 5) return null;

  let overLimitDays = 0;

  for (const dayExpenses of dailyExpenses.values()) {
    const dayTotal = dayExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

    if (dayTotal > dailyLimit) {
      overLimitDays += 1;
    }
  }

  const ratio = overLimitDays / totalDays;

  // ⛔ Too weak → no insight
  if (ratio <= 0.25) return null;

  const isSevere = ratio > 0.4;

  return {
    type: "behavioral_over_limit_frequency",
    titleKey: "insights.behavioral.overLimit.title",
    descriptionKey: isSevere
      ? "insights.behavioral.overLimit.descSevere"
      : "insights.behavioral.overLimit.desc",
    tone: isSevere ? "negative" : "neutral",
  };
}
function getMostExpensiveWeekdayInsight({
  expenses,
  dailyLimit,
}: BehavioralInsightsProps): InsightItem | null {
  if (expenses.length < 7) return null;

  // 0 (Sun) → 6 (Sat)
  const totalsByWeekday: Record<number, { total: number; days: Set<string> }> =
    {
      0: { total: 0, days: new Set() },
      1: { total: 0, days: new Set() },
      2: { total: 0, days: new Set() },
      3: { total: 0, days: new Set() },
      4: { total: 0, days: new Set() },
      5: { total: 0, days: new Set() },
      6: { total: 0, days: new Set() },
    };

  for (const e of expenses) {
    const d = new Date(e.date);
    const day = d.getDay();
    const dayKey = d.toISOString().slice(0, 10);

    totalsByWeekday[day].total += Number(e.amount);
    totalsByWeekday[day].days.add(dayKey);
  }

  // Average per weekday
  const averages = Object.entries(totalsByWeekday)
    .map(([day, data]) => {
      const count = data.days.size;
      return count === 0 ? null : { day: Number(day), avg: data.total / count };
    })
    .filter(Boolean) as { day: number; avg: number }[];

  if (averages.length < 3) return null;

  const overallAverage =
    averages.reduce((s, d) => s + d.avg, 0) / averages.length;

  const mostExpensive = averages.reduce((max, cur) =>
    cur.avg > max.avg ? cur : max
  );

  if (mostExpensive.avg < overallAverage * 1.25) return null;

  const isOverLimit = mostExpensive.avg > dailyLimit;

  return {
    type: "behavioral_inconsistent_days",
    titleKey: "insights.behavioral.expensiveWeekday.title",
    descriptionKey: isOverLimit
      ? "insights.behavioral.expensiveWeekday.descOverLimit"
      : "insights.behavioral.expensiveWeekday.desc",
    tone: isOverLimit ? "negative" : "neutral",
  };
}
function getInconsistentDaysInsight({
  expenses,
  dailyLimit,
}: BehavioralInsightsProps): InsightItem | null {
  const dailyTotals = getDailyTotals(expenses);
  if (dailyTotals.size < 4) {
    return null;
  }
  const values = Array.from(dailyTotals.values());

  const average = values.reduce((sum, v) => sum + v, 0) / values.length;
  if (average < 1) return null;

  const max = Math.max(...values);
  const min = Math.min(...values);

  if (max >= average * SPIKE_MULTIPLIER && min <= average * DROP_MULTIPLIER) {
    const isOverDailyLimit = max > dailyLimit * 2;
    return {
      type: "behavioral_inconsistent_days",
      titleKey: "insights.behavioral.inconsistent.title",
      descriptionKey: isOverDailyLimit
        ? "insights.behavioral.inconsistent.descOverLimit"
        : "insights.behavioral.inconsistent.desc",
      tone: isOverDailyLimit ? "negative" : "neutral",
    };
  }
  return null;
}

function isInsight(item: InsightItem | null): item is InsightItem {
  return item !== null;
}

export function behavioralInsights({
  expenses,
  dailyLimit,
}: BehavioralInsightsProps): InsightItem[] {
  // ✅ SADECE BEHAVIORAL EXPENSES
  const behavioralExpenses = expenses.filter((e) => e.kind === "behavioral");

  if (behavioralExpenses.length === 0) return [];

  const weekendSpendingInsight = getWeekendSpendingInsight({
    expenses: behavioralExpenses,
    dailyLimit,
  });

  const overLimitFrequencyInsight = getOverLimitFrequencyInsight({
    expenses: behavioralExpenses,
    dailyLimit,
  });

  const mostExpensiveWeekdayInsight = getMostExpensiveWeekdayInsight({
    expenses: behavioralExpenses,
    dailyLimit,
  });

  const inconsistentDaysInsight = getInconsistentDaysInsight({
    expenses: behavioralExpenses,
    dailyLimit,
  });

  return [
    weekendSpendingInsight,
    overLimitFrequencyInsight,
    mostExpensiveWeekdayInsight,
    inconsistentDaysInsight,
  ].filter(isInsight);
}