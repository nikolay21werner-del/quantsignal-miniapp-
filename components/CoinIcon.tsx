"use client";

import { useState } from "react";

export function CoinIcon({
  src,
  symbol,
  size = 34,
}: {
  src?: string;
  symbol: string;
  size?: number;
}) {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div
        className="grid place-items-center rounded-full bg-bg-700 text-[11px] font-bold text-ink-200 border border-line"
        style={{ width: size, height: size }}
      >
        {symbol.slice(0, 3)}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={symbol}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setErr(true)}
      className="rounded-full bg-bg-700 border border-line/60"
      style={{ width: size, height: size }}
    />
  );
}
