import CurrencyInput from "@/components/ui/CurrencyInput";
import { useTranslation } from "@/hooks/useTranslation";
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
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t("onboarding.income.title")}
      </Text>

      <CurrencyInput
        placeholder={t("onboarding.income.placeholder")}
        value={monthlyIncome}
        onChange={onChange}
        style={{ marginBottom: 24, color:"#fff" }}
      />

      <View style={styles.actions}>
        <Pressable onPress={onBack}>
          <Text style={styles.back}>
            {t("common.back")}
          </Text>
        </Pressable>

        <Pressable style={styles.button} onPress={onNext}>
          <Text style={styles.buttonText}>
            {t("common.continue")}
          </Text>
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
});