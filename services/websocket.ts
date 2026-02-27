import { priceStore } from '@/stores/priceStore';

const BASE_PRICES: Record<string, number> = {
  TSLA: 210.5,
  AAPL: 185.25,
  MSFT: 420.8,
  AMZN: 178.6,
  GOOGL: 155.3,
  META: 510.4,
  NVDA: 880.75,
  NFLX: 620.1,
  AMD: 165.9,
  DIS: 112.4,
  CRM: 285.6,
  INTC: 42.3,
  UBER: 72.5,
};

let subscribedTickers = new Set<string>();
let intervalId: ReturnType<typeof setInterval> | null = null;

function simulateTick(): void {
  subscribedTickers.forEach((ticker) => {
    const base = BASE_PRICES[ticker] ?? 100;
    const delta = (Math.random() - 0.5) * base * 0.004;
    const current = priceStore.getSnapshot(ticker).price ?? base;
    const next = Math.round((current + delta) * 100) / 100;
    priceStore.setPrice(ticker, next);
  });
}

function startSimulation(): void {
  if (intervalId) return;
  intervalId = setInterval(simulateTick, 200);
}

function stopSimulation(): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

export function updateSubscriptions(tickers: string[]): void {
  const next = new Set(tickers);

  if (setsEqual(subscribedTickers, next)) return;

  subscribedTickers = next;

  if (subscribedTickers.size > 0) {
    startSimulation();
  } else {
    stopSimulation();
  }
}

export function disconnect(): void {
  subscribedTickers.clear();
  stopSimulation();
}

function setsEqual(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false;
  for (const v of a) {
    if (!b.has(v)) return false;
  }
  return true;
}
