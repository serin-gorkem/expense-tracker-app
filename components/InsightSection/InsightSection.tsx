import { Expense } from "@/models/expense.model";
import { selectInsights } from "@/utils/insightSelectors";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import InsightCard from "./InsightCard";

type Props = {
  expenses: Expense[];
  mode: "daily" | "weekly" | "monthly";
};

export default function InsightSection({ expenses, mode }: Props) {
  const insights = selectInsights(expenses).filter((insight) => {
    if (mode === "weekly" && insight.type === "monthly_change") {
      return false;
    }
    return true;
  });

  // 🔑 HOOKS HER ZAMAN ÇALIŞIR
  const animatedValues = useRef<
    { opacity: Animated.Value; translateY: Animated.Value }[]
  >([]).current;

  // Animated values sync (insight count değişirse)
  if (animatedValues.length !== insights.length) {
    animatedValues.length = 0;
    insights.forEach(() => {
      animatedValues.push({
        opacity: new Animated.Value(0),
        translateY: new Animated.Value(6),
      });
    });
  }

  useEffect(() => {
    if (insights.length === 0) return;

    const animations = animatedValues.map((anim) =>
      Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(anim.translateY, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.stagger(80, animations).start();
  }, [insights.length]);

  // 🔑 EARLY RETURN HOOK'LARDAN SONRA
  if (insights.length === 0) return null;

  return (
    <View style={styles.container}>
      {insights.map((insight, index) => {
        const anim = animatedValues[index];

        return (
          <Animated.View
            key={insight.type}
            style={{
              opacity: anim.opacity,
              transform: [{ translateY: anim.translateY }],
            }}
          >
            <InsightCard insight={insight} />
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
});