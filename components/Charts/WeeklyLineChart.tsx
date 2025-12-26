import { LineChartPoint } from "@/utils/expense/expenseChart";
import React from "react";
import { View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import GlassCard from "../ui/GlassCard";

type Props = {
  data: LineChartPoint[];
};

export default function WeeklyLineChart({ data }: Props) {
  if (!data.length) return null;

  const max = Math.max(...data.map((d) => d.value), 0);
  const hasData = max > 0;

  return (
    <GlassCard style={{ marginBottom: 12, paddingLeft: 8, paddingRight: 12 }}>
      <View style={{ paddingVertical: 12 }}>
        <LineChart
          data={data}

          /* Layout */
          height={140}
          spacing={30}
          initialSpacing={12}
          thickness={2}

          /* Clean look */
          hideRules
          hideDataPoints={!hasData}
          curved
          isAnimated
          animationDuration={600}

          /* Y Axis */
          hideYAxisText={!hasData}
          yAxisColor="transparent"
          yAxisLabelPrefix="₺"
          yAxisTextStyle={{
            color: "rgba(255,255,255,0.45)",
            fontSize: 11,
            fontWeight: "600",
          }}

          maxValue={hasData ? max * 1.25 : 100}
          noOfSections={4}

          /* Line + Area */
          color="rgba(255,255,255,0.9)"
          startFillColor="rgba(255,255,255,0.14)"
          endFillColor="rgba(255,255,255,0)"
          startOpacity={0.8}
          endOpacity={0.05}
          areaChart

          /* X Axis */
          xAxisColor="transparent"
          xAxisLabelTextStyle={{
            color: "rgba(255,255,255,0.55)",
            fontSize: 11,
            fontWeight: "600",
          }}
        />
      </View>
    </GlassCard>
  );
}