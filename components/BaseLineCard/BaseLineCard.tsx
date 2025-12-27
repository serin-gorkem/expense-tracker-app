import GlassCard from "@/components/ui/GlassCard";
import { StyleSheet, Text } from "react-native";
import { useExpensesStore } from "../../src/context/ExpensesContext";

export default function BaselineCard() {
  const { dailyBaseline } = useExpensesStore();

  if (dailyBaseline == null) return null;

  return (
    <GlassCard>
      <Text style={styles.title}>Daily baseline</Text>

      <Text style={styles.amount}>₺{dailyBaseline}</Text>

      <Text style={styles.desc}>
        This is what a balanced day looks like for you.
      </Text>
      <Text style={styles.hint}>Not a limit.</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  title: {
    opacity: 0.7,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  amount: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  desc: {
    opacity: 0.6,
    color: "#FFFFFF",
    fontSize: 13,
  },
  hint: {
    opacity: 0.4,
    color: "#FFFFFF",
    fontSize: 11,
    marginTop: 4,
  },
});