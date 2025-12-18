import { Expense } from '@/models/expense.model';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import ExpenseItem from '../ExpenseItem/ExpenseItem';


type ExpenseListProps ={
  expenses: Expense[];
  onDelete: (id:string) => void;
  onEdit: (expense:Expense) => void;
}

const ExpenseList = ({expenses, onDelete, onEdit}: ExpenseListProps) => {
  if(expenses.length <= 0){
    return(
      <View>
        <Text>No expenses yet.</Text>
      </View>
    )
  }
  
  return (
    <FlatList
      data={expenses}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ExpenseItem expense={item} onDelete={onDelete} onEdit={onEdit} ></ExpenseItem>}
      style={{ flex: 1 }}
    />
  );
}

export default ExpenseList
