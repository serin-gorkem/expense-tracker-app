// components/InsightSection/FinancialInsightSection.tsx

import { Expense } from "@/models/expense.model";
import { InsightItem } from "@/models/insight.model";
import { useExpensesStore } from "@/src/context/ExpensesContext";
import { selectAllFinancialInsights } from "@/utils/insights/selectAllFinancialInsights";
import { StyleSheet, Text, View } from "react-native";
import InsightCard from "./InsightCard";

type Props = {
  expenses: Expense[];
};

export default function FinancialInsightSection({ expenses }: Props) {
  const { dailyBaseline } = useExpensesStore();

  const insights: InsightItem[] = selectAllFinancialInsights({
    expenses,
    dailyBaseline,
  });

  if (insights.length === 0) return null;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Financial insights</Text>
      <Text style={styles.subtitle}>
        Overview of your spending metrics
      </Text>

      {insights.map((insight) => (
        <InsightCard key={insight.type} insight={insight} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(17,24,39,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    color: "rgba(255,255,255,0.9)",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 12,
  },
});