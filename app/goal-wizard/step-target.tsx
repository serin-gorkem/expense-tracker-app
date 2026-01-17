import CurrencyInput from "@/components/ui/CurrencyInput";
import { useTranslation } from "@/hooks/useTranslation";
import { CurrencyCode } from "@/models/currency.model";
import { CATEGORY_OPTIONS } from "@/models/expense.model";
import { useWizard } from "@/src/context/WizardContext";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function StepTarget() {
  const { t } = useTranslation();
  const {setCurrency} = useWizard();

  const { draft, setTargetAmount, setTitle, next, canGoNext, setCategory } =
    useWizard();

    const CURRENCIES: CurrencyCode[] = ["EUR", "USD", "TRY"];
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>{t("goalWizard.target.title")}</Text>
      <Text style={styles.p}>{t("goalWizard.target.subtitle")}</Text>

      {/* TARGET AMOUNT */}
      <View style={styles.card}>
        <Text style={styles.label}>{t("goalWizard.target.amountLabel")}</Text>
        <CurrencyInput
          value={draft.targetAmount ?? 0}
          onChange={setTargetAmount}
          placeholder={t("goalWizard.target.amountPlaceholder")}
          style={styles.currencyInput}
        />
      </View>
              <View style={styles.card}>
          <Text style={styles.label}>
            {t("goalWizard.target.currencyLabel")}
          </Text>

          <View style={styles.currencyRow}>
            {CURRENCIES.map((c) => {
              const active = draft.currency === c;

              return (
                <Pressable
                  key={c}
                  onPress={() => setCurrency(c)}
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
        </View>

      {/* GOAL TITLE */}
      <View style={styles.card}>
        <Text style={styles.label}>{t("goalWizard.target.titleLabel")}</Text>
        <TextInput
          value={draft.customTitle ?? ""}
          onChangeText={setTitle}
          maxLength={32}
          placeholder={t("goalWizard.target.titlePlaceholder")}
          placeholderTextColor="rgba(255,255,255,0.35)"
          style={styles.input}
        />
      </View>

      {/* CATEGORY */}
      <View style={styles.card}>
        <Text style={styles.label}>{t("goalWizard.target.categoryLabel")}</Text>
        <Text style={styles.helper}>
          {t("goalWizard.target.categoryHelper")}
        </Text>

        <View style={styles.categoryGrid}>
          {CATEGORY_OPTIONS.map((c) => {
            const isActive = draft.category === c.key;

            return (
              <Pressable
                key={c.key}
                onPress={() => setCategory(isActive ? undefined : c.key)}
                style={[styles.categoryItem, isActive && styles.categoryActive]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isActive && styles.categoryTextActive,
                  ]}
                >
                  {t(`categories.${c.key}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>
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

/* =========================
   Styles
========================= */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#020617" },

  h1: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 22,
    fontWeight: "800",
  },

  p: {
    marginTop: 6,
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
  },

  card: {
    marginTop: 18,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(17,24,39,0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  label: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },

  currencyInput: {
    borderBottomWidth: 1,
    borderColor: "#6366F1",
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    fontWeight: "800",
    paddingVertical: 6,
  },
  helper: {
    marginTop: 4,
    marginBottom: 10,
    fontSize: 11,
    color: "rgba(255,255,255,0.45)",
  },

  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  categoryItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  categoryActive: {
    borderColor: "#6366F1",
    backgroundColor: "rgba(99,102,241,0.15)",
  },

  categoryText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontWeight: "700",
  },

  categoryTextActive: {
    color: "#fff",
  },
  currencyRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },

  currencyPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  currencyActive: {
    borderColor: "#6366F1",
    backgroundColor: "rgba(99,102,241,0.15)",
  },

  currencyText: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255,255,255,0.7)",
  },

  currencyTextActive: {
    color: "#fff",
  },

  input: {
    marginTop: 6,
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    fontWeight: "700",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "rgba(2,6,23,0.85)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  primaryBtn: {
    marginTop: "auto",
    marginBottom: 32,
    backgroundColor: "#6366F1",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },

  btnDisabled: {
    opacity: 0.45,
  },

  primaryText: {
    color: "#0B1020",
    fontWeight: "800",
  },
});
