import { LimitPeriod, LimitsState } from "@/models/limit.model";
import Slider from "@react-native-community/slider";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useExpensesStore } from "../../../src/context/ExpensesContext";

/* =========================
   EditableAmount
========================= */

function EditableAmount({
  value,
  onChange,
}: {
  value: number;
  onChange(v: number): void;
}) {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(String(value));

  function commit() {
    const num = Number(temp);
    if (!isNaN(num)) {
      onChange(num);
    }
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
      <Text style={styles.amountText}>₺{value}</Text>
    </Pressable>
  );
}

/* =========================
   Helpers
========================= */

function getMinLimit(period: LimitPeriod, limits: LimitsState) {
  if (period === "daily") return 0;
  if (period === "weekly") return limits.daily.amount;
  return limits.weekly.amount;
}

function getMaxLimit(
  period: LimitPeriod,
  limits: LimitsState,
  monthlyIncome?: number | null
) {
  if (period === "daily") return limits.weekly.amount;
  if (period === "weekly") return limits.monthly.amount;
  return monthlyIncome ?? 10000;
}

/* =========================
   ManualLimitsStep
========================= */

type Props = {
  onFinish(): void;
  onBack(): void;
};


export default function ManualLimitsStep({
  onFinish,
  onBack,
}: Props) {
  const { limits, applyLimitChange, financeProfile } =
    useExpensesStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set your limits</Text>

      {Object.values(limits).map((limit) => (
        <View key={limit.period} style={styles.card}>
          <Text style={styles.label}>{limit.period.toUpperCase()}</Text>

          <EditableAmount
            value={limit.amount}
            onChange={(v) =>
              applyLimitChange(limit.period, { amount: Math.max(0, v) })
            }
          />

          <Slider
            minimumValue={getMinLimit(limit.period, limits)}
            maximumValue={getMaxLimit(
              limit.period,
              limits,
              financeProfile.monthlyIncome
            )}
            step={10}
            value={limit.amount}
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

      <View style={styles.actions}>
        <Pressable onPress={onBack}>
          <Text style={styles.back}>Back</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={onFinish}>
          <Text style={styles.buttonText}>Finish</Text>
        </Pressable>
      </View>
    </View>
  );
}

/* =========================
   Styles
========================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 24,
  },

  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(17,24,39,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    marginBottom: 16,
  },

  label: {
    fontWeight: "700",
    marginBottom: 8,
    opacity: 0.8,
  },

  amountText: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 12,
  },

  amountInput: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#6366F1",
    paddingVertical: 2,
  },

  actions: {
    marginTop: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  back: {
    opacity: 0.6,
  },

  button: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
  },
});