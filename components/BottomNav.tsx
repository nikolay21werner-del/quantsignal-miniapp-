"use client";

import { useTelegram } from "./TelegramProvider";

export type TabKey = "markets" | "signals" | "ai" | "portfolio";

const TABS: { key: TabKey; label: string; icon: (active: boolean) => JSX.Element }[] = [
  {
    key: "markets",
    label: "Рынки",
    icon: (a) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <path
          d="M4 16l4-5 3 3 4-7 5 8"
          stroke={a ? "#22E1D9" : "#6B7A8C"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "signals",
    label: "Сигналы",
    icon: (a) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <path
          d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"
          stroke={a ? "#22E1D9" : "#6B7A8C"}
          strokeWidth="2"
          strokeLinejoin="round"
          fill={a ? "rgba(34,225,217,0.12)" : "none"}
        />
      </svg>
    ),
  },
  {
    key: "ai",
    label: "AI",
    icon: (a) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <rect
          x="4"
          y="5"
          width="16"
          height="13"
          rx="3"
          stroke={a ? "#22E1D9" : "#6B7A8C"}
          strokeWidth="2"
        />
        <path d="M9 11h.01M15 11h.01M12 2v3" stroke={a ? "#22E1D9" : "#6B7A8C"} strokeWidth="2" strokeLinecap="round" />
        <path d="M9 21h6" stroke={a ? "#22E1D9" : "#6B7A8C"} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "portfolio",
    label: "Портфель",
    icon: (a) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <rect x="3" y="7" width="18" height="13" rx="3" stroke={a ? "#22E1D9" : "#6B7A8C"} strokeWidth="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke={a ? "#22E1D9" : "#6B7A8C"} strokeWidth="2" />
      </svg>
    ),
  },
];

export function BottomNav({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (k: TabKey) => void;
}) {
  const { haptic } = useTelegram();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line/80 bg-bg-900/95 backdrop-blur-md"
      style={{ paddingBottom: "var(--tg-safe-bottom)" }}
    >
      <div className="mx-auto grid max-w-md grid-cols-4">
        {TABS.map((t) => {
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => {
                if (!isActive) haptic("light");
                onChange(t.key);
              }}
              className="relative flex h-[58px] flex-col items-center justify-center gap-1"
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <span className="absolute top-0 h-[2px] w-8 rounded-full bg-brand-grad shadow-glow" />
              )}
              {t.icon(isActive)}
              <span
                className={`text-[10px] font-medium ${isActive ? "text-brand" : "text-ink-300"}`}
              >
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
