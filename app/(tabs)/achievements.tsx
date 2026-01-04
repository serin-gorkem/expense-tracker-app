import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    Milestone,
    STREAK_MILESTONE_REGISTRY,
} from "@/constants/streakMilestoneRegistry";
import { AchievedMilestone } from "@/models/milestones.model";
import { getUnlockedMilestones } from "@/utils/streak/streakMilestoneStore";

import AchievementCard from "@/components/Achievements/AchievementCard";
import { LiquidBackground } from "@/components/ui/LiquidBackground";
import { useStreakMetrics } from "@/hooks/useStreakMetrics";
import { useExpensesStore } from "@/src/context/ExpensesContext";
import { useEffect, useMemo, useState } from "react";

export default function AchievementsScreen() {
  const [unlocked, setUnlocked] = useState<AchievedMilestone[]>([]);
  const { expenses, limits } = useExpensesStore();
  useEffect(() => {
    getUnlockedMilestones()
      .then(setUnlocked)
      .catch(() => {});
  }, []);

  /**
   * Map unlocked achievements by id for O(1) lookup
   */
  const unlockedMap = useMemo(() => {
    const map = new Map<string, AchievedMilestone>();
    unlocked.forEach((m) => map.set(m.id, m));
    return map;
  }, [unlocked]);
  // inside component
  const { currentStreak } = useStreakMetrics({
    expenses,
    dailyLimit: limits.daily.amount,
  });
  /**
   * Registry → ordered list
   */
  const allMilestones: Milestone[] = useMemo(() => {
    return Object.values(STREAK_MILESTONE_REGISTRY).sort(
      (a, b) => a.value - b.value
    );
  }, []);

  return (
    <View style={styles.root}>
      <LiquidBackground />

      <SafeAreaView style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          {/* ---------- Header ---------- */}
          <View style={styles.header}>
            <Text style={styles.title}>Achievements</Text>
            <Text style={styles.subtitle}>
              Your progress, milestones, and discipline
            </Text>
          </View>

          {/* ---------- Grid ---------- */}
          <View style={styles.grid}>
            {allMilestones.map((milestone) => {
              const unlockedItem = unlockedMap.get(milestone.id);

              return (
                <AchievementCard
                  key={milestone.id}
                  base={milestone}
                  unlocked={unlockedItem}
                  currentStreak={currentStreak}
                />
              );
            })}
          </View>

          {/* ---------- Footer hint ---------- */}
          <View style={styles.hintCard}>
            <Text style={styles.hintText}>
              More achievements will unlock as you build consistency and reach
              new goals.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  root: { flex: 1 },

  safe: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  header: {
    marginBottom: 18,
  },

  title: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 6,
  },

  subtitle: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },

  hintCard: {
    marginTop: 24,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "rgba(17,24,39,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  hintText: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    textAlign: "center",
  },
});
