// components/goals/GoalWhatIfModal.tsx
import { Goal } from "@/models/goal.model";
import { useExpensesStore } from "@/src/context/ExpensesContext";
import { calculateGoalProjection } from "@/utils/goals/calculateGoalProjection";
import { simulateGoalProjection } from "@/utils/goals/simulateGoalProjection";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  visible: boolean;
  onClose(): void;
  goal: Goal;
};

const PRESETS = [10, 25, 50] as const;

export default function GoalWhatIfModal({ visible, onClose, goal }: Props) {
  const { expenses } = useExpensesStore();
  const base = calculateGoalProjection(goal, expenses);
  const [extra, setExtra] = useState<number | null>(null);

  const simulated =
    extra != null ? simulateGoalProjection(base, extra) : null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.modal}>
        <Text style={styles.title}>What if I save more daily?</Text>

        <View style={styles.row}>
          {PRESETS.map((v) => (
            <Pressable
              key={v}
              onPress={() => setExtra(v)}
              style={[
                styles.pill,
                extra === v && styles.pillActive,
              ]}
            >
              <Text style={styles.pillText}>+{v}</Text>
            </Pressable>
          ))}
        </View>

        {simulated && (
          <>
            <Text
              style={[
                styles.result,
                styles[`status_${simulated.feasibility}`],
              ]}
            >
              {simulated.message}
            </Text>

            <Text style={styles.meta}>
              New pace: {simulated.actualDaily}/day
            </Text>
          </>
        )}

        <Text style={styles.note}>
          This is a simulation. Your data will not change.
        </Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modal: {
    position: "absolute",
    left: 16,
    right: 16,
    top: "30%",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  title: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  pill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  pillActive: {
    backgroundColor: "rgba(99,102,241,0.28)",
    borderColor: "rgba(99,102,241,0.5)",
  },
  pillText: {
    color: "rgba(255,255,255,0.9)",
    fontWeight: "800",
    fontSize: 12,
  },
  result: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
  },
  meta: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 8,
  },
  note: {
    fontSize: 10,
    color: "rgba(255,255,255,0.45)",
  },
  status_good: { color: "#22c55e" },
  status_tight: { color: "#eab308" },
  status_heavy: { color: "#f97316" },
});