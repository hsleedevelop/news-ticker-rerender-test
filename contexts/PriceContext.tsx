import React, { createContext, useContext, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { PriceSnapshot } from '@/stores/types';
import { priceStore } from '@/stores/priceStore';
import { updateSubscriptions, disconnect } from '@/services/websocket';

export interface PriceContextValue {
  subscribe: (ticker: string, cb: () => void) => () => void;
  getSnapshot: (ticker: string) => PriceSnapshot;
  updateSubscriptions: (tickers: string[]) => void;
}

const PriceContext = createContext<PriceContextValue>(null!);

/**
 * Stable context value wrapping priceStore + websocket.
 * The value reference never changes, so consuming components
 * only re-render via useSyncExternalStore — not via context.
 */
export function PriceProvider({ children }: Readonly<{ children: ReactNode }>) {
  const value = useMemo<PriceContextValue>(
    () => ({
      subscribe: priceStore.subscribe,
      getSnapshot: priceStore.getSnapshot,
      updateSubscriptions,
    }),
    [],
  );

  useEffect(() => {
    return () => disconnect();
  }, []);

  return (
    <PriceContext.Provider value={value}>
      {children}
    </PriceContext.Provider>
  );
}

export function usePriceContext(): PriceContextValue {
  return useContext(PriceContext);
}
