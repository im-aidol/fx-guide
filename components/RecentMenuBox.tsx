"use client";

import Link from "next/link";
import { useRecentMenu } from "@/lib/hooks/useRecentMenu";

/**
 * 우측 상단 떠있는 "최근 본 메뉴" 위젯.
 * layout.tsx에서 fixed 포지셔닝으로 모든 페이지에 노출.
 * 좁은 화면(< xl)에서는 숨김 — 부모에서 hidden 처리.
 */
export function RecentMenuBox() {
  const items = useRecentMenu();

  return (
    <aside className="bg-white border border-border rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base leading-none">🕒</span>
        <h2 className="text-sm font-semibold">최근 본 메뉴</h2>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-charcoal-soft leading-relaxed">
          메뉴를 둘러보면 여기에 표시돼요.
        </p>
      ) : (
        <ul className="space-y-0.5">
          {items.map((it) => (
            <li key={it.path}>
              <Link
                href={it.path}
                className="flex items-center gap-2 px-2 py-1.5 -mx-2 rounded-md text-xs text-charcoal-soft hover:bg-offwhite hover:text-charcoal transition"
              >
                <span className="text-sm leading-none shrink-0">{it.icon}</span>
                <span className="flex-1 truncate">{it.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
