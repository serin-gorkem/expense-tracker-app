import { LinearGradient } from "expo-linear-gradient";
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
import {
  getMonthlyChangeInsightData,
  getTopCategoryInsightData,
  getWeeklyAverageInsightData,
} from "@/utils/expense/expenseInsights";
import { useExpensesStore } from "../../src/context/ExpensesContext";

import BaselineCard from "@/components/BaseLineCard/BaseLineCard";
import MonthlyCategoryDonutChart from "@/components/Charts/MonthlyCategoryDonutChart";
import WeeklyLineChart from "@/components/Charts/WeeklyLineChart";
import ConsistencyCalendar from "@/components/Consistency/ConsistencyCalendar";

import { buildConsistencyDayMap } from "@/utils/consistency/buildDailyConsistencyMap";
import { useMemo, useState } from "react";

export default function Insights() {
  const { expenses, limits } = useExpensesStore();
  const dailyLimit = limits.daily.amount;


const monthGroups = groupExpensesByMonth(expenses);
const weekGroups = groupExpensesByWeek(expenses);

const donutData = buildMonthlyCategoryDonutData(monthGroups);
const lineData = buildWeeklyLineChartData(weekGroups);

const monthlyChange = getMonthlyChangeInsightData(expenses);
const topCategory = getTopCategoryInsightData(expenses);
const weeklyAvg = getWeeklyAverageInsightData(expenses);

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
    }),
  [expenses, dailyLimit, month]
);

  const goPrevMonth = () =>
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));

  const goNextMonth = () =>
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#050816", "#070A2A", "#0B1238", "#050816"]}
        style={StyleSheet.absoluteFillObject}
      />

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
                onPrevMonth={goPrevMonth}
                onNextMonth={goNextMonth}
              />

              {donutData.length > 0 && (
                <MonthlyCategoryDonutChart data={donutData} />
              )}
              {lineData.length > 0 && <WeeklyLineChart data={lineData} />}

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Quick insights</Text>

                {monthlyChange && (
                  <Text style={styles.item}>
                    You spent {Math.abs(monthlyChange.percentageChange)}%
                    {monthlyChange.percentageChange > 0 ? " more" : " less"}{" "}
                    than last month.
                  </Text>
                )}

                {topCategory && (
                  <Text style={styles.item}>
                    Most of your spending went to {topCategory.category}.
                  </Text>
                )}

                {weeklyAvg && (
                  <Text style={styles.item}>
                    Your weekly average is ₺
                    {Math.round(weeklyAvg.weeklyAverage)}.
                  </Text>
                )}

                {!monthlyChange && !topCategory && !weeklyAvg && (
                  <Text style={styles.item}>
                    Not enough history for comparisons yet.
                  </Text>
                )}
              </View>

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