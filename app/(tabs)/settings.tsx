import CurrencyInput from "@/components/ui/CurrencyInput";
import GlassCard from "@/components/ui/GlassCard";
import { LiquidBackground } from "@/components/ui/LiquidBackground";
import { LiquidDecor } from "@/components/ui/LiquidDecor";
import { useTranslation } from "@/hooks/useTranslation";
import { CurrencyCode } from "@/models/currency.model";
import { LimitPeriod } from "@/models/limit.model";
import { useFinanceProfile } from "@/src/context/FinanceProfileContext";
import { useGoalsStore } from "@/src/context/GoalContext";
import { useLanguage } from "@/src/context/LanguageContext";
import { LANGUAGES } from "@/src/i18n/languages";
import { CURRENCY_META } from "@/utils/currency/currencyMeta";
import { resetAppData } from "@/utils/storage/resetAppData";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useExpensesStore } from "../../src/context/ExpensesContext";

const CURRENCIES: CurrencyCode[] = ["TRY", "EUR", "USD"];
/* =========================
   Helpers
========================= */
function getMaxLimit(period: LimitPeriod, monthlyIncome?: number | null) {
  if (!monthlyIncome) return 10000;
  if (period === "daily") return Math.floor(monthlyIncome / 10);
  if (period === "weekly") return Math.floor(monthlyIncome / 2);
  return monthlyIncome;
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
  } = useExpensesStore();

  const router = useRouter();
  const [editingLimit, setEditingLimit] = useState<LimitPeriod | null>(null);
  const [tempLimitValue, setTempLimitValue] = useState("");
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const { resetGoals } = useGoalsStore();
  const {resetProfile} = useFinanceProfile();
  const {resetExpenses} = useExpensesStore();

const baseCurrency: CurrencyCode =
  financeProfile.baseCurrency ?? "TRY";

const currencyMeta = CURRENCY_META[baseCurrency];

  function confirmReset() {
    Alert.alert(t("settings.reset.title"), t("settings.reset.message"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("settings.reset.confirm"),
        style: "destructive",
        onPress: async () => {
          await resetAppData();
          resetGoals();
          resetProfile();
          resetExpenses();
          router.replace("/onboarding");
        },
      },
    ]);
  }
  return (
    <View style={styles.root}>
      <LiquidBackground theme="settings" />
      <LiquidDecor variant="settings" />

      <SafeAreaView style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40, gap: 16 }}
        >
          <Text style={styles.title}>{t("settings.title")}</Text>

          {/* =========================
              AUTO MODE
          ========================= */}
          <GlassCard>
            <View style={styles.row}>
              <Text style={styles.label}>{t("settings.autoLimits")}</Text>
              <Switch
                value={financeProfile.autoLimitEnabled}
                onValueChange={(v) =>
                  updateFinanceProfile({ autoLimitEnabled: v })
                }
              />
            </View>
          </GlassCard>
          <GlassCard>
            <Text style={styles.label}>{t("settings.language")}</Text>

            <View style={styles.pillRow}>
              {LANGUAGES.map((l) => {
                const active = language === l.code;

                return (
                  <Pressable
                    key={l.code}
                    onPress={() => changeLanguage(l.code)}
                    style={[styles.pill, active && styles.pillActive]}
                  >
                    <Text
                      style={[styles.pillText, active && styles.pillTextActive]}
                    >
                      {l.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </GlassCard>
          <GlassCard>
            <Text style={styles.label}>{t("settings.baseCurrency")}</Text>

            <View style={styles.pillRow}>
              {CURRENCIES.map((c) => {
                const active = financeProfile.baseCurrency === c;

                return (
                  <Pressable
                    key={c}
                    onPress={() => updateFinanceProfile({ baseCurrency: c })}
                    style={[styles.pill, active && styles.pillActive]}
                  >
                    <Text
                      style={[styles.pillText, active && styles.pillTextActive]}
                    >
                      {CURRENCY_META[c].symbol} {c}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.hint}>{t("settings.baseCurrencyHint")}</Text>
          </GlassCard>

          {/* =========================
              INCOME + FIXED (AUTO)
          ========================= */}
          {financeProfile.autoLimitEnabled && (
            <>
              <GlassCard>
                <Text style={styles.label}>{t("settings.monthlyIncome")}</Text>

                <CurrencyInput
                  value={financeProfile.monthlyIncome}
                  onChange={(v) => updateFinanceProfile({ monthlyIncome: v })}
                  style={styles.input}
                />
              </GlassCard>

              <GlassCard>
                <Text style={styles.label}>{t("settings.fixedExpenses")}</Text>

                <CurrencyInput
                  value={financeProfile.fixedExpenses}
                  onChange={(v) => updateFinanceProfile({ fixedExpenses: v })}
                  style={styles.input}
                />
              </GlassCard>
            </>
          )}

          {/* =========================
              LIMITS
          ========================= */}
          {Object.values(limits).map((limit) => (
            <GlassCard key={limit.period}>
              <View style={styles.row}>
                <Text style={styles.label}>
                  {t(`limits.${limit.period}.title`)}
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
                  <Text style={styles.amount}>
                    {currencyMeta.symbol} {limit.amount}
                  </Text>
                </Pressable>
              )}

              {financeProfile.autoLimitEnabled && (
                <Text style={styles.hint}>{t("settings.disableAutoHint")}</Text>
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
            </GlassCard>
          ))}
          <GlassCard>
            <Pressable onPress={confirmReset} style={{ paddingVertical: 12 }}>
              <Text
                style={{
                  color: "#EF4444",
                  fontWeight: "800",
                  textAlign: "center",
                }}
              >
                {t("settings.reset.button")}
              </Text>
            </Pressable>
          </GlassCard>
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
  safe: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "rgba(255,255,255,0.9)",
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
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  pillActive: {
    backgroundColor: "rgba(99,102,241,0.25)",
    borderColor: "#6366F1",
  },

  pillText: {
    color: "rgba(255,255,255,0.7)",
    fontWeight: "700",
  },

  pillTextActive: {
    color: "#fff",
  },
});
