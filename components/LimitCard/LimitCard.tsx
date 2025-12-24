import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { LimitPeriod, LimitStatus } from "@/models/limit.model";

const LIMIT_COLORS: Record<LimitStatus, string> = {
  safe: "#10B981",      // emerald-500
  warning: "#F59E0B",   // amber-500
  exceeded: "#EF4444",  // red-500
};

type LimitCardProps = {
  period: LimitPeriod;
  total: number;
  limitAmount: number;
  ratio: number;
  status: LimitStatus;
};

export function LimitCard({
  period,
  total,
  limitAmount,
  ratio,
  status,
}: LimitCardProps) {
  /** Clamp ratio for UI (not business logic) */
  const progress = Math.min(ratio, 1);

  /** Animated width value (0 → 1) */
  const animatedProgress = useSharedValue(0);

  /** Animate on mount & ratio change */
  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 650,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  /** Animated style for progress bar */
  const progressStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value * 100}%`,
  }));

  return (
    <View style={styles.card}>
      {/* Header */}
      <Text style={styles.title}>
        {period.charAt(0).toUpperCase() + period.slice(1)} Limit
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

      {/* Status Text */}
      <Text style={[styles.status, { color: LIMIT_COLORS[status] }]}>
        {status === "safe" && "You are within your limit"}
        {status === "warning" && "You are close to your limit"}
        {status === "exceeded" && "You have exceeded your limit"}
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