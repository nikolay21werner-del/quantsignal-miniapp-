"use client";

import { useRef, useState } from "react";
import type { Coin } from "@/lib/types";
import { buildSignals } from "@/lib/signals";
import { fmtPct, fmtPrice } from "@/lib/format";
import { useTelegram } from "../TelegramProvider";

type Msg = { role: "user" | "ai"; text: string };

function answer(q: string, coins: Coin[]): string {
  const text = q.toLowerCase();
  if (!coins.length) return "Данные рынка ещё загружаются — попробуйте через секунду.";

  const byChange = [...coins].sort((a, b) => (b.change24h ?? 0) - (a.change24h ?? 0));
  const top = byChange[0];
  const worst = byChange[byChange.length - 1];

  const named = coins.find(
    (c) => text.includes(c.symbol.toLowerCase()) || text.includes(c.name.toLowerCase()),
  );

  if (named) {
    const up = (named.change24h ?? 0) >= 0;
    return `${named.name} (${named.symbol}): ${fmtPrice(named.price)}, 24ч ${fmtPct(
      named.change24h,
    )}. Тренд ${up ? "восходящий" : "нисходящий"} — действуйте по риск-менеджменту.`;
  }
  if (text.includes("сигнал") || text.includes("купи") || text.includes("идея")) {
    const s = buildSignals(coins)[0];
    return s
      ? `Топ-сигнал: ${s.symbol} ${s.side}, уверенность ${s.confidence}%. Вход ${fmtPrice(
          s.entry,
        )}, цель ${fmtPrice(s.target)}, стоп ${fmtPrice(s.stop)}.`
      : "Сейчас нет сильных сигналов — рынок в боковике.";
  }
  if (text.includes("растет") || text.includes("лучш") || text.includes("топ")) {
    return `Лидер за 24ч — ${top.symbol} ${fmtPct(top.change24h)}. Аутсайдер — ${
      worst.symbol
    } ${fmtPct(worst.change24h)}.`;
  }
  if (text.includes("паден") || text.includes("худш") || text.includes("красн")) {
    return `Сильнее всех падает ${worst.symbol} (${fmtPct(worst.change24h)}). Осторожно с лонгами.`;
  }
  const avg = coins.reduce((a, c) => a + (c.change24h ?? 0), 0) / coins.length;
  return `Рынок в среднем ${fmtPct(avg)} за 24ч. Лидер ${top.symbol} ${fmtPct(
    top.change24h,
  )}. Задайте вопрос про монету или попросите сигнал.`;
}

const SUGGESTIONS = ["Что растёт сегодня?", "Дай топ-сигнал", "Как BTC?", "Что падает?"];

export function AIScreen({ coins }: { coins: Coin[] }) {
  const { haptic } = useTelegram();
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "ai",
      text: "Привет! Я QUANTSIGNAL AI. Спросите про любую монету, тренд или попросите торговый сигнал.",
    },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const send = (q: string) => {
    const query = q.trim();
    if (!query) return;
    haptic("light");
    const reply = answer(query, coins);
    setMsgs((m) => [...m, { role: "user", text: query }, { role: "ai", text: reply }]);
    setInput("");
    requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth" }));
  };

  return (
    <div className="fade-in flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-base font-bold text-ink-100">AI Ассистент</h2>
        <span className="chip-brand">on-chain aware</span>
      </div>

      <div className="card space-y-3 p-3">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                m.role === "user"
                  ? "bg-brand-grad text-bg-900 font-medium"
                  : "bg-bg-800 text-ink-100 border border-line/70"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
        {SUGGESTIONS.map((s) => (
          <button key={s} type="button" onClick={() => send(s)} className="btn-ghost shrink-0 text-[12px]">
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Спросите про рынок…"
          inputMode="text"
          className="flex-1 rounded-xl border border-line bg-bg-800 px-3.5 py-3 text-sm text-ink-100 placeholder:text-ink-400 focus:border-brand/50"
        />
        <button type="submit" className="btn-primary px-4">
          →
        </button>
      </form>
    </div>
  );
}
