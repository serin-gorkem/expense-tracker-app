// components/goals/GoalInsightsPanel.tsx

import { GoalInsight } from "@/models/goalInsight.model";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  insights: GoalInsight[];
};

const TYPE_META = {
  ahead: { color: "#22c55e", icon: "▲" },
  on_track: { color: "#60a5fa", icon: "●" },
  behind: { color: "#eab308", icon: "■" },
  risk: { color: "#f97316", icon: "!" },
  inactive: { color: "#a855f7", icon: "○" },
} as const;

export default function GoalInsightsPanel({ insights }: Props) {
  if (insights.length === 0) return null;

  return (
    <View style={styles.panel}>
      <Text style={styles.panelLabel}>INSIGHTS</Text>

      {insights.map((i, idx) => {
        const meta = TYPE_META[i.type];

        return (
          <View key={idx} style={styles.item}>
            <View style={styles.header}>
              <Text style={[styles.icon, { color: meta.color }]}>
                {meta.icon}
              </Text>
              <Text style={[styles.title, { color: meta.color }]}>
                {i.title}
              </Text>
            </View>

            <Text style={styles.desc}>{i.description}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 12,
  },

  panelLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
    color: "#818cf8",
  },

  item: {
    gap: 4,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  icon: {
    fontSize: 10,
    fontWeight: "900",
  },

  title: {
    fontSize: 12,
    fontWeight: "800",
  },

  desc: {
    fontSize: 11,
    color: "rgba(255,255,255,0.65)",
    lineHeight: 15,
  },
});