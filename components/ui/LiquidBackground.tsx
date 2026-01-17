import { LinearGradient } from "expo-linear-gradient";
import { ColorValue, StyleSheet } from "react-native";

/* =========================
   Types
========================= */

export type LiquidTheme =
  | "home"
  | "goals"
  | "insights"
  | "achievements"
  | "settings";

type GradientColors = readonly [
  ColorValue,
  ColorValue,
  ...ColorValue[]
];

type LiquidThemeConfig = {
  base: GradientColors;
  overlay: GradientColors;
};

/* =========================
   Theme Definitions
========================= */

const THEMES: Record<LiquidTheme, LiquidThemeConfig> = {
  home: {
    base: ["#050816", "#070A2A", "#0B1238"],
    overlay: ["rgba(91,124,255,0.35)", "transparent"],
  },

  goals: {
    base: ["#081A12", "#0F3D2E", "#052018"],
    overlay: ["rgba(34,197,94,0.35)", "transparent"],
  },

  insights: {
    base: ["#0B1026", "#1B2A5E", "#0F1A3D"],
    overlay: ["rgba(56,189,248,0.35)", "transparent"],
  },

  achievements: {
    base: ["#1C0A2E", "#3B145F", "#1A0730"],
    overlay: ["rgba(168,85,247,0.35)", "transparent"],
  },

  settings: {
    base: ["#020617", "#0F172A", "#020617"],
    overlay: ["rgba(255,255,255,0.08)", "transparent"],
  },
};

/* =========================
   Component
========================= */

type Props = {
  theme?: LiquidTheme;
};

export function LiquidBackground({ theme = "home" }: Props) {
  const config = THEMES[theme];

  return (
    <>
      {/* BASE GRADIENT */}
      <LinearGradient
        colors={config.base}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* SOFT OVERLAY */}
      <LinearGradient
        colors={config.overlay}
        start={{ x: 0.2, y: 0.2 }}
        end={{ x: 0.8, y: 0.8 }}
        style={StyleSheet.absoluteFill}
      />
    </>
  );
}