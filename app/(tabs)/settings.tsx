import CurrencyInput from "@/components/ui/CurrencyInput";
import { LimitPeriod } from "@/models/limit.model";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useExpensesStore } from "../../src/context/ExpensesContext";

/* =========================
   Helpers
========================= */

function getMaxLimit(period: LimitPeriod, monthlyIncome?: number | null) {
  if (!monthlyIncome) return 10000;
  if (period === "daily") return Math.floor(monthlyIncome / 10);
  if (period === "weekly") return Math.floor(monthlyIncome / 2);
  return monthlyIncome;
}

function formatCurrency(value: number | null) {
  if (value == null) return "";
  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 0,
  }).format(value);
}

function parseCurrency(input: string) {
  // nokta, boşluk vs temizle
  const normalized = input.replace(/\D/g, "");
  return Number(normalized) || 0;
}

/* =========================
   Settings Screen
========================= */

export default function Settings() {
  const {
    limits,
    applyLimitChange,
    financeProfile,
    updateFinanceProfile,
    enableAutoLimits,
    disableAutoLimits,
  } = useExpensesStore();

  const [editingLimit, setEditingLimit] = useState<LimitPeriod | null>(null);
  const [tempLimitValue, setTempLimitValue] = useState("");
  const [editingField, setEditingField] = useState<"income" | "fixed" | null>(
    null
  );

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#050816", "#070A2A", "#0B1238"]}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <Text style={styles.title}>Settings</Text>

          {/* =========================
              AUTO MODE
          ========================= */}
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Automatic limits</Text>
              <Switch
                value={financeProfile.autoLimitEnabled}
                onValueChange={(v) =>
                  v ? enableAutoLimits() : disableAutoLimits()
                }
              />
            </View>
          </View>

          {/* =========================
              INCOME + FIXED (AUTO)
          ========================= */}
          {financeProfile.autoLimitEnabled && (
            <>
              {/* Monthly income */}
              <View style={styles.card}>
                <Text style={styles.label}>Monthly income</Text>

                <CurrencyInput
                  value={financeProfile.monthlyIncome}
                  onChange={(v) =>
                    updateFinanceProfile({
                      monthlyIncome: v,
                    })
                  }
                  style={styles.input}
                />
              </View>

              {/* Fixed expenses */}
              <View style={styles.card}>
                <Text style={styles.label}>Fixed expenses</Text>

                <CurrencyInput
                  value={financeProfile.fixedExpenses}
                  onChange={(v) =>
                    updateFinanceProfile({
                      fixedExpenses: v,
                    })
                  }
                  style={styles.input}
                />

                <Text style={styles.hint}>
                  Used to calculate available spending
                </Text>
              </View>
            </>
          )}

          {/* =========================
              LIMITS
          ========================= */}
          {Object.values(limits).map((limit) => (
            <View key={limit.period} style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>
                  {limit.period.toUpperCase()}
                  {limit.source === "auto" && " · AUTO"}
                </Text>

                <Switch
                  value={limit.active}
                  onValueChange={(v) =>
                    applyLimitChange(limit.period, { active: v })
                  }
                />
              </View>

              {editingLimit === limit.period &&
              !financeProfile.autoLimitEnabled ? (
                <CurrencyInput
                  autoFocus
                  value={Number(tempLimitValue) || 0}
                  onChange={(v) => setTempLimitValue(String(v))}
                  style={styles.input}
                  onBlur={() => {
                    const num = Number(tempLimitValue);
                    if (!isNaN(num)) {
                      applyLimitChange(limit.period, { amount: num });
                    }
                    setEditingLimit(null);
                  }}
                  onSubmitEditing={() => {
                    const num = Number(tempLimitValue);
                    if (!isNaN(num)) {
                      applyLimitChange(limit.period, { amount: num });
                    }
                    setEditingLimit(null);
                  }}
                />
              ) : (
                <Pressable
                  disabled={financeProfile.autoLimitEnabled}
                  onPress={() => {
                    setEditingLimit(limit.period);
                    setTempLimitValue(String(limit.amount));
                  }}
                >
                  <Text style={styles.amount}>₺{limit.amount}</Text>
                </Pressable>
              )}

              {financeProfile.autoLimitEnabled && (
                <Text style={styles.hint}>
                  Disable automatic limits to edit
                </Text>
              )}

              <Slider
                minimumValue={0}
                maximumValue={getMaxLimit(
                  limit.period,
                  financeProfile.monthlyIncome
                )}
                step={10}
                value={limit.amount}
                disabled={!limit.active || financeProfile.autoLimitEnabled}
                onValueChange={(v) =>
                  applyLimitChange(limit.period, {
                    amount: Math.round(v),
                  })
                }
                minimumTrackTintColor="#6366F1"
                maximumTrackTintColor="rgba(255,255,255,0.15)"
                thumbTintColor="#6366F1"
              />
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/* =========================
   Styles
========================= */

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 16 },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "rgba(255,255,255,0.9)",
    marginBottom: 16,
  },

  card: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: "rgba(17,24,39,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  label: {
    color: "rgba(255,255,255,0.9)",
    fontWeight: "700",
  },

  input: {
    borderBottomWidth: 1,
    borderColor: "#6366F1",
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    paddingVertical: 6,
    marginTop: 6,
  },

  amount: {
    fontSize: 18,
    fontWeight: "700",
    color: "rgba(255,255,255,0.85)",
    marginBottom: 6,
  },

  hint: {
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
    marginTop: 6,
  },
});