import { useTranslation } from "@/hooks/useTranslation";
import { haptic } from "@/utils/haptics";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ExpenseListHintProps = {
  onDismiss: () => void;
};

export default function ExpenseListHint({ onDismiss }: ExpenseListHintProps) {
  const { t } = useTranslation();

  const handleDismiss = () => {
    haptic.light();
    onDismiss();
  };

  return (
    <View style={styles.wrapper}>
      <BlurView intensity={18} tint="dark" style={styles.card}>
        <LinearGradient
          colors={["rgba(255,255,255,0.10)", "rgba(255,255,255,0.03)"]}
          style={StyleSheet.absoluteFillObject}
        />

        <View style={styles.content}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{t("expense.hint.title")}</Text>

            <Text style={styles.description}>
              {t("expense.hint.edit")}
              {"\n"}
              {t("expense.hint.delete")}
            </Text>
          </View>

          <Pressable
            onPress={handleDismiss}
            hitSlop={10}
            android_ripple={{ color: "rgba(255,255,255,0.08)" }}
          >
            <Text style={styles.action}>{t("common.gotIt")}</Text>
          </Pressable>
        </View>
      </BlurView>
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    marginTop: 12,
    marginBottom: 6,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    overflow: "hidden",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  title: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 4,
  },
  description: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 16,
  },
  action: {
    color: "#93C5FD",
    fontSize: 12,
    fontWeight: "800",
  },
});