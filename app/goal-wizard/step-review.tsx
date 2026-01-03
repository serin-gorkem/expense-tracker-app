import { useGoalsStore } from "@/src/context/GoalContext";
import { useWizard } from "@/src/context/WizardContext";
import { createGoalFromDraft } from "@/utils/goals/createGoalFromDraft";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type FeasibilityLevel = "good" | "tight" | "heavy";

export default function StepReview() {
  const router = useRouter();
  const { draft, goTo, reset } = useWizard();
  const { createGoal } = useGoalsStore();

  const dailyAvg =
    draft.targetAmount && draft.durationInDays
      ? Math.ceil(draft.targetAmount / draft.durationInDays)
      : null;

  const feasibility: FeasibilityLevel | null = dailyAvg
    ? dailyAvg <= 300
      ? "good"
      : dailyAvg <= 700
      ? "tight"
      : "heavy"
    : null;

  const handleSubmit = () => {
    const goal = createGoalFromDraft(draft);
    createGoal(goal);
    reset();
    router.replace("/(tabs)/goals");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Review</Text>
      <Text style={styles.p}>Take a final look before starting this goal.</Text>

      <View style={styles.card}>
        <ReviewRow label="Type" value={draft.type} />
        <ReviewRow label="Duration" value={`${draft.durationInDays} days`} />
        <ReviewRow label="Target" value={`${draft.targetAmount}`} />
        {dailyAvg && (
          <ReviewRow label="Daily effort" value={`~ ${dailyAvg} per day`} />
        )}
        {draft.customTitle && (
          <ReviewRow label="Title" value={draft.customTitle} />
        )}
        {draft.category && (
          <ReviewRow label="Category" value={draft.category} />
        )}
      </View>

      {feasibility && (
        <View
          style={[
            styles.feasibilityCard,
            feasibility === "good" && styles.good,
            feasibility === "tight" && styles.tight,
            feasibility === "heavy" && styles.heavy,
          ]}
        >
          <Text
            style={[
              styles.feasibilityText,
              feasibility === "good" && styles.goodText,
              feasibility === "tight" && styles.tightText,
              feasibility === "heavy" && styles.heavyText,
            ]}
          >
            {feasibility === "good" &&
              "✅ This goal looks very achievable with steady progress."}
            {feasibility === "tight" &&
              "⚠️ This goal may require consistent daily discipline."}
            {feasibility === "heavy" &&
              "🧠 This is an ambitious goal. Consider adjusting duration if needed."}
          </Text>
          {feasibility === "heavy" && (
            <Pressable
              onPress={() => goTo("duration")}
              style={styles.secondaryBtn}
            >
              <Text style={styles.secondaryText}>Adjust duration</Text>
            </Pressable>
          )}
        </View>
      )}

      <Pressable style={styles.primaryBtn} onPress={handleSubmit}>
        <Text style={styles.primaryText}>Start this goal</Text>
      </Pressable>
    </View>
  );
}

/* =========================
   Helper
========================= */

function ReviewRow({ label, value }: { label: string; value?: string }) {
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

  feasibilityCard: {
    marginTop: 14,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },

  feasibilityText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  goodText: { color: "#22c55e" },
  tightText: { color: "#fbbf24" },
  heavyText: { color: "#f87171" },
  good: {
    backgroundColor: "rgba(34,197,94,0.12)",
    borderColor: "rgba(34,197,94,0.4)",
    color: "#22c55e",
  },

  tight: {
    backgroundColor: "rgba(251,191,36,0.12)",
    borderColor: "rgba(251,191,36,0.4)",
    color: "#fbbf24",
  },

  heavy: {
    backgroundColor: "rgba(239,68,68,0.10)",
    borderColor: "rgba(239,68,68,0.35)",
    color: "#f87171",
  },

  primaryBtn: {
    marginTop: "auto",
    backgroundColor: "#6366F1",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 32,
  },

  primaryText: {
    color: "#0B1020",
    fontWeight: "900",
    fontSize: 14,
  },
  secondaryBtn: {
    marginTop: 10,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  secondaryText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontWeight: "700",
  },
});
