import { Expense } from '@/models/expense.model';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

type EditExpenseFormProps = {
    expense: Expense,
    onSubmit: (expense:Expense) => void,
    onCancel: () => void,
}


const EditExpenseForm = ({expense,onSubmit,onCancel} : EditExpenseFormProps) => {
    const [title,setTitle] = useState(expense.title);
    const [amount,setAmount] = useState(expense.amount.toString());

    const handleSubmit= () => {
        const parsedAmount = Number(amount);
        if(!title || isNaN(parsedAmount)){
            return;
        }
        const updatedExpense: Expense = {
          ...expense,
          title,
          amount: parsedAmount,
        };
        onSubmit(updatedExpense);
    }


  return (
    <View>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        style={{ backgroundColor: "#fff" }}
      ></TextInput>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="Amount"
        style={{ backgroundColor: "#fff" }}
      ></TextInput>

      <Pressable onPress={handleSubmit}>
        <Text>Save</Text>
      </Pressable>
      <Pressable onPress={onCancel}>
        <Text>Cancel</Text>
      </Pressable>
    </View>
  );
}

export default EditExpenseForm
