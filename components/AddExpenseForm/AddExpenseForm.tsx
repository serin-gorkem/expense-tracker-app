import {
  Category,
  CATEGORY_OPTIONS,
  Expense,
  EXPENSE_KIND_META,
  ExpenseKind
} from "@/models/expense.model";
import { haptic } from "@/utils/haptics";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import CurrencyInput from "../ui/CurrencyInput";
type AddExpenseFormProps = {
  onSubmit: (expense: Expense) => void;
};

const AddExpenseForm = ({ onSubmit }: AddExpenseFormProps) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [kind, setKind] = useState<ExpenseKind>("behavioral");

  const handleSubmit = () => {
    if (!title || !amount || !category) return;

    const expense: Expense = {
      id: Date.now().toString(),
      title,
      amount,
      category,
      date: new Date().toISOString(),
      kind,
    };

    onSubmit(expense);
    haptic.success();

    setTitle("");
    setAmount(null);
    setCategory(null);
    setKind("behavioral");
  };

  return (
    <View style={{ marginBottom: 12 }}>
      <BlurView intensity={24} tint="dark" style={styles.card}>
        <LinearGradient
          colors={["rgba(255,255,255,0.10)", "rgba(255,255,255,0.03)"]}
          style={StyleSheet.absoluteFillObject}
        />

        <Text style={styles.cardTitle}>Add expense</Text>

        {/* Title */}
        <Text style={styles.label}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Expense title"
          placeholderTextColor="rgba(255,255,255,0.45)"
          style={styles.input}
        />

        {/* Amount */}
        <Text style={styles.label}>Amount</Text>
        <CurrencyInput
          value={amount}
          onChange={setAmount}
          placeholder="Amount"
          style={styles.input}
        />

        {/* Kind */}
        <Text style={styles.label}>Expense type</Text>
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

        {/* Category */}
        <Text style={styles.label}>Category</Text>
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

        <Pressable onPress={handleSubmit} style={styles.btn}>
          <Text style={styles.btnText}>Add</Text>
        </Pressable>
      </BlurView>
    </View>
  );
};

export default AddExpenseForm;

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
    marginBottom: 12,
  },

  label: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "rgba(255,255,255,0.92)",
    marginBottom: 12,
  },

  kindRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
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

  btn: {
    marginTop: 4,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },

  btnText: {
    color: "rgba(255,255,255,0.92)",
    fontWeight: "900",
  },
});