import { InsightItem } from "@/models/insight.model";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  insight: InsightItem;
};

export default function InsightCard({ insight }: Props) {
  const toneStyle =
    insight.tone === "positive"
      ? styles.positive
      : insight.tone === "negative"
      ? styles.negative
      : styles.neutral;

  return (
    <View style={[styles.card, toneStyle]}>
      <Text style={styles.title}>{insight.title}</Text>
      <Text style={styles.description}>{insight.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(255,255,255,0.92)",
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: "rgba(255,255,255,0.72)",
    lineHeight: 17,
  },
  neutral: {
    backgroundColor: "rgba(17,24,39,0.4)",
    borderColor: "rgba(255,255,255,0.14)",
  },
  positive: {
    backgroundColor: "rgba(34,197,94,0.08)",
    borderColor: "rgba(34,197,94,0.4)",
  },
  negative: {
    backgroundColor: "rgba(239,68,68,0.08)",
    borderColor: "rgba(239,68,68,0.4)",
  },
});