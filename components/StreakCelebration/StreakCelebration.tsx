import { streakCelebrationResult } from "@/utils/streak/streakCelebrationRules";
import { Pressable, StyleSheet, Text } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import Animated, {
    FadeIn,
    FadeOut,
    SlideInUp,
    SlideOutDown,
    ZoomIn,
    ZoomOut,
} from "react-native-reanimated";

type Props = {
  result: streakCelebrationResult;
  onDismiss: () => void;
};

export function StreakCelebration({ result, onDismiss }: Props) {
  const isNew = result.type === "new_streak";

  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      exiting={FadeOut.duration(200)}
      style={styles.overlay}
    >
      <ConfettiCannon
        count={isNew ? 80 : 120}
        origin={{ x: -10, y: 0 }}
        fadeOut
        explosionSpeed={350}
        fallSpeed={3000}
      />
      <Pressable style={styles.backdrop} onPress={onDismiss} />

      <Animated.View
        entering={ZoomIn.springify().damping(14)}
        exiting={ZoomOut.duration(150)}
        style={styles.card}
      >
        <Animated.Text
          entering={SlideInUp.delay(80)}
          exiting={SlideOutDown}
          style={styles.emoji}
        >
          {isNew ? "🔥" : "🏆"}
        </Animated.Text>

        <Animated.Text entering={SlideInUp.delay(120)} style={styles.title}>
          {isNew ? "Streak Started!" : "Milestone Reached"}
        </Animated.Text>

        <Animated.Text entering={SlideInUp.delay(160)} style={styles.subtitle}>
          {result.count} day streak
        </Animated.Text>

        {!isNew && (
          <Animated.Text entering={FadeIn.delay(220)} style={styles.badge}>
            {result.milestone} days milestone
          </Animated.Text>
        )}

        <Pressable style={styles.button} onPress={onDismiss}>
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  card: {
    width: "82%",
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignItems: "center",

    backgroundColor: "rgba(17,24,39,0.92)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",

    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 20,
  },
  emoji: {
    fontSize: 44,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#F9FAFB",
    letterSpacing: 0.4,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "rgba(255,255,255,0.65)",
  },
  badge: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(16,185,129,0.15)",
    color: "#6EE7B7",
    fontSize: 12,
    fontWeight: "700",
  },
  button: {
    marginTop: 24,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#22C55E",
  },
  buttonText: {
    color: "#052E16",
    fontWeight: "800",
    fontSize: 14,
  },
});