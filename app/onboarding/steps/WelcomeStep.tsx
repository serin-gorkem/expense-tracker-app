import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/src/context/LanguageContext";
import { LANGUAGES } from "@/src/i18n/languages";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  onNext(): void;
};

export default function WelcomeStep({ onNext }: Props) {
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* TITLE */}
      <Text style={styles.title}>{t("onboarding.welcome.title")}</Text>

      <Text style={styles.text}>
        {t("onboarding.welcome.subtitle")}
      </Text>

      {/* LANGUAGE SELECT */}
      <View style={styles.langSection}>
        <Text style={styles.langLabel}>
          {t("onboarding.welcome.language")}
        </Text>

        <View style={styles.langRow}>
          {LANGUAGES.map((l) => {
            const active = language === l.code;

            return (
              <Pressable
                key={l.code}
                onPress={() => changeLanguage(l.code)}
                style={[
                  styles.langPill,
                  active && styles.langPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.langText,
                    active && styles.langTextActive,
                  ]}
                >
                  {l.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* CTA */}
      <Pressable style={styles.button} onPress={onNext}>
        <Text style={styles.buttonText}>
          {t("onboarding.welcome.cta")}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#020617",
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "rgba(255,255,255,0.95)",
    marginBottom: 12,
  },

  text: {
    fontSize: 15,
    color: "rgba(255,255,255,0.65)",
    lineHeight: 22,
  },

  langSection: {
    marginTop: 32,
  },

  langLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255,255,255,0.6)",
    marginBottom: 8,
  },

  langRow: {
    flexDirection: "row",
    gap: 10,
  },

  langPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  langPillActive: {
    backgroundColor: "rgba(99,102,241,0.18)",
    borderColor: "#6366F1",
  },

  langText: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255,255,255,0.65)",
  },

  langTextActive: {
    color: "#fff",
  },

  button: {
    marginTop: 40,
    backgroundColor: "#6366F1",
    paddingVertical: 14,
    borderRadius: 14,
  },

  buttonText: {
    color: "#0B1020",
    fontWeight: "800",
    textAlign: "center",
    fontSize: 15,
  },
});