import CurrencyInput from "@/components/ui/CurrencyInput";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";

type Props = {
  fixedExpenses: number | null;
  monthlyIncome: number | null;
  onChange(value: number): void;
  onNext(): void;
  onBack(): void;
};

export default function FixedExpensesStep({
  fixedExpenses,
  monthlyIncome,
  onChange,
  onNext,
  onBack,
}: Props) {
  function handleNext() {
    if (
      monthlyIncome != null &&
      fixedExpenses != null &&
      fixedExpenses > monthlyIncome
    ) {
      Alert.alert(
        "Hold on 😄",
        "Your expenses are higher than your income.\nEither you have a secret sponsor, or something went wrong here.",
        [{ text: "Alright, I'll fix it" }]
      );
      return;
    }

    onNext();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fixed expenses</Text>
      <Text style={styles.subtitle}>
        Rent, bills, subscriptions, etc.
      </Text>

<CurrencyInput
  value={fixedExpenses}
  onChange={onChange}
  placeholder="Total fixed expenses"
  style={styles.input}
/>

      <View style={styles.actions}>
        <Pressable onPress={onBack}>
          <Text style={styles.back}>Back</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </View>
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
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 6,
    opacity: 0.6,
  },

  input: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    fontWeight: "600",
  },

  actions: {
    marginTop: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  back: {
    opacity: 0.6,
  },

  button: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
  },
});