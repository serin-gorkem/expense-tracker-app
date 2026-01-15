import { useTranslation } from "@/hooks/useTranslation";
import { Goal } from "@/models/goal.model";
import { useExpensesStore } from "@/src/context/ExpensesContext";
import { useGoalsStore } from "@/src/context/GoalContext";
import { buildGoalInsights } from "@/utils/goals/buildGoalInsights";
import { calculateGoalHealth } from "@/utils/goals/calculateGoalHealth";
import { calculateGoalProjection } from "@/utils/goals/calculateGoalProjection";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import GlassCard from "../ui/GlassCard";
import GoalHealthRow from "./GoalHealthRow";
import GoalInsightsPanel from "./GoalsInsightPanel";
import GoalWhatIfModal from "./GoalWhatIfModal";

type Props = {
  goal: Goal;
};

export function ActiveGoalCard({ goal }: Props) {
  const { t } = useTranslation();
  const { expenses, dailyBaseline } = useExpensesStore();
  const { calculateGoalProgress } = useGoalsStore();

  const savedAmount = calculateGoalProgress(goal.id, expenses);
  const savedInGoalCurrency =
  goal.currency === goal.baseCurrency
    ? savedAmount
    : savedAmount / (goal.baseTargetAmount / goal.targetAmount);
 const remaining = Math.max(goal.baseTargetAmount - savedAmount, 0);

 const remainingInGoalCurrency =
  goal.currency === goal.baseCurrency
    ? remaining
    : remaining / (goal.baseTargetAmount / goal.targetAmount);

  const weekly = calculateGoalHealth(goal, expenses, "weekly");
  const monthly = calculateGoalHealth(goal, expenses, "monthly");
  
const goalRate =
  goal.currency === goal.baseCurrency
    ? 1
    : goal.baseTargetAmount / goal.targetAmount;
    const weeklyInGoalCurrency = {
  ...weekly,
  actual: Math.round(weekly.actual / goalRate),
  expected: Math.round(weekly.expected / goalRate),
};

const monthlyInGoalCurrency = {
  ...monthly,
  actual: Math.round(monthly.actual / goalRate),
  expected: Math.round(monthly.expected / goalRate),
};
const projection = calculateGoalProjection(
  goal,
  expenses,
  dailyBaseline ?? undefined
);
const requiredDailyInGoalCurrency = Math.ceil(
  projection.requiredDaily / goalRate
);
const projectionMessage = t(
  `goals.active.projection.${projection.feasibility}`
);

  const insights = buildGoalInsights(projection);

const progress =
  goal.baseTargetAmount > 0
    ? Math.min(savedAmount / goal.baseTargetAmount, 1)
    : 0;

  const percentage = Math.round(progress * 100);

const lastBoost = expenses
  .filter((e) => e.isGoalBoost && e.goalId === goal.id)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  const categoryLabel = goal.category ? t(`categories.${goal.category}`) : null;

  const [whatIfOpen, setWhatIfOpen] = useState(false);

  return (
    <GlassCard>
      {/* HEADER */}
      <Text style={styles.label}>{t("goals.active.label")}</Text>
      <Text style={styles.title}>{goal.title}</Text>

      {/* META */}
      <View style={styles.metaRow}>
        <Text style={styles.amount}>
          {savedInGoalCurrency.toFixed(0)} / {goal.targetAmount.toFixed(0)}{" "}
          {goal.currency}
        </Text>

        <Text style={styles.percent}>{percentage}%</Text>
      </View>

      <Text style={styles.subtle}>
        ≈ {savedAmount.toFixed(0)} {goal.baseCurrency}
      </Text>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage}%` }]} />
      </View>

      {categoryLabel && <Text style={styles.category}>{categoryLabel}</Text>}

      {/* SUMMARY */}
      <View style={styles.panel}>
        <Text style={styles.panelLabel}>{t("goals.active.summary.title")}</Text>

        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryLabel}>
              {t("goals.active.summary.remaining")}
            </Text>
            <Text style={styles.summaryValue}>
              {remainingInGoalCurrency.toFixed(0)} {goal.currency}
            </Text>
          </View>

          <View>
            <Text style={styles.summaryLabel}>
              {t("goals.active.summary.dailyTarget")}
            </Text>
            <Text style={styles.summaryValue}>
              {requiredDailyInGoalCurrency} {goal.currency}
            </Text>

            <Text style={styles.subtle}>
              ≈ {projection.requiredDaily} {goal.baseCurrency}
            </Text>
          </View>
        </View>

        {lastBoost && (
          <Text style={styles.lastBoost}>
            {t("goals.active.summary.lastBoost", {
              amount: lastBoost.fx.baseAmount.toFixed(0),
              currency: goal.baseCurrency,
              nativeAmount: lastBoost.amount,
              nativeCurrency: lastBoost.fx.currency,
            })}
          </Text>
        )}
      </View>

      {/* PROJECTION */}
      <View style={styles.panel}>
        <Text style={styles.panelLabel}>
          {t("goals.active.projection.title")}
        </Text>

        <View style={styles.statusRow}>
          <Text
            style={[styles.statusDot, styles[`dot_${projection.feasibility}`]]}
          >
            ●
          </Text>

          <Text
            style={[
              styles.projectionStatus,
              styles[`status_${projection.feasibility}`],
            ]}
          >
            {projectionMessage}
          </Text>
        </View>
      </View>

      {/* INSIGHTS */}
      <GoalInsightsPanel insights={insights} />

      {/* GOAL HEALTH */}
      <View style={styles.panel}>
        <Text style={styles.panelLabel}>{t("goals.active.health.title")}</Text>
        <Text style={styles.panelTitle}>
          {t("goals.active.health.subtitle")}
        </Text>

        <View style={styles.healthRows}>
          <GoalHealthRow
            label={t("goals.active.health.week")}
            health={weeklyInGoalCurrency.health}
            actual={weeklyInGoalCurrency.actual}
            expected={weeklyInGoalCurrency.expected}
          />

          <GoalHealthRow
            label={t("goals.active.health.month")}
            health={monthlyInGoalCurrency.health}
            actual={monthlyInGoalCurrency.actual}
            expected={monthlyInGoalCurrency.expected}
          />
        </View>
      </View>

      {/* WHAT IF */}
      <View style={styles.whatIfButton}>
        <Pressable onPress={() => setWhatIfOpen(true)}>
          <Text style={styles.whatIfText}>
            {t("goals.active.whatIf.title")}
          </Text>
        </Pressable>

        <GoalWhatIfModal
          visible={whatIfOpen}
          goal={goal}
          onClose={() => setWhatIfOpen(false)}
        />
      </View>
    </GlassCard>
  );
}
const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
    color: "#818cf8",
    marginBottom: 6,
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#f9fafb",
    marginBottom: 12,
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  amount: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "600",
  },

  percent: {
    fontSize: 13,
    color: "#a5b4fc",
    fontWeight: "800",
  },

  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },

  fill: {
    height: "100%",
    backgroundColor: "#6366F1",
    borderRadius: 999,
  },
  subtle:{
    fontSize: 11,
    color: "rgba(255,255,255,0.55)",
    marginBottom: 12,
  },

  category: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.55)",
    marginVertical: 6,
  },

  panel: {
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 6,
  },

  panelLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
    color: "#818cf8",
  },

  panelTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "rgba(255,255,255,0.9)",
    marginBottom: 8,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  summaryLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.45)",
    fontWeight: "600",
  },

  summaryValue: {
    fontSize: 13,
    fontWeight: "800",
    color: "rgba(255,255,255,0.9)",
  },

  lastBoost: {
    marginTop: 6,
    fontSize: 12,
    color: "#22c55e",
    fontWeight: "700",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  statusDot: {
    fontSize: 10,
    fontWeight: "900",
  },

  dot_good: { color: "#22c55e" },
  dot_tight: { color: "#eab308" },
  dot_heavy: { color: "#f97316" },

  projectionStatus: {
    fontSize: 12,
    fontWeight: "700",
  },

  status_good: { color: "#22c55e" },
  status_tight: { color: "#eab308" },
  status_heavy: { color: "#f97316" },

  healthRows: {
    gap: 4,
  },

  whatIfButton: {
    marginTop: 16,
  },

  whatIfText: {
    fontSize: 11,
    color: "#a5b4fc",
    fontWeight: "700",
  },
});
