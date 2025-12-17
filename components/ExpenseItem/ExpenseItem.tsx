import { Expense } from '@/models/expense.model';
import React from 'react';
import { Text, View } from 'react-native';

type ExpenseItemProps = {
    expense: Expense;
}

const ExpenseItem = ({ expense }: ExpenseItemProps) => {
    return (
      <View>
        <Text>{expense.title}</Text>
        <Text>{expense.amount}</Text>
        <Text>{expense.category}</Text>
        <Text>{expense.date}</Text>
      </View>
    );

};

export default ExpenseItem
