import { useStreakMetrics } from "@/hooks/useStreakMetrics";
import { useStreakMilestones } from "@/hooks/useStreakMilestones";
import { Expense } from "@/models/expense.model";
import { selectInsights } from "@/utils/insights/insightSelectors";
import { Animated, StyleSheet, View } from "react-native";
import { StreakMilestoneCard } from "../StreakMilestoneCard/StreakMilestoneCard";
import InsightCard from "./InsightCard";

type Props = {
  expenses: Expense[];
  mode: "daily" | "weekly" | "monthly";
  streakMetrics: ReturnType<typeof useStreakMetrics>;
};

export default function InsightSection({ expenses, mode, streakMetrics }: Props) {
  const insights = selectInsights(expenses);
  const { newMilestone } = useStreakMilestones(streakMetrics.currentStreak);

  return (
    <View style={styles.container}>
      {newMilestone && <StreakMilestoneCard milestone={newMilestone} />}

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