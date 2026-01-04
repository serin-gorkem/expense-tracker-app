import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ActiveGoalCard } from "@/components/Goals/ActiveGoalCard";
import GoalsList from "@/components/Goals/GoalsList";
import { LiquidBackground } from "@/components/ui/LiquidBackground";
import { Goal } from "@/models/goal.model";
import { useGoalsStore } from "@/src/context/GoalContext";
import { useWizard } from "@/src/context/WizardContext";

export default function GoalsScreen() {
  const router = useRouter();
  const { goals, activeGoal } = useGoalsStore();
  const { reset } = useWizard();

  const handleEditGoal = (goal: Goal) => {
    router.push(`../goals/${goal.id}/edit`);
  };

  return (
    <View style={styles.container}>
      <LiquidBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* CREATE GOAL */}
        <Pressable
          style={styles.button}
          onPress={() => {
            reset();
            router.push("/goal-wizard");
          }}
        >
          <Text style={styles.buttonText}>Create Goal</Text>
        </Pressable>

        {/* ACTIVE GOAL */}
        {activeGoal && <ActiveGoalCard goal={activeGoal} />}

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
    paddingVertical:32,
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
