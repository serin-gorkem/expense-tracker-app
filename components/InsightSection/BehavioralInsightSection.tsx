import InsightCard from "@/components/InsightSection/InsightCard";
import { Expense } from "@/models/expense.model";
import { behavioralInsights } from "@/utils/insights/behavioralInsights";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  expenses: Expense[];
  dailyLimit: number;
};

export default function BehavioralInsightSection({
  expenses,
  dailyLimit,
}: Props) {
const insights = behavioralInsights({
  expenses,
  dailyLimit,
}).slice(0, 2);

if (insights.length === 0) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Behavioral patterns</Text>
      <Text style={styles.subtitle}>We&apos;re still learning your habits</Text>
      <Text style={styles.hint}>
        Use the app for a few more days to unlock behavior insights.
      </Text>
    </View>
  );
}

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Behavioral patterns</Text>
      <Text style={styles.subtitle}>
        How your spending behavior changes over time
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
  hint: {
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
    marginTop: 6,
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