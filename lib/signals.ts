import type { Coin, Signal } from "./types";

// Derive deterministic signals from real market data (momentum + volatility of
// the 24h sparkline window). No random promo — same inputs always produce the
// same output so the UI is stable across renders.
export function buildSignals(coins: Coin[]): Signal[] {
  return coins
    .filter((c) => c.sparkline && c.sparkline.length >= 4)
    .map((c) => {
      const series = c.sparkline;
      const first = series[0];
      const last = series[series.length - 1];
      const momentum = ((last - first) / first) * 100;

      // realized volatility proxy
      let sumAbs = 0;
      for (let i = 1; i < series.length; i++) {
        sumAbs += Math.abs((series[i] - series[i - 1]) / series[i - 1]);
      }
      const vol = (sumAbs / (series.length - 1)) * 100;

      const side: Signal["side"] = momentum >= 0 ? "LONG" : "SHORT";
      const dir = side === "LONG" ? 1 : -1;

      // Confidence: stronger momentum + lower noise → higher confidence.
      const raw = Math.min(98, 50 + Math.abs(momentum) * 6 - vol * 4);
      const confidence = Math.max(52, Math.round(raw));

      const price = c.price;
      const movePct = Math.max(1.5, Math.min(8, Math.abs(momentum) * 1.4 + 1.5));
      const stopPct = Math.max(1, movePct * 0.45);

      const target = price * (1 + dir * (movePct / 100));
      const stop = price * (1 - dir * (stopPct / 100));

      const horizon = vol > 1.2 ? "Intraday" : "Swing (1-3d)";

      const rationale =
        side === "LONG"
          ? `Восходящий импульс +${momentum.toFixed(1)}% за 24ч при умеренной волатильности.`
          : `Нисходящий импульс ${momentum.toFixed(1)}% за 24ч, давление продавцов.`;

      return {
        id: `sig-${c.id}`,
        coinId: c.id,
        symbol: c.symbol,
        name: c.name,
        image: c.image,
        side,
        confidence,
        entry: price,
        target,
        stop,
        horizon,
        rationale,
        status: "active" as const,
      };
    })
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 6);
}
