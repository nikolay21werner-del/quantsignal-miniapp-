"use client";

import type { Coin, Signal } from "@/lib/types";
import { buildSignals } from "@/lib/signals";
import { CoinIcon } from "../CoinIcon";
import { fmtPrice } from "@/lib/format";

function ConfidenceBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-700">
      <div
        className="h-full rounded-full bg-brand-grad"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function SignalCard({ s }: { s: Signal }) {
  const long = s.side === "LONG";
  return (
    <div className="card-elev p-4">
      <div className="flex items-center gap-3">
        <CoinIcon src={s.image} symbol={s.symbol} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-ink-100">{s.symbol}</span>
            <span
              className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                long ? "bg-good/15 text-good" : "bg-bad/15 text-bad"
              }`}
            >
              {s.side}
            </span>
          </div>
          <div className="text-[11px] text-ink-300">{s.horizon}</div>
        </div>
        <div className="text-right">
          <div className="stat-num text-sm font-bold text-brand">{s.confidence}%</div>
          <div className="text-[10px] text-ink-300">уверенность</div>
        </div>
      </div>

      <div className="mt-3">
        <ConfidenceBar value={s.confidence} />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-bg-800 py-2">
          <div className="text-[10px] text-ink-300">Вход</div>
          <div className="stat-num text-xs font-semibold text-ink-100">{fmtPrice(s.entry)}</div>
        </div>
        <div className="rounded-lg bg-bg-800 py-2">
          <div className="text-[10px] text-ink-300">Цель</div>
          <div className="stat-num text-xs font-semibold text-good">{fmtPrice(s.target)}</div>
        </div>
        <div className="rounded-lg bg-bg-800 py-2">
          <div className="text-[10px] text-ink-300">Стоп</div>
          <div className="stat-num text-xs font-semibold text-bad">{fmtPrice(s.stop)}</div>
        </div>
      </div>

      <p className="mt-3 text-[12px] leading-relaxed text-ink-200">{s.rationale}</p>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="card-elev space-y-3 p-4">
      <div className="flex items-center gap-3">
        <div className="skeleton h-[34px] w-[34px] rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-2.5 w-14 rounded" />
        </div>
      </div>
      <div className="skeleton h-1.5 w-full rounded-full" />
      <div className="grid grid-cols-3 gap-2">
        <div className="skeleton h-10 rounded-lg" />
        <div className="skeleton h-10 rounded-lg" />
        <div className="skeleton h-10 rounded-lg" />
      </div>
    </div>
  );
}

export function SignalsScreen({ coins, loading }: { coins: Coin[]; loading: boolean }) {
  const signals = buildSignals(coins);
  return (
    <div className="fade-in space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-base font-bold text-ink-100">AI Сигналы</h2>
        <span className="chip-brand">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-good" /> live
        </span>
      </div>
      <div className="space-y-3">
        {loading && coins.length === 0
          ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          : signals.map((s) => <SignalCard key={s.id} s={s} />)}
      </div>
    </div>
  );
}
