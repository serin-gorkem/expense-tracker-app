import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useExpensesStore } from "../../src/context/ExpenseContext";

export default function Settings() {
  const { limits, updateLimit } = useExpensesStore();

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#050816", "#070A2A", "#0B1238"]}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>Limits</Text>

        {Object.values(limits).map((limit) => (
          <View key={limit.period} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>
                {limit.period.toUpperCase()}
              </Text>

              <Switch
                value={limit.active}
                onValueChange={(v) =>
                  updateLimit(limit.period, { active: v })
                }
              />
            </View>

            <Text style={styles.amount}>
              {limit.amount}
            </Text>

            <Slider
              minimumValue={0}
              maximumValue={
                limit.period === "daily"
                  ? 500
                  : limit.period === "weekly"
                  ? 3000
                  : 10000
              }
              step={10}
              value={limit.amount}
              disabled={!limit.active}
              onValueChange={(v) =>
                updateLimit(limit.period, { amount: Math.round(v) })
              }
            />
          </View>
        ))}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1, padding: 16 },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "rgba(255,255,255,0.9)",
    marginBottom: 16,
  },

  card: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: "rgba(17,24,39,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  label: {
    color: "rgba(255,255,255,0.9)",
    fontWeight: "700",
  },

  amount: {
    color: "rgba(255,255,255,0.7)",
    marginBottom: 8,
  },
});