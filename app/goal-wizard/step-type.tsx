import { useTranslation } from "@/hooks/useTranslation";
import { useWizard } from "@/src/context/WizardContext";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function StepType() {
  const { draft, setType, next, canGoNext } = useWizard();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>{t("goalWizard.type.title")}</Text>
      <Text style={styles.p}>{t("goalWizard.type.subtitle")}</Text>

      <View style={styles.list}>
        <Pressable
          style={[styles.card, draft.type === "savings" && styles.cardActive]}
          onPress={() => setType("savings")}
        >
          <Text style={styles.cardTitle}>
            {t("goalWizard.type.savings.title")}
          </Text>
          <Text style={styles.cardSub}>
            {t("goalWizard.type.savings.desc")}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.card, draft.type === "purchase" && styles.cardActive]}
          onPress={() => setType("purchase")}
        >
          <Text style={styles.cardTitle}>
            {t("goalWizard.type.purchase.title")}
          </Text>
          <Text style={styles.cardSub}>
            {t("goalWizard.type.purchase.desc")}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.card, draft.type === "budget" && styles.cardActive]}
          onPress={() => setType("budget")}
        >
          <Text style={styles.cardTitle}>
            {t("goalWizard.type.budget.title")}
          </Text>
          <Text style={styles.cardSub}>{t("goalWizard.type.budget.desc")}</Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.primaryBtn, !canGoNext && styles.btnDisabled]}
        onPress={next}
        disabled={!canGoNext}
      >
        <Text style={styles.primaryText}>{t("common.continue")}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#020617" },
  h1: { color: "rgba(255,255,255,0.92)", fontSize: 22, fontWeight: "700" },
  p: { marginTop: 6, color: "rgba(255,255,255,0.6)", fontSize: 13 },
  list: { marginTop: 18, gap: 12 },
  card: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(17,24,39,0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  cardActive: { borderColor: "rgba(99,102,241,0.9)" },
  cardTitle: { color: "rgba(255,255,255,0.9)", fontSize: 15, fontWeight: "700" },
  cardSub: { marginTop: 6, color: "rgba(255,255,255,0.55)", fontSize: 12, lineHeight: 16 },
  primaryBtn: {
    marginTop: "auto",
    marginBottom:32,
    backgroundColor: "#6366F1",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  btnDisabled: { opacity: 0.45 },
  primaryText: { color: "#0B1020", fontWeight: "800" },
});