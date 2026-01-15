import { useTranslation } from "@/hooks/useTranslation";
import { useFX } from "@/src/context/FXContext";
import { useFinanceProfile } from "@/src/context/FinanceProfileContext";
import { useGoalsStore } from "@/src/context/GoalContext";
import { useWizard } from "@/src/context/WizardContext";
import { createGoalFromDraft } from "@/utils/goals/createGoalFromDraft";
import { getOnboardingReturn } from "@/utils/onboarding/onboardingReturn";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
type FeasibilityLevel = "good" | "tight" | "heavy";

export default function StepReview() {
  const router = useRouter();
  const { t } = useTranslation();
  const { draft, goTo, reset } = useWizard();
  const { createGoal } = useGoalsStore();
  const { getRate } = useFX();
  const { profile } = useFinanceProfile();

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

  const defaultTitle = t(`goals.goal.defaultTitle.${draft.type}`);

  const handleSubmit = async () => {
    const goal = createGoalFromDraft(
      draft,
      defaultTitle,
      profile.baseCurrency,
      getRate
    );
    createGoal(goal);
    reset();

    const onboardingReturn = await getOnboardingReturn();
    if (onboardingReturn) {
      router.replace("/onboarding");
    } else {
      router.replace("/(tabs)/goals");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>{t("goalWizard.review.title")}</Text>
      <Text style={styles.p}>{t("goalWizard.review.subtitle")}</Text>

      <View style={styles.card}>
        <ReviewRow
          label={t("goalWizard.review.type")}
          value={draft.type && t(`goalTypes.${draft.type}`)}
        />
        <ReviewRow
          label={t("goalWizard.review.duration")}
          value={`${draft.durationInDays} ${t("common.days")}`}
        />
        <ReviewRow
          label={t("goalWizard.review.target")}
          value={`${draft.targetAmount}`}
        />

        {dailyAvg && (
          <ReviewRow
            label={t("goalWizard.review.dailyEffort")}
            value={`~ ${dailyAvg} ${t("common.perDay")}`}
          />
        )}

        {draft.customTitle && (
          <ReviewRow
            label={t("goalWizard.review.titleLabel")}
            value={draft.customTitle}
          />
        )}

        {draft.category && (
          <ReviewRow
            label={t("goalWizard.review.category")}
            value={t(`categories.${draft.category}`)}
          />
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
            {t(`goalWizard.review.feasibility.${feasibility}`)}
          </Text>

          {feasibility === "heavy" && (
            <Pressable
              onPress={() => goTo("duration")}
              style={styles.secondaryBtn}
            >
              <Text style={styles.secondaryText}>
                {t("goalWizard.review.adjustDuration")}
              </Text>
            </Pressable>
          )}
        </View>
      )}

      <Pressable style={styles.primaryBtn} onPress={handleSubmit}>
        <Text style={styles.primaryText}>{t("goalWizard.review.start")}</Text>
      </Pressable>
    </View>
  );
}

/* =========================
   Helper
========================= */

function ReviewRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;

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
