import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function CreateGoalEntry() {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setOpen((v) => !v)} style={styles.header}>
        <Text style={styles.headerText}>Create a new goal</Text>
        <Text style={styles.chevron}>{open ? "▲" : "▼"}</Text>
      </Pressable>

      {open && (
        <View style={styles.content}>
          <Text style={styles.desc}>
            Goals help you turn daily savings into meaningful progress.
            This will guide you step by step.
          </Text>

          <Pressable
            style={styles.cta}
            onPress={() => router.push("/goal-wizard")}
          >
            <Text style={styles.ctaText}>Start goal wizard</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(17,24,39,0.6)",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#f9fafb",
  },
  chevron: {
    color: "#9ca3af",
    fontSize: 12,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  desc: {
    fontSize: 13,
    color: "#9ca3af",
    lineHeight: 18,
  },
  cta: {
    marginTop: 4,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#4f46e5",
    alignItems: "center",
  },
  ctaText: {
    color: "#eef2ff",
    fontSize: 14,
    fontWeight: "600",
  },
});