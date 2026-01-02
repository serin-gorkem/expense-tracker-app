import { useWizard } from "@/src/context/WizardContext";
import { Stack, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

export default function GoalWizardLayout() {
  const router = useRouter();
  const { step, back, reset } = useWizard();

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: true,

          // 🔥 HEADER STYLING
          headerTitle: "Goal",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#020617", // wizard background
          },
          headerShadowVisible: false,

          headerTitleStyle: {
            color: "rgba(255,255,255,0.92)",
            fontWeight: "800",
            fontSize: 16,
          },

          // 🔙 BACK BUTTON
          headerLeft: () => (
            <Pressable
              onPress={() => {
                if (step === "type") {
                  reset();
                  router.replace("/(tabs)/goals");
                } else {
                  back();
                }
              }}
              style={styles.backBtn}
            >
              <Text style={styles.backText}>Back</Text>
            </Pressable>
          ),
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  backText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
  },
});
