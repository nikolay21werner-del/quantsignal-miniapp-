export function fmtPrice(n: number): string {
  if (n == null || Number.isNaN(n)) return "—";
  if (n >= 1000) return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (n >= 1) return `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 6 })}`;
}

export function fmtCompact(n: number): string {
  if (n == null || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export function fmtPct(n: number): string {
  if (n == null || Number.isNaN(n)) return "—";
  const s = n.toFixed(2);
  return `${n >= 0 ? "+" : ""}${s}%`;
}
