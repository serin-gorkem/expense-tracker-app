import { useTranslation } from "@/hooks/useTranslation";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  enabled: boolean;
  onChange(value: boolean): void;
  onNext(): void;
  onBack(): void;
};

export default function AutoLimitStep({
  enabled,
  onChange,
  onNext,
  onBack,
}: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t("onboarding.autoLimits.title")}
      </Text>

      <Text style={styles.subtitle}>
        {t("onboarding.autoLimits.subtitle")}
      </Text>

      <View style={styles.options}>
        <Pressable
          style={[styles.option, enabled && styles.active]}
          onPress={() => onChange(true)}
        >
          <Text style={styles.optionText}>
            {t("onboarding.autoLimits.yes")}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.option, !enabled && styles.active]}
          onPress={() => onChange(false)}
        >
          <Text style={styles.optionText}>
            {t("onboarding.autoLimits.no")}
          </Text>
        </Pressable>
      </View>

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
  container: { flex: 1, padding: 24, justifyContent: "center" , alignItems: "stretch"},
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { marginTop: 8, opacity: 0.6 },
  options: { marginTop: 32 },
  option: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    marginBottom: 12,
  },
  active: {
    borderColor: "#6366F1",
    backgroundColor: "rgba(99,102,241,0.15)",
  },
  optionText: { fontWeight: "600" },
  actions: {
    marginTop: 32,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  back: { opacity: 0.6 },
  button: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: { color: "white", fontWeight: "700" },
});