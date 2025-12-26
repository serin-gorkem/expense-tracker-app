import AddExpenseForm from "@/components/AddExpenseForm/AddExpenseForm";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useExpensesStore } from "../../src/context/ExpenseContext";

export default function Add() {
  const { addExpense } = useExpensesStore();

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#050816", "#070A2A", "#0B1238"]}
        style={StyleSheet.absoluteFillObject}
      />

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
