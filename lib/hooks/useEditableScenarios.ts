"use client";

// 무역금융 시나리오 편집 hook.
// 본점 모드 = CRUD 가능, 영업점 모드 = 읽기 전용.
// localStorage 키: fx-guide:trade-scenarios

import { useEffect, useState } from "react";
import {
  TRADE_SCENARIOS,
  type TradeScenario,
} from "@/lib/data/trade-scenarios";

const STORAGE_KEY = "fx-guide:trade-scenarios";

export function useEditableScenarios() {
  const [items, setItems] = useState<TradeScenario[]>(TRADE_SCENARIOS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as TradeScenario[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  const persist = (next: TradeScenario[]) => {
    setItems(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const add = (item: TradeScenario) => persist([item, ...items]);

  const update = (id: string, patch: Partial<TradeScenario>) =>
    persist(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const remove = (id: string) =>
    persist(items.filter((it) => it.id !== id));

  const reset = () => {
    setItems(TRADE_SCENARIOS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return { items, add, update, remove, reset, hydrated };
}
