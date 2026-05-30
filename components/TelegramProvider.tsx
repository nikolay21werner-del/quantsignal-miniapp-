"use client";

import { createContext, useContext, useEffect, useState } from "react";

type TgUser = {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

type TgContext = {
  ready: boolean;
  user: TgUser | null;
  platform: string;
  haptic: (type?: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
};

const Ctx = createContext<TgContext>({
  ready: false,
  user: null,
  platform: "web",
  haptic: () => {},
});

export function useTelegram() {
  return useContext(Ctx);
}

declare global {
  interface Window {
    Telegram?: any;
  }
}

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<TgUser | null>(null);
  const [platform, setPlatform] = useState("web");

  useEffect(() => {
    let raf = 0;

    const applyViewportVar = (wa: any) => {
      // Lock our app height to the real Telegram viewport to avoid jump/over-scroll.
      const h = wa?.viewportStableHeight || wa?.viewportHeight || window.innerHeight;
      if (h) document.documentElement.style.setProperty("--tg-vh", `${h}px`);
    };

    const init = () => {
      const tg = window.Telegram?.WebApp;
      if (!tg) {
        // Not inside Telegram — run as standalone web with dvh fallback.
        document.documentElement.style.setProperty("--tg-vh", "100dvh");
        setReady(true);
        return;
      }
      try {
        tg.ready();
        tg.expand?.();
        tg.disableVerticalSwipes?.();
        tg.setHeaderColor?.("#05070A");
        tg.setBackgroundColor?.("#05070A");
        setPlatform(tg.platform || "web");
        const u = tg.initDataUnsafe?.user;
        if (u) setUser(u);
        applyViewportVar(tg);
        tg.onEvent?.("viewportChanged", () => applyViewportVar(tg));
      } catch {
        document.documentElement.style.setProperty("--tg-vh", "100dvh");
      }
      setReady(true);
    };

    // telegram-web-app.js loads async; poll briefly then fall back.
    let tries = 0;
    const tick = () => {
      if (window.Telegram?.WebApp || tries > 20) {
        init();
      } else {
        tries += 1;
        raf = window.setTimeout(tick, 50);
      }
    };
    tick();

    return () => window.clearTimeout(raf);
  }, []);

  const haptic: TgContext["haptic"] = (type = "light") => {
    try {
      window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.(type);
    } catch {
      /* noop */
    }
  };

  return <Ctx.Provider value={{ ready, user, platform, haptic }}>{children}</Ctx.Provider>;
}
