import { useTranslation } from "@/hooks/useTranslation";
import { CurrencyCode } from "@/models/currency.model";
import { useExpensesStore } from "@/src/context/ExpensesContext";
import { CURRENCY_META } from "@/utils/currency/currencyMeta";
import { LineChartPoint } from "@/utils/expense/expenseChart";
import { haptic } from "@/utils/haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import GlassCard from "../ui/GlassCard";

type Props = {
  data: LineChartPoint[];
  baseCurrency: CurrencyCode;
};

export default function WeeklyLineChart({ data, baseCurrency }: Props) {
  const { t } = useTranslation();
  const tooltipAnim = useRef(new Animated.Value(0)).current;
  const { dailyBaseline } = useExpensesStore();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  useEffect(() => {
    Animated.timing(tooltipAnim, {
      toValue: activeIndex !== null ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [activeIndex]);
  if (!data.length || !baseCurrency) return null;

  function formatAmount(value: number) {
    return `${value.toLocaleString("en-US")} ${baseCurrency}`;
  }

  const rawMax = Math.max(...data.map((d) => d.value), dailyBaseline ?? 0);

  const roundedMax = Math.max(50, Math.ceil(rawMax / 50) * 50);
  const hasData = roundedMax > 0;

  const CHART_WIDTH = Dimensions.get("window").width - 8;
  // 16 + 16 padding + kart boşlukları

  const baselineValue = dailyBaseline;

  const TOP_PADDING = 16;
  const BOTTOM_PADDING = 40;
  const CHART_HEIGHT = 220;
  const Y_AXIS_WIDTH = 40; // yAxisLabelTexts alanı

  const DRAW_HEIGHT = CHART_HEIGHT - TOP_PADDING - BOTTOM_PADDING;

  const spacing = (CHART_WIDTH - 75) / data.length;

  const activeX =
    activeIndex !== null ? 43 + activeIndex * spacing + spacing / 2 : 0;

  const baselineY =
    baselineValue != null && roundedMax > 0
      ? TOP_PADDING + DRAW_HEIGHT - (baselineValue / roundedMax) * DRAW_HEIGHT
      : null;

  const formatAxis = (v: number) =>
    `${CURRENCY_META[baseCurrency].symbol}${v.toLocaleString("en-US")}`;
  return (
    <GlassCard style={{ marginBottom: 12, paddingHorizontal: 16 }}>
      <View style={styles.chartWrapper}>
        {baselineY != null && (
          <>
            {/* BASELINE LINE */}
            <View
              pointerEvents="none"
              style={[styles.baselineLine, { top: baselineY }]}
            />
          </>
        )}
        <LineChart
          data={data.map((d, index) => ({
            value: d.value,
            label: "",
            onPress: () => {
              haptic.light();
              setActiveIndex((prev) => (prev === index ? null : index));
            },
          }))}
          /* Size */
          width={CHART_WIDTH}
          height={CHART_HEIGHT}
          adjustToWidth
          dataPointsRadius={4}
          dataPointsWidth={12}
          dataPointsHeight={12}
          focusEnabled
          focusedDataPointRadius={12}
          focusedDataPointColor="rgba(255,255,255,0.15)"
          dataPointsColor="rgba(255,255,255,0.95)"
          xAxisLabelsVerticalShift={18}
          yAxisLabelTexts={[
            formatAxis(0),
            "-",
            formatAxis(roundedMax * 0.25),
            formatAxis(roundedMax * 0.5),
            formatAxis(roundedMax * 0.75),
            formatAxis(roundedMax),
            "", // ⬅️ üst sınırı bilinçli gizle
          ]}
          /* Spacing */
          initialSpacing={10}
          spacing={(CHART_WIDTH - 75) / data.length}
          /* Line */
          thickness={2}
          curved
          isAnimated
          animationDuration={600}
          /* Grid (KARELİ ARKA PLAN) */
          rulesType="solid"
          rulesLength={CHART_WIDTH - 100}
          rulesColor="rgba(255,255,255,0.12)"
          verticalLinesColor="rgba(255,255,255,0.08)"
          verticalLinesThickness={1}
          showVerticalLines
          /* Y Axis */
          hideYAxisText={!hasData}
          yAxisColor="transparent"
          showYAxisIndices={false}
          yAxisOffset={1}
          yAxisTextStyle={{
            color: "rgba(255,255,255,0.45)",
            fontSize: 11,
            fontWeight: "600",
            width: Y_AXIS_WIDTH,
          }}
          maxValue={roundedMax}
          noOfSections={4}
          /* Area */
          areaChart
          color="rgba(255,255,255,0.95)"
          startFillColor="rgba(255,255,255,0.18)"
          endFillColor="rgba(255,255,255,0)"
          startOpacity={0.9}
          endOpacity={0.05}
          /* X Axis */
          xAxisColor="transparent"
          xAxisLabelTextStyle={{
            color: "rgba(255,255,255,0.55)",
            fontSize: 11,
            fontWeight: "700",
          }}
        />

        <View style={styles.xAxisRow}>
          {data.map((d, index) => (
            <Pressable
              key={d.dayKey}
              style={styles.dayItem}
              onPress={() => {
                haptic.light();
                setActiveIndex((prev) => (prev === index ? null : index));
              }}
            >
              <Text
                style={[
                  styles.dayLabel,
                  activeIndex === index && styles.dayLabelActive,
                ]}
              >
                {t(`weekdays.${d.dayKey}`)}
              </Text>
            </Pressable>
          ))}
        </View>

        {activeIndex !== null && (
          <Animated.View
            style={[
              styles.tooltip,
              {
                left: activeX - 50, // tooltip yarı genişliği
                transform: [
                  {
                    scale: tooltipAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  },
                ],
                opacity: tooltipAnim,
              },
            ]}
          >
            <Text style={styles.tooltipLabel}>
              {t(`weekdays.${data[activeIndex].dayKey}`)}
            </Text>
            <Text style={styles.tooltipValue}>
              {formatAmount(data[activeIndex].value)}
            </Text>
          </Animated.View>
        )}
      </View>
      <View style={styles.footer}>
        <Text style={styles.hint}>{t("charts.weekly.hint")}</Text>
        {baselineY != null && (
          <View pointerEvents="none" style={[styles.baselineBadge]}>
            <Text style={styles.baselineText}>
              {t("charts.weekly.baseline", {
                amount: formatAmount(baselineValue ?? 0),
              })}
            </Text>
          </View>
        )}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  tooltip: {
    position: "absolute",
    top: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    zIndex: 20,
  },
  tooltipLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontWeight: "700",
  },
  tooltipValue: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "900",
  },
  hint: {
    marginVertical: 12,
    textAlign: "left",
    color: "rgba(255,255,255,0.45)",
    fontSize: 11,
    fontWeight: "600",
  },
  chartWrapper: {
    position: "relative",
    height: 300,
    width: "100%",
  },

  xAxisRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -28, // chart'a yaklaştır
    paddingLeft: 24,
  },

  dayItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  baselineLine: {
    position: "absolute",
    left: 46,
    right: 16,
    borderTopWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(34,197,94,0.85)",
    zIndex: 4,
  },

  baselineBadge: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: "rgba(34,197,94,0.15)",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.45)",
    zIndex: 5,
  },

  baselineText: {
    fontSize: 11,
    fontWeight: "800",
    color: "rgba(34,197,94,0.95)",
  },
  dayLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.45)",
    fontWeight: "600",
  },

  dayLabelActive: {
    color: "#fff",
    fontWeight: "800",
  },
  footer: {
    marginVertical: 16,
  },
});
