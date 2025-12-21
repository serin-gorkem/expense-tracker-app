import { Expense } from "@/models/expense.model";
import { buildWeeklyLineChartData } from "@/utils/expenseChart";
import { GroupedExpenses } from "@/utils/expenseGrouping";
import { calculateTotal } from "@/utils/expenseSummary";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import WeeklyLineChart from "../Charts/WeeklyLineChart";
import ExpenseList from "../ExpenseList/ExpenseList";

type WeeklyExpenseListProps = {
  groups: GroupedExpenses[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
};

export default function WeeklyExpenseList({
  groups,
  onDelete,
  onEdit,
}: WeeklyExpenseListProps) {
  const chartData = useMemo(
    () => buildWeeklyLineChartData(groups),
    [groups]
  );

  return (
    <View>
      <WeeklyLineChart data={chartData} />

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
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    marginBottom: 14,
  },
  label: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 6,
  },
  total: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },
});