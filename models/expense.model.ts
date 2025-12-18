// Domain models for expense tracking

export type Category =
  | "food"
  | "health"
  | "transport"
  | "entertainment"
  | "shopping"
  | "other";

  export const CATEGORY_OPTIONS = [
    { key: "food", label: "Food" },
    { key: "health", label: "Health" },
    { key: "transport", label: "Transport" },
    { key: "entertainment", label: "Fun" },
    { key: "shopping", label: "Shopping" },
    { key: "other", label: "Other" },
  ] as const;

export type Expense = {
  id: string;
  title: string;
  amount: number;
  category: Category;
  date: string; // ISO date String.
};

