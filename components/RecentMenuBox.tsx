"use client";

import Link from "next/link";
import { useState } from "react";
import { useRecentMenu } from "@/lib/hooks/useRecentMenu";

/**
 * 우측 상단 떠있는 "최근 본 메뉴" 위젯.
 * layout.tsx에서 fixed 포지셔닝으로 모든 페이지에 노출.
 * 좁은 화면(< xl)에서는 숨김 — 부모에서 hidden 처리.
 *
 * 헤더 클릭으로 펼침/접힘 토글. layout 내 한 번 마운트되므로
 * 페이지 이동에도 토글 상태가 자동 유지됨 (하드 리프레시 시에만 초기화).
 */
export function RecentMenuBox() {
  const items = useRecentMenu();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className="bg-white border border-border rounded-lg shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-offwhite transition"
        aria-expanded={!collapsed}
        aria-label={collapsed ? "최근 본 메뉴 펼치기" : "최근 본 메뉴 접기"}
      >
        <span className="text-xs leading-none">🕒</span>
        <h2 className="text-[11px] font-semibold flex-1 text-left">
          최근 본 메뉴
          {items.length > 0 && (
            <span className="ml-1 text-charcoal-soft font-normal">
              ({items.length})
            </span>
          )}
        </h2>
        <span
          aria-hidden
          className={[
            "text-[9px] text-charcoal-soft transition-transform",
            collapsed ? "" : "rotate-180",
          ].join(" ")}
        >
          ▾
        </span>
      </button>

      {!collapsed && (
        <div className="border-t border-border px-2.5 py-2">
          {items.length === 0 ? (
            <p className="text-[10px] text-charcoal-soft leading-relaxed">
              메뉴를 둘러보면 여기에 표시돼요.
            </p>
          ) : (
            <ul className="space-y-0">
              {items.map((it) => (
                <li key={it.path}>
                  <Link
                    href={it.path}
                    className="flex items-center gap-1.5 px-1.5 py-1 -mx-1.5 rounded text-[11px] text-charcoal-soft hover:bg-offwhite hover:text-charcoal transition"
                  >
                    <span className="text-xs leading-none shrink-0">
                      {it.icon}
                    </span>
                    <span className="flex-1 truncate">{it.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </aside>
  );
}
