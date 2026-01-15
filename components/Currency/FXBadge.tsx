// components/currency/FXBadge.tsx
import { StyleSheet, Text, View } from "react-native";

export type FXBadgeStatus = "live" | "cached" | "stale" | "locked";

const META: Record<
  FXBadgeStatus,
  { label: string; color: string }
> = {
  live: { label: "Live rate", color: "#22c55e" },
  cached: { label: "Cached rate", color: "#eab308" },
  stale: { label: "Outdated", color: "#ef4444" },
  locked: { label: "Locked rate", color: "#60a5fa" },
};

export default function FXBadge({ status }: { status: FXBadgeStatus }) {
  const meta = META[status];

  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: meta.color }]} />
      <Text style={styles.text}>{meta.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.6)",
  },
});