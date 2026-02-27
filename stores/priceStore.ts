import type { PriceSnapshot } from './types';

const EMPTY_SNAPSHOT: PriceSnapshot = { price: null, prevPrice: null, lastUpdated: null };

type Listener = () => void;

const data = new Map<string, PriceSnapshot>();
const tickerListeners = new Map<string, Set<Listener>>();

/**
 * Ticker-scoped external store for useSyncExternalStore.
 * Only listeners subscribed to the updated ticker are notified,
 * so unrelated cards never re-render.
 */

function setPrice(ticker: string, price: number): void {
  const prev = data.get(ticker);
  const snapshot: PriceSnapshot = {
    price,
    prevPrice: prev?.price ?? null,
    lastUpdated: Date.now(),
  };
  data.set(ticker, snapshot);

  const listeners = tickerListeners.get(ticker);
  if (listeners) {
    listeners.forEach((fn) => fn());
  }
}

function getSnapshot(ticker: string): PriceSnapshot {
  return data.get(ticker) ?? EMPTY_SNAPSHOT;
}

function subscribe(ticker: string, callback: Listener): () => void {
  let set = tickerListeners.get(ticker);
  if (!set) {
    set = new Set();
    tickerListeners.set(ticker, set);
  }
  set.add(callback);

  return () => {
    set.delete(callback);
    if (set.size === 0) {
      tickerListeners.delete(ticker);
    }
  };
}

export const priceStore = { setPrice, getSnapshot, subscribe };
