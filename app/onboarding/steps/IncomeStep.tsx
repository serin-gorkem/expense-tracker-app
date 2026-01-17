import CurrencyInput from "@/components/ui/CurrencyInput";
import { useTranslation } from "@/hooks/useTranslation";
import { CurrencyCode } from "@/models/currency.model";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  monthlyIncome: number | null;
  baseCurrency: CurrencyCode;
  onCurrencyChange(currency: CurrencyCode): void;

  onChange(value: number): void;
  onNext(): void;
  onBack(): void;
};
export default function IncomeStep({
  monthlyIncome,
  baseCurrency,
  onCurrencyChange,
  onChange,
  onNext,
  onBack,
}: Props) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

const isInvalid = !monthlyIncome || monthlyIncome <= 0 || !baseCurrency;

  const CURRENCIES: CurrencyCode[] = ["TRY", "EUR", "USD"];

  function handleNext() {
    if (isInvalid) {
      setError(t("onboarding.income.error"));
      return;
    }

    setError(null);
    onNext();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("onboarding.income.title")}</Text>

      <CurrencyInput
        placeholder={t("onboarding.income.placeholder")}
        value={monthlyIncome}
        onChange={(v) => {
          onChange(v);
          if (error) setError(null);
        }}
        style={{ marginBottom: 8, color: "#fff" }}
      />
      <View style={styles.currencyRow}>
        {CURRENCIES.map((c) => {
          const active = c === baseCurrency;

          return (
            <Pressable
              key={c}
              onPress={() => {
                onCurrencyChange(c);
                if (error) setError(null);
              }}
              style={[styles.currencyPill, active && styles.currencyActive]}
            >
              <Text
                style={[
                  styles.currencyText,
                  active && styles.currencyTextActive,
                ]}
              >
                {c}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.actions}>
        <Pressable onPress={onBack}>
          <Text style={styles.back}>{t("common.back")}</Text>
        </Pressable>

        <Pressable
          style={[styles.button, isInvalid && styles.buttonDisabled]}
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
    marginBottom: 16,
    color: "#fff",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  back: {
    opacity: 0.6,
    fontSize: 14,
    color: "#fff",
  },
  button: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 20,
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
    marginBottom: 16,
    fontWeight: "600",
  },

  buttonDisabled: {
    opacity: 0.4,
  },
  currencyRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },

  currencyPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  currencyActive: {
    backgroundColor: "rgba(99,102,241,0.25)",
    borderColor: "#6366F1",
  },

  currencyText: {
    color: "rgba(255,255,255,0.7)",
    fontWeight: "700",
  },

  currencyTextActive: {
    color: "#fff",
  },
});
