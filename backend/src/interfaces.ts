export interface Stock {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
  purchasePrice: number;
  quantity: number;
  purchaseDate: string; // ISO date string
}

export interface StockWithComputed extends Stock {
  cmp: number | null;
  investment: number;
  presentValue: number | null;
  gainLoss: number | null;
  portfolioPercent: number | null;
  peRatio: number | null;
  earnings: number | null;
}

export interface Quote {
  symbol: string;
  cmp: number | null;
  error?: string;
  cached?: boolean; // Added for debugging cache hits
}

export interface Metrics {
  symbol: string;
  peRatio: number | null;
  earnings: number | null;
  error?: string;
  cached?: boolean; // Added for debugging cache hits
}
