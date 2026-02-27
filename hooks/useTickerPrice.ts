import { useCallback, useSyncExternalStore } from 'react';
import { usePriceContext } from '@/contexts/PriceContext';
import type { PriceSnapshot } from '@/stores/types';

export function useTickerPrice(ticker: string): PriceSnapshot {
  const { subscribe, getSnapshot } = usePriceContext();

  const subscribeToTicker = useCallback(
    (cb: () => void) => subscribe(ticker, cb),
    [subscribe, ticker],
  );

  const snap = useCallback(
    () => getSnapshot(ticker),
    [getSnapshot, ticker],
  );

  return useSyncExternalStore(subscribeToTicker, snap, snap);
}
