import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function Index() {
  const [ready, setReady] = useState(false);
  const [completed, setCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("@onboarding_completed").then((v) => {
      setCompleted(v === "true");
      setReady(true);
    });
  }, []);

  if (!ready) return <View />; // splash / blank

  return completed ? (
    <Redirect href="/home" />
  ) : (
    <Redirect href="/onboarding" />
  );
}