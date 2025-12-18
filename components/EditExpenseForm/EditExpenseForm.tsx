import { Expense } from "@/models/expense.model";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type EditExpenseFormProps = {
  expense: Expense;
  onSubmit: (expense: Expense) => void;
  onCancel: () => void;
};

const EditExpenseForm = ({ expense, onSubmit, onCancel }: EditExpenseFormProps) => {
  const [title, setTitle] = useState(expense.title);
  const [amount, setAmount] = useState(expense.amount.toString());

  const handleSubmit = () => {
    const parsedAmount = Number(amount);
    if (!title || isNaN(parsedAmount)) return;

    onSubmit({ ...expense, title, amount: parsedAmount });
  };

  return (
    <View style={{ marginTop: 8 }}>
      <BlurView intensity={24} tint="dark" style={styles.card}>
        <LinearGradient
          colors={["rgba(255,255,255,0.10)", "rgba(255,255,255,0.03)"]}
          style={StyleSheet.absoluteFillObject}
        />
        <Text style={styles.cardTitle}>Edit expense</Text>

        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor="rgba(255,255,255,0.45)"
          style={styles.input}
        />
        <TextInput
          value={amount}
          onChangeText={setAmount}
          placeholder="Amount"
          placeholderTextColor="rgba(255,255,255,0.45)"
          style={styles.input}
          keyboardType="numeric"
        />

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
    letterSpacing: 0.2,
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