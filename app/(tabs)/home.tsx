import AddExpenseForm from "@/components/AddExpenseForm/AddExpenseForm";
import CategoryFilter from "@/components/CategoryFilter/CategoryFilter";
import EditExpenseForm from "@/components/EditExpenseForm/EditExpenseForm";
import EmptyState from "@/components/EmptyState/EmptyState";
import ExpenseList from "@/components/ExpenseList/ExpenseList";
import ExpenseListHint from "@/components/ExpenseListHint/ExpenseListHint";
import InsightSection from "@/components/InsightSection/InsightSection";
import { LimitCard } from "@/components/LimitCard/LimitCard";
import ModeSwitcher from "@/components/ModeSwitcher/ModeSwitcher";
import MonthlyExpenseList from "@/components/MonthlyExpenseList/MonthlyExpenseList";
import SearchBar from "@/components/SearchBar/SearchBar";
import { StreakBadge } from "@/components/StreakBadge/StreakBadge";
import { StreakCelebration } from "@/components/StreakCelebration/StreakCelebration";
import WeeklyExpenseList from "@/components/WeeklyExpenseList/WeeklyExpenseList";

import { useStreakCelebration } from "@/hooks/useStreakCelebrations";
import { useStreakMetrics } from "@/hooks/useStreakMetrics";
import { useStreakMilestones } from "@/hooks/useStreakMilestones";
import { useExpensesStore } from "../../src/context/ExpensesContext";

import { Category, Expense } from "@/models/expense.model";
import {
  groupExpensesByMonth,
  groupExpensesByWeek,
} from "@/utils/expense/expenseGrouping";
import { selectVisibleExpenses, ViewMode } from "@/utils/expense/expenseSelectors";
import { haptic } from "@/utils/haptics";
import { calculateLimitStatus } from "@/utils/limit/limitCalculations";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [mode, setMode] = useState<ViewMode>("daily");
  const [category, setCategory] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [lastDeletedExpense, setLastDeletedExpense] = useState<Expense | null>(
    null
  );
  const [showExpenseHint, setShowExpenseHint] = useState(false);

  const options = useMemo(
    () => ({ mode, category, query }),
    [mode, category, query]
  );

  const {
    expenses,
    limits,
    addExpense,
    removeExpense,
    updateExpense,
    loading,
  } = useExpensesStore();

  const activeLimit = limits[mode];

  const limitResult = activeLimit.active
    ? calculateLimitStatus({
        expenses,
        period: mode,
        limitAmount: activeLimit.amount,
      })
    : null;

  const visibleExpenses = selectVisibleExpenses(expenses, options);

  const isGlobalEmpty = expenses.length === 0;
  const isFilteredEmpty = expenses.length > 0 && visibleExpenses.length === 0;

  const monthlyChartExpenses = selectVisibleExpenses(expenses, {
    ...options,
    category: "all",
  });

  const streakMetrics = useStreakMetrics({
    expenses,
    dailyLimit: limits.daily.amount,
  });
  useStreakMilestones(streakMetrics.currentStreak); // side-effect store unlock

  const { celebration, dismiss } = useStreakCelebration(
    streakMetrics.currentStreak,
    expenses.length
  );

  useEffect(() => {
    if (!lastDeletedExpense) return;
    const timer = setTimeout(() => setLastDeletedExpense(null), 4000);
    return () => clearTimeout(timer);
  }, [lastDeletedExpense]);

  useEffect(() => {
    const checkHint = async () => {
      try {
        const seen = await AsyncStorage.getItem("@expense_list_hint_seen");
        if (!seen) setShowExpenseHint(true);
      } catch {}
    };
    checkHint();
  }, []);

  const dismissExpenseHint = async () => {
    setShowExpenseHint(false);
    try {
      await AsyncStorage.setItem("@expense_list_hint_seen", "true");
    } catch {}
  };

  const handleUpdate = (expense: Expense) => {
    updateExpense(expense);
    setEditingExpense(null);
  };

  const handleDelete = (expenseId: string) => {
    const expenseToDelete = expenses.find((e) => e.id === expenseId);
    if (!expenseToDelete) return;
    removeExpense(expenseId);
    haptic.warning();
    setLastDeletedExpense(expenseToDelete);
  };

  const keyboard = useAnimatedKeyboard();
  const searchBarStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboard.height.value }],
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.root}>
        <LinearGradient
          colors={["#050816", "#070A2A", "#0B1238", "#050816"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />

        <View style={[styles.blob, styles.blobA]} />
        <View style={[styles.blob, styles.blobB]} />
        <View style={[styles.blob, styles.blobC]} />

        <SafeAreaView style={styles.safe}>
          {celebration && (
            <StreakCelebration result={celebration} onDismiss={dismiss} />
          )}

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 180 }}
            keyboardDismissMode="on-drag"
          >
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Home</Text>
                <Text style={styles.subtitle}>Expense Manage Dashboard</Text>
              </View>
              {streakMetrics.hasActiveStreak && (
                <StreakBadge count={streakMetrics.currentStreak} />
              )}
            </View>

            <InsightSection
              expenses={expenses}
              mode={mode}
              streakMetrics={streakMetrics}
              dailyLimit={limits.daily.amount}
            />

            {limitResult && (
              <LimitCard
                period={mode}
                total={limitResult.total}
                ratio={limitResult.ratio}
                status={limitResult.status}
                limitAmount={activeLimit.amount}
              />
            )}

            <ModeSwitcher value={mode} onChange={setMode} />

            {editingExpense ? (
              <EditExpenseForm
                expense={editingExpense}
                onSubmit={handleUpdate}
                onCancel={() => setEditingExpense(null)}
              />
            ) : (
              <>
                {/* İstersen bunu Home’dan kaldırırız; Add tab’ı varken burada kalabalık yapıyor. */}
                <AddExpenseForm onSubmit={addExpense} />

                <CategoryFilter category={category} setCategory={setCategory} />
                {showExpenseHint && (
                  <ExpenseListHint onDismiss={dismissExpenseHint} />
                )}

                {query.length > 0 && (
                  <Text style={styles.searchMeta}>
                    Showing results for “{query}”
                  </Text>
                )}

                {!loading && isGlobalEmpty && (
                  <EmptyState
                    title="No expenses yet"
                    description="Start adding your expenses to see them here."
                  />
                )}

                {!loading && isFilteredEmpty && (
                  <EmptyState
                    title="No expenses found"
                    description="Try adjusting your search or filter to find what you're looking for."
                  />
                )}

                {loading && <Text style={styles.loading}>Loading...</Text>}

                {!loading &&
                  !isGlobalEmpty &&
                  !isFilteredEmpty &&
                  (mode === "weekly" ? (
                    <WeeklyExpenseList
                      groups={groupExpensesByWeek(visibleExpenses)}
                      onDelete={handleDelete}
                      onEdit={setEditingExpense}
                    />
                  ) : mode === "monthly" ? (
                    <MonthlyExpenseList
                      groups={groupExpensesByMonth(visibleExpenses)}
                      chartGroups={groupExpensesByMonth(monthlyChartExpenses)}
                      selectedCategory={category}
                      onSelectCategory={setCategory}
                      onDelete={handleDelete}
                      onEdit={setEditingExpense}
                    />
                  ) : (
                    <ExpenseList
                      expenses={visibleExpenses}
                      onDelete={handleDelete}
                      onEdit={setEditingExpense}
                    />
                  ))}
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

          <Animated.View style={[styles.searchWrapper, searchBarStyle]}>
            <SearchBar value={query} onChange={setQuery} />
          </Animated.View>
        </SafeAreaView>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 16, paddingTop: 6 },
  header: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
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
    bottom: 80,
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
    zIndex: 100,
    elevation: 10,
  },
  toastText: { color: "rgba(255,255,255,0.85)" },
  toastAction: { color: "#93C5FD", fontWeight: "800", letterSpacing: 0.2 },

  searchWrapper: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "rgba(17,24,39,0.55)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    zIndex: 999,
    elevation: 12,
  },
  searchMeta: {
    marginTop: 8,
    marginBottom: 4,
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    fontWeight: "600",
  },
});
