import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "../../hooks/useTranslation";
import { CurrencyCode } from "../../models/currency.model";
import { useFX } from "../../src/context/FXContext";

export default function FXRatesCard() {
  const { t } = useTranslation();
  const { rates, status } = useFX();

  if (!rates) return null;

  const base = rates.base;
  const updatedAt = rates.fetchedAt
    ? new Date(rates.fetchedAt).toLocaleString()
    : null;

  const currencies = (Object.keys(rates.rates) as CurrencyCode[])
    .filter((c) => c !== base)
    .sort();

  return (
    <BlurView intensity={22} tint="dark" style={styles.card}>
      <LinearGradient
        colors={["rgba(255,255,255,0.10)", "rgba(255,255,255,0.03)"]}
        style={StyleSheet.absoluteFillObject}
      />

      <Text style={styles.title}>{t("insights.fx.title", { base })}</Text>

      <View style={styles.list}>
        {currencies.map((currency) => {
          const rate = rates.rates[currency];

          if (!rate || rate <= 0) return null;

          const displayRate = 1 / rate; // 👈 SADECE UI İÇİN

          return (
            <View key={currency} style={styles.row}>
              <Text style={styles.currency}>{currency}</Text>

              <Text style={styles.rate}>
                1 {base} = {displayRate.toFixed(2)} {currency}
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
