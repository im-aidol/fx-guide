"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const ITEMS = [
  { href: "/", label: "홈", icon: "🏠" },
  { href: "/simulator", label: "당발 송금 도우미", icon: "📤" },
  { href: "/incoming", label: "타발 송금 안내", icon: "📥" },
  { href: "/guide", label: "업무별 가이드", icon: "📚" },
  { href: "/samples", label: "외국통화 견양", icon: "💴" },
  { href: "/notices", label: "본부 게시판", icon: "📣" },
  { href: "/qna", label: "익명 Q&A", icon: "💬" },
  { href: "/faq", label: "FAQ", icon: "❓" },
  { href: "/glossary", label: "용어 사전", icon: "📖" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 모바일 헤더 */}
      <header className="md:hidden print:hidden border-b border-border bg-white sticky top-0 z-30 flex items-center justify-between px-4 h-14">
        <Link
          href="/"
          className="font-bold text-primary text-base"
          onClick={() => setOpen(false)}
        >
          외환 길잡이
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="text-2xl text-charcoal-soft hover:text-primary"
          aria-label="메뉴 토글"
        >
          {open ? "✕" : "☰"}
        </button>
      </header>

      {/* 모바일 backdrop */}
      {open && (
        <div
          className="md:hidden print:hidden fixed inset-0 top-14 bg-charcoal/30 z-20"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 사이드바 본체 */}
      <aside
        className={[
          "bg-white border-r border-border z-30 flex flex-col print:hidden",
          // 모바일: fixed slide-in (헤더 14h 아래)
          "fixed top-14 left-0 w-64 h-[calc(100vh-3.5rem)]",
          // 데스크톱: sticky 사이드바 (모바일 스타일을 덮어씀)
          "md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0",
          "transition-transform",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        <div className="p-5 border-b border-border hidden md:block">
          <Link href="/" className="font-bold text-primary text-lg block">
            외환 길잡이
          </Link>
          <p className="text-[10px] text-charcoal-soft mt-1">
            iM뱅크 영업점 가이드
          </p>
        </div>

        <nav className="p-3 flex-1 overflow-y-auto">
          <ul className="space-y-0.5">
            {ITEMS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={[
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition",
                      active
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-charcoal-soft hover:bg-offwhite hover:text-charcoal",
                    ].join(" ")}
                  >
                    <span className="text-base leading-none">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-border bg-offwhite/40">
          <p className="text-[10px] text-charcoal-soft uppercase tracking-wide">
            1차 기준
          </p>
          <p className="text-xs font-medium text-charcoal mt-1">
            외환규정 제2026-69호
          </p>
          <p className="text-[10px] text-charcoal-soft mt-0.5">
            시행 2026.3.30.
          </p>
        </div>
      </aside>
    </>
  );
}
