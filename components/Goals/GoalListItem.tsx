import { Goal } from "@/models/goal.model";
import { useGoalsStore } from "@/src/context/GoalContext";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";

type Props = {
  goal: Goal;
  isActive: boolean;
  onEdit: (goal: Goal) => void;
};

export default function GoalListItem({ goal, isActive, onEdit }: Props) {
  const { toggleGoal, deleteGoal } = useGoalsStore();

  const progress = goal.savedAmount / goal.targetAmount;
  const percent = Math.min(Math.round(progress * 100), 100);

  const statusColor =
    goal.status === "completed"
      ? "#22c55e"
      : goal.status === "active"
      ? "#6366F1"
      : "rgba(255,255,255,0.35)";

  /* =========================
     Delete confirmation
  ========================= */

  const confirmDelete = () => {
    Alert.alert(
      "Delete Goal",
      "Are you sure you want to delete this goal?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteGoal(goal.id),
        },
      ]
    );
  };

  /* =========================
     Swipe action
  ========================= */

  const renderRightActions = () => (
    <Pressable
      onPress={confirmDelete}
      style={[styles.action, styles.actionDelete]}
    >
      <Text style={styles.actionText}>Delete</Text>
    </Pressable>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReanimatedSwipeable
        enabled={goal.status !== "completed"}
        renderRightActions={renderRightActions}
      >
        <Pressable
          onPress={() => toggleGoal(goal.id)}
          onLongPress={() => onEdit(goal)}
          delayLongPress={300}
          style={[
            styles.row,
            isActive && styles.activeRow,
            goal.status === "completed" && styles.completedRow,
          ]}
        >
          <View style={styles.left}>
            <Text style={styles.title}>{goal.title}</Text>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${percent}%`,
                    backgroundColor: statusColor,
                  },
                ]}
              />
            </View>
          </View>

          <Text style={[styles.percent, { color: statusColor }]}>
            {percent}%
          </Text>
        </Pressable>
      </ReanimatedSwipeable>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  row: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    backgroundColor: "#020617",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  activeRow: {
    borderColor: "rgba(99,102,241,0.5)",
  },
  completedRow: {
    opacity: 0.45,
  },
  left: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 14,
    color: "#e5e7eb",
    fontWeight: "700",
    marginBottom: 6,
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  percent: {
    fontSize: 12,
    fontWeight: "800",
    minWidth: 42,
    textAlign: "right",
  },

  action: {
    width: 86,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 14,
  },
  actionDelete: {
    backgroundColor: "rgba(239,68,68,0.75)",
  },
  actionText: {
    color: "rgba(255,255,255,0.95)",
    fontWeight: "900",
  },
});