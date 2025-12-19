import AddExpenseForm from "@/components/AddExpenseForm/AddExpenseForm";
import CategoryFilter from "@/components/CategoryFilter/CategoryFilter";
import EditExpenseForm from "@/components/EditExpenseForm/EditExpenseForm";
import ExpenseList from "@/components/ExpenseList/ExpenseList";
import ModeSwitcher from "@/components/ModeSwitcher/ModeSwitcher";
import MonthlyExpenseList from "@/components/MonthlyExpenseList/MonthlyExpenseList";
import WeeklyExpenseList from "@/components/WeeklyExpenseList/WeeklyExpenseList";
import { useExpenses } from "@/hooks/useExpenses";
import { Category, Expense } from "@/models/expense.model";
import {
  groupExpensesByMonth,
  groupExpensesByWeek,
} from "@/utils/expenseGrouping";
import { selectVisibleExpenses, ViewMode } from "@/utils/expenseSelectors";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [mode, setMode] = useState<ViewMode>("daily");
  const [category, setCategory] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [lastDeletedExpense, setLastDeletedExpense] = useState<Expense | null>(
    null
  );

  const options = useMemo(
    () => ({
      mode,
      category,
      query,
    }),
    [mode, category, query]
  );

  useEffect(() => {
    if (!lastDeletedExpense) return;
    const timer = setTimeout(() => setLastDeletedExpense(null), 4000);
    return () => clearTimeout(timer);
  }, [lastDeletedExpense]);

  const { expenses, addExpense, removeExpense, updateExpense, loading } =
    useExpenses();

  const visibleExpenses = selectVisibleExpenses(expenses, options);

  const handleUpdate = (expense: Expense) => {
    updateExpense(expense);
    setEditingExpense(null);
  };

  const handleDelete = (expenseId: string) => {
    const expenseToDelete = expenses.find((e) => e.id === expenseId);
    if (!expenseToDelete) return;
    removeExpense(expenseId);
    setLastDeletedExpense(expenseToDelete);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.root}>
        {/* Background (liquid blobs + gradient) */}
        <LinearGradient
          colors={["#050816", "#070A2A", "#0B1238", "#050816"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Decorative blobs */}
        <View style={[styles.blob, styles.blobA]} />
        <View style={[styles.blob, styles.blobB]} />
        <View style={[styles.blob, styles.blobC]} />

        <SafeAreaView style={styles.safe}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Welcome To</Text>
              <Text style={styles.subtitle}>Expense Manage Databoard</Text>
            </View>

            <ModeSwitcher value={mode} onChange={setMode} />

            {editingExpense ? (
              <EditExpenseForm
                expense={editingExpense}
                onSubmit={handleUpdate}
                onCancel={() => setEditingExpense(null)}
              />
            ) : (
              <>
                <AddExpenseForm onSubmit={addExpense} />
                <CategoryFilter category={category} setCategory={setCategory} />

                {loading ? (
                  <Text style={styles.loading}>Loading...</Text>
                ) : mode === "weekly" ? (
                  <WeeklyExpenseList
                    groups={groupExpensesByWeek(visibleExpenses)}
                    onDelete={handleDelete}
                    onEdit={setEditingExpense}
                  />
                ) : mode === "monthly" ? (
                  <MonthlyExpenseList
                    groups={groupExpensesByMonth(visibleExpenses)}
                    onDelete={handleDelete}
                    onEdit={setEditingExpense}
                  />
                ) : (
                  <ExpenseList
                    expenses={visibleExpenses}
                    onDelete={handleDelete}
                    onEdit={setEditingExpense}
                  />
                )}
              </>
            )}

            {lastDeletedExpense && (
              <View style={styles.toast}>
                <Text style={styles.toastText}>Expense deleted</Text>
                <Pressable
                  onPress={() => {
                    addExpense(lastDeletedExpense);
                    setLastDeletedExpense(null);
                  }}
                  hitSlop={10}
                >
                  <Text style={styles.toastAction}>UNDO</Text>
                </Pressable>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 16, paddingTop: 6 },
  header: { marginBottom: 10 },
  title: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: 2,
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
  },
  loading: { color: "rgba(255,255,255,0.75)", marginTop: 12 },

  blob: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 999,
    opacity: 0.35,
  },
  blobA: { top: -120, left: -90, backgroundColor: "#5B7CFF" },
  blobB: { top: 80, right: -140, backgroundColor: "#8B5CFF", opacity: 0.25 },
  blobC: { bottom: -160, left: 40, backgroundColor: "#22D3EE", opacity: 0.18 },

  toast: {
    position: "absolute",
    bottom: 18,
    left: 16,
    right: 16,
    backgroundColor: "rgba(17,24,39,0.75)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toastText: { color: "rgba(255,255,255,0.85)" },
  toastAction: { color: "#93C5FD", fontWeight: "800", letterSpacing: 0.2 },
});
