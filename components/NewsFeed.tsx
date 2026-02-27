import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { ViewToken } from 'react-native';
import { NewsCard } from './NewsCard';
import { useVisibleTickers } from '@/hooks/useVisibleTickers';
import { fetchNews } from '@/services/api';
import type { NewsItem } from '@/stores/types';

const ITEM_HEIGHT = 130;

function renderNewsItem({ item }: { item: NewsItem }) {
  return <NewsCard headline={item.headline} ticker={item.ticker} />;
}

export function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { onViewableItemsChanged } = useVisibleTickers();

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 30 }).current;

  useEffect(() => {
    let cancelled = false;
    fetchNews().then((items) => {
      if (!cancelled) {
        setNews(items);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const keyExtractor = useCallback((item: NewsItem) => String(item.id), []);

  const getItemLayout = useMemo(
    () => (_: unknown, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.loadingText}>Loading news...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={news}
      renderItem={renderNewsItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      onViewableItemsChanged={onViewableItemsChanged as (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => void}
      viewabilityConfig={viewabilityConfig}
      contentContainerStyle={styles.list}
      initialNumToRender={10}
      maxToRenderPerBatch={8}
      windowSize={7}
      removeClippedSubviews
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
});
