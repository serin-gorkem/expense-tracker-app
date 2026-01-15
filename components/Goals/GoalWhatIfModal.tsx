// components/goals/GoalWhatIfModal.tsx

import { useTranslation } from "@/hooks/useTranslation";
import { CurrencyCode } from "@/models/currency.model";
import { Goal } from "@/models/goal.model";
import { useExpensesStore } from "@/src/context/ExpensesContext";
import { useFX } from "@/src/context/FXContext";
import { calculateGoalProjection } from "@/utils/goals/calculateGoalProjection";
import { simulateGoalProjection } from "@/utils/goals/simulateGoalProjection";
import { useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  visible: boolean;
  onClose(): void;
  goal: Goal;
};

const PRESETS = [10, 25, 50] as const;
const CURRENCIES: CurrencyCode[] = ["EUR", "USD", "TRY"];
const PRESETS_BY_CURRENCY: Record<CurrencyCode, readonly number[]> = {
  EUR: [10, 25, 50],
  USD: [10, 25, 50],
  TRY: [250, 500, 1000],
};

export default function GoalWhatIfModal({ visible, onClose, goal }: Props) {
  const { expenses } = useExpensesStore();
  const { getRate } = useFX();
  const { t } = useTranslation();

  const [currency, setCurrency] = useState<CurrencyCode>(goal.currency);
  const [extra, setExtra] = useState<number | null>(null);

  const baseProjection = calculateGoalProjection(goal, expenses);

  const rate = useMemo(() => {
    if (currency === goal.baseCurrency) return 1;
    return getRate(currency);
  }, [currency, goal.baseCurrency, getRate]);

  const baseExtraDaily =
    extra != null && rate ? Number((extra * rate).toFixed(0)) : null;

  const simulated =
    baseExtraDaily != null
      ? simulateGoalProjection(baseProjection, baseExtraDaily)
      : null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.modal}>
        <Text style={styles.title}>
          {t("goals.active.whatIf.title")}
        </Text>

        {/* Currency selector */}
        <View style={styles.currencyRow}>
          {CURRENCIES.map((c) => {
            const active = c === currency;
            return (
              <Pressable
                key={c}
                onPress={() => {
                  setCurrency(c);
                  setExtra(null);
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

        {/* Presets */}
        <View style={styles.row}>
          {PRESETS_BY_CURRENCY[currency].map((v) => (
            <Pressable
              key={v}
              onPress={() => setExtra(v)}
              style={[styles.pill, extra === v && styles.pillActive]}
            >
              <Text style={styles.pillText}>
                +{v} {currency}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Result */}
        {simulated && baseExtraDaily != null && (
          <>
            <Text
              style={[
                styles.result,
                styles[`status_${simulated.feasibility}`],
              ]}
            >
              {t(
                `goals.active.whatIf.result.${simulated.feasibility}`,
                { amount: extra ?? 0 }
              )}
            </Text>

            <Text style={styles.meta}>
              ≈ +{baseExtraDaily} {goal.baseCurrency} / {t("common.perDay")}
            </Text>

            <Text style={styles.meta}>
              {t("goals.active.whatIf.resultPrefix")}{" "}
              {simulated.actualDaily} {goal.baseCurrency}
            </Text>
          </>
        )}

        <Text style={styles.note}>
          {t("goals.active.whatIf.note")}
        </Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modal: {
    position: "absolute",
    left: 16,
    right: 16,
    top: "28%",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  title: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 12,
  },

  currencyRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },

  currencyPill: {
    flex: 1,
    paddingVertical: 8,
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
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.7)",
  },

  currencyTextActive: {
    color: "#fff",
  },

  row: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },

  pill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  pillActive: {
    backgroundColor: "rgba(99,102,241,0.28)",
    borderColor: "rgba(99,102,241,0.5)",
  },

  pillText: {
    color: "rgba(255,255,255,0.9)",
    fontWeight: "800",
    fontSize: 12,
  },

  result: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
  },

  meta: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 4,
  },

  note: {
    fontSize: 10,
    color: "rgba(255,255,255,0.45)",
    marginTop: 8,
  },

  status_good: { color: "#22c55e" },
  status_tight: { color: "#eab308" },
  status_heavy: { color: "#f97316" },
});