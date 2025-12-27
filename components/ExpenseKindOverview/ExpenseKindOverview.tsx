import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { useExpensesStore } from "../../src/context/ExpensesContext";
import { calculateByKind } from "../../utils/expense/expenseKindSummary";

export default function ExpenseKindOverview() {
  const { expenses } = useExpensesStore();

  const totals = calculateByKind(expenses);
  const total = totals.behavioral + totals.structural || 1;

  const behavioralPct = Math.round((totals.behavioral / total) * 100);
  const structuralPct = 100 - behavioralPct;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spending Breakdown</Text>

      <BlurView intensity={24} tint="dark" style={styles.card}>
        <LinearGradient
          colors={["rgba(255,255,255,0.10)", "rgba(255,255,255,0.03)"]}
          style={StyleSheet.absoluteFillObject}
        />

        <View style={styles.row}>
          <Text style={styles.label}>Structural</Text>
          <Text style={styles.value}>₺{totals.structural}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Behavioral</Text>
          <Text style={styles.value}>₺{totals.behavioral}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.insight}>
          {behavioralPct}% of your spending is behavioral.
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