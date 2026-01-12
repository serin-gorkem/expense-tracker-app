import { useTranslation } from "@/hooks/useTranslation";
import { useExpensesStore } from "@/src/context/ExpensesContext";
import { calculateAutoLimits } from "@/utils/limit/calculateAutoLimits";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  monthlyIncome: number;
  fixedExpenses: number;
  useAutoLimits: boolean;
  onFinish(): void;
};

export default function PreviewStep({
  monthlyIncome,
  fixedExpenses,
  useAutoLimits,
  onFinish,
}: Props) {
  const { t } = useTranslation();
  const { updateFinanceProfile, enableAutoLimits, applyAutoLimit } =
    useExpensesStore();

  const limits = calculateAutoLimits({
    monthlyIncome,
    fixedExpenses,
  });

  function finish() {
    updateFinanceProfile({
      monthlyIncome,
      fixedExpenses,
      autoLimitEnabled: useAutoLimits,
    });

    if (useAutoLimits) {
      enableAutoLimits();
applyAutoLimit("daily", limits.daily);
applyAutoLimit("weekly", limits.weekly);
applyAutoLimit("monthly", limits.monthly);
    }

    onFinish();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t("onboarding.preview.title")}
      </Text>

      <Text style={styles.subtitle}>
        {useAutoLimits
          ? t("onboarding.preview.autoSubtitle")
          : t("onboarding.preview.manualSubtitle")}
      </Text>

      <View style={styles.card}>
        <PreviewRow
          label={t("onboarding.limits.period.daily")}
          value={limits.daily}
        />
        <PreviewRow
          label={t("onboarding.limits.period.weekly")}
          value={limits.weekly}
        />
        <PreviewRow
          label={t("onboarding.limits.period.monthly")}
          value={limits.monthly}
        />
      </View>

      <Pressable style={styles.button} onPress={finish}>
        <Text style={styles.buttonText}>
          {t("common.finish")}
        </Text>
      </Pressable>
    </View>
  );
}

/* =========================
   Helpers
========================= */

function PreviewRow({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>₺{value}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    opacity: 0.65,
    marginBottom: 24,
  },

  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
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
    fontSize: 13,
    opacity: 0.7,
    fontWeight: "600",
  },

  rowValue: {
    fontSize: 15,
    fontWeight: "800",
  },

  button: {
    marginTop: 32,
    backgroundColor: "#22C55E",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "800",
    fontSize: 15,
  },
});