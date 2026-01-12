import { useStreakMilestones } from "@/hooks/useStreakMilestones";
import { useTranslation } from "@/hooks/useTranslation";
import { Expense } from "@/models/expense.model";
import { insightSelectors } from "@/utils/insights/insightSelectors";
import { StreakMetrics } from "@/utils/streak/streakMetrics";
import { Animated, StyleSheet, View } from "react-native";
import { useExpensesStore } from "../../src/context/ExpensesContext";
import { StreakMilestoneCard } from "../StreakMilestoneCard/StreakMilestoneCard";
import InsightCard from "./InsightCard";

type Props = {
  expenses: Expense[];
  streakMetrics: StreakMetrics;
  dailyLimit: number;
};

export default function InsightSection({
  expenses,
  streakMetrics,
  dailyLimit,
}: Props) {
  const { dailyBaseline } = useExpensesStore();
  const { t, formatCurrency } = useTranslation();

  const insights = insightSelectors({
    expenses,
    dailyLimit,
    dailyBaseline,
  });

  const { newMilestone } = useStreakMilestones(
    streakMetrics.currentStreak
  );

  return (
    <View style={styles.container}>
      {newMilestone && <StreakMilestoneCard milestone={newMilestone} />}

      {insights.map((insight) => {
        const params = insight.params?.amount
          ? {
              ...insight.params,
              amount: formatCurrency(insight.params.amount as number),
            }
          : insight.params;

        return (
          <Animated.View key={insight.type}>
            <InsightCard
              title={t(insight.titleKey)}
              description={t(insight.descriptionKey, params)}
              tone={insight.tone}
            />
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
});