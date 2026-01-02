import CurrencyInput from "@/components/ui/CurrencyInput";
import { useWizard } from "@/src/context/WizardContext";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function StepTarget() {
  const { draft, setTargetAmount, setTitle, next, canGoNext } = useWizard();

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>What is the target?</Text>
      <Text style={styles.p}>Set the amount you want to reach.</Text>

      {/* TARGET AMOUNT */}
      <View style={styles.card}>
        <Text style={styles.label}>Target amount</Text>

        <CurrencyInput
          value={draft.targetAmount ?? 0}
          onChange={(value) => setTargetAmount(value)}
          placeholder="e.g. 5.000"
          style={styles.currencyInput}
        />
      </View>

      {/* GOAL TITLE */}
      <View style={styles.card}>
        <Text style={styles.label}>Goal title</Text>

        <TextInput
          value={draft.customTitle ?? ""}
          onChangeText={setTitle}
          placeholder="e.g. New Laptop"
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

/* =========================
   Styles
========================= */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#020617" },

  h1: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 22,
    fontWeight: "800",
  },

  p: {
    marginTop: 6,
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
  },

  card: {
    marginTop: 18,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(17,24,39,0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  label: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },

  currencyInput: {
    borderBottomWidth: 1,
    borderColor: "#6366F1",
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    fontWeight: "800",
    paddingVertical: 6,
  },

  input: {
    marginTop: 6,
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
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

  btnDisabled: {
    opacity: 0.45,
  },

  primaryText: {
    color: "#0B1020",
    fontWeight: "800",
  },
});