import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTickerPrice } from '@/hooks/useTickerPrice';

interface Props {
  readonly ticker: string;
}

function resolveDirection(
  price: number | null,
  prevPrice: number | null,
): 'up' | 'down' | 'neutral' {
  if (price === null || prevPrice === null) return 'neutral';
  if (price > prevPrice) return 'up';
  if (price < prevPrice) return 'down';
  return 'neutral';
}

const BG_COLORS = { up: '#e6f9ed', down: '#fde8e8', neutral: '#f0f1f3' } as const;
const TEXT_COLORS = { up: '#16a34a', down: '#dc2626', neutral: '#6b7280' } as const;
const ARROWS = { up: '▲ ', down: '▼ ', neutral: '' } as const;

function PriceBadgeInner({ ticker }: Props) {
  const { price, prevPrice } = useTickerPrice(ticker);
  const opacity = useSharedValue(1);
  const isFirstRender = useRef(true);

  const direction = resolveDirection(price, prevPrice);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (price !== null && prevPrice !== null && price !== prevPrice) {
      opacity.value = withSequence(
        withTiming(0.3, { duration: 80 }),
        withTiming(1, { duration: 250 }),
      );
    }
  }, [price, prevPrice, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (price === null) {
    return (
      <View style={[styles.badge, { backgroundColor: '#f0f1f3' }]}>
        <Text style={[styles.text, { color: '#9ca3af' }]}>—</Text>
      </View>
    );
  }

  return (
    <Animated.View
      style={[styles.badge, { backgroundColor: BG_COLORS[direction] }, animatedStyle]}
    >
      <Text style={[styles.text, { color: TEXT_COLORS[direction] }]}>
        {ARROWS[direction]}${price.toFixed(2)}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-end',
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
});

export const PriceBadge = React.memo(PriceBadgeInner);
