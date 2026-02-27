import type { NewsItem } from '@/stores/types';

const MOCK_NEWS: NewsItem[] = [
  { id: 1, headline: 'Tesla Earnings Beat Expectations', ticker: 'TSLA' },
  { id: 2, headline: 'Apple Unveils New Chip', ticker: 'AAPL' },
  { id: 3, headline: 'Microsoft Cloud Revenue Surges', ticker: 'MSFT' },
  { id: 4, headline: 'Amazon Expands Same-Day Delivery', ticker: 'AMZN' },
  { id: 5, headline: 'Google DeepMind Breakthrough', ticker: 'GOOGL' },
  { id: 6, headline: 'Meta Launches New AR Glasses', ticker: 'META' },
  { id: 7, headline: 'NVIDIA Sets New GPU Record', ticker: 'NVDA' },
  { id: 8, headline: 'Netflix Subscriber Growth Accelerates', ticker: 'NFLX' },
  { id: 9, headline: 'AMD Gains Server Market Share', ticker: 'AMD' },
  { id: 10, headline: 'Disney+ Reaches Profitability', ticker: 'DIS' },
  { id: 11, headline: 'Salesforce AI Integration Boosts Revenue', ticker: 'CRM' },
  { id: 12, headline: 'Intel Announces New Fab Investment', ticker: 'INTC' },
  { id: 13, headline: 'Uber Posts Record Quarterly Profit', ticker: 'UBER' },
  { id: 14, headline: 'Tesla FSD Update Rolling Out', ticker: 'TSLA' },
  { id: 15, headline: 'Apple Vision Pro Sales Ramp Up', ticker: 'AAPL' },
  { id: 16, headline: 'NVIDIA Blackwell Chip Demand Soars', ticker: 'NVDA' },
  { id: 17, headline: 'Amazon AWS Revenue Hits New High', ticker: 'AMZN' },
  { id: 18, headline: 'Microsoft Copilot Adoption Grows', ticker: 'MSFT' },
  { id: 19, headline: 'Google Gemini 2.0 Launched', ticker: 'GOOGL' },
  { id: 20, headline: 'Meta Threads Reaches 200M Users', ticker: 'META' },
];

export async function fetchNews(): Promise<NewsItem[]> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 300));
  return MOCK_NEWS;
}
