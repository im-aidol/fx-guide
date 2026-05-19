"use client";

// localStorage 영속화 + CRUD를 한 곳에서 제공하는 제네릭 hook.
// 본점/영업점 모드 권한 분기는 page 컴포넌트 측에서 판단 (useMode).
// seed 데이터는 처음 1회만 채워 넣고, 이후 사용자의 수정·추가·삭제 결과를 우선 유지.

import { useEffect, useState } from "react";

type Identifiable = { id: string };

export function useEditableList<T extends Identifiable>(
  storageKey: string,
  seed: T[],
) {
  const [items, setItems] = useState<T[]>(seed);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as T[];
        if (Array.isArray(parsed)) setItems(parsed);
      } else {
        localStorage.setItem(storageKey, JSON.stringify(seed));
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, [storageKey, seed]);

  const persist = (next: T[]) => {
    setItems(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const add = (item: T) => persist([item, ...items]);

  const update = (id: string, patch: Partial<T>) =>
    persist(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const remove = (id: string) =>
    persist(items.filter((it) => it.id !== id));

  const reset = () => persist(seed);

  return { items, add, update, remove, reset, hydrated };
}
