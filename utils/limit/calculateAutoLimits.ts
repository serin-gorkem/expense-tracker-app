export type AutoLimitResult = {
  daily: number;
  weekly: number;
  monthly: number;
};

export function calculateAutoLimits(params: {
  monthlyIncome: number;
  fixedExpenses: number;
  date?: Date;
}): AutoLimitResult {
  const { monthlyIncome, fixedExpenses } = params;

  const baseDate = params.date ?? new Date();
  const daysInMonth = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth() + 1,
    0
  ).getDate();

  const disposable = Math.max(0, monthlyIncome - fixedExpenses);

  const daily = Math.floor(disposable / daysInMonth);
  const weekly = daily * 7;
  const monthly = disposable;

  return { daily, weekly, monthly };
}