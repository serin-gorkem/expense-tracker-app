import { useTranslation } from "@/hooks/useTranslation";
import { CurrencyCode } from "@/models/currency.model";
import {
  Category,
  CATEGORY_OPTIONS,
  Expense,
  EXPENSE_KIND_META,
  ExpenseKind,
} from "@/models/expense.model";
import { useFinanceProfile } from "@/src/context/FinanceProfileContext";
import { useFX } from "@/src/context/FXContext";
import { useGoalsStore } from "@/src/context/GoalContext";
import { buildFXSnapshot } from "@/utils/currency/buildFXSnapshot";
import { mapFXStatusToBadge } from "@/utils/currency/mapFXStatusToBadge";
import { haptic } from "@/utils/haptics";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import FXBadge from "../Currency/FXBadge";
import CurrencyInput from "../ui/CurrencyInput";
import { styles } from "./styles/addExpenseFormStyle";
type AddExpenseFormProps = {
  onSubmit: (expense: Expense) => void;
};
type ValidationError = {
  title?: string;
  amount?: string;
  category?: string;
};

const AddExpenseForm = ({ onSubmit }: AddExpenseFormProps) => {
  const [title, setTitle] = useState("");
  const [originalTitle, setOriginalTitle] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [kind, setKind] = useState<ExpenseKind>("behavioral");
  const { t } = useTranslation();
  const [errors, setErrors] = useState<ValidationError>({});

  const [showSuccess, setShowSuccess] = useState(false);

  const { activeGoal } = useGoalsStore();
  const [boostGoal, setBoostGoal] = useState(false);

  const [currency, setCurrency] = useState<CurrencyCode>("EUR");
  const { profile, hydrated } = useFinanceProfile();
  const { getRate, status: fxStatus } = useFX();
  
  const [lockFX, setLockFX] = useState(false);
  const [manualRate, setManualRate] = useState<number | null>(null);
  
  const resetForm = () => {
    setTitle("");
    setOriginalTitle(null);
    setAmount(null);
    setCategory(null);
    setKind("behavioral");
    setBoostGoal(false);
    setCurrency(baseCurrency);
  };
  
  const badgeStatus =
  currency === profile.baseCurrency
  ? null
  : lockFX
  ? "locked"
  : mapFXStatusToBadge(fxStatus);
  
  useEffect(() => {
    if (currency === profile.baseCurrency) {
      setLockFX(false);
      setManualRate(null);
    }
  }, [currency, profile.baseCurrency]);
  
  if (!hydrated || !profile.baseCurrency) {
    return null; // ya da loader
  }
  const baseCurrency = profile.baseCurrency;
  const handleSubmit = () => {
    const newErrors: ValidationError = {};

    // Title validation
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    // Amount validation
    if (!amount || amount <= 0) {
      newErrors.amount = "Enter a valid amount";
    }

    // Category validation
    if (!boostGoal && !category) {
      newErrors.category = "Select a category";
    }

    // Eğer hata varsa → UI + haptic
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      haptic.warning();
      return;
    }
    const safeAmount = amount as number;
    const safeCategory = category as Category;

    // ---- SUCCESS FLOW ----

    let rate: number;
    let status: "live" | "cached" | "locked";

    if (currency === baseCurrency) {
      rate = 1;
      status = "live";
    } else if (lockFX) {
      if (!manualRate || manualRate <= 0) {
        setErrors({ amount: "Enter a valid FX rate" });
        haptic.warning();
        return;
      }

      rate = manualRate;
      status = "locked";
    } else {
      const fxRate = getRate(currency);

      if (!fxRate) {
        setErrors({ amount: t("currency.errors.fxUnavailable") });
        haptic.warning();
        return;
      }

      rate = fxRate;
      status = fxStatus === "live" ? "live" : "cached";
    }

    const fxSnapshot = buildFXSnapshot({
      amount: safeAmount,
      currency,
      baseCurrency,
      rate,
      status,
    });

    const expense: Expense = {
      id: Date.now().toString(),
      title: title.trim(),
      amount: safeAmount,
      category: safeCategory,
      date: new Date().toISOString(),
      kind,

      fx: fxSnapshot,

      ...(boostGoal && activeGoal
        ? {
            isGoalBoost: true,
            goalId: activeGoal.id,
            boostAmount: safeAmount,
          }
        : {}),
    };
    onSubmit(expense);

    haptic.success();
    setShowSuccess(true);

    setErrors({});
  };

  return (
    <View style={{ marginBottom: 12 }}>
      <BlurView intensity={24} tint="dark" style={styles.card}>
        <LinearGradient
          colors={["rgba(255,255,255,0.10)", "rgba(255,255,255,0.03)"]}
          style={StyleSheet.absoluteFillObject}
        />

        <Text style={styles.cardTitle}>{t("expense.add.title")}</Text>

        {/* Title */}
        <Text style={styles.label}>{t("expense.fields.title")}</Text>

        <TextInput
          value={title}
          maxLength={30}
          onChangeText={(v) => {
            setTitle(v);

            if (boostGoal && originalTitle === null) {
              setOriginalTitle(v);
            }

            if (errors.title) {
              setErrors((e) => ({ ...e, title: undefined }));
            }
          }}
          placeholder={t("expense.placeholders.title")}
          placeholderTextColor="rgba(255,255,255,0.45)"
          style={[styles.input, errors.title && styles.inputError]}
        />

        {errors.title && (
          <Text style={styles.errorText}>{t("expense.errors.title")}</Text>
        )}

        {boostGoal && (
          <Text style={styles.boostTitleHint}>{t("expense.goal.linked")}</Text>
        )}
        {/* Amount */}
        <Text style={styles.label}>{t("expense.fields.amount")}</Text>

        <CurrencyInput
          value={amount}
          onChange={(v) => {
            setAmount(v);
            if (errors.amount) setErrors((e) => ({ ...e, amount: undefined }));
          }}
          placeholder={t("expense.placeholders.amount")}
          style={[styles.input, errors.amount && styles.inputError]}
        />

        {errors.amount && (
          <Text style={styles.errorText}>{t("expense.errors.amount")}</Text>
        )}

        {/* Kind */}
        <Text style={styles.label}>{t("expense.fields.kind")}</Text>
        <View style={styles.kindRow}>
          {(["behavioral", "structural", "goal"] as ExpenseKind[]).map((k) => {
            const active = kind === k;
            return (
              <Pressable
                key={k}
                onPress={() => setKind(k)}
                style={[styles.kindPill, active && styles.kindPillActive]}
              >
                <Text style={styles.kindText}>
                  {t(EXPENSE_KIND_META[k].labelKey)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Category */}
        <Text style={styles.label}>{t("expense.fields.category")}</Text>
        <View
          style={[
            styles.categoryRow,
            errors.category && styles.categoryRowError,
          ]}
        >
          {CATEGORY_OPTIONS.map((item) => {
            const active = category === item.key;
            return (
              <Pressable
                key={item.key}
                onPress={() => setCategory(item.key)}
                style={[styles.category, active && styles.categoryActive]}
              >
                <Text style={styles.categoryText}>
                  {t(`categories.${item.key}`)}
                </Text>
              </Pressable>
            );
          })}
          {errors.category && (
            <Text style={styles.errorText}>{t("expense.errors.category")}</Text>
          )}
        </View>
        <Text style={styles.label}>Currency</Text>

        <View style={styles.kindRow}>
          {(["TRY", "USD", "EUR"] as CurrencyCode[]).map((c) => (
            <Pressable
              key={c}
              onPress={() => setCurrency(c)}
              style={[styles.kindPill, currency === c && styles.kindPillActive]}
            >
              <Text style={styles.kindText}>{c}</Text>
            </Pressable>
          ))}
        </View>
        {currency !== profile.baseCurrency && badgeStatus && (
          <View style={{ marginBottom: 11 }}>
            <FXBadge status={badgeStatus} />
          </View>
        )}
        {currency !== profile.baseCurrency && (
          <Pressable
            onPress={() => setLockFX((v) => !v)}
            style={{
              marginBottom: 8,
              padding: 10,
              borderRadius: 12,
              backgroundColor: lockFX
                ? "rgba(96,165,250,0.18)"
                : "rgba(255,255,255,0.06)",
              borderWidth: 1,
              borderColor: lockFX
                ? "rgba(96,165,250,0.45)"
                : "rgba(255,255,255,0.12)",
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "800", color: "#93c5fd" }}>
              🔒 Lock exchange rate
            </Text>
          </Pressable>
        )}
        {lockFX && (
          <>
            <Text style={styles.label}>Manual FX rate</Text>
            <TextInput
              keyboardType="decimal-pad"
              placeholder="e.g. 32.50"
              value={manualRate?.toString() ?? ""}
              onChangeText={(v) => setManualRate(Number(v))}
              style={styles.input}
            />
          </>
        )}
        {/* GOAL BOOST */}
        {activeGoal && (
          <Pressable
            onPress={() => {
              // Check if the activeGoal completed.
              setBoostGoal((prev) => {
                const next = !prev;

                if (next && activeGoal) {
                  // Open Boost
                  if (!originalTitle) {
                    setOriginalTitle(title);
                  }
                  setTitle(`Goal: ${activeGoal.title}`);
                  setKind("goal");
                  setCategory("other");
                }

                if (!next) {
                  // Close Boost.
                  if (originalTitle !== null) {
                    setTitle(originalTitle);
                    setOriginalTitle(null);
                  }
                }

                return next;
              });
            }}
            style={[styles.boostCard, boostGoal && styles.boostCardActive]}
          >
            <Text style={styles.boostTitle}>
              🎯 {t("expense.goal.boostTitle")}
            </Text>

            <Text style={styles.boostSub}>{activeGoal.title}</Text>

            {boostGoal && (
              <Text style={styles.boostHint}>
                {t("expense.goal.boostHint")}
              </Text>
            )}
          </Pressable>
        )}
        <Pressable onPress={handleSubmit} style={styles.btn}>
          <Text style={styles.btnText}>{t("expense.add.action")}</Text>
        </Pressable>
      </BlurView>

      {/* SUCCESS MODAL */}
      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccess(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {boostGoal
                ? t("expense.success.goalTitle")
                : t("expense.success.title")}
            </Text>

            <Text style={styles.modalText}>
              {boostGoal
                ? t("expense.success.goalDesc")
                : t("expense.success.desc")}
            </Text>

            <Pressable
              onPress={() => {
                setShowSuccess(false);
                resetForm();
              }}
              style={styles.modalBtn}
            >
              <Text style={styles.modalBtnText}>{t("common.ok")}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddExpenseForm;