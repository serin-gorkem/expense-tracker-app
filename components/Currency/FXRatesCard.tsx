import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "../../hooks/useTranslation";
import { CurrencyCode } from "../../models/currency.model";
import { useFX } from "../../src/context/FXContext";

type Props = {
  baseCurrency: CurrencyCode;
};


export default function FXRatesCard({ baseCurrency }: Props) {
  const { t } = useTranslation();
  const { rates, status } = useFX();
  if (!rates || !baseCurrency) return null;
  const updatedAt = rates?.fetchedAt
    ? new Date(rates.fetchedAt).toLocaleString()
    : null;
  if (!rates) return null;

  const currencies = Object.keys(rates.rates) as CurrencyCode[];

  return (
    <BlurView intensity={22} tint="dark" style={styles.card}>
      <LinearGradient
        colors={["rgba(255,255,255,0.10)", "rgba(255,255,255,0.03)"]}
        style={StyleSheet.absoluteFillObject}
      />

      <Text style={styles.title}>
        {t("insights.fx.title", { base: baseCurrency })}
      </Text>

      <View style={styles.list}>
        {currencies.map((currency) => {
          const isBase = currency === baseCurrency;

          return (
            <View key={currency} style={styles.row}>
              <Text style={styles.currency}>{currency}</Text>

              <Text style={styles.rate}>
                {isBase
                  ? `1 ${baseCurrency}`
                  : `${rates.rates[currency].toFixed(4)} ${currency}`}
              </Text>
            </View>
          );
        })}
      </View>

      <Text style={styles.meta}>
        {status === "live" ? t("insights.fx.live") : t("insights.fx.cached")}
        {updatedAt ? ` • ${updatedAt}` : ""}
      </Text>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    overflow: "hidden",
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    color: "rgba(255,255,255,0.9)",
    marginBottom: 10,
  },
  list: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  currency: {
    fontSize: 13,
    fontWeight: "800",
    color: "rgba(255,255,255,0.85)",
  },
  rate: {
    fontSize: 13,
    fontWeight: "900",
    color: "rgba(255,255,255,0.95)",
  },
  meta: {
    marginTop: 10,
    fontSize: 11,
    color: "rgba(255,255,255,0.45)",
    fontWeight: "600",
  },
});