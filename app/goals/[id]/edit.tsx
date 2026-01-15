import CategoryFilter from "@/components/CategoryFilter/CategoryFilter";
import { useTranslation } from "@/hooks/useTranslation";
import { Category } from "@/models/expense.model";
import { Goal } from "@/models/goal.model";
import { useGoalsStore } from "@/src/context/GoalContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function EditGoalScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [category, setCategory] = useState<Category | undefined>(undefined);

  const { goals, updateGoal, deleteGoal } = useGoalsStore();

  const [localGoal, setLocalGoal] = useState<Goal | null>(null);
  const goal = goals.find((g) => g.id === id);

  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [duration, setDuration] = useState("");

  /* =========================
     Init form from goal
  ========================= */
  useEffect(() => {
    if (!goal) return;

    setLocalGoal(goal);
    setTitle(goal.title);
    setTarget(String(goal.targetAmount));
    setDuration(String(goal.durationInDays));
    setCategory(goal.category);
  }, [goal]);

  if (!localGoal) {
    return (
      <View style={styles.container}>
        <Text style={styles.h1}>{t("common.loading")}</Text>
      </View>
    );
  }

  /* =========================
     Actions
  ========================= */

  

  const handleSave = () => {
    const targetAmount = Number(target);
    const durationInDays = Number(duration);

    if (Number.isNaN(targetAmount) || Number.isNaN(durationInDays)) {
      Alert.alert(
        t("errors.invalidInput.title"),
        t("errors.invalidInput.message")
      );
      return;
    }

    if (!title || targetAmount <= 0 || durationInDays <= 0) {
      Alert.alert(
        t("errors.invalidInput.title"),
        t("errors.invalidInput.message")
      );
      return;
    }

    updateGoal(localGoal.id, {
      title,
      targetAmount,
      durationInDays,
      category,
    });

    router.back();
  };

  const confirmDelete = () => {
    Alert.alert(t("goals.delete.title"), t("goals.delete.message"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: () => {
          deleteGoal(localGoal.id);
          router.replace("/(tabs)/goals");
        },
      },
    ]);
  };

  /* =========================
     Render
  ========================= */

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>{t("goals.edit.title")}</Text>
      <Text style={styles.p}>{t("goals.edit.subtitle")}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>{t("goals.edit.fields.title")}</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder={t("goals.edit.placeholders.title")}
          placeholderTextColor="rgba(255,255,255,0.35)"
          style={styles.input}
        />

        <Text style={styles.label}>{t("goals.edit.fields.target")}</Text>
        <TextInput
          value={target}
          onChangeText={setTarget}
          keyboardType="number-pad"
          placeholder={t("goals.edit.placeholders.target")}
          placeholderTextColor="rgba(255,255,255,0.35)"
          style={styles.input}
        />

        <Text style={styles.label}>{t("goals.edit.fields.duration")}</Text>
        <TextInput
          value={duration}
          onChangeText={setDuration}
          keyboardType="number-pad"
          placeholder={t("goals.edit.placeholders.duration")}
          placeholderTextColor="rgba(255,255,255,0.35)"
          style={styles.input}
        />
        <Text style={styles.label}>{t("goalWizard.target.currencyLabel")}</Text>

        <View style={styles.readonlyBox}>
          <Text style={styles.readonlyText}>{localGoal.currency}</Text>
          <Text style={styles.subtle}>
            {t("goals.edit.currencyLockedHint")}
          </Text>
        </View>
        <Text style={styles.label}>{t("goals.edit.fields.category")}</Text>

        <CategoryFilter
          category={category ?? "all"}
          setCategory={(c) => {
            if (c === "all") {
              setCategory(undefined);
            } else {
              setCategory(c);
            }
          }}
        />
      </View>

      <View style={styles.row}>
        <Pressable style={styles.secondaryBtn} onPress={() => router.back()}>
          <Text style={styles.secondaryText}>{t("common.cancel")}</Text>
        </Pressable>

        <Pressable style={styles.primaryBtn} onPress={handleSave}>
          <Text style={styles.primaryText}>{t("common.save")}</Text>
        </Pressable>
      </View>

      <Pressable style={styles.deleteBtn} onPress={confirmDelete}>
        <Text style={styles.deleteText}>{t("common.delete")}</Text>
      </Pressable>
    </View>
  );
}

/* =========================
   Styles
========================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    backgroundColor: "#020617",
  },

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
    marginTop: 20,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(17,24,39,0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    gap: 12,
  },

  label: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    fontWeight: "700",
  },

  input: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    fontWeight: "700",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "rgba(2,6,23,0.85)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  row: {
    marginTop: 20,
    flexDirection: "row",
    gap: 12,
  },

  primaryBtn: {
    flex: 1,
    backgroundColor: "#6366F1",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },

  secondaryBtn: {
    flex: 1,
    backgroundColor: "rgba(17,24,39,0.55)",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  primaryText: {
    color: "#0B1020",
    fontWeight: "900",
  },

  secondaryText: {
    color: "rgba(255,255,255,0.85)",
    fontWeight: "700",
  },

  deleteBtn: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "rgba(239,68,68,0.15)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.4)",
  },

  deleteText: {
    color: "rgba(239,68,68,0.95)",
    fontWeight: "800",
  },

  readonlyBox: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  readonlyText: {
    color: "rgba(255,255,255,0.7)",
    fontWeight: "800",
    fontSize: 14,
  },
  subtle: {
    marginTop: 4,
    color: "rgba(255,255,255,0.45)",
    fontSize: 11,
  },
});