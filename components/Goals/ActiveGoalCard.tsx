import { Goal } from "@/models/goal.model";
import { StyleSheet, Text, View } from "react-native";

type ActiveGoalProps = {
  goal: Goal;
};

export function ActiveGoalCard({ goal }: ActiveGoalProps) {
  const progress = goal.savedAmount / goal.targetAmount;
  const percentage = Math.min(Math.round(progress * 100), 100);
  const remainingAmount = goal.targetAmount - goal.savedAmount;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>ACTIVE GOAL</Text>

      <Text style={styles.title}>{goal.title}</Text>

      {/* Progress Info */}
      <View style={styles.progressMeta}>
        <Text style={styles.amount}>
          {goal.savedAmount} / {goal.targetAmount}
        </Text>
        <Text style={styles.percent}>{percentage}%</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${percentage}%` },
          ]}
        />
      </View>

      <Text style={styles.remaining}>
        Remaining: {remainingAmount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    marginBottom: 16,
  },

  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: "#818cf8",
    marginBottom: 6,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#f9fafb",
    marginBottom: 12,
  },

  progressMeta: {
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
    fontWeight: "700",
  },

  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#6366F1",
    borderRadius: 999,
  },

  remaining: {
    marginTop: 8,
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "600",
  },
});