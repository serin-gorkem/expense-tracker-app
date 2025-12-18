import AddExpenseForm from "@/components/AddExpenseForm/AddExpenseForm";
import EditExpenseForm from "@/components/EditExpenseForm/EditExpenseForm";
import ExpenseList from "@/components/ExpenseList/ExpenseList";
import ModeSwitcher from "@/components/ModeSwitcher/ModeSwitcher";
import { useExpenses } from "@/hooks/useExpenses";
import { Category, Expense } from "@/models/expense.model";
import { selectVisibleExpenses, ViewMode } from "@/utils/expenseSelectors";
import { useMemo, useState } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [mode, setMode] = useState<ViewMode>("daily");
  const [category, setCategory] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const options = useMemo(
    () => ({
      mode,
      category,
      query,
    }),
    [mode, category, query]
  );

  const { expenses, addExpense, removeExpense, updateExpense, loading } =
    useExpenses();

  const visibleExpenses = selectVisibleExpenses(expenses, options);

  const handleUpdate = (expense: Expense) => {
    updateExpense(expense);
    setEditingExpense(null);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ModeSwitcher value={mode} onChange={setMode} />

      {editingExpense ? (
        <EditExpenseForm
          expense={editingExpense}
          onSubmit={handleUpdate}
          onCancel={() => setEditingExpense(null)}
        ></EditExpenseForm>
      ) : (
        <>
          <AddExpenseForm onSubmit={addExpense} />
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            <ExpenseList
              expenses={visibleExpenses}
              onDelete={removeExpense}
              onEdit={setEditingExpense}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
}
