// components/goals/GoalApplyModal.tsx

import { useTranslation } from "@/hooks/useTranslation";
import { CurrencyCode } from "@/models/currency.model";
import {
  Goal,
  GoalApplyDecision,
  GoalApplyPayload,
} from "@/models/goal.model";
import React, { useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type GoalModalProps = {
  visible: boolean;
  remainingAmount: number; // native amount (default goal.currency)
  goal: Goal;
  getRate: (currency: CurrencyCode) => number | null;

  onDecision: (
    decision: GoalApplyDecision,
    payload?: GoalApplyPayload
  ) => void;
};

const CURRENCIES: CurrencyCode[] = ["EUR", "USD", "TRY"];

export default function GoalApplyModal({
  visible,
  remainingAmount,
  goal,
  getRate,
  onDecision,
}: GoalModalProps) {
  const { t } = useTranslation();

  const [currency, setCurrency] = useState<CurrencyCode>(goal.currency);

  const rate = useMemo(() => {
    if (currency === goal.baseCurrency) return 1;
    return getRate(currency);
  }, [currency, goal.baseCurrency, getRate]);

  const baseAmount = useMemo(() => {
    if (!rate) return null;
    return Number((remainingAmount * rate).toFixed(2));
  }, [remainingAmount, rate]);

  const remainingBase = Math.max(goal.baseTargetAmount, 0);

  const willComplete =
    baseAmount != null && baseAmount >= remainingBase;

  if (!goal) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <View style={styles.container}>
          {/* TITLE */}
          <Text style={styles.title}>{t("goalApply.title")}</Text>

          {/* AMOUNT */}
          <Text style={styles.amount}>
            {remainingAmount} {currency}
          </Text>

          <Text style={styles.subtle}>
            {t("goalApply.subtle")}
          </Text>

          {/* CONTEXT */}
          <Text style={styles.context}>
            {t("goalApply.context")}{" "}
            <Text style={styles.goalTitle}>{goal.title}</Text>
          </Text>

          {/* CURRENCY SELECT */}
          <View style={styles.currencyRow}>
            {CURRENCIES.map((c) => {
              const active = c === currency;
              return (
                <Pressable
                  key={c}
                  onPress={() => setCurrency(c)}
                  style={[
                    styles.currencyPill,
                    active && styles.currencyActive,
                  ]}
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

          {/* FX PREVIEW */}
          {baseAmount != null && (
            <View style={styles.preview}>
              <Text style={styles.previewValue}>
                ≈ {baseAmount} {goal.baseCurrency}
              </Text>

              {willComplete ? (
                <Text style={styles.previewSuccess}>
                  {t("goalApply.preview.success")}
                </Text>
              ) : (
                <Text style={styles.previewNeutral}>
                  {t("goalApply.preview.notEnough")}
                </Text>
              )}
            </View>
          )}

          {/* ACTIONS */}
          <View style={styles.actions}>
            <Pressable
              style={[styles.button, styles.primary]}
              onPress={() =>
                onDecision("APPLY_TO_GOAL", {
                  amount: remainingAmount,
                  currency,
                  fxStatus: "cached",
                })
              }
              disabled={!rate}
            >
              <Text style={styles.primaryText}>
                {t("goalApply.actions.apply")}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.secondary]}
              onPress={() => onDecision("SKIP_FOR_TODAY")}
            >
              <Text style={styles.secondaryText}>
                {t("goalApply.actions.skip")}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 24,
  },

  container: {
    backgroundColor: "#020617",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  title: {
    color: "#e5e7eb",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 14,
  },

  amount: {
    color: "#f9fafb",
    fontSize: 30,
    fontWeight: "800",
  },

  subtle: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 4,
  },

  context: {
    color: "#d1d5db",
    fontSize: 14,
    marginTop: 14,
  },

  goalTitle: {
    color: "#fff",
    fontWeight: "700",
  },

  currencyRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
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

  preview: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  previewValue: {
    color: "#e5e7eb",
    fontSize: 13,
    fontWeight: "700",
  },

  previewSuccess: {
    marginTop: 6,
    color: "#22c55e",
    fontWeight: "700",
    fontSize: 12,
  },

  previewNeutral: {
    marginTop: 6,
    color: "#fbbf24",
    fontWeight: "700",
    fontSize: 12,
  },

  actions: {
    marginTop: 20,
    gap: 10,
  },

  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },

  primary: {
    backgroundColor: "#22c55e",
  },

  primaryText: {
    color: "#052e16",
    fontWeight: "800",
    fontSize: 15,
  },

  secondary: {
    backgroundColor: "#1f2937",
  },

  secondaryText: {
    color: "#e5e7eb",
    fontSize: 14,
  },
});