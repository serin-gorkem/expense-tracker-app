import {
  Category,
  CATEGORY_OPTIONS,
  Expense,
  EXPENSE_KIND_META,
  ExpenseKind,
} from "@/models/expense.model";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import CurrencyInput from "../ui/CurrencyInput";

type EditExpenseFormProps = {
  expense: Expense;
  onSubmit: (expense: Expense) => void;
  onCancel: () => void;
};

const EditExpenseForm = ({
  expense,
  onSubmit,
  onCancel,
}: EditExpenseFormProps) => {
  const [title, setTitle] = useState(expense.title);
  const [amount, setAmount] = useState<number | null>(expense.amount);
  const [category, setCategory] = useState<Category>(expense.category);
  const [kind, setKind] = useState<ExpenseKind>(expense.kind);

  const handleSubmit = () => {
    if (!title || !amount) return;

    onSubmit({
      ...expense,
      title,
      amount,
      category,
      kind,
    });
  };

  return (
    <View style={{ marginTop: 8 }}>
      <BlurView intensity={24} tint="dark" style={styles.card}>
        <LinearGradient
          colors={["rgba(255,255,255,0.10)", "rgba(255,255,255,0.03)"]}
          style={StyleSheet.absoluteFillObject}
        />

        <Text style={styles.cardTitle}>Edit expense</Text>

        <CurrencyInput
          value={amount}
          onChange={setAmount}
          placeholder="Amount"
          style={styles.input}
        />

        <View style={styles.kindRow}>
          {(["behavioral", "structural"] as ExpenseKind[]).map((k) => {
            const active = kind === k;
            return (
              <Pressable
                key={k}
                onPress={() => setKind(k)}
                style={[styles.kindPill, active && styles.kindPillActive]}
              >
                <Text style={styles.kindText}>
                  {EXPENSE_KIND_META[k].label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.categoryRow}>
          {CATEGORY_OPTIONS.map((item) => {
            const active = category === item.key;
            return (
              <Pressable
                key={item.key}
                onPress={() => setCategory(item.key)}
                style={[styles.category, active && styles.categoryActive]}
              >
                <Text style={styles.categoryText}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.row}>
          <Pressable onPress={onCancel} style={[styles.btn, styles.btnGhost]}>
            <Text style={styles.btnText}>Cancel</Text>
          </Pressable>
          <Pressable onPress={handleSubmit} style={styles.btn}>
            <Text style={styles.btnText}>Save</Text>
          </Pressable>
        </View>
      </BlurView>
    </View>
  );
};

export default EditExpenseForm;

/* =========================
   Styles
========================= */

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    padding: 14,
    overflow: "hidden",
  },
  cardTitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "rgba(255,255,255,0.92)",
    marginBottom: 10,
  },
  kindRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  kindPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  kindPillActive: {
    backgroundColor: "rgba(99,102,241,0.28)",
    borderColor: "rgba(99,102,241,0.5)",
  },
  kindText: {
    color: "rgba(255,255,255,0.85)",
    fontWeight: "800",
    fontSize: 12,
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  category: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  categoryActive: {
    backgroundColor: "rgba(91,124,255,0.22)",
    borderColor: "rgba(91,124,255,0.35)",
  },
  categoryText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontWeight: "800",
  },
  row: { flexDirection: "row", gap: 10 },
  btn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  btnGhost: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.10)",
  },
  btnText: { color: "rgba(255,255,255,0.92)", fontWeight: "900" },
});