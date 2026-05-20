"use client";

// 본점이 사이드바에 직접 추가하는 사용자 정의 메뉴 그룹과 그 안의 가이드 페이지.
// localStorage에 영속화. 실제 도입 시 중앙 저장소로 전환.

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "fx-guide:custom-menus";

export type CustomMenuItem = {
  slug: string; // URL의 [slug] 부분 (소문자·하이픈만 허용)
  label: string; // 사이드바 표기
  pageTitle: string; // 페이지 헤더
  pageSubtitle?: string;
  body: string; // 자유 본문 (간단 마크다운: **bold**, --- 구분선, # 헤딩)
  source?: string;
};

export type CustomMenuGroup = {
  id: string;
  label: string;
  icon: string; // 이모지 1개
  items: CustomMenuItem[];
};

export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

function read(): CustomMenuGroup[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CustomMenuGroup[]) : [];
  } catch {
    return [];
  }
}

function write(groups: CustomMenuGroup[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
  } catch {
    // ignore
  }
  // 같은 탭의 다른 컴포넌트에 변경 알림
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("fx-guide:custom-menus-changed"));
  }
}

export function useCustomMenus() {
  const [groups, setGroups] = useState<CustomMenuGroup[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setGroups(read());
    setHydrated(true);

    const onChange = () => setGroups(read());
    window.addEventListener("fx-guide:custom-menus-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("fx-guide:custom-menus-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const persist = useCallback((next: CustomMenuGroup[]) => {
    setGroups(next);
    write(next);
  }, []);

  const addGroup = useCallback(
    (input: { label: string; icon: string; firstItem: CustomMenuItem }) => {
      const current = read();
      const id = `g-${Date.now()}`;
      const next: CustomMenuGroup = {
        id,
        label: input.label,
        icon: input.icon,
        items: [input.firstItem],
      };
      persist([...current, next]);
      return next;
    },
    [persist],
  );

  const updateGroup = useCallback(
    (id: string, patch: Partial<Pick<CustomMenuGroup, "label" | "icon">>) => {
      const current = read();
      persist(
        current.map((g) => (g.id === id ? { ...g, ...patch } : g)),
      );
    },
    [persist],
  );

  const removeGroup = useCallback(
    (id: string) => {
      const current = read();
      persist(current.filter((g) => g.id !== id));
    },
    [persist],
  );

  const addItem = useCallback(
    (groupId: string, item: CustomMenuItem) => {
      const current = read();
      persist(
        current.map((g) =>
          g.id === groupId ? { ...g, items: [...g.items, item] } : g,
        ),
      );
    },
    [persist],
  );

  const updateItem = useCallback(
    (groupId: string, slug: string, patch: Partial<CustomMenuItem>) => {
      const current = read();
      persist(
        current.map((g) =>
          g.id === groupId
            ? {
                ...g,
                items: g.items.map((it) =>
                  it.slug === slug ? { ...it, ...patch } : it,
                ),
              }
            : g,
        ),
      );
    },
    [persist],
  );

  const removeItem = useCallback(
    (groupId: string, slug: string) => {
      const current = read();
      persist(
        current.map((g) =>
          g.id === groupId
            ? { ...g, items: g.items.filter((it) => it.slug !== slug) }
            : g,
        ),
      );
    },
    [persist],
  );

  const findBySlug = useCallback(
    (
      slug: string,
    ): { group: CustomMenuGroup; item: CustomMenuItem } | null => {
      for (const g of groups) {
        const item = g.items.find((it) => it.slug === slug);
        if (item) return { group: g, item };
      }
      return null;
    },
    [groups],
  );

  const slugExists = useCallback(
    (slug: string, excludeGroupId?: string): boolean => {
      const current = read();
      return current.some((g) =>
        g.id === excludeGroupId
          ? false
          : g.items.some((it) => it.slug === slug),
      );
    },
    [],
  );

  return {
    groups,
    hydrated,
    addGroup,
    updateGroup,
    removeGroup,
    addItem,
    updateItem,
    removeItem,
    findBySlug,
    slugExists,
  };
}
