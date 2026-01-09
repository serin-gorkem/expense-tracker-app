import { Goal } from "@/models/goal.model";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";

type Props = {
  visible: boolean;
  type: "success" | "failure";
  goal: Goal | null;
  onClose: () => void;
  onNextGoal?: () => void; // opsiyonel navigation hook
};

export default function GoalOutcomeModal({
  visible,
  type,
  goal,
  onClose,
  onNextGoal,
}: Props) {
  if (!visible || !goal) return null;

  const isSuccess = type === "success";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Animated.View entering={ZoomIn.duration(180)} style={styles.card}>
          <LinearGradient
            colors={
              isSuccess
                ? ["#22D3EE", "#6366F1"]
                : ["#64748B", "#334155"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <Text style={styles.headerEmoji}>
              {isSuccess ? "🎉" : "⏳"}
            </Text>
          </LinearGradient>

          <Text style={styles.goalTitle}>{goal.title}</Text>

          <Text style={styles.message}>
            {isSuccess
              ? "You’ve reached your goal. This one is now archived."
              : "This goal didn’t make it in time. You can try again or set a new one."}
          </Text>

          <View style={styles.actions}>
            <Pressable onPress={onClose} style={styles.button}>
              <Text style={styles.buttonText}>OK</Text>
            </Pressable>

            {isSuccess && onNextGoal && (
              <Pressable
                onPress={() => {
                  onClose();       // 🔒 modal her zaman önce kapanır
                  onNextGoal();    // ➜ navigation / next flow
                }}
                style={styles.secondaryBtn}
              >
                <Text style={styles.secondaryText}>Next Goal</Text>
              </Pressable>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "rgba(17,24,39,0.95)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  header: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    alignItems: "center",
  },

  headerEmoji: {
    fontSize: 32,
  },

  goalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#93C5FD",
    marginBottom: 10,
  },

  message: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    marginBottom: 20,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },

  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#6366F1",
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  secondaryBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },

  secondaryText: {
    color: "rgba(255,255,255,0.9)",
    fontWeight: "700",
  },
});