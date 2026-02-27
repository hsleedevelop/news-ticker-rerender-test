import { NewsFeed } from "@/components/NewsFeed";
import { PriceProvider } from "@/contexts/PriceContext";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <PriceProvider>
        <NewsFeed />
      </PriceProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f7",
  },
});
