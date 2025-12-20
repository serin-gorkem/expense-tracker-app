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

  export const CATEGORY_OPTIONS = [
    { key: "food", label: "Food" },
    { key: "transport", label: "Transport" },
    { key: "entertainment", label: "Entertainment" },
    { key: "shopping", label: "Shopping" },
    { key: "health", label: "Health" },
    { key: "bills", label: "Bills" },
    { key: "education", label: "Education" },
    { key: "other", label: "Other" },
  ] as const;

export type Expense = {
  id: string;
  title: string;
  amount: number;
  category: Category;
  date: string; // ISO date String.
};

