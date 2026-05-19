"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useMode, type Mode } from "@/components/Mode";

// 사이드바 메뉴는 단일 항목(item)과 자식 항목을 가진 그룹(group) 두 가지.
// 그룹은 1차 메뉴 클릭 시 href로 이동하면서 자동 펼침, 자식 페이지에 있을 때도 펼침.
// 새 외환 업무(예: 수출입대출·외환대출) 추가 시 group children에 한 줄 더 추가만 하면 됨.
type NavItem =
  | { type: "item"; href: string; label: string; icon: string }
  | {
      type: "group";
      id: string;
      label: string;
      icon: string;
      href: string; // 1차 메뉴 클릭 시 이동할 대표 페이지
      children: { href: string; label: string }[];
    };

const NAV: NavItem[] = [
  { type: "item", href: "/", label: "홈", icon: "🏠" },

  {
    type: "group",
    id: "send",
    label: "송금 (당발)",
    icon: "📤",
    href: "/guide/send",
    children: [
      { href: "/guide/send", label: "송금 가이드" },
      { href: "/simulator", label: "당발 송금 도우미" },
    ],
  },
  {
    type: "group",
    id: "receive",
    label: "타발 송금",
    icon: "📥",
    href: "/guide/receive",
    children: [
      { href: "/guide/receive", label: "타발 가이드" },
      { href: "/incoming", label: "타발 송금 안내서" },
    ],
  },
  {
    type: "group",
    id: "exchange",
    label: "환전",
    icon: "💱",
    href: "/guide/exchange",
    children: [
      { href: "/guide/exchange", label: "환전 가이드" },
      { href: "/samples", label: "통화 견본" },
    ],
  },
  {
    type: "group",
    id: "delivery",
    label: "외화 배송",
    icon: "📦",
    href: "/guide/delivery",
    children: [{ href: "/guide/delivery", label: "외화 배송 가이드" }],
  },
  {
    type: "group",
    id: "deposit",
    label: "외화 예금·적금",
    icon: "🏦",
    href: "/guide/deposit",
    children: [{ href: "/guide/deposit", label: "외화 예금·적금 가이드" }],
  },
  {
    type: "group",
    id: "trade-finance",
    label: "무역금융",
    icon: "🏭",
    href: "/guide/trade-finance",
    children: [{ href: "/guide/trade-finance", label: "무역금융 가이드" }],
  },

  { type: "item", href: "/notices", label: "공지사항", icon: "📣" },
  { type: "item", href: "/qna", label: "익명 Q&A", icon: "💬" },
  { type: "item", href: "/faq", label: "FAQ", icon: "❓" },
  { type: "item", href: "/glossary", label: "외환 용어집", icon: "📖" },
];

function isItemActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function isGroupActive(
  group: Extract<NavItem, { type: "group" }>,
  pathname: string,
): boolean {
  return group.children.some((c) => isItemActive(c.href, pathname));
}

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // 현재 경로의 그룹은 자동 펼침. 추가 토글은 사용자가 직접.
  const activeGroupId = useMemo(() => {
    for (const item of NAV) {
      if (item.type === "group" && isGroupActive(item, pathname)) {
        return item.id;
      }
    }
    return null;
  }, [pathname]);

  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(activeGroupId ? [activeGroupId] : []),
  );

  // 라우트 이동으로 활성 그룹이 바뀌면 자동 펼침에 추가.
  useEffect(() => {
    if (activeGroupId) {
      setExpandedIds((prev) => {
        if (prev.has(activeGroupId)) return prev;
        const next = new Set(prev);
        next.add(activeGroupId);
        return next;
      });
    }
  }, [activeGroupId]);

  const toggleGroup = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header className="md:hidden print:hidden border-b border-border bg-white sticky top-0 z-30 flex items-center justify-between px-4 h-14">
        <Link
          href="/"
          className="font-bold text-primary text-base"
          onClick={closeMobile}
        >
          외환 길잡이
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-2xl text-charcoal-soft hover:text-primary"
          aria-label="메뉴 토글"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </header>

      {mobileOpen && (
        <div
          className="md:hidden print:hidden fixed inset-0 top-14 bg-charcoal/30 z-20"
          onClick={closeMobile}
        />
      )}

      <aside
        className={[
          "bg-white border-r border-border z-30 flex flex-col print:hidden",
          "fixed top-14 left-0 w-64 h-[calc(100vh-3.5rem)]",
          "md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0",
          "transition-transform",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        <div className="p-5 border-b border-border hidden md:block">
          <Link href="/" className="font-bold text-primary text-lg block">
            외환 길잡이
          </Link>
          <p className="text-[10px] text-charcoal-soft mt-1">
            iM뱅크 외환 업무 가이드
          </p>
        </div>

        <div className="px-3 pt-3 pb-2 border-b border-border">
          <p className="text-[10px] text-charcoal-soft uppercase tracking-wide mb-1.5 px-1">
            현재 모드
          </p>
          <ModeToggle />
        </div>

        <nav className="p-3 flex-1 overflow-y-auto">
          <ul className="space-y-0.5">
            {NAV.map((item) => {
              if (item.type === "item") {
                const active = isItemActive(item.href, pathname);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeMobile}
                      className={[
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition",
                        active
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-charcoal-soft hover:bg-offwhite hover:text-charcoal",
                      ].join(" ")}
                    >
                      <span className="text-base leading-none">
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              }

              const expanded = expandedIds.has(item.id);
              const groupActive = isGroupActive(item, pathname);

              return (
                <li key={item.id}>
                  <div
                    className={[
                      "flex items-center rounded-lg text-sm transition",
                      groupActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-charcoal-soft hover:bg-offwhite hover:text-charcoal",
                    ].join(" ")}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMobile}
                      className="flex items-center gap-3 px-3 py-2 flex-1 min-w-0"
                    >
                      <span className="text-base leading-none">
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleGroup(item.id)}
                      className="px-2 py-2 text-xs text-charcoal-soft hover:text-charcoal shrink-0"
                      aria-label={`${item.label} 메뉴 ${expanded ? "접기" : "펼치기"}`}
                      aria-expanded={expanded}
                    >
                      <span
                        className={[
                          "inline-block transition-transform",
                          expanded ? "rotate-90" : "",
                        ].join(" ")}
                      >
                        ▸
                      </span>
                    </button>
                  </div>

                  {expanded && (
                    <ul className="mt-0.5 mb-1 ml-3 pl-3 border-l border-border space-y-0.5">
                      {item.children.map((child) => {
                        const childActive = isItemActive(child.href, pathname);
                        return (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={closeMobile}
                              className={[
                                "block px-2.5 py-1.5 rounded-md text-xs transition",
                                childActive
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "text-charcoal-soft hover:bg-offwhite hover:text-charcoal",
                              ].join(" ")}
                            >
                              {child.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
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

function ModeToggle() {
  const { mode, setMode } = useMode();
  const options: { value: Mode; label: string; icon: string }[] = [
    { value: "branch", label: "영업점", icon: "🏢" },
    { value: "hq", label: "본점", icon: "🏛️" },
  ];

  const description =
    mode === "hq"
      ? "외환사업부 관리자. 가이드·공지 작성과 Q&A 답변이 가능합니다."
      : "영업점 직원 조회 화면. 가이드 열람과 익명 Q&A 등록이 가능합니다.";

  return (
    <>
      <div className="flex gap-1 bg-offwhite border border-border rounded-md p-0.5">
        {options.map((opt) => {
          const active = mode === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setMode(opt.value)}
              className={[
                "flex-1 text-xs px-2 py-1.5 rounded transition flex items-center justify-center gap-1",
                active
                  ? "bg-primary text-white font-medium"
                  : "text-charcoal-soft hover:text-charcoal",
              ].join(" ")}
              aria-pressed={active}
            >
              <span className="text-sm leading-none">{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
      <p className="text-[10px] text-charcoal-soft leading-snug mt-1.5 px-1">
        {description}
      </p>
    </>
  );
}
