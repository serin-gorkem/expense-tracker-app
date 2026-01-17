import { FinanceProfileProvider } from "@/src/context/FinanceProfileContext";
import { FXProvider } from "@/src/context/FXContext";
import { GoalsProvider } from "@/src/context/GoalContext";
import { LanguageProvider } from "@/src/context/LanguageContext";
import { WizardProvider } from "@/src/context/WizardContext";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ExpensesProvider } from "../src/context/ExpensesContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
        <FinanceProfileProvider>
          <FXProvider>
            <WizardProvider>
              <GoalsProvider>
                <ExpensesProvider>
                  <Stack screenOptions={{ headerShown: false }} />
                </ExpensesProvider>
              </GoalsProvider>
            </WizardProvider>
          </FXProvider>
        </FinanceProfileProvider>
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}