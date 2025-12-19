import { Expense } from "@/models/expense.model";
import { GroupedExpenses } from "@/utils/expenseGrouping";
import { calculateTotal } from "@/utils/expenseSummary";
import { StyleSheet, Text, View } from "react-native";
import ExpenseList from "../ExpenseList/ExpenseList";

type MonthlyExpenseListProps = {
    groups: GroupedExpenses[];
    onDelete: (id:string) => void;
    onEdit: (expense: Expense) => void;
}

export default function MonthlyExpenseList({
  groups,
  onDelete,
  onEdit,
}: MonthlyExpenseListProps) {
    return (
      <View>
        {groups.map((group) => {
            const total = calculateTotal(group.expenses);
            return (
          <View key={group.label} style={styles.group}>
            <Text style={styles.label}>{group.label}</Text>
            <Text style={styles.total}>
              {new Intl.NumberFormat("tr-TR", {
                style: "currency",
                currency: "TRY",
              }).format(total)}
            </Text>
            <ExpenseList
              expenses={group.expenses}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          </View>
        )})}
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
  total: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },
});