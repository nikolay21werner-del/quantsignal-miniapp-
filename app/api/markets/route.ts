import { NextResponse } from "next/server";

export const revalidate = 30;

const COINS = [
  "bitcoin",
  "ethereum",
  "solana",
  "binancecoin",
  "ripple",
  "cardano",
  "dogecoin",
  "avalanche-2",
  "chainlink",
  "polkadot",
];

export async function GET() {
  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd" +
    `&ids=${COINS.join(",")}` +
    "&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=24h";

  try {
    const res = await fetch(url, {
      headers: { accept: "application/json" },
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error(`coingecko ${res.status}`);
    const data = await res.json();
    const coins = (data as any[]).map((c) => ({
      id: c.id,
      symbol: (c.symbol || "").toUpperCase(),
      name: c.name,
      image: c.image,
      price: c.current_price,
      change24h: c.price_change_percentage_24h,
      marketCap: c.market_cap,
      volume: c.total_volume,
      sparkline: c.sparkline_in_7d?.price?.slice(-24) ?? [],
    }));
    return NextResponse.json({ ok: true, coins, ts: Date.now() });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: String(e), coins: [], ts: Date.now() },
      { status: 200 },
    );
  }
}
