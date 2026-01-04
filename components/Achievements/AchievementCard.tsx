import { Milestone } from "@/constants/streakMilestoneRegistry";
import { AchievedMilestone } from "@/models/milestones.model";
import { getStreakProgress } from "@/utils/achievements/progressCalculators";
import { BlurView } from "expo-blur";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  base: Milestone;
  unlocked?: AchievedMilestone;
  currentStreak?: number; // 🔥 yeni
};

export default function AchievementCard({
  base,
  unlocked,
  currentStreak = 0,
}: Props) {
  const isUnlocked = Boolean(unlocked);

  const progress = !isUnlocked
    ? getStreakProgress(base, currentStreak)
    : null;

  return (
    <View style={styles.wrapper}>
      <BlurView intensity={18} tint="dark" style={styles.card}>
        {/* ---------- Emoji ---------- */}
        <Text style={styles.emoji}>{base.emoji}</Text>

        {/* ---------- Title ---------- */}
        <Text style={styles.title}>{base.title}</Text>

        {/* ---------- Description ---------- */}
        <Text style={styles.desc}>{base.description}</Text>

        {/* ---------- Unlocked ---------- */}
        {isUnlocked && unlocked && (
          <Text style={styles.date}>
            Achieved on{" "}
            {new Date(unlocked.achievedAt).toLocaleDateString()}
          </Text>
        )}

        {/* ---------- Locked → Progress ---------- */}
        {!isUnlocked && progress && (
          <View style={styles.progressWrapper}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progress.ratio * 100}%` },
                ]}
              />
            </View>

            <Text style={styles.progressText}>
              {progress.current} / {progress.target} days
            </Text>
          </View>
        )}

        {/* ---------- Locked Overlay ---------- */}
        {!isUnlocked && <View style={styles.lockOverlay} />}
      </BlurView>
    </View>
  );
}
/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  wrapper: {
    width: "48%",
  },

  card: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    overflow: "hidden",
  },

  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },

  title: {
    color: "#F9FAFB",
    fontWeight: "800",
    fontSize: 13,
    textAlign: "center",
  },

  desc: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 11,
    textAlign: "center",
    marginTop: 4,
  },

  date: {
    marginTop: 8,
    fontSize: 11,
    color: "#6EE7B7",
    fontWeight: "700",
  },

  progressWrapper: {
    width: "100%",
    marginTop: 10,
  },

  progressBarBg: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.15)",
    overflow: "hidden",
  },

  progressBarFill: {
    height: "100%",
    backgroundColor: "#6366F1",
  },

  progressText: {
    marginTop: 6,
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    fontWeight: "700",
  },

  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
});