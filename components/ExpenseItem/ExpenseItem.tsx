import { Expense } from '@/models/expense.model';
import React from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

type ExpenseItemProps = {
    expense: Expense;
    onDelete: (id:string) => void;
    onEdit: (expense: Expense) => void;
}

const ExpenseItem = ({ expense, onDelete, onEdit }: ExpenseItemProps) => {
  const confirmDelete = () => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(expense.id),
        },
      ]
    );
  }
    return (
      <View>
        <Text>{expense.title}</Text>
        <Text>{expense.amount}</Text>
        <Text>{expense.category}</Text>
        <Text>{expense.date}</Text>
        <Pressable onPress={confirmDelete}>
          <Text>Delete</Text>
        </Pressable>
        <Pressable onPress={() => onEdit(expense)}>
          <Text>Edit</Text>
        </Pressable>
      </View>
    );

};

export default ExpenseItem
