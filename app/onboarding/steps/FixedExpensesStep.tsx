import CurrencyInput from "@/components/ui/CurrencyInput";
import { useTranslation } from "@/hooks/useTranslation";
import { CurrencyCode } from "@/models/currency.model";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  fixedExpenses: number | null;
  monthlyIncome: number | null;
  baseCurrency: CurrencyCode; // ✅ NEW
  onChange(value: number): void;
  onNext(): void;
  onBack(): void;
};

export default function FixedExpensesStep({
  fixedExpenses,
  monthlyIncome,
  baseCurrency,
  onChange,
  onNext,
  onBack,
}: Props) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  function handleNext() {
    if (!fixedExpenses || fixedExpenses <= 0) {
      setError(t("onboarding.fixedExpenses.error"));
      return;
    }

    if (monthlyIncome != null && fixedExpenses > monthlyIncome) {
      Alert.alert(
        t("onboarding.fixedExpenses.alert.title"),
        t("onboarding.fixedExpenses.alert.message"),
        [{ text: t("common.ok") }]
      );
      return;
    }

    setError(null);
    onNext();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("onboarding.fixedExpenses.title")}</Text>

      <Text style={styles.subtitle}>
        {t("onboarding.fixedExpenses.subtitle")}
      </Text>

      <Text style={styles.currencyHint}>
        {t("onboarding.fixedExpenses.baseCurrencyHint", {
          currency: baseCurrency,
        })}
      </Text>
      <CurrencyInput
        value={fixedExpenses}
        onChange={(v) => {
          onChange(v);
          if (error) setError(null);
        }}
        placeholder={`${t(
          "onboarding.fixedExpenses.placeholder"
        )} (${baseCurrency})`}
        style={styles.input}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.actions}>
        <Pressable onPress={onBack}>
          <Text style={styles.back}>{t("common.back")}</Text>
        </Pressable>

        <Pressable
          style={[
            styles.button,
            (!fixedExpenses || fixedExpenses <= 0) && styles.buttonDisabled,
          ]}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>{t("common.continue")}</Text>
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
    backgroundColor: "#020617",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },

  subtitle: {
    marginTop: 6,
    opacity: 0.6,
    color: "#fff",
  },

  input: {
    marginTop: 24,
    color: "#fff",
  },

  actions: {
    marginTop: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  back: {
    opacity: 0.6,
    color: "#fff",
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
  error: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 8,
    fontWeight: "600",
  },

  buttonDisabled: {
    opacity: 0.4,
  },
  currencyHint: {
    marginTop: 4,
    fontSize: 12,
    opacity: 0.45,
    color: "#fff",
  },
});
