import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Category, CATEGORY_OPTIONS, Expense } from "../../models/expense.model";

type AddExpenceFormProps = {
  onSubmit: (expense: Expense) => void;
};

const AddExpenseForm = ({ onSubmit }: AddExpenceFormProps) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category,setCategory] = useState<Category| null>(null); 

  const handleSubmit = () => {
    const parsedAmount = Number(amount);
    if (!title || isNaN(parsedAmount) || !category) return;

    const expense: Expense = {
      id: Date.now().toString(),
      title,
      amount: parsedAmount,
      category,
      date: new Date().toISOString(),
    };

    onSubmit(expense);
    setTitle("");
    setAmount("");
    setCategory(null);
  };

  return (
    <View style={{ marginBottom: 12 }}>
      <BlurView intensity={24} tint="dark" style={styles.card}>
        <LinearGradient
          colors={["rgba(255,255,255,0.10)", "rgba(255,255,255,0.03)"]}
          style={StyleSheet.absoluteFillObject}
        />
        <Text style={styles.cardTitle}>Add expense</Text>

        <TextInput
          placeholder="Title"
          placeholderTextColor="rgba(255,255,255,0.45)"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          placeholder="Amount"
          placeholderTextColor="rgba(255,255,255,0.45)"
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <View style={{ gap: 6, marginBottom: 12 }}>
          <Text style={styles.btnText}>Select Category</Text>
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
        </View>

        <Pressable onPress={handleSubmit} style={styles.btn}>
          <Text style={styles.btnText}>Add</Text>
        </Pressable>
      </BlurView>
    </View>
  );
};

export default AddExpenseForm;

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
  btn: {
    marginTop: 2,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
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

  btnText: { color: "rgba(255,255,255,0.92)", fontWeight: "900" },
});