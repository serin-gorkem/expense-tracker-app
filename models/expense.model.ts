// Domain models for expense tracking

export type Category =
  | "food"
  | "transport"
  | "entertainment"
  | "shopping"
  | "health"
  | "bills"
  | "education"
  | "other";


  export type ExpenseKind = "behavioral" | "structural" | "goal";

export const EXPENSE_KIND_META: Record<
  ExpenseKind,
  {
    labelKey: string;
    descriptionKey: string;
  }
> = {
  behavioral: {
    labelKey: "expenseKind.behavioral.label",
    descriptionKey: "expenseKind.behavioral.desc",
  },
  structural: {
    labelKey: "expenseKind.structural.label",
    descriptionKey: "expenseKind.structural.desc",
  },
  goal: {
    labelKey: "expenseKind.goal.label",
    descriptionKey: "expenseKind.goal.desc",
  },
};

export const CATEGORY_OPTIONS = [
  { key: "food" },
  { key: "transport" },
  { key: "entertainment" },
  { key: "shopping" },
  { key: "health" },
  { key: "bills" },
  { key: "education" },
  { key: "other" },
] as const;

export type Expense = {
  id: string;
  title: string;
  amount: number;
  category: Category;
  date: string; // ISO date String.
  kind: ExpenseKind
  
    // 🔥 GOAL BOOST
  isGoalBoost?: boolean;
  goalId?: string;
  boostAmount?: number;
};

