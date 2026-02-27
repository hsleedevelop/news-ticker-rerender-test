import { useCallback, useRef } from 'react';
import type { ViewToken } from 'react-native';
import type { NewsItem } from '@/stores/types';
import { updateSubscriptions } from '@/services/websocket';

const DEBOUNCE_MS = 150;

/**
 * Returns a stable onViewableItemsChanged handler that
 * debounces visible-ticker extraction and pushes it
 * to the WebSocket subscription manager.
 */
export function useVisibleTickers() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<NewsItem>[] }) => {
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        const tickers = [
          ...new Set(
            viewableItems
              .map((v) => (v.item as NewsItem | undefined)?.ticker)
              .filter((t): t is string => !!t),
          ),
        ];
        updateSubscriptions(tickers);
      }, DEBOUNCE_MS);
    },
    [],
  );

  return { onViewableItemsChanged };
}
