"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Coin } from "./types";

type State = {
  coins: Coin[];
  loading: boolean;
  error: string | null;
  updatedAt: number | null;
};

export function useMarkets(pollMs = 30000) {
  const [state, setState] = useState<State>({
    coins: [],
    loading: true,
    error: null,
    updatedAt: null,
  });
  const mounted = useRef(true);

  const load = useCallback(async (soft = false) => {
    if (!soft) setState((s) => ({ ...s, loading: s.coins.length === 0 }));
    try {
      const res = await fetch("/api/markets", { cache: "no-store" });
      const json = await res.json();
      if (!mounted.current) return;
      if (json.ok && json.coins?.length) {
        setState({ coins: json.coins, loading: false, error: null, updatedAt: json.ts });
      } else {
        setState((s) => ({
          ...s,
          loading: false,
          error: s.coins.length ? null : "Не удалось загрузить рынок",
        }));
      }
    } catch (e) {
      if (!mounted.current) return;
      setState((s) => ({ ...s, loading: false, error: s.coins.length ? null : String(e) }));
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    load(false);
    const id = setInterval(() => load(true), pollMs);
    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, [load, pollMs]);

  return { ...state, refresh: () => load(false) };
}
