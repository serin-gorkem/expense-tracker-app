import { useTranslation } from "@/hooks/useTranslation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function DoneStep() {
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem("@onboarding_completed", "true");
      } catch {
        // fail silently – onboarding should not block app usage
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t("onboarding.done.title")}
      </Text>

      <Text style={styles.subtitle}>
        {t("onboarding.done.subtitle")}
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => router.replace("/(tabs)/home")}
      >
        <Text style={styles.buttonText}>
          {t("common.goHome")}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 12,
  },
  subtitle: {
    opacity: 0.65,
    fontSize: 15,
  },
  button: {
    marginTop: 40,
    backgroundColor: "#22C55E",
    padding: 16,
    borderRadius: 14,
  },
  buttonText: {
    color: "white",
    fontWeight: "800",
    textAlign: "center",
  },
});