import { Expense } from '@/models/expense.model';
import React from 'react';
import { FlatList } from 'react-native';
import ExpenseItem from '../ExpenseItem/ExpenseItem';

type ExpenseListProps ={
    expenses: Expense[];
}


const ExpenseList = ({expenses}: ExpenseListProps) => {
  return (
    <FlatList
      data={expenses}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ExpenseItem expense={item}></ExpenseItem>}
    />
  );
}

export default ExpenseList
