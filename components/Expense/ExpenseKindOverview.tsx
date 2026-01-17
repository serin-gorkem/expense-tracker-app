import { useTranslation } from "@/hooks/useTranslation";
import { useExpensesStore } from "@/src/context/ExpensesContext";
import { calculateByKind } from "@/utils/expense/expenseKindSummary";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

export default function ExpenseKindOverview() {
  const { expenses } = useExpensesStore();
  const { t } = useTranslation();

  const totals = calculateByKind(expenses);

  const total =
    totals.behavioral + totals.structural > 0
      ? totals.behavioral + totals.structural
      : 1;

  const behavioralPct = Math.round(
    (totals.behavioral / total) * 100
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t("expenseBreakdown.title")}
      </Text>

      <BlurView intensity={24} tint="dark" style={styles.card}>
        <LinearGradient
          colors={[
            "rgba(255,255,255,0.10)",
            "rgba(255,255,255,0.03)",
          ]}
          style={StyleSheet.absoluteFillObject}
        />

        <View style={styles.row}>
          <Text style={styles.label}>
            {t("expenseBreakdown.structural")}
          </Text>
          <Text style={styles.value}>
            {totals.structural}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            {t("expenseBreakdown.behavioral")}
          </Text>
          <Text style={styles.value}>
            {totals.behavioral}
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.insight}>
          {t("expenseBreakdown.insight", {
            percent: behavioralPct,
          })}
        </Text>
      </BlurView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: "800", color: "white", marginBottom: 12 },
  card: {
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: { color: "rgba(255,255,255,0.75)", fontWeight: "700" },
  value: { color: "white", fontWeight: "900" },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginVertical: 10,
  },
  insight: {
    color: "rgba(255,255,255,0.9)",
    fontWeight: "700",
  },
});