import { Expense } from "@/models/expense.model";
import { InsightItem } from "@/models/insight.model";
import { getDailyTotals, getExpensesByDay, isWeekend } from './insightRules';
const SPIKE_MULTIPLIER = 2.5;
const DROP_MULTIPLIER = 0.3;
const WEEKEND_SPIKE_MULTIPLIER = 1.3;

type BehavioralInsightsProps = {
  expenses: Expense[];
  dailyLimit: number;
};

function getWeekendSpendingInsight({
  expenses,
  dailyLimit
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
      title: "Weekend spending pattern detected",
      tone: isOverDailyLimit ? "negative" : "neutral",
      description: isOverDailyLimit
        ? "Your weekend spending is consistently higher than weekdays and exceeds your daily limit. This could affect your budget."
        : "Your average spending on weekends is noticeably higher than on weekdays. This might be worth keeping an eye on.",
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
    const dayTotal = dayExpenses.reduce(
      (sum, e) => sum + Number(e.amount),
      0
    );

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
    title: "Daily limit frequently exceeded",
    tone: isSevere ? "negative" : "neutral",
    description: isSevere
      ? "You exceed your daily spending limit on many days. This frequent overspending may make it hard to stay within your budget."
      : "You exceed your daily spending limit on several days. Being more mindful on those days could help improve consistency.",
  };
}
function getMostExpensiveWeekdayInsight({
  expenses,
  dailyLimit,
}: BehavioralInsightsProps): InsightItem | null {
  if (expenses.length < 7) return null;

  // 0 (Sun) → 6 (Sat)
  const totalsByWeekday: Record<number, { total: number; days: Set<string> }> =
    { 0:{total:0,days:new Set()},1:{total:0,days:new Set()},
      2:{total:0,days:new Set()},3:{total:0,days:new Set()},
      4:{total:0,days:new Set()},5:{total:0,days:new Set()},
      6:{total:0,days:new Set()} };

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
      return count === 0
        ? null
        : { day: Number(day), avg: data.total / count };
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

  const weekdayNames = [
    "Sunday","Monday","Tuesday","Wednesday",
    "Thursday","Friday","Saturday"
  ];

  return {
    type: "behavioral_inconsistent_days",
    title: `${weekdayNames[mostExpensive.day]} tends to be more expensive`,
    tone: isOverLimit ? "negative" : "neutral",
    description: isOverLimit
      ? `Your spending on ${weekdayNames[mostExpensive.day]} is consistently higher and often exceeds your daily limit. Planning ahead for this day could help control costs.`
      : `You tend to spend more on ${weekdayNames[mostExpensive.day]} compared to other days. Being aware of this pattern may help with budgeting.`,
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
    const isOverDailyLimit = max > dailyLimit *2;
      return {
        type: "behavioral_inconsistent_days",
        title: "Spending pattern looks inconsistent",
        tone: isOverDailyLimit ? "negative" : "neutral",
        description: isOverDailyLimit
          ? "Your spending fluctuates heavily between days, and some days exceed your daily limit by a large margin. This level of variation can make it difficult to stay in control of your budget."
          : "Your spending varies significantly from day to day. Some days are much higher than others, which may make budgeting harder.",
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
  const behavioralExpenses = expenses.filter(
    (e) => e.kind === "behavioral"
  );

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
