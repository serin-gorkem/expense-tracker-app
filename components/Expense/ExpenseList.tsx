import { useTranslation } from "@/hooks/useTranslation";
import { Expense } from "@/models/expense.model";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import ExpenseItem from "./ExpenseItem";

type ExpenseListProps = {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
};

const ExpenseList = ({ expenses, onDelete, onEdit }: ExpenseListProps) => {
  const { t } = useTranslation();

  if (expenses.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          {t("expense.empty")}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={expenses}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ExpenseItem
          expense={item}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      )}
      style={{ flex: 1 }}
      scrollEnabled={false}
      contentContainerStyle={{
        paddingTop: 2,
        paddingBottom: 20,
      }}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default ExpenseList;

const styles = StyleSheet.create({
  empty: { paddingVertical: 18 },
  emptyText: { color: "rgba(255,255,255,0.65)", fontWeight: "700" },
});