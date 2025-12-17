// Domain models for expense tracking

export type Category =
  | "food"
  | "transport"
  | "entertainment"
  | "other";

export type Expense = {
  id: string;
  title: string;
  amount: number;
  category: Category;
  date: string; // ISO date String.
};

