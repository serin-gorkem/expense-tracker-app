import { useStreakMilestones } from "@/hooks/useStreakMilestones";
import { Expense } from "@/models/expense.model";
import { buildConsistencyDayMap } from "@/utils/consistency/buildDailyConsistencyMap";
import { ViewMode } from "@/utils/expense/expenseSelectors";
import { selectInsights } from "@/utils/insights/insightSelectors";
import { StreakMetrics } from "@/utils/streak/streakMetrics";
import { useMemo, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useExpensesStore } from "../../src/context/ExpensesContext";
import { StreakMilestoneCard } from "../StreakMilestoneCard/StreakMilestoneCard";
import InsightCard from "./InsightCard";


type Props = {
  expenses: Expense[];
  mode: ViewMode;
  streakMetrics: StreakMetrics;
  dailyLimit: number;
};

export default function InsightSection({
  expenses,
  mode,
  streakMetrics,
  dailyLimit,
}: Props) {
  const { dailyBaseline } = useExpensesStore();
  const insights = selectInsights({
    expenses,
    dailyLimit,
    dailyBaseline,
  });

  const { newMilestone } = useStreakMilestones(
    streakMetrics.currentStreak
  );

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
    <View style={styles.container}>
      {newMilestone && (
        <StreakMilestoneCard milestone={newMilestone} />
      )}

      {insights.map((insight) => (
        <Animated.View key={insight.type}>
          <InsightCard insight={insight} />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
});