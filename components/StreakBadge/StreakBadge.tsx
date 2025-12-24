import { StyleSheet, Text } from "react-native";
import Animated, {
    FadeInUp,
} from "react-native-reanimated";

type StreakBadgeProps = {
  count: number;
};

export function StreakBadge({ count }: StreakBadgeProps) {
  if (count <= 0) return null;

  return (
    <Animated.View
      entering={FadeInUp.duration(300)}
      style={styles.container}
    >
      <Text style={styles.text}>
        🔥 {count} {count === 1 ? "day" : "days"} streak
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,

    backgroundColor: "rgba(16,185,129,0.15)",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.35)",
  },
  text: {
    color: "#6EE7B7",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});