import { useTranslation } from "@/hooks/useTranslation";
import { LimitPeriod, LimitsState } from "@/models/limit.model";
import { useExpensesStore } from "@/src/context/ExpensesContext";
import { CURRENCY_META } from "@/utils/currency/currencyMeta";
import Slider from "@react-native-community/slider";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* =========================
   Helpers
========================= */

function formatAmount(value: number, symbol: string) {
  return `${symbol}${value.toLocaleString("en-US")}`;
}

function getMinLimit(period: LimitPeriod, limits: LimitsState) {
  if (period === "daily") return 0;
  if (period === "weekly") return limits.daily.amount;
  return limits.weekly.amount;
}

function getMaxLimit(
  period: LimitPeriod,
  limits: LimitsState,
  monthlyIncome?: number | null,
) {
  if (period === "daily") return limits.weekly.amount;
  if (period === "weekly") return limits.monthly.amount;
  return monthlyIncome ?? 10000;
}

/* =========================
   EditableAmount
========================= */

function EditableAmount({
  value,
  symbol,
  onChange,
}: {
  value: number;
  symbol: string;
  onChange(v: number): void;
}) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(String(value));

  function commit() {
    const num = Number(temp);
    if (!isNaN(num)) onChange(num);
    setEditing(false);
  }

  if (editing) {
    return (
      <TextInput
        autoFocus
        keyboardType="numeric"
        value={temp}
        onChangeText={setTemp}
        onBlur={commit}
        onSubmitEditing={commit}
        style={styles.amountInput}
      />
    );
  }

  return (
    <Pressable onPress={() => setEditing(true)}>
      <Text style={styles.amountText}>{formatAmount(value, symbol)}</Text>
      <Text style={styles.editHint}>{t("onboarding.limits.tapToEdit")}</Text>
    </Pressable>
  );
}

/* =========================
   ManualLimitsStep
========================= */

type Props = {
  onFinish(): void;
  onBack(): void;
};

export default function ManualLimitsStep({ onFinish, onBack }: Props) {
  const { limits, applyLimitChange, financeProfile, updateFinanceProfile } =
    useExpensesStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (financeProfile.autoLimitEnabled) {
      updateFinanceProfile({ autoLimitEnabled: false });
    }
  }, []);

  const baseCurrency = financeProfile.baseCurrency ?? "TRY";
  const symbol = CURRENCY_META[baseCurrency].symbol;

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>{t("onboarding.limits.manualTitle")}</Text>
        <Text style={styles.subtitle}>
          {t("onboarding.limits.manualSubtitle")}
        </Text>

        {/* =========================
          BASE CURRENCY (MANUAL)
          ========================= */}
        <View style={styles.card}>
          <Text style={styles.label}>{t("settings.baseCurrency")}</Text>

          <View style={styles.pillRow}>
            {Object.values(CURRENCY_META).map((c) => {
              const active = c.code === baseCurrency;

              return (
                <Pressable
                  key={c.code}
                  onPress={() => updateFinanceProfile({ baseCurrency: c.code })}
                  style={[styles.pill, active && styles.pillActive]}
                >
                  <Text
                    style={[styles.pillText, active && styles.pillTextActive]}
                  >
                    {c.symbol} {c.code}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* =========================
          LIMITS
          ========================= */}
        {Object.values(limits).map((limit) => (
          <View key={limit.period} style={styles.card}>
            <Text style={styles.label}>
              {t(`onboarding.limits.period.${limit.period}`)}
            </Text>

            <EditableAmount
              value={limit.amount}
              symbol={symbol}
              onChange={(v) =>
                applyLimitChange(limit.period, {
                  amount: Math.max(0, v),
                })
              }
            />

            <Slider
              minimumValue={getMinLimit(limit.period, limits)}
              maximumValue={getMaxLimit(
                limit.period,
                limits,
                financeProfile.monthlyIncome,
              )}
              step={10}
              value={limit.amount}
              onValueChange={(v) =>
                applyLimitChange(limit.period, {
                  amount: Math.round(v),
                })
              }
              minimumTrackTintColor="#6366F1"
              maximumTrackTintColor="rgba(0,0,0,0.1)"
              thumbTintColor="#6366F1"
            />
          </View>
        ))}

        <View style={styles.actions}>
          <Pressable onPress={onBack}>
            <Text style={styles.back}>{t("common.back")}</Text>
          </Pressable>

          <Pressable
            style={styles.primaryBtn}
            onPress={() => {
              updateFinanceProfile({ baseCurrency });
              onFinish();
            }}
          >
            <Text style={styles.primaryText}>{t("common.finish")}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* =========================
   Styles
========================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#FFFFFF",
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0B1020",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "rgba(0,0,0,0.55)",
    marginBottom: 24,
  },

  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    marginBottom: 16,
  },

  label: {
    fontWeight: "700",
    color: "#0B1020",
    marginBottom: 8,
  },

  amountText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0B1020",
  },

  editHint: {
    fontSize: 11,
    color: "rgba(0,0,0,0.4)",
    marginBottom: 12,
  },

  amountInput: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#6366F1",
    paddingVertical: 2,
    color: "#0B1020",
  },

  pillRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },

  pill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.04)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
  },

  pillActive: {
    backgroundColor: "rgba(99,102,241,0.2)",
    borderColor: "#6366F1",
  },

  pillText: {
    color: "rgba(0,0,0,0.6)",
    fontWeight: "700",
  },

  pillTextActive: {
    color: "#0B1020",
  },

  actions: {
    marginTop: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  back: {
    fontSize: 14,
    color: "rgba(0,0,0,0.6)",
    fontWeight: "600",
  },

  primaryBtn: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },

  primaryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
