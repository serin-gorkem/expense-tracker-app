import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BaselineCard from "@/components/BaseLineCard/BaseLineCard";
import CurrencyExposureChart from "@/components/Charts/CurrencyExposureChart";
import MonthlyCategoryDonutChart from "@/components/Charts/MonthlyCategoryDonutChart";
import WeeklyLineChart from "@/components/Charts/WeeklyLineChart";
import ConsistencyCalendar from "@/components/Consistency/ConsistencyCalendar";
import { calculateCurrencyExposure } from "@/utils/currency/calculateCurrencyExposure";
import {
  buildMonthlyCategoryDonutData,
  buildWeeklyLineChartData,
} from "@/utils/expense/expenseChart";
import {
  groupExpensesByMonth,
  groupExpensesByWeek,
} from "@/utils/expense/expenseGrouping";
import { useExpensesStore } from "../../src/context/ExpensesContext";

import DayDetailModal from "@/components/Consistency/DayDetailsModal";
import FXRatesCard from '@/components/Currency/FXRatesCard';
import BehavioralInsightSection from "@/components/InsightSection/BehavioralInsightSection";
import FinancialInsightSection from "@/components/InsightSection/FinancialInsightSection";
import { LiquidBackground } from "@/components/ui/LiquidBackground";
import { LiquidDecor } from "@/components/ui/LiquidDecor";
import { useTranslation } from "@/hooks/useTranslation";
import { useFinanceProfile } from "@/src/context/FinanceProfileContext";
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
  const { t } = useTranslation();
  const monthGroups = groupExpensesByMonth(expenses);
  const weekGroups = groupExpensesByWeek(expenses);

  const donutData = buildMonthlyCategoryDonutData(monthGroups);
  const lineData = buildWeeklyLineChartData(weekGroups);
  const [month, setMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const { profile: financeProfile } = useFinanceProfile();
  const baseCurrency = financeProfile.baseCurrency!;
  const currencyExposure = useMemo(
    () => calculateCurrencyExposure(expenses, baseCurrency),
    [expenses, financeProfile.baseCurrency]
  );
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
      <LiquidBackground theme="insights" />
            <LiquidDecor variant="insights" />

      <SafeAreaView style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 28 }}
        >
          <Text style={styles.title}>{t("insights.screen.title")}</Text>
          <Text style={styles.subtitle}>{t("insights.screen.subtitle")}</Text>

          {expenses.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>{t("insights.empty.title")}</Text>
              <Text style={styles.emptyDesc}>{t("insights.empty.desc")}</Text>
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
                <MonthlyCategoryDonutChart
                  data={donutData}
                  baseCurrency={baseCurrency}
                />
              )}
              {lineData.length > 0 && (
                <WeeklyLineChart data={lineData} baseCurrency={baseCurrency} />
              )}
              <FXRatesCard baseCurrency={baseCurrency} />
              {currencyExposure.length > 1 && (
                <CurrencyExposureChart exposure={currencyExposure} />
              )}
              <FinancialInsightSection expenses={expenses} />
              <BehavioralInsightSection
                expenses={expenses}
                dailyLimit={dailyLimit}
              />
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{t("insights.more.title")}</Text>

                <Text style={styles.item}>
                  • {t("insights.more.items.consistency")}
                </Text>
                <Text style={styles.item}>
                  • {t("insights.more.items.recovery")}
                </Text>
                <Text style={styles.item}>
                  • {t("insights.more.items.strongWeak")}
                </Text>
                <Text style={styles.item}>
                  • {t("insights.more.items.patterns")}
                </Text>

                <Text style={styles.itemMuted}>{t("insights.more.hint")}</Text>
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