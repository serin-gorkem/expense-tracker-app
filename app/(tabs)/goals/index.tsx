import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import EmptyState from "@/components/EmptyState/EmptyState";
import { ActiveGoalCard } from "@/components/Goals/ActiveGoalCard";
import GoalListHint from "@/components/Goals/GoalListHint";
import GoalsList from "@/components/Goals/GoalsList";
import { LiquidBackground } from "@/components/ui/LiquidBackground";
import { LiquidDecor } from "@/components/ui/LiquidDecor";
import { useTranslation } from "@/hooks/useTranslation";
import { Goal } from "@/models/goal.model";
import { useGoalsStore } from "@/src/context/GoalContext";
import { useWizard } from "@/src/context/WizardContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function GoalsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { goals, activeGoal } = useGoalsStore();
  const { reset } = useWizard();
  const [showGoalHint, setShowGoalHint] = useState(false);
  
  const handleEditGoal = (goal: Goal) => {
    router.push(`../goals/${goal.id}/edit`);
  };
  
  useEffect(() => {
    const checkHint = async () => {
      try {
        const seen = await AsyncStorage.getItem("@goal_list_hint_seen");
        if (!seen) setShowGoalHint(true);
      } catch {}
    };
    
    checkHint();
  }, []);
const dismissGoalHint = async () => {
  setShowGoalHint(false);
  try {
    await AsyncStorage.setItem("@goal_list_hint_seen", "true");
  } catch {}
};

return (
  <View style={styles.container}>
    <LiquidBackground theme="goals" />
    <LiquidDecor variant="goals" />

    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.title}>{t("goals.screen.title")}</Text>
      <Text style={styles.subtitle}>{t("goals.screen.subtitle")}</Text>
      {/* CREATE GOAL */}
      <Pressable
        style={styles.button}
        onPress={() => {
          reset();
          router.push("/goal-wizard");
        }}
      >
        <Text style={styles.buttonText}>{t("goals.create")}</Text>
      </Pressable>

      {/* ACTIVE GOAL */}
      {activeGoal && <ActiveGoalCard goal={activeGoal} />}

      {!goals.length && (
        <EmptyState
          title={t("empty.noGoalsTitle")}
          description={t("empty.noGoalsDesc")}
        />
      )}
      {showGoalHint && goals.length !== 0 && !activeGoal && (
        <GoalListHint onDismiss={dismissGoalHint} />
      )}
      {/* GOALS LIST */}
      <GoalsList
        goals={goals}
        activeGoalId={activeGoal?.id}
        onEdit={handleEditGoal}
      />
    </ScrollView>
  </View>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingVertical: 32,
  },
  title: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: 2,
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 120, // ⬅️ What-if modal + bottom bar safety
    gap: 16,
  },

  button: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "rgba(99,102,241,0.18)",
    borderWidth: 1,
    borderColor: "rgba(99,102,241,0.35)",
  },

  buttonText: {
    color: "rgba(255,255,255,0.9)",
    fontWeight: "800",
  },
});
