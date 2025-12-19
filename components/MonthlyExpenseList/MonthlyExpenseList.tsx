import { Expense } from "@/models/expense.model";
import { GroupedExpenses } from "@/utils/expenseGrouping";
import { StyleSheet, Text, View } from "react-native";
import ExpenseList from "../ExpenseList/ExpenseList";

type MonthlyExpenseListProps = {
    groups: GroupedExpenses[];
    onDelete: (id:string) => void;
    onEdit: (expense: Expense) => void;
}

export default function WeeklyExpenseList({
  groups,
  onDelete,
  onEdit,
}: MonthlyExpenseListProps) {
    return (
      <View>
        {groups.map((group) => (
          <View key={group.label} style={styles.group}>
            <Text style={styles.label}>{group.label}</Text>
            <ExpenseList
              expenses={group.expenses}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          </View>
        ))}
      </View>
    );
}

const styles = StyleSheet.create({
  group: {
    marginBottom: 18,
  },
  label: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 6,
  },
});