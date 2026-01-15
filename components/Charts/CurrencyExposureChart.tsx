import { useTranslation } from "@/hooks/useTranslation";
import { StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import GlassCard from "../ui/GlassCard";

type Props = {
  exposure: {
    currency: string;
    percentage: number;
  }[];
};

const COLORS: Record<string, string> = {
  EUR: "#6366F1",
  USD: "#22C55E",
  TRY: "#F59E0B",
};

export default function CurrencyExposureChart({ exposure }: Props) {
  const { t } = useTranslation();

  if (!exposure.length) return null;

  const donutData = exposure.map((e) => ({
    value: e.percentage,
    color: COLORS[e.currency] ?? "#94A3B8",
    label: e.currency,
  }));

  return (
    <GlassCard>
      <Text style={styles.title}>{t("charts.currency_exposure.title")}</Text>

      <View style={styles.chart}>
        <PieChart
          donut
          radius={64}
          innerRadius={46}
          data={donutData}
          strokeWidth={0}
          centerLabelComponent={() => (
            <View style={{ alignItems: "center" }}>
              <Text style={styles.centerText}>
                {t("charts.currency_exposure.center")}
              </Text>
              <Text style={styles.centerValue}>100%</Text>
            </View>
          )}
        />
      </View>

      <View style={styles.legend}>
        {exposure.map((e) => (
          <CurrencyExposureRow
            key={e.currency}
            currency={e.currency}
            percent={e.percentage}
            color={COLORS[e.currency] ?? "#94A3B8"}
          />
        ))}
      </View>
    </GlassCard>
  );
}

function CurrencyExposureRow({
  currency,
  percent,
  color,
}: {
  currency: string;
  percent: number;
  color: string;
}) {
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{currency}</Text>

      <View style={styles.barBg}>
        <View
          style={[
            styles.barFill,
            { width: `${percent}%`, backgroundColor: color },
          ]}
        />
      </View>

      <Text style={styles.percent}>
        {t("charts.currency_exposure.percent", { value: percent })}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 13,
    fontWeight: "800",
    color: "rgba(255,255,255,0.85)",
    marginBottom: 12,
  },

  chart: {
    alignItems: "center",
    marginBottom: 12,
  },

  centerText: {
    color: "rgba(255,255,255,0.55)",
    fontWeight: "600",
    fontSize: 11,
  },

  centerValue: {
    color: "rgba(255,255,255,0.85)",
    fontWeight: "800",
    fontSize: 14,
  },

  legend: {
    gap: 8,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  label: {
    width: 40,
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255,255,255,0.7)",
  },

  barBg: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginHorizontal: 8,
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    borderRadius: 999,
  },

  percent: {
    width: 44,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "right",
    color: "rgba(255,255,255,0.7)",
  },
});