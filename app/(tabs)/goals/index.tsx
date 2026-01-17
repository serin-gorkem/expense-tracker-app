import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    (async () => {
      const seen = await AsyncStorage.getItem("@goal_list_hint_seen");
      if (!seen) setShowGoalHint(true);
    })();
  }, []);

  const dismissGoalHint = async () => {
    setShowGoalHint(false);
    await AsyncStorage.setItem("@goal_list_hint_seen", "true");
  };

  return (
    <View style={styles.root}>
      <LiquidBackground theme="goals" />
      <LiquidDecor variant="goals" />

      <SafeAreaView style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* HEADER (Home ile aynı) */}
          <View style={styles.header}>
            <Text style={styles.title}>{t("goals.screen.title")}</Text>
            <Text style={styles.subtitle}>
              {t("goals.screen.subtitle")}
            </Text>
          </View>

          {/* CREATE GOAL CTA */}
          <Pressable
            style={styles.button}
            onPress={() => {
              reset();
              router.push("/goal-wizard");
            }}
          >
            <Text style={styles.buttonText}>
              {t("goals.screen.create")}
            </Text>
          </Pressable>

          {/* ACTIVE GOAL */}
          {activeGoal && <ActiveGoalCard goal={activeGoal} />}

          {/* EMPTY STATE */}
          {!goals.length && (
            <EmptyState
              title={t("goals.screen.noGoalsTitle")}
              description={t("goals.screen.noGoalsDesc")}
            />
          )}

          {/* HINT */}
          {showGoalHint && goals.length > 0 && !activeGoal && (
            <GoalListHint onDismiss={dismissGoalHint} />
          )}

          {/* LIST */}
          <GoalsList
            goals={goals}
            activeGoalId={activeGoal?.id}
            onEdit={handleEditGoal}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  safe: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  scroll: {
    paddingBottom: 120,
    gap: 16,
  },

  header: {
    marginBottom: 8,
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
