import { Category, Expense } from "@/models/expense.model";
import { buildMonthlyCategoryDonutData } from "@/utils/expense/expenseChart";
import { GroupedExpenses } from "@/utils/expense/expenseGrouping";
import { calculateTotal } from "@/utils/expense/expenseSummary";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import MonthlyCategoryDonutChart from "../Charts/MonthlyCategoryDonutChart";
import ExpenseList from "../ExpenseList/ExpenseList";

type MonthlyExpenseListProps = {
  // LIST (filtreli olabilir)
  groups: GroupedExpenses[];

  // CHART (her zaman category = "all" datası)
  chartGroups: GroupedExpenses[];

  selectedCategory: Category | "all";
  onSelectCategory: (category: Category | "all") => void;

  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
};

export default function MonthlyExpenseList({
  groups,
  chartGroups,
  selectedCategory,
  onSelectCategory,
  onDelete,
  onEdit,
}: MonthlyExpenseListProps) {
  // Chart asla kaybolmasın diye donutData'yı chartGroups'tan üret
  const donutData = useMemo(
    () => buildMonthlyCategoryDonutData(chartGroups),
    [chartGroups]
  );

  const monthLabel = chartGroups[0]?.label ?? groups[0]?.label ?? "";

  return (
    <View>
      <MonthlyCategoryDonutChart
        data={donutData}
        monthLabel={monthLabel}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />

      {groups.map((group) => {
        const total = calculateTotal(group.expenses);

        return (
          <View key={group.label} style={styles.group}>
            <Text style={styles.label}>{group.label}</Text>
            <Text style={styles.total}>
              {new Intl.NumberFormat("en-US", {
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
  group: { marginBottom: 18 },
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