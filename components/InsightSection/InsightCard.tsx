import { InsightItem } from "@/models/insight.model";
import { Feather } from "@expo/vector-icons";
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

  const iconName =
    insight.type === "monthly_change"
      ? insight.tone === "negative"
        ? "trending-up"
        : "trending-down"
      : insight.type === "top_category"
      ? "pie-chart"
      : "bar-chart-2";

  return (
    <View style={[styles.card, toneStyle]}>
      <View style={styles.header}>
        <Feather
          name={iconName}
          size={16}
          color="rgba(255,255,255,0.85)"
        />
        <Text style={styles.title}>{insight.title}</Text>
      </View>

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

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
    color: "rgba(255,255,255,0.92)",
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