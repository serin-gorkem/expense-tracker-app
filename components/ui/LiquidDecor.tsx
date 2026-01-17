import { StyleSheet, View } from "react-native";

type Props = {
  variant: "home" | "goals" | "insights" | "achievements" | "settings";
};

export function LiquidDecor({ variant }: Props) {
  return (
    <>
      <View style={[styles.blob, styles[`${variant}A`]]} />
      <View style={[styles.blob, styles[`${variant}B`]]} />
    </>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 999,
    opacity: 0.35,
  },

  homeA: { top: -120, left: -90, backgroundColor: "#5B7CFF" },
  homeB: { bottom: -140, right: -120, backgroundColor: "#8B5CFF" },

  goalsA: { top: -100, right: -80, backgroundColor: "#22C55E" },
  goalsB: { bottom: -120, left: -100, backgroundColor: "#16A34A" },

  insightsA: { top: -120, left: -80, backgroundColor: "#38BDF8" },
  insightsB: { bottom: -140, right: -120, backgroundColor: "#0EA5E9" },

  achievementsA: { top: -10, left: -100, backgroundColor: "#A855F7" },
  achievementsB: { bottom: 120, right: -120, backgroundColor: "#9333EA" },

  settingsA: { top: -120, left: -90, backgroundColor: "#ffffff38" },
  settingsB: { bottom: -140, right: -120, backgroundColor: "#ffffff38" },
});