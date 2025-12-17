//Change expense data.Filter based on mode.Applies category and search.Contains pure functions.
import { Category, Expense } from "@/models/expense.model";

export type ViewMode = "daily" | "weekly" | "monthly";

//Filter the expenses based on ViewMode daily , weekly, monthly.
export function filterByMode(expenses: Expense[], mode: ViewMode): Expense[] {
  
  switch (mode) {
    case "daily":
      let startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      let endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      return expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate <= endOfDay && expenseDate >= startOfDay;
      });

    case "weekly":
      break;

    case "monthly":
      break;

    default:
      return expenses;
  }

  return expenses;
}


//Filter the expenses based on their category. Food, Entertainment, Bill, etc.
export function filterByCategory(
  expenses: Expense[],
  category: Category | "all"
): Expense[] {
  if (category === "all") {
    return expenses;
  }
  return expenses.filter((expense) => expense.category === category);
}

//Filter the expenses based on the search bar input. 
export function filterBySearch(expenses: Expense[], query: string): Expense[] {
  if (query === "") {
    return expenses;
  }
  const result = expenses.filter((expense) => {
    const title = expense.title.toLowerCase().trim();

    return title.includes(query.toLowerCase().trim());
  });
  return result;
}

//Pure function.
//Create filter priority. Mode > Category > Search
export function selectVisibleExpenses(
  expenses: Expense[],
  options: {
    mode: ViewMode;
    category: Category | "all";
    query: string;
  }
): Expense[] {

  const step1 = filterByMode(expenses,options.mode);
  const step2 = filterByCategory(step1, options.category);
  const step3 = filterBySearch(step2,options.query);

  return step3;
}
