import { StyleSheet, Text, View } from "react-native";
import { Milestone } from "../../models/milestones.model";

type Props = {
  milestone: Milestone;
};

export function StreakMilestoneCard({ milestone }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{milestone.title}</Text>
      <Text style={styles.description}>{milestone.description}</Text>
      <Text style={styles.meta}>
        Achieved on {new Date(milestone.achievedAt).toLocaleDateString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: "rgba(16,185,129,0.08)",
    borderColor: "rgba(16,185,129,0.4)",
  },
  title: {
    fontSize: 13,
    fontWeight: "800",
    color: "#6EE7B7",
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
  },
  meta: {
    marginTop: 6,
    fontSize: 10,
    color: "rgba(255,255,255,0.45)",
  },
});