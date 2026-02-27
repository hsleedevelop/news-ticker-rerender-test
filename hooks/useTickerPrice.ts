import { useCallback, useSyncExternalStore } from 'react';
import { priceStore } from '@/stores/priceStore';
import type { PriceSnapshot } from '@/stores/types';

export function useTickerPrice(ticker: string): PriceSnapshot {
  const subscribeToTicker = useCallback(
    (cb: () => void) => priceStore.subscribe(ticker, cb),
    [ticker],
  );

  const getSnapshot = useCallback(
    () => priceStore.getSnapshot(ticker),
    [ticker],
  );

  return useSyncExternalStore(subscribeToTicker, getSnapshot, getSnapshot);
}
