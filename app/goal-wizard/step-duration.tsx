import { useWizard } from "@/src/context/WizardContext";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function StepDuration() {
  const { draft, setDurationInDays, next, canGoNext } = useWizard();
  const [value, setValue] = useState(String(draft.durationInDays ?? ""));

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>How long will you save?</Text>
      <Text style={styles.p}>Set the duration in days.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Duration (days)</Text>
        <TextInput
          value={value}
          onChangeText={(t) => {
            setValue(t);
            const n = Number(t);
            if (!Number.isNaN(n)) setDurationInDays(n);
          }}
          keyboardType="number-pad"
          placeholder="e.g. 30"
          placeholderTextColor="rgba(255,255,255,0.35)"
          style={styles.input}
        />
      </View>

      <Pressable
        style={[styles.primaryBtn, !canGoNext && styles.btnDisabled]}
        onPress={next}
        disabled={!canGoNext}
      >
        <Text style={styles.primaryText}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#020617", },
  h1: { color: "rgba(255,255,255,0.92)", fontSize: 22, fontWeight: "700" },
  p: { marginTop: 6, color: "rgba(255,255,255,0.6)", fontSize: 13 },
  card: {
    marginTop: 18,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(17,24,39,0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  label: { color: "rgba(255,255,255,0.65)", fontSize: 12, fontWeight: "700" },
  input: {
    marginTop: 10,
    color: "rgba(255,255,255,0.9)",
    fontSize: 18,
    fontWeight: "700",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "rgba(2,6,23,0.85)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  primaryBtn: {
    marginTop: "auto",
    marginBottom: 32,
    backgroundColor: "#6366F1",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: "rgba(17,24,39,0.55)",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  btnDisabled: { opacity: 0.45 },
  primaryText: { color: "#0B1020", fontWeight: "800" },
  secondaryText: { color: "rgba(255,255,255,0.85)", fontWeight: "700" },
});
