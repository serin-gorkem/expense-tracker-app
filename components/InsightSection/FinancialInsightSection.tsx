// components/InsightSection/FinancialInsightSection.tsx

import { useTranslation } from "@/hooks/useTranslation";
import { Expense } from "@/models/expense.model";
import { InsightItem } from "@/models/insight.model";
import { useExpensesStore } from "@/src/context/ExpensesContext";
import { useFX } from "@/src/context/FXContext";
import { useFinanceProfile } from "@/src/context/FinanceProfileContext";
import { selectAllFinancialInsights } from "@/utils/insights/selectAllFinancialInsights";
import { StyleSheet, Text, View } from "react-native";
import InsightCard from "./InsightCard";

type Props = {
  expenses: Expense[];
};

export default function FinancialInsightSection({ expenses }: Props) {
  const { dailyBaseline } = useExpensesStore();
  const { t, formatCurrency } = useTranslation();
  const { rates } = useFX();
  const { profile } = useFinanceProfile();

  const insights: InsightItem[] = selectAllFinancialInsights({
    expenses,
    dailyBaseline,
    currentRates: rates?.rates ?? {},
    baseCurrency: profile.baseCurrency,
  });

  if (insights.length === 0) return null;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{t("insights.financial.title")}</Text>

      <Text style={styles.subtitle}>{t("insights.financial.subtitle")}</Text>

      {insights.map((insight) => {
        const params = insight.params?.amount
          ? {
              ...insight.params,
              amount: formatCurrency(insight.params.amount as number),
            }
          : insight.params;

        return (
          <InsightCard
            key={insight.type}
            title={t(insight.titleKey)}
            description={t(insight.descriptionKey, params)}
            tone={insight.tone}
          />
        );
      })}
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
