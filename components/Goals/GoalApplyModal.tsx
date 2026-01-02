// components/goals/GoalApplyModal.tsx

import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type DecisionEvent = "APPLY_TO_GOAL" | "SKIP_FOR_TODAY";

type GoalModalProps = {
  visible: boolean;
  remainingAmount: number;
  projectedRemainingDays: number;
  goalTitle: string;
  onDecision: (event: DecisionEvent) => void;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);

export default function GoalApplyModal({
  visible,
  remainingAmount,
  projectedRemainingDays,
  goalTitle,
  onDecision,
}: GoalModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <View style={styles.container}>
          {/* Title */}
          <Text style={styles.title}>
            Bugün artan bir miktar var
          </Text>

          {/* Main Amount */}
          <Text style={styles.amount}>
            {formatCurrency(remainingAmount)}
          </Text>
          <Text style={styles.subtle}>
            Bu tutar günlük harcama limitinden arttı.
          </Text>

          {/* Goal Context */}
          <Text style={styles.context}>
            İstersen bu tutar{" "}
            <Text style={styles.goalTitle}>{goalTitle}</Text>{" "}
            hedefine eklenebilir.
          </Text>

          {/* Projection */}
          {projectedRemainingDays > 0 && (
            <Text style={styles.projection}>
              Bu şekilde devam edersen hedef yaklaşık{" "}
              {projectedRemainingDays} gün içinde tamamlanır.
            </Text>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              style={[styles.button, styles.primary]}
              onPress={() => onDecision("APPLY_TO_GOAL")}
            >
              <Text style={styles.primaryText}>
                Hedefime ekle
              </Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.secondary]}
              onPress={() => onDecision("SKIP_FOR_TODAY")}
            >
              <Text style={styles.secondaryText}>
                Bugün pas geç
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 24,
  },
  container: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 20,
  },
  title: {
    color: "#e5e7eb",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  amount: {
    color: "#f9fafb",
    fontSize: 32,
    fontWeight: "700",
  },
  subtle: {
    color: "#9ca3af",
    fontSize: 13,
    marginTop: 4,
  },
  context: {
    color: "#d1d5db",
    fontSize: 14,
    marginTop: 16,
    lineHeight: 20,
  },
  goalTitle: {
    color: "#f9fafb",
    fontWeight: "600",
  },
  projection: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 12,
  },
  actions: {
    marginTop: 24,
    gap: 12,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  primary: {
    backgroundColor: "#22c55e",
  },
  primaryText: {
    color: "#052e16",
    fontWeight: "600",
    fontSize: 15,
  },
  secondary: {
    backgroundColor: "#1f2937",
  },
  secondaryText: {
    color: "#e5e7eb",
    fontSize: 14,
  },
});