import { Expense } from "@/models/expense.model";

export type GroupedExpenses = {
  label: string;
  expenses: Expense[];
  startOfWeek?: Date;
  startOfMonth?: Date;
};

// #region Week Grouping
//Helper Functions
export function getStartOfWeek(date: Date): Date {
  const d = new Date(date);

  d.setHours(0, 0, 0, 0);

  const day = d.getDay();

  //Wednesday = 3, For Monday 1 - 3 = -2 days. Add it to current date.
  const diff = day === 0 ? -6 : 1 - day;

  d.setDate(d.getDate() + diff);

  return d;
}
function formatWeekLabel(startOfWeek: Date): string {
  const start = new Date(startOfWeek);

  const end = new Date(startOfWeek);
  end.setDate(end.getDate() + 6);

  const startDay = start.getDate();
  const endDay = end.getDate();

  const monthFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
  });

  const startMonth = monthFormatter.format(start);
  const endMonth = monthFormatter.format(end);

  if (startMonth === endMonth) {
    return `${startDay}–${endDay} ${startMonth}`;
  }

  return `${startDay} ${startMonth}–${endDay} ${endMonth}`;
}
//Group Function
export function groupExpensesByWeek(expenses: Expense[]): GroupedExpenses[] {
  const groups: Record<string, Expense[]> = {};

  expenses.forEach((expense) => {
    const date = new Date(expense.date);
    const startOfWeek = getStartOfWeek(date);
    const key = startOfWeek.toISOString();

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(expense);
  });

  return Object.entries(groups)
    .map(([key, expenses]) => {
      const startOfWeek = new Date(key);
      return {
        label: formatWeekLabel(startOfWeek),
        expenses,
        startOfWeek, // 🔴 ARTIK KAYBOLMUYOR
      };
    })
    .sort((a, b) => a.startOfWeek!.getTime() - b.startOfWeek!.getTime());
}
// #endregion

//#region Month Grouping

//Helper Functions
export function getStartOfMonth(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  d.setHours(0, 0, 0, 0);
  return d;
}
export function getEndOfMonth(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  d.setHours(0, 0, 0, 0);
  return d;
}
function formatMonthLabel(startOfMonth: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(startOfMonth);
}
//Group Function
export function groupExpensesByMonth(expenses: Expense[]): GroupedExpenses[] {
  const groups: Record<string, Expense[]> = {};

  expenses.forEach((expense) => {
    const date = new Date(expense.date);
    const startOfMonth = getStartOfMonth(date);
    const key = startOfMonth.toISOString();
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(expense);
  });
  return Object.entries(groups)
    .map(([key, expenses]) => {
      const startOfMonth = new Date(key);
      return {
        label: formatMonthLabel(startOfMonth),
        expenses,
        startOfMonth, // temporary for sorting
      };
    })
    .sort((a, b) => a.startOfMonth.getTime() - b.startOfMonth.getTime())
    .map(({ label, expenses }) => ({ label, expenses }));
}
// #endregion