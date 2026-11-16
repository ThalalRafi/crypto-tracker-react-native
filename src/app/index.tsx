import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Button, StyleSheet, Text, View } from "react-native";

type Prices = Record<string, { usd: number; usd_24h_change: number }>;

const COINS = [
  { id: "bitcoin", name: "Bitcoin" },
  { id: "ethereum", name: "Ethereum" },
];

const URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true";

export default function HomeScreen() {
  const [prices, setPrices] = useState<Prices | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPrices = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(URL);
      if (!response.ok) {
        throw new Error("Server error " + response.status);
      }
      const data = await response.json();
      setPrices(data);
    } catch (e) {
      setError("Could not load prices. Check your internet and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPrices();
  }, [loadPrices]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crypto Tracker</Text>

      {loading && <ActivityIndicator size="large" color="#ffffff" />}

      {error !== "" && <Text style={styles.error}>{error}</Text>}

      {!loading &&
        prices &&
        COINS.map((coin) => {
          const price = prices[coin.id]?.usd;
          const change = prices[coin.id]?.usd_24h_change;
          const isUp = change >= 0;
          return (
            <View key={coin.id} style={styles.card}>
              <Text style={styles.coinName}>{coin.name}</Text>
              <Text style={styles.price}>${price?.toLocaleString("en-US")}</Text>
              <Text style={{ color: isUp ? "#4ade80" : "#f87171" }}>
                {isUp ? "▲" : "▼"} {change?.toFixed(2)}% (24h)
              </Text>
            </View>
          );
        })}

      <View style={styles.button}>
        <Button title="Refresh" onPress={loadPrices} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  coinName: { color: "#9ca3af", fontSize: 16 },
  price: { color: "#ffffff", fontSize: 26, fontWeight: "bold", marginVertical: 4 },
  error: { color: "#f87171", marginBottom: 12 },
  button: { marginTop: 12 },
});