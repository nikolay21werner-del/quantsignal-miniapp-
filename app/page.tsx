"use client";

import { useState } from "react";
import { BrandMark, BrandWord } from "@/components/Brand";
import { BottomNav, type TabKey } from "@/components/BottomNav";
import { MarketsScreen } from "@/components/screens/MarketsScreen";
import { SignalsScreen } from "@/components/screens/SignalsScreen";
import { AIScreen } from "@/components/screens/AIScreen";
import { PortfolioScreen } from "@/components/screens/PortfolioScreen";
import { useMarkets } from "@/lib/useMarkets";
import { useTelegram } from "@/components/TelegramProvider";

export default function Page() {
  const [tab, setTab] = useState<TabKey>("markets");
  const { coins, loading, updatedAt } = useMarkets();
  const { user } = useTelegram();

  return (
    <div
      className="mx-auto flex w-full max-w-md flex-col bg-bg-900"
      style={{ minHeight: "var(--tg-vh, 100dvh)" }}
    >
      {/* Fixed header — brand block, no top tab bar */}
      <header
        className="sticky top-0 z-30 border-b border-line/70 bg-bg-900/95 backdrop-blur-md"
        style={{ paddingTop: "var(--tg-safe-top)" }}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <BrandMark size={40} />
          <BrandWord />
          <div className="ml-auto flex items-center gap-2">
            <span className="chip">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-good" />
              {updatedAt ? "online" : "…"}
            </span>
          </div>
        </div>
        {user?.first_name && (
          <div className="px-4 pb-2 text-[12px] text-ink-300">
            С возвращением, <span className="text-ink-100">{user.first_name}</span>
          </div>
        )}
      </header>

      {/* Scroll area — only this scrolls; bottom padding clears the nav + safe area */}
      <main
        className="flex-1 overflow-x-hidden px-4 pt-4"
        style={{ paddingBottom: "calc(58px + var(--tg-safe-bottom) + 20px)" }}
      >
        {tab === "markets" && <MarketsScreen coins={coins} loading={loading} />}
        {tab === "signals" && <SignalsScreen coins={coins} loading={loading} />}
        {tab === "ai" && <AIScreen coins={coins} />}
        {tab === "portfolio" && <PortfolioScreen coins={coins} loading={loading} />}
      </main>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
