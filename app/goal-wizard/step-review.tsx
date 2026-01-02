import { Goal } from "@/models/goal.model";
import { useGoalsStore } from "@/src/context/GoalContext";
import { useWizard } from "@/src/context/WizardContext";
import { createGoalFromDraft } from "@/utils/goals/createGoalFromDraft";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function StepReview() {
  const router = useRouter();
  const { draft, reset, isEditMode, editingGoalId } = useWizard();
  const { createGoal, updateGoal } = useGoalsStore();

  const handleSubmit = () => {
    if (isEditMode && editingGoalId) {
      updateGoal({
        id: editingGoalId,
        title: draft.customTitle!,
        targetAmount: draft.targetAmount!,
        durationInDays: draft.durationInDays!,
      } as Goal);
    } else {
      const goal = createGoalFromDraft(draft);
      createGoal(goal);
    }

    reset();
    router.replace("/(tabs)/goals");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Review</Text>
      <Text style={styles.p}>
        {isEditMode
          ? "Review your changes before saving."
          : "Review your goal before creating it."}
      </Text>

      <View style={styles.card}>
        <ReviewRow label="Type" value={draft.type} />
        <ReviewRow
          label="Duration"
          value={`${draft.durationInDays} days`}
        />
        <ReviewRow
          label="Target"
          value={`${draft.targetAmount}`}
        />
        {draft.customTitle ? (
          <ReviewRow label="Title" value={draft.customTitle} />
        ) : null}
      </View>

      <Pressable style={styles.primaryBtn} onPress={handleSubmit}>
        <Text style={styles.primaryText}>
          {isEditMode ? "Save Changes" : "Create Goal"}
        </Text>
      </Pressable>
    </View>
  );
}

/* =========================
   Small helper component
========================= */

function ReviewRow({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
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
    backgroundColor: "transparent",
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
    marginTop: 18,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(17,24,39,0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    gap: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  rowLabel: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    fontWeight: "700",
  },

  rowValue: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    fontWeight: "800",
  },

  primaryBtn: {
    marginTop: "auto",
    backgroundColor: "#6366F1",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom:32,
  },

  primaryText: {
    color: "#0B1020",
    fontWeight: "900",
    fontSize: 14,
  },
});