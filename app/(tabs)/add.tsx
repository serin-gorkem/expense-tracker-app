import AddExpenseForm from "@/components/AddExpenseForm/AddExpenseForm";
import { LiquidBackground } from "@/components/ui/LiquidBackground";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useExpensesStore } from "../../src/context/ExpensesContext";

export default function Add() {
  const { addExpense } = useExpensesStore();

  return (
    <View style={styles.root}>
      <LiquidBackground />

      <SafeAreaView style={styles.safe}>
        <AddExpenseForm onSubmit={addExpense} />
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
});
