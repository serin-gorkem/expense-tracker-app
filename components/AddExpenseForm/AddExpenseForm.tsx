import {
  Category,
  CATEGORY_OPTIONS,
  Expense,
  EXPENSE_KIND_META,
  ExpenseKind,
} from "@/models/expense.model";
import { haptic } from "@/utils/haptics";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import CurrencyInput from "../ui/CurrencyInput";

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
  const [amount, setAmount] = useState<number | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [kind, setKind] = useState<ExpenseKind>("behavioral");

  const [errors, setErrors] = useState<ValidationError>({});

  const [showSuccess, setShowSuccess] = useState(false);

  const resetForm = () => {
    setTitle("");
    setAmount(null);
    setCategory(null);
    setKind("behavioral");
  };

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
    if (!category) {
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

    const expense: Expense = {
      id: Date.now().toString(),
      title: title.trim(),
      amount: safeAmount,
      category: safeCategory,
      date: new Date().toISOString(),
      kind,
    };

    onSubmit(expense);

    haptic.success();
    setShowSuccess(true);

    setErrors({});
    resetForm();
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
          onChangeText={(v) => {
            setTitle(v);
            if (errors.title) setErrors((e) => ({ ...e, title: undefined }));
          }}
          placeholder="Expense title"
          placeholderTextColor="rgba(255,255,255,0.45)"
          style={[styles.input, errors.title && styles.inputError]}
        />
        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

        {/* Amount */}
        <Text style={styles.label}>Amount</Text>
        <CurrencyInput
          value={amount}
          onChange={(v) => {
            setAmount(v);
            if (errors.amount) setErrors((e) => ({ ...e, amount: undefined }));
          }}
          placeholder="Amount"
          placeholderTextColor="#"
          style={[styles.input, errors.amount && styles.inputError]}
        />
        {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}

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
                  {EXPENSE_KIND_META[k]?.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Category */}
        <Text style={styles.label}>Category</Text>
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
                <Text style={styles.categoryText}>{item.label}</Text>
              </Pressable>
            );
          })}
          {errors.category && (
            <Text style={styles.errorText}>{errors.category}</Text>
          )}
        </View>

        <Pressable onPress={handleSubmit} style={styles.btn}>
          <Text style={styles.btnText}>Add</Text>
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
            <Text style={styles.modalTitle}>Expense added</Text>
            <Text style={styles.modalText}>
              Your expense has been saved successfully.
            </Text>

            <Pressable
              onPress={() => setShowSuccess(false)}
              style={styles.modalBtn}
            >
              <Text style={styles.modalBtnText}>Got it</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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

  /* ---------- Modal ---------- */

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },

  modalCard: {
    width: "80%",
    borderRadius: 18,
    padding: 16,
    backgroundColor: "rgba(17,24,39,0.95)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  modalTitle: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 6,
  },

  modalText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginBottom: 12,
  },

  modalBtn: {
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
  },

  modalBtnText: {
    color: "rgba(255,255,255,0.95)",
    fontWeight: "800",
  },
  inputError: {
    borderColor: "rgba(239,68,68,0.6)",
  },

  categoryRowError: {
    padding: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.5)",
  },

  errorText: {
    color: "rgba(239,68,68,0.9)",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 6,
  },
});
