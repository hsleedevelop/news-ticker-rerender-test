import { StyleSheet, View } from 'react-native';
import { NewsFeed } from '@/components/NewsFeed';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <NewsFeed />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
});
