export interface NewsItem {
  id: number;
  headline: string;
  ticker: string;
}

export interface PriceSnapshot {
  price: number | null;
  prevPrice: number | null;
  lastUpdated: number | null;
}

export interface Tick {
  ticker: string;
  price: number;
}
