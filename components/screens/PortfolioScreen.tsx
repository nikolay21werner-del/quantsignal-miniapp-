"use client";

import type { Coin } from "@/lib/types";
import { CoinIcon } from "../CoinIcon";
import { fmtPrice, fmtPct } from "@/lib/format";

// Demo holdings (units) keyed by coin id — valued live against real prices.
const HOLDINGS: Record<string, number> = {
  bitcoin: 0.0425,
  ethereum: 1.8,
  solana: 22,
  chainlink: 140,
};

export function PortfolioScreen({ coins, loading }: { coins: Coin[]; loading: boolean }) {
  const rows = coins
    .filter((c) => HOLDINGS[c.id])
    .map((c) => {
      const units = HOLDINGS[c.id];
      const value = units * c.price;
      return { coin: c, units, value };
    });

  const total = rows.reduce((a, r) => a + r.value, 0);
  const weightedChange =
    total > 0
      ? rows.reduce((a, r) => a + (r.coin.change24h ?? 0) * (r.value / total), 0)
      : 0;
  const up = weightedChange >= 0;

  return (
    <div className="fade-in space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-base font-bold text-ink-100">Портфель</h2>
        <span className="chip">live valuation</span>
      </div>

      <div className="card relative overflow-hidden p-5">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand/10 blur-2xl" />
        <div className="text-[12px] text-ink-300">Общая стоимость</div>
        {loading && !rows.length ? (
          <div className="skeleton mt-2 h-8 w-40 rounded" />
        ) : (
          <div className="stat-num mt-1 text-3xl font-extrabold text-ink-100">
            {fmtPrice(total)}
          </div>
        )}
        <div className={`stat-num mt-1 text-sm font-semibold ${up ? "text-good" : "text-bad"}`}>
          {fmtPct(weightedChange)} · 24ч
        </div>
      </div>

      <div className="card divide-y divide-line/70 overflow-hidden">
        {loading && !rows.length
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="skeleton h-[34px] w-[34px] rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-3 w-20 rounded" />
                  <div className="skeleton h-2.5 w-14 rounded" />
                </div>
                <div className="skeleton h-3 w-16 rounded" />
              </div>
            ))
          : rows.map((r) => {
              const cUp = (r.coin.change24h ?? 0) >= 0;
              return (
                <div key={r.coin.id} className="flex items-center gap-3 px-4 py-3">
                  <CoinIcon src={r.coin.image} symbol={r.coin.symbol} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-ink-100">{r.coin.symbol}</div>
                    <div className="stat-num text-[11px] text-ink-300">
                      {r.units} {r.coin.symbol}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="stat-num text-sm font-semibold text-ink-100">
                      {fmtPrice(r.value)}
                    </div>
                    <div className={`stat-num text-[12px] ${cUp ? "text-good" : "text-bad"}`}>
                      {fmtPct(r.coin.change24h)}
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
