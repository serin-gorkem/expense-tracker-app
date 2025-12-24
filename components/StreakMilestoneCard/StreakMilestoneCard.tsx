// components/StreakMilestoneCard/StreakMilestoneCard.tsx
import { AchievedMilestone } from "@/models/milestones.model";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  milestone: AchievedMilestone;
};

export function StreakMilestoneCard({ milestone }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.emoji}>{milestone.emoji}</Text>
      <Text style={styles.title}>{milestone.title}</Text>
      <Text style={styles.desc}>{milestone.description}</Text>
      <Text style={styles.date}>
        Achieved on {new Date(milestone.achievedAt).toLocaleDateString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(17,24,39,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    marginBottom: 12,
  },
  emoji: { fontSize: 28, marginBottom: 6 },
  title: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  desc: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginTop: 4,
  },
  date: {
    marginTop: 6,
    fontSize: 11,
    color: "rgba(255,255,255,0.4)",
  },
});