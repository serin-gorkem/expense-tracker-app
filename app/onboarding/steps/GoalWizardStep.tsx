import { useWizard } from "@/src/context/WizardContext";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function GoalWizardStep() {
  const router = useRouter();
  const { reset } = useWizard();

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View>
        <Text style={styles.title}>Set a goal</Text>
        <Text style={styles.subtitle}>
          Goals help you stay motivated and turn leftover money into progress.
        </Text>
      </View>

      {/* INFO CARD */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Why create a goal?</Text>

        <Text style={styles.cardItem}>• Save for something specific</Text>
        <Text style={styles.cardItem}>• Build a habit over time</Text>
        <Text style={styles.cardItem}>
          • Automatically move unused money forward
        </Text>
      </View>

      {/* ACTIONS */}
      <View style={styles.actions}>
        <Pressable
          onPress={() => {
            reset();
            router.replace("/(tabs)/home");
          }}
        >
          <Text style={styles.skip}>Skip for now</Text>
        </Pressable>

        <Pressable
          style={styles.primaryBtn}
          onPress={() => {
            reset(); // CREATE MODE
            router.push("/goal-wizard");
          }}
        >
          <Text style={styles.primaryText}>Create a goal</Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0B1020",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "rgba(0,0,0,0.55)",
    marginBottom: 32,
  },

  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    marginBottom: 32,
  },

  cardTitle: {
    fontWeight: "700",
    color: "#0B1020",
    marginBottom: 10,
  },

  cardItem: {
    fontSize: 13,
    lineHeight: 20,
    color: "rgba(0,0,0,0.6)",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  skip: {
    fontSize: 14,
    color: "#6366F1",
    fontWeight: "600",
  },

  primaryBtn: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },

  primaryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});