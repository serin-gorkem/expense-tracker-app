// components/goals/GoalHealthRow.tsx
import { GoalHealth } from "@/models/goalHealth.model";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  health: GoalHealth;
  actual: number;
  expected: number;
};

export default function GoalHealthRow({
  label,
  health,
  actual,
  expected,
}: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.health, styles[health]]}>
        {actual} / {expected}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  label: {
    fontSize: 11,
    color: "rgba(255,255,255,0.55)",
    fontWeight: "600",
  },
  health: {
    fontSize: 11,
    fontWeight: "800",
  },

  excellent: { color: "#22c55e" },
  good: { color: "#60a5fa" },
  warning: { color: "#eab308" },
  bad: { color: "#f97316" },
});