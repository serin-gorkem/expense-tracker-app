import AddExpenseForm from "@/components/Expense/AddExpenseForm";
import { LiquidBackground } from "@/components/ui/LiquidBackground";
import { useGoalsStore } from "@/src/context/GoalContext";
import { useWizard } from "@/src/context/WizardContext";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useExpensesStore } from "../../src/context/ExpensesContext";

export default function Add() {
  const { addExpense } = useExpensesStore();
  const { goals, activeGoal } = useGoalsStore();
  const { reset } = useWizard();
  const router = useRouter();

  return (
    <View style={styles.root}>
      <LiquidBackground />

      <SafeAreaView style={styles.safe}>
        <AddExpenseForm onSubmit={addExpense} />
              <Pressable
                style={styles.button}
                onPress={() => {
                  reset(); // ⬅️ CREATE MODE
                  router.push("/goal-wizard");
                }}
              >
                <Text style={styles.buttonText}>Create Goal</Text>
              </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  button: {
    marginBottom: 12,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "rgba(99,102,241,0.18)",
    borderWidth: 1,
    borderColor: "rgba(99,102,241,0.35)",
  },
  buttonText: {
    color: "rgba(255,255,255,0.9)",
    fontWeight: "800",
  },
});
