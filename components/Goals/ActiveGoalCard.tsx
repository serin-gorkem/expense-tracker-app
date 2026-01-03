import { CATEGORY_OPTIONS } from "@/models/expense.model";
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
  const { expenses, dailyBaseline } = useExpensesStore();
  const { calculateGoalProgress } = useGoalsStore();

  const savedAmount = calculateGoalProgress(goal.id, expenses);
  const remaining = Math.max(goal.targetAmount - savedAmount, 0);

  const weekly = calculateGoalHealth(goal, expenses, "weekly");
  const monthly = calculateGoalHealth(goal, expenses, "monthly");

  const projection = calculateGoalProjection(
    goal,
    expenses,
    dailyBaseline ?? undefined
  );

  const insights = buildGoalInsights(projection);

  const progress =
    goal.targetAmount > 0
      ? Math.min(savedAmount / goal.targetAmount, 1)
      : 0;

  const percentage = Math.round(progress * 100);

  const lastBoost = expenses
    .filter((e) => e.isGoalBoost && e.goalId === goal.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  const categoryLabel = goal.category
    ? CATEGORY_OPTIONS.find((c) => c.key === goal.category)?.label
    : null;

  const [whatIfOpen, setWhatIfOpen] = useState(false);

  return (
    <GlassCard>
      {/* ================= HEADER ================= */}
      <Text style={styles.label}>ACTIVE GOAL</Text>
      <Text style={styles.title}>{goal.title}</Text>

      {/* ================= META ================= */}
      <View style={styles.metaRow}>
        <Text style={styles.amount}>
          {savedAmount} / {goal.targetAmount}
        </Text>
        <Text style={styles.percent}>{percentage}%</Text>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage}%` }]} />
      </View>

      {categoryLabel && <Text style={styles.category}>{categoryLabel}</Text>}

      {/* ================= SUMMARY ================= */}
      <View style={styles.panel}>
        <Text style={styles.panelLabel}>SUMMARY</Text>

        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryLabel}>Remaining</Text>
            <Text style={styles.summaryValue}>{remaining}</Text>
          </View>

          <View>
            <Text style={styles.summaryLabel}>Daily target</Text>
            <Text style={styles.summaryValue}>
              {projection.requiredDaily}
            </Text>
          </View>
        </View>

        {lastBoost && (
          <Text style={styles.lastBoost}>
            Last boost: +{lastBoost.boostAmount ?? lastBoost.amount}
          </Text>
        )}
      </View>

      {/* ================= PROJECTION ================= */}
      <View style={styles.panel}>
        <Text style={styles.panelLabel}>PROJECTION</Text>

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
            {projection.message}
          </Text>
        </View>
      </View>

      {/* ================= INSIGHTS ================= */}
      <GoalInsightsPanel insights={insights} />

      {/* ================= GOAL HEALTH ================= */}
      <View style={styles.panel}>
        <Text style={styles.panelLabel}>GOAL HEALTH</Text>
        <Text style={styles.panelTitle}>Current saving pace</Text>

        <View style={styles.healthRows}>
          <GoalHealthRow label="This week" {...weekly} />
          <GoalHealthRow label="This month" {...monthly} />
        </View>
      </View>

      {/* ================= WHAT IF ================= */}
      <View style={styles.whatIfButton}>
        <Pressable onPress={() => setWhatIfOpen(true)}>
          <Text style={styles.whatIfText}>What if I save more?</Text>
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