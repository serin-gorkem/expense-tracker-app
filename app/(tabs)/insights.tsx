import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { buildMonthlyCategoryDonutData, buildWeeklyLineChartData } from "@/utils/expense/expenseChart";
import { groupExpensesByMonth, groupExpensesByWeek } from "@/utils/expense/expenseGrouping";
import {
  getMonthlyChangeInsightData,
  getTopCategoryInsightData,
  getWeeklyAverageInsightData,
} from "@/utils/expense/expenseInsights";
import { useExpensesStore } from "../../src/context/ExpensesContext";

// Bu iki component sende vardı (components/Charts altında olduğunu varsaydım)
import MonthlyCategoryDonutChart from "@/components/Charts/MonthlyCategoryDonutChart";
import WeeklyLineChart from "@/components/Charts/WeeklyLineChart";

export default function Insights() {
  const { expenses } = useExpensesStore();

  const monthGroups = groupExpensesByMonth(expenses);
  const weekGroups = groupExpensesByWeek(expenses);

  const donutData = buildMonthlyCategoryDonutData(monthGroups);
  const lineData = buildWeeklyLineChartData(weekGroups);

  const monthlyChange = getMonthlyChangeInsightData(expenses);
  const topCategory = getTopCategoryInsightData(expenses);
  const weeklyAvg = getWeeklyAverageInsightData(expenses);

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
          <Text style={styles.subtitle}>Charts and analytics based on your expenses.</Text>

          {expenses.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No data yet</Text>
              <Text style={styles.emptyDesc}>Add a few expenses to unlock insights.</Text>
            </View>
          ) : (
            <>
              {/* Charts */}
              {donutData.length > 0 && <MonthlyCategoryDonutChart data={donutData} />}
              {lineData.length > 0 && <WeeklyLineChart data={lineData} />}

              {/* Insight Cards */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Quick Insights</Text>

                {monthlyChange && (
                  <Text style={styles.item}>
                    • Monthly change: {monthlyChange.percentageChange}% (this month {monthlyChange.currentMonthTotal}, prev {monthlyChange.previousMonthTotal})
                  </Text>
                )}

                {topCategory && (
                  <Text style={styles.item}>
                    • Top category this month: {topCategory.category} ({topCategory.total})
                  </Text>
                )}

                {weeklyAvg && (
                  <Text style={styles.item}>
                    • Weekly average: {Math.round(weeklyAvg.weeklyAverage)}
                  </Text>
                )}

                {!monthlyChange && !topCategory && !weeklyAvg && (
                  <Text style={styles.item}>
                    Not enough history for comparisons yet.
                  </Text>
                )}
              </View>
            </>
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
  emptyCard: {
    marginTop: 14,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(17,24,39,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  emptyTitle: { color: "rgba(255,255,255,0.9)", fontWeight: "800", fontSize: 14 },
  emptyDesc: { color: "rgba(255,255,255,0.6)", marginTop: 6, fontSize: 12 },
  card: {
    marginTop: 14,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(17,24,39,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  cardTitle: { color: "rgba(255,255,255,0.9)", fontWeight: "800", marginBottom: 8 },
  item: { color: "rgba(255,255,255,0.75)", fontSize: 12, marginBottom: 6 },
});