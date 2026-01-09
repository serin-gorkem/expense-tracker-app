import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  buildMonthlyCategoryDonutData,
  buildWeeklyLineChartData,
} from "@/utils/expense/expenseChart";
import {
  groupExpensesByMonth,
  groupExpensesByWeek,
} from "@/utils/expense/expenseGrouping";
import { useExpensesStore } from "../../src/context/ExpensesContext";

import BaselineCard from "@/components/BaseLineCard/BaseLineCard";
import MonthlyCategoryDonutChart from "@/components/Charts/MonthlyCategoryDonutChart";
import WeeklyLineChart from "@/components/Charts/WeeklyLineChart";
import ConsistencyCalendar from "@/components/Consistency/ConsistencyCalendar";

import DayDetailModal from "@/components/Consistency/DayDetailsModal";
import BehavioralInsightSection from "@/components/InsightSection/BehavioralInsightSection";
import FinancialInsightSection from "@/components/InsightSection/FinancialInsightSection";
import { LiquidBackground } from "@/components/ui/LiquidBackground";
import { useGoalsStore } from "@/src/context/GoalContext";
import { buildConsistencyDayMap } from "@/utils/consistency/buildDailyConsistencyMap";
import { getExpensesByDay } from "@/utils/insights/insightRules";
import { useMemo, useState } from "react";
export default function Insights() {
  const { expenses, limits } = useExpensesStore();
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);

const expensesByDay = useMemo(() => getExpensesByDay(expenses), [expenses]);
  const { activeGoal } = useGoalsStore();
  const dailyLimit = limits.daily.amount;

  const monthGroups = groupExpensesByMonth(expenses);
  const weekGroups = groupExpensesByWeek(expenses);

  const donutData = buildMonthlyCategoryDonutData(monthGroups);
  const lineData = buildWeeklyLineChartData(weekGroups);
  const [month, setMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const dayMap = useMemo(
    () =>
      buildConsistencyDayMap({
        expenses,
        dailyLimit,
        month,
        activeGoal: activeGoal ?? null,
      }),
    [expenses, dailyLimit, month, activeGoal]
  );

  const goPrevMonth = () =>
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));

  const goNextMonth = () =>
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));

  return (
    <View style={styles.root}>
      <LiquidBackground />

      <SafeAreaView style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 28 }}
        >
          <Text style={styles.title}>Insights</Text>
          <Text style={styles.subtitle}>
            Charts and analytics based on your expenses.
          </Text>

          {expenses.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No data yet</Text>
              <Text style={styles.emptyDesc}>
                Add a few expenses to unlock insights.
              </Text>
            </View>
          ) : (
            <View style={styles.container}>
              <BaselineCard />

              <ConsistencyCalendar
                month={month}
                dayMap={dayMap}
                onSelectDay={setSelectedDayKey}
                onPrevMonth={goPrevMonth}
                onNextMonth={goNextMonth}
              />
              <DayDetailModal
                dayKey={selectedDayKey}
                dayInfo={selectedDayKey ? dayMap[selectedDayKey] : null}
                expenses={
                  selectedDayKey ? expensesByDay.get(selectedDayKey) ?? [] : []
                }
                onClose={() => setSelectedDayKey(null)}
              />

              {donutData.length > 0 && (
                <MonthlyCategoryDonutChart data={donutData} />
              )}
              {lineData.length > 0 && <WeeklyLineChart data={lineData} />}
              <FinancialInsightSection expenses={expenses} />
              <BehavioralInsightSection
                expenses={expenses}
                dailyLimit={dailyLimit}
              />
              <View style={styles.card}>
                <Text style={styles.cardTitle}>
                  More insights will unlock as you use the app
                </Text>

                <Text style={styles.item}>
                  • Spending consistency over time
                </Text>
                <Text style={styles.item}>
                  • Recovery after overspending days
                </Text>
                <Text style={styles.item}>
                  • Your strongest and weakest days
                </Text>
                <Text style={styles.item}>• Limit behavior patterns</Text>

                <Text style={styles.itemMuted}>
                  These insights appear gradually as your data becomes
                  meaningful.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
  title: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 6,
  },
  subtitle: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    marginBottom: 14,
  },
  itemMuted: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 11,
    marginTop: 8,
  },
  container: { gap: 8 },
  emptyCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(17,24,39,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  emptyTitle: {
    color: "rgba(255,255,255,0.9)",
    fontWeight: "800",
    fontSize: 14,
  },
  emptyDesc: { color: "rgba(255,255,255,0.6)", marginTop: 6, fontSize: 12 },
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(17,24,39,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  cardTitle: {
    color: "rgba(255,255,255,0.9)",
    fontWeight: "800",
    marginBottom: 8,
  },
  item: { color: "rgba(255,255,255,0.75)", fontSize: 12, marginBottom: 6 },
});
