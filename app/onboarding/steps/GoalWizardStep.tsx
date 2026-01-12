import { OnboardingData } from "@/hooks/useOnboardingWizard";
import { useTranslation } from "@/hooks/useTranslation";
import { useWizard } from "@/src/context/WizardContext";
import { setOnboardingReturn } from "@/utils/onboarding/onboardingReturn";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  data: OnboardingData;
  onNext(): void;
  onBack(): void;
};

export default function GoalWizardStep({ data, onNext, onBack }: Props) {
  const router = useRouter();
  const { reset } = useWizard();
  const { t } = useTranslation();
if (!data) return null;
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View>
        <Text style={styles.title}>{t("onboarding.goal-wizard.title")}</Text>
        <Text style={styles.subtitle}>
          {t("onboarding.goal-wizard.subtitle")}
        </Text>
      </View>

      {/* INFO CARD */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {t("onboarding.goal-wizard.whyTitle")}
        </Text>

        <Text style={styles.cardItem}>
          • {t("onboarding.goal-wizard.why.1")}
        </Text>
        <Text style={styles.cardItem}>
          • {t("onboarding.goal-wizard.why.2")}
        </Text>
        <Text style={styles.cardItem}>
          • {t("onboarding.goal-wizard.why.3")}
        </Text>
      </View>

      {/* ACTIONS */}
      <View style={styles.footer}>
        <View style={styles.inlineActions}>
          <Pressable onPress={onBack}>
            <Text style={styles.back}>{t("common.back")}</Text>
          </Pressable>

          <Text style={styles.or}>·</Text>

          <Pressable
            onPress={async () => {
              reset();
              onNext();
            }}
          >
            <Text style={styles.skip}>{t("common.skipForNow")}</Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.primaryBtn}
          onPress={async () => {
            if (data.useAutoLimits) {
              await setOnboardingReturn({
                flow: "auto",
                step: 6,
                useAutoLimits: true,
                monthlyIncome: data?.monthlyIncome!,
                fixedExpenses: data?.fixedExpenses!,
              });
            } else {
              await setOnboardingReturn({
                flow: "manual",
                step: 5,
                useAutoLimits: false,
              });
            }

            reset();
            router.push("/goal-wizard");
          }}
        >
          <Text style={styles.primaryText}>
            {t("onboarding.goal-wizard.create")}
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
    backgroundColor: "#FFFFFF",
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0B1020",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "rgba(0,0,0,0.55)",
    marginBottom: 32,
  },

  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    marginBottom: 32,
  },

  cardTitle: {
    fontWeight: "700",
    color: "#0B1020",
    marginBottom: 10,
  },

  cardItem: {
    fontSize: 13,
    lineHeight: 20,
    color: "rgba(0,0,0,0.6)",
  },

  footer: {
    gap: 16,
  },

  inlineActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  or: {
    color: "rgba(0,0,0,0.3)",
    fontWeight: "700",
  },

  skip: {
    fontSize: 14,
    color: "#6366F1",
    fontWeight: "600",
  },

  back: {
    fontSize: 14,
    color: "rgba(0,0,0,0.6)",
    fontWeight: "600",
  },

  primaryBtn: {
    backgroundColor: "#6366F1",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  primaryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
