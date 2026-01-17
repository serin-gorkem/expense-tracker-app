// components/currency/FXBadge.tsx
import { useTranslation } from "@/hooks/useTranslation";
import { StyleSheet, Text, View } from "react-native";

export type FXBadgeStatus = "live" | "cached" | "stale" | "locked";

const COLORS: Record<FXBadgeStatus, string> = {
  live: "#22c55e",
  cached: "#eab308",
  stale: "#ef4444",
  locked: "#60a5fa",
};

export default function FXBadge({ status }: { status: FXBadgeStatus }) {
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: COLORS[status] }]} />
      <Text style={styles.text}>
        {t(`currency.fxBadge.${status}`)}
      </Text>
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