import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Expense } from "../../models/expense.model";

type AddExpenceFormProps = {
  onSubmit: (expense: Expense) => void;
};

const AddExpenseForm = ({ onSubmit }: AddExpenceFormProps) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = () => {
    const parsedAmount = Number(amount);

    if(!title || isNaN(parsedAmount)){
        return;
    }

    const expense: Expense = {
        id: Date.now().toString(),
        title,
        amount: parsedAmount,
        category: "other",
        date: new Date().toISOString()
    }
    onSubmit(expense);
    setTitle("");
    setAmount("");
  }

  return (
    <View>
      <TextInput
        placeholder="Title"
        style={{ backgroundColor: "#fff" }}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Amount"
        style={{ backgroundColor: "#fff" }}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <Pressable onPress={handleSubmit}>
        <Text>Add Expense</Text>
      </Pressable>
    </View>
  );
};

export default AddExpenseForm;