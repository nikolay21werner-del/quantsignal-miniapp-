export type Coin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume: number;
  sparkline: number[];
};

export type Signal = {
  id: string;
  coinId: string;
  symbol: string;
  name: string;
  image: string;
  side: "LONG" | "SHORT";
  confidence: number; // 0..100
  entry: number;
  target: number;
  stop: number;
  horizon: string;
  rationale: string;
  status: "active" | "hit" | "stopped";
};
