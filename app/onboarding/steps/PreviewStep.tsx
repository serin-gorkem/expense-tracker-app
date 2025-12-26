import { Pressable, StyleSheet, Text, View } from "react-native";
import { useExpensesStore } from "../../../src/context/ExpensesContext";
import { calculateAutoLimits } from "../../../utils/limit/calculateAutoLimits";

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
  const { updateFinanceProfile, enableAutoLimits, applyLimitChange } =
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

      applyLimitChange("daily", {
        amount: limits.daily,
        source: "auto",
      });
      applyLimitChange("weekly", {
        amount: limits.weekly,
        source: "auto",
      });
      applyLimitChange("monthly", {
        amount: limits.monthly,
        source: "auto",
      });
    }

    onFinish();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preview</Text>

      <Text>Daily limit: ₺{limits.daily}</Text>
      <Text>Weekly limit: ₺{limits.weekly}</Text>
      <Text>Monthly limit: ₺{limits.monthly}</Text>

      <Pressable style={styles.button} onPress={finish}>
        <Text style={styles.buttonText}>Finish</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 , justifyContent: "center" , alignItems: "stretch"},
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
  button: {
    marginTop: 32,
    backgroundColor: "#22C55E",
    padding: 14,
    borderRadius: 12,
  },
  buttonText: { color: "white", fontWeight: "700", textAlign: "center" },
});