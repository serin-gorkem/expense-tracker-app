import { useStreakMilestones } from "@/hooks/useStreakMilestones";
import { Expense } from "@/models/expense.model";
import { ViewMode } from "@/utils/expense/expenseSelectors";
import { selectInsights } from "@/utils/insights/insightSelectors";
import { StreakMetrics } from "@/utils/streak/streakMetrics";
import { Animated, StyleSheet, View } from "react-native";
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
  const insights = selectInsights({
    expenses,
    dailyLimit,
  });

  const { newMilestone } = useStreakMilestones(
    streakMetrics.currentStreak
  );

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