"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMode, type Mode } from "@/components/Mode";
import { useCustomMenus, slugify } from "@/lib/custom-menus";

// 상단 바 네비게이션 — Sidebar의 NAV 구조 그대로 가져옴.
// 1차 메뉴는 가로 정렬, 그룹은 hover/click drop-down. 모바일은 햄버거 + 풀스크린 메뉴.

type NavGroup = {
  type: "group";
  id: string;
  label: string;
  icon: string;
  href: string;
  children: { href: string; label: string }[];
  custom?: boolean;
};

type NavItem =
  | { type: "item"; href: string; label: string; icon: string }
  | NavGroup;

const NAV_TOP: NavItem[] = [
  { type: "item", href: "/", label: "홈", icon: "🏠" },
  {
    type: "group",
    id: "send",
    label: "당발송금",
    icon: "📤",
    href: "/guide/send",
    children: [
      { href: "/simulator", label: "🎯 당발송금 도우미" },
      { href: "/guide/send/cases", label: "📋 사유별 가이드" },
      { href: "/guide/send/channels/swift", label: "💸 SWIFT 일반 외화송금" },
      { href: "/guide/send/channels/baro", label: "🚀 BARO-BARO 자동송금" },
      { href: "/guide/send/channels/wu", label: "⚡ WU 송금 3종" },
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
      { href: "/guide/exchange/calculator", label: "🧮 환전 계산기" },
      { href: "/guide/exchange/info", label: "📐 환율 산출 안내" },
      { href: "/samples", label: "💴 통화 견본" },
      { href: "/guide/exchange/e-wallet", label: "💼 외화 E-지갑" },
      { href: "/guide/delivery", label: "📦 외화 배송" },
      { href: "/guide/exchange/gift", label: "🎁 외화 기프티콘" },
      { href: "/guide/exchange/gln", label: "💳 GLN 해외 결제" },
    ],
  },
  {
    type: "group",
    id: "deposit",
    label: "외화 예금·적금",
    icon: "🏦",
    href: "/guide/deposit",
    children: [
      {
        href: "/guide/deposit/global-comprehensive",
        label: "🌐 글로벌외화종합통장",
      },
      { href: "/guide/deposit/category/demand", label: "💵 수시입출" },
      { href: "/guide/deposit/category/term", label: "🏛️ 기간예치" },
      { href: "/guide/deposit/category/savings", label: "💰 자유적립" },
      { href: "/guide/deposit/auto-transfer", label: "🔁 자동이체" },
      { href: "/guide/deposit/simulator", label: "🧮 이자 시뮬레이터" },
      { href: "/guide/deposit/all", label: "🔍 전체 검색·표" },
    ],
  },
  {
    type: "group",
    id: "trade-finance",
    label: "무역금융",
    icon: "🏭",
    href: "/guide/trade-finance",
    children: [{ href: "/guide/trade-finance", label: "무역금융 가이드" }],
  },
];

const NAV_BOTTOM: NavItem[] = [
  { type: "item", href: "/notices", label: "공지사항", icon: "📣" },
  { type: "item", href: "/qna", label: "익명 Q&A", icon: "💬" },
  { type: "item", href: "/faq", label: "FAQ", icon: "❓" },
  { type: "item", href: "/glossary", label: "외환 용어집", icon: "📖" },
];

function isItemActive(href: string, pathname: string): boolean {
  const cleanHref = href.split("#")[0].split("?")[0];
  if (cleanHref === "/") return pathname === "/";
  return pathname === cleanHref || pathname.startsWith(cleanHref + "/");
}

function isGroupActive(group: NavGroup, pathname: string): boolean {
  return group.children.some((c) => isItemActive(c.href, pathname));
}

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { mode } = useMode();
  const canEdit = mode === "hq";

  const { groups: customGroups, addGroup, addItem, removeGroup, slugExists } =
    useCustomMenus();

  const [openGroupId, setOpenGroupId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) {
        setOpenGroupId(null);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // 페이지 이동 시 드롭다운 닫기
  useEffect(() => {
    setOpenGroupId(null);
    setMobileOpen(false);
  }, [pathname]);

  // 사용자 정의 그룹
  const customNav: NavGroup[] = useMemo(
    () =>
      customGroups.map((g) => ({
        type: "group",
        id: g.id,
        label: g.label,
        icon: g.icon,
        href: g.items[0] ? `/guide/custom/${g.items[0].slug}` : "/guide",
        children: g.items.map((it) => ({
          href: `/guide/custom/${it.slug}`,
          label: it.label,
        })),
        custom: true,
      })),
    [customGroups],
  );

  const allNav: NavItem[] = useMemo(
    () => [...NAV_TOP, ...customNav, ...NAV_BOTTOM],
    [customNav],
  );

  const handleAddGroup = (input: {
    groupLabel: string;
    icon: string;
    pageLabel: string;
  }) => {
    const baseSlug = slugify(input.pageLabel) || `page-${Date.now()}`;
    let finalSlug = baseSlug;
    let i = 1;
    while (slugExists(finalSlug)) {
      finalSlug = `${baseSlug}-${i++}`;
    }
    addGroup({
      label: input.groupLabel,
      icon: input.icon || "📄",
      firstItem: {
        slug: finalSlug,
        label: input.pageLabel,
        pageTitle: input.pageLabel,
        body:
          "이 페이지는 본점 외환사업부에서 직접 작성합니다.\n\n오른쪽 위 “✏️ 페이지 수정” 버튼을 눌러 본문을 채우세요.",
        source: "",
      },
    });
    setShowAddForm(false);
    router.push(`/guide/custom/${finalSlug}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border print:hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* 상단 줄 — 로고 + 모바일 햄버거 + 데스크톱 메뉴 + 모드 토글 */}
        <div className="flex items-center h-14 gap-3">
          {/* 로고 */}
          <Link
            href="/"
            className="flex items-center gap-1.5 shrink-0 hover:opacity-80 transition"
          >
            <span className="text-lg">🏦</span>
            <div className="leading-none">
              <p className="font-bold text-primary text-sm">외환 길잡이</p>
              <p className="text-[9px] text-charcoal-soft mt-0.5">
                iM뱅크 외환 업무 가이드
              </p>
            </div>
          </Link>

          {/* 데스크톱 메뉴 */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 ml-2" ref={dropdownRef}>
            {allNav.map((item) => {
              if (item.type === "item") {
                const active = isItemActive(item.href, pathname);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs transition whitespace-nowrap",
                      active
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-charcoal-soft hover:bg-offwhite hover:text-charcoal",
                    ].join(" ")}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              }

              const groupActive = isGroupActive(item, pathname);
              const isOpen = openGroupId === item.id;

              return (
                <div key={item.id} className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenGroupId(isOpen ? null : item.id);
                    }}
                    className={[
                      "flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs transition whitespace-nowrap",
                      groupActive || isOpen
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-charcoal-soft hover:bg-offwhite hover:text-charcoal",
                    ].join(" ")}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                    {item.custom && (
                      <span className="text-[8px] uppercase tracking-wide bg-primary/15 text-primary px-1 rounded">
                        new
                      </span>
                    )}
                    <span className="text-[9px] opacity-60">
                      {isOpen ? "▴" : "▾"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="absolute left-0 top-full mt-1 min-w-56 bg-white border border-border rounded-lg shadow-lg overflow-hidden">
                      <Link
                        href={item.href}
                        onClick={() => setOpenGroupId(null)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold border-b border-border bg-primary/5 hover:bg-primary/10 transition"
                      >
                        <span>{item.icon}</span>
                        <span className="text-primary">
                          {item.label} 진입판
                        </span>
                      </Link>
                      {item.children.map((c) => {
                        const childActive = isItemActive(c.href, pathname);
                        return (
                          <Link
                            key={c.href}
                            href={c.href}
                            onClick={() => setOpenGroupId(null)}
                            className={[
                              "block px-3 py-2 text-xs transition",
                              childActive
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-charcoal-soft hover:bg-offwhite hover:text-charcoal",
                            ].join(" ")}
                          >
                            {c.label}
                          </Link>
                        );
                      })}
                      {canEdit && item.custom && (
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                `"${item.label}" 업무 그룹과 그 안의 모든 가이드 페이지를 삭제할까요?`,
                              )
                            ) {
                              removeGroup(item.id);
                            }
                          }}
                          className="w-full text-left px-3 py-2 text-[11px] text-danger hover:bg-danger/5 border-t border-border transition"
                        >
                          ✕ 이 그룹 삭제
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* 본점 모드 — 새 업무 추가 */}
            {canEdit && (
              <div className="relative ml-1">
                {showAddForm ? (
                  <div className="absolute right-0 top-0 z-10">
                    <AddGroupForm
                      onSubmit={handleAddGroup}
                      onCancel={() => setShowAddForm(false)}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="text-[11px] text-charcoal-soft hover:text-primary border border-dashed border-border px-2 py-1.5 rounded-md transition"
                  >
                    ➕ 새 업무
                  </button>
                )}
              </div>
            )}
          </nav>

          {/* 모드 토글 */}
          <div className="ml-auto shrink-0">
            <CompactModeToggle />
          </div>

          {/* 모바일 햄버거 */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-xl text-charcoal-soft hover:text-primary"
            aria-label="메뉴 토글"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 — 풀 화면 슬라이드다운 */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-border max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          <nav className="px-4 py-3 space-y-2">
            {allNav.map((item) => {
              if (item.type === "item") {
                const active = isItemActive(item.href, pathname);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition",
                      active
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-charcoal hover:bg-offwhite",
                    ].join(" ")}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              }
              return (
                <details
                  key={item.id}
                  open={isGroupActive(item, pathname)}
                  className="border border-border rounded-md"
                >
                  <summary className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm font-medium">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                    {item.custom && (
                      <span className="text-[8px] uppercase tracking-wide bg-primary/15 text-primary px-1 rounded">
                        new
                      </span>
                    )}
                  </summary>
                  <div className="border-t border-border bg-offwhite/40">
                    <Link
                      href={item.href}
                      className="block px-5 py-2 text-xs text-primary hover:bg-primary/10 transition"
                    >
                      → 진입판
                    </Link>
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="block px-5 py-2 text-xs text-charcoal-soft hover:text-charcoal hover:bg-white transition"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </details>
              );
            })}
            {canEdit && (
              <>
                {showAddForm ? (
                  <AddGroupForm
                    onSubmit={handleAddGroup}
                    onCancel={() => setShowAddForm(false)}
                  />
                ) : (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="w-full text-left px-3 py-2 text-xs text-charcoal-soft hover:text-primary border border-dashed border-border rounded-md transition"
                  >
                    ➕ 새 업무 추가 (본점)
                  </button>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

function CompactModeToggle() {
  const { mode, setMode } = useMode();
  const options: { value: Mode; label: string; icon: string }[] = [
    { value: "branch", label: "영업점", icon: "🏢" },
    { value: "hq", label: "본점", icon: "🏛️" },
  ];

  return (
    <div className="flex gap-1 bg-offwhite border border-border rounded-md p-0.5">
      {options.map((opt) => {
        const active = mode === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setMode(opt.value)}
            className={[
              "text-[11px] px-2 py-1 rounded transition flex items-center gap-1",
              active
                ? "bg-primary text-white font-medium"
                : "text-charcoal-soft hover:text-charcoal",
            ].join(" ")}
            aria-pressed={active}
          >
            <span className="text-xs leading-none">{opt.icon}</span>
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function AddGroupForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (input: {
    groupLabel: string;
    icon: string;
    pageLabel: string;
  }) => void;
  onCancel: () => void;
}) {
  const [groupLabel, setGroupLabel] = useState("");
  const [icon, setIcon] = useState("📄");
  const [pageLabel, setPageLabel] = useState("");

  const submit = () => {
    if (!groupLabel.trim()) return;
    onSubmit({
      groupLabel: groupLabel.trim(),
      icon: icon.trim() || "📄",
      pageLabel: pageLabel.trim() || `${groupLabel.trim()} 가이드`,
    });
  };

  return (
    <div className="bg-white border border-primary/40 rounded-lg p-3 space-y-2 shadow-lg w-72">
      <p className="text-[10px] text-charcoal-soft font-medium uppercase tracking-wide">
        새 업무 그룹 추가
      </p>
      <div className="flex gap-1.5">
        <input
          type="text"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          placeholder="📄"
          maxLength={2}
          className="w-10 text-center px-1 py-1.5 border border-border rounded text-sm focus:outline-none focus:border-primary"
          aria-label="아이콘"
        />
        <input
          type="text"
          value={groupLabel}
          onChange={(e) => setGroupLabel(e.target.value)}
          placeholder="업무 이름 (예: 외환대출)"
          className="flex-1 px-2 py-1.5 border border-border rounded text-xs focus:outline-none focus:border-primary"
          autoFocus
        />
      </div>
      <input
        type="text"
        value={pageLabel}
        onChange={(e) => setPageLabel(e.target.value)}
        placeholder="첫 가이드 페이지 제목 (선택)"
        className="w-full px-2 py-1.5 border border-border rounded text-xs focus:outline-none focus:border-primary"
      />
      <div className="flex items-center justify-end gap-1">
        <button
          onClick={onCancel}
          className="text-[11px] text-charcoal-soft hover:text-charcoal px-2 py-1"
        >
          취소
        </button>
        <button
          onClick={submit}
          disabled={!groupLabel.trim()}
          className="bg-primary hover:bg-primary-dark text-white px-2.5 py-1 rounded text-[11px] font-medium transition disabled:opacity-50"
        >
          추가
        </button>
      </div>
    </div>
  );
}
