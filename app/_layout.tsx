import { LiquidBackground } from "@/components/ui/LiquidBackground";
import { GoalsProvider } from "@/src/context/GoalContext";
import { WizardProvider } from "@/src/context/WizardContext";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ExpensesProvider } from "../src/context/ExpensesContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <WizardProvider>
        <GoalsProvider>
          <ExpensesProvider>
            <LiquidBackground />
            <Stack screenOptions={{ headerShown: false }} />
          </ExpensesProvider>
        </GoalsProvider>
      </WizardProvider>
    </GestureHandlerRootView>
  );
}