"use client";

import type { Coin } from "@/lib/types";
import { CoinIcon } from "../CoinIcon";
import { Sparkline } from "../Sparkline";
import { fmtPrice, fmtPct, fmtCompact } from "@/lib/format";

function Row({ coin }: { coin: Coin }) {
  const up = (coin.change24h ?? 0) >= 0;
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <CoinIcon src={coin.image} symbol={coin.symbol} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-ink-100">{coin.symbol}</span>
          <span className="truncate text-[11px] text-ink-300">{coin.name}</span>
        </div>
        <div className="text-[11px] text-ink-300">Vol {fmtCompact(coin.volume)}</div>
      </div>
      <Sparkline data={coin.sparkline} positive={up} />
      <div className="w-[88px] text-right">
        <div className="stat-num text-sm font-semibold text-ink-100">{fmtPrice(coin.price)}</div>
        <div className={`stat-num text-[12px] font-semibold ${up ? "text-good" : "text-bad"}`}>
          {fmtPct(coin.change24h)}
        </div>
      </div>
    </div>
  );
}

function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="skeleton h-[34px] w-[34px] rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-2.5 w-16 rounded" />
      </div>
      <div className="skeleton h-[26px] w-16 rounded" />
      <div className="space-y-2">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-2.5 w-10 rounded" />
      </div>
    </div>
  );
}

export function MarketsScreen({
  coins,
  loading,
}: {
  coins: Coin[];
  loading: boolean;
}) {
  return (
    <div className="fade-in space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-base font-bold text-ink-100">Рынки</h2>
        <span className="chip">Top 10 · USD</span>
      </div>
      <div className="card divide-y divide-line/70 overflow-hidden">
        {loading && coins.length === 0
          ? Array.from({ length: 8 }).map((_, i) => <RowSkeleton key={i} />)
          : coins.map((c) => <Row key={c.id} coin={c} />)}
      </div>
    </div>
  );
}
