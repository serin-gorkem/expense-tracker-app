import ExpenseList from "@/components/ExpenseList/ExpenseList";
import { useExpenses } from "@/hooks/useExpenses";
import { Category } from "@/models/expense.model";
import { selectVisibleExpenses, ViewMode } from "@/utils/expenseSelectors";
import { useState } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [mode, setMode] = useState<ViewMode>("daily");
  const [category, setCategory] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");
  const options = {
    mode,
    category,
    query,
  };
  const { expenses, loading } = useExpenses();

  const visibleExpenses = selectVisibleExpenses(expenses, options);

  return (
    <SafeAreaView>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <ExpenseList expenses={visibleExpenses} />
      )}
    </SafeAreaView>
  );
}
