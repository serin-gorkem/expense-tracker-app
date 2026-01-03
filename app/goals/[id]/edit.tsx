import { useGoalsStore } from "@/src/context/GoalContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function EditGoalScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { goals, updateGoal, deleteGoal } = useGoalsStore();

  const goal = goals.find((g) => g.id === id);

  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [duration, setDuration] = useState("");

  /* =========================
     Init form from goal
  ========================= */

  useEffect(() => {
    if (!goal) return;
    setTitle(goal.title);
    setTarget(String(goal.targetAmount));
    setDuration(String(goal.durationInDays));
  }, [goal]);

  if (!goal) {
    return (
      <View style={styles.container}>
        <Text style={styles.h1}>Goal not found</Text>
      </View>
    );
  }

  /* =========================
     Actions
  ========================= */

  const handleSave = () => {
    const targetAmount = Number(target);
    const durationInDays = Number(duration);

    if (!title || targetAmount <= 0 || durationInDays <= 0) {
      Alert.alert("Invalid input", "Please fill all fields correctly.");
      return;
    }

    updateGoal(goal.id, {
      title,
      targetAmount,
      durationInDays,
    });

    router.back();
  };

  const confirmDelete = () => {
    Alert.alert("Delete Goal", "This action cannot be undone. Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteGoal(goal.id);
          router.replace("/(tabs)/goals");
        },
      },
    ]);
  };

  /* =========================
     Render
  ========================= */

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Edit Goal</Text>
      <Text style={styles.p}>Update or delete your goal</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Goal title"
          placeholderTextColor="rgba(255,255,255,0.35)"
          style={styles.input}
        />

        <Text style={styles.label}>Target amount</Text>
        <TextInput
          value={target}
          onChangeText={setTarget}
          keyboardType="number-pad"
          placeholder="e.g. 5000"
          placeholderTextColor="rgba(255,255,255,0.35)"
          style={styles.input}
        />

        <Text style={styles.label}>Duration (days)</Text>
        <TextInput
          value={duration}
          onChangeText={setDuration}
          keyboardType="number-pad"
          placeholder="e.g. 30"
          placeholderTextColor="rgba(255,255,255,0.35)"
          style={styles.input}
        />
      </View>

      <View style={styles.row}>
        <Pressable style={styles.secondaryBtn} onPress={() => router.back()}>
          <Text style={styles.secondaryText}>Cancel</Text>
        </Pressable>

        <Pressable style={styles.primaryBtn} onPress={handleSave}>
          <Text style={styles.primaryText}>Save</Text>
        </Pressable>
      </View>

      <Pressable style={styles.deleteBtn} onPress={confirmDelete}>
        <Text style={styles.deleteText}>Delete Goal</Text>
      </Pressable>
    </View>
  );
}

/* =========================
   Styles
========================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#020617",
  },

  h1: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 22,
    fontWeight: "800",
  },

  p: {
    marginTop: 6,
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
  },

  card: {
    marginTop: 20,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(17,24,39,0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    gap: 12,
  },

  label: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    fontWeight: "700",
  },

  input: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    fontWeight: "700",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "rgba(2,6,23,0.85)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  row: {
    marginTop: 20,
    flexDirection: "row",
    gap: 12,
  },

  primaryBtn: {
    flex: 1,
    backgroundColor: "#6366F1",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },

  secondaryBtn: {
    flex: 1,
    backgroundColor: "rgba(17,24,39,0.55)",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  primaryText: {
    color: "#0B1020",
    fontWeight: "900",
  },

  secondaryText: {
    color: "rgba(255,255,255,0.85)",
    fontWeight: "700",
  },

  deleteBtn: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "rgba(239,68,68,0.15)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.4)",
  },

  deleteText: {
    color: "rgba(239,68,68,0.95)",
    fontWeight: "800",
  },
});
