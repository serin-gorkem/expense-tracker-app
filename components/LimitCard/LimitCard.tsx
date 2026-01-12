import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useTranslation } from "@/hooks/useTranslation";
import { LimitStatus } from "@/models/limit.model";

const LIMIT_COLORS: Record<LimitStatus, string> = {
  safe: "#10B981",
  warning: "#F59E0B",
  exceeded: "#EF4444",
};

type LimitCardProps = {
  period: "daily" | "weekly" | "monthly";
  total: number;
  ratio: number;
  status: LimitStatus;
  limitAmount: number;
};

export function LimitCard({
  period,
  total,
  limitAmount,
  ratio,
  status,
}: LimitCardProps) {
  const { t } = useTranslation();

  const progress = Math.min(ratio, 1);
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 650,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value * 100}%`,
  }));

  return (
    <View style={styles.card}>
      {/* Header */}
      <Text style={styles.title}>
        {t(`limits.${period}.title`)}
      </Text>

      {/* Amount */}
      <Text style={styles.amount}>
        ${total.toFixed(2)} / ${limitAmount.toFixed(2)}
      </Text>

      {/* Progress Bar */}
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressFill,
            progressStyle,
            { backgroundColor: LIMIT_COLORS[status] },
          ]}
        />
      </View>

      {/* Status */}
      <Text style={[styles.status, { color: LIMIT_COLORS[status] }]}>
        {t(`limits.status.${status}`)}
      </Text>
    </View>
  );
}
export const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(17,24,39,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    marginBottom: 16,
  },
  title: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  amount: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginBottom: 12,
  },
  progressTrack: {
    height: 10,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  status: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "600",
  },
});