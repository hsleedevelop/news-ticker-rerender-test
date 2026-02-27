import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { PriceBadge } from "./PriceBadge";

interface Props {
  readonly headline: string;
  readonly ticker: string;
}

function NewsCardInner({ headline, ticker }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.tickerRow}>
        <View style={styles.tickerBadge}>
          <Text style={styles.tickerText}>{ticker}</Text>
        </View>
      </View>

      <Text style={styles.headline} numberOfLines={2}>
        {headline}
      </Text>

      <View style={styles.priceRow}>
        <PriceBadge ticker={ticker} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  tickerRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  tickerBadge: {
    backgroundColor: "#eef2ff",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  tickerText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4f46e5",
    letterSpacing: 0.5,
  },
  headline: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    lineHeight: 22,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});

export const NewsCard = React.memo(NewsCardInner);
