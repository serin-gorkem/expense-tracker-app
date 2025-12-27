import CurrencyInput from "@/components/ui/CurrencyInput";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  monthlyIncome: number | null;
  onChange(value: number): void;
  onNext(): void;
  onBack(): void;
};

export default function IncomeStep({
  monthlyIncome,
  onChange,
  onNext,
  onBack,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your income</Text>

      <CurrencyInput
        placeholder="Monthly income"
        value={monthlyIncome}
        onChange={onChange}
        style={{ marginBottom: 24 }}
      />

      <View style={styles.actions}>
        <Pressable onPress={onBack}>
          <Text style={styles.back}>Back</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={onNext}>
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  back: { opacity: 0.6, fontSize: 14 },
  button: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: { color: "white", fontWeight: "700" },
});