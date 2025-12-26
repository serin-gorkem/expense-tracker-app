import { LiquidBackground } from "@/components/ui/LiquidBackground";
import { Stack } from "expo-router";
import { ExpensesProvider } from "../src/context/ExpensesContext";

export default function RootLayout() {
  return (
    <ExpensesProvider>
      <LiquidBackground />
      <Stack screenOptions={{ headerShown: false }} />
    </ExpensesProvider>
  );
}