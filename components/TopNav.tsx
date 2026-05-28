"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMode, type Mode } from "@/components/Mode";
import { useCustomMenus, slugify } from "@/lib/custom-menus";

// 상단 바 네비게이션.
// 1차 메뉴는 가로 정렬, 그룹은 hover/focus 시 드롭다운.
// 모바일은 햄버거 → 풀스크린 details 메뉴.

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

// 1차 메뉴 통일: 홈 + 6대 업무 그룹 + 자료·공지 그룹.
// 모두 같은 형태(아이콘 + 4글자 명사구)로 가독성·일관성.
const NAV: NavItem[] = [
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
    children: [
      { href: "/guide/trade-finance/overview", label: "🌐 수출입 업무 개요" },
      { href: "/guide/trade-finance/import-lc", label: "📥 수입 신용장" },
      { href: "/guide/trade-finance/export-lc", label: "📤 수출 신용장" },
      { href: "/guide/trade-finance/collection", label: "🔄 추심 (D/P·D/A)" },
      { href: "/guide/trade-finance/flow-lc", label: "🗺️ 신용장 거래 흐름도" },
      {
        href: "/guide/trade-finance/flow-collection",
        label: "🔁 추심 거래 흐름도",
      },
      { href: "/guide/trade-finance/lc-fields", label: "📑 신용장 19개 필드" },
      { href: "/guide/trade-finance/lc-checker", label: "🔍 신용장 하자 점검" },
    ],
  },
  {
    type: "group",
    id: "resources",
    label: "자료·공지",
    icon: "📋",
    href: "/notices",
    children: [
      { href: "/notices", label: "📣 공지사항" },
      { href: "/qna", label: "💬 익명 Q&A" },
      { href: "/faq", label: "❓ FAQ" },
      { href: "/glossary", label: "📖 외환 용어집" },
    ],
  },
];

function isItemActive(href: string, pathname: string): boolean {
  const cleanHref = href.split("#")[0].split("?")[0];
  if (cleanHref === "/") return pathname === "/";
  return pathname === cleanHref || pathname.startsWith(cleanHref + "/");
}

function isGroupActive(group: NavGroup, pathname: string): boolean {
  if (group.children.some((c) => isItemActive(c.href, pathname))) return true;
  return isItemActive(group.href, pathname);
}

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { mode } = useMode();
  const canEdit = mode === "hq";

  const { groups: customGroups, addGroup, removeGroup, slugExists } =
    useCustomMenus();

  const [openGroupId, setOpenGroupId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // hover 닫힘에 살짝 딜레이 — 자식 메뉴로 이동할 때 사라지지 않도록
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openGroup = (id: string) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenGroupId(id);
  };

  const scheduleClose = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setOpenGroupId(null);
    }, 120);
  };

  // 페이지 이동 시 드롭다운 닫기
  useEffect(() => {
    setOpenGroupId(null);
    setMobileOpen(false);
  }, [pathname]);

  // Escape 키로 닫기
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenGroupId(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // 사용자 정의 그룹 → NavGroup
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

  // 자료·공지 그룹 앞에 사용자 정의 그룹 끼워 넣기
  const allNav: NavItem[] = useMemo(() => {
    const resourcesIndex = NAV.findIndex(
      (n) => n.type === "group" && (n as NavGroup).id === "resources",
    );
    return [
      ...NAV.slice(0, resourcesIndex),
      ...customNav,
      ...NAV.slice(resourcesIndex),
    ];
  }, [customNav]);

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-border print:hidden">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
        <div className="flex items-center h-14 gap-3">
          {/* 로고 */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 hover:opacity-80 transition"
          >
            <span className="text-lg">🏦</span>
            <div className="leading-none">
              <p className="font-bold text-primary text-sm">외환 길잡이</p>
              <p className="text-[9px] text-charcoal-soft mt-0.5 hidden sm:block">
                iM뱅크 외환 업무 가이드
              </p>
            </div>
          </Link>

          {/* 데스크톱 메뉴 */}
          <nav className="hidden lg:flex items-stretch flex-1 ml-3">
            {allNav.map((item) => {
              if (item.type === "item") {
                const active = isItemActive(item.href, pathname);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "flex items-center gap-1.5 px-3 text-xs whitespace-nowrap transition relative",
                      active
                        ? "text-primary font-semibold"
                        : "text-charcoal-soft hover:text-charcoal",
                    ].join(" ")}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                    {active && (
                      <span className="absolute left-2 right-2 -bottom-px h-0.5 bg-primary rounded-t" />
                    )}
                  </Link>
                );
              }

              const groupActive = isGroupActive(item, pathname);
              const isOpen = openGroupId === item.id;

              return (
                <div
                  key={item.id}
                  className="relative flex items-stretch"
                  onMouseEnter={() => openGroup(item.id)}
                  onMouseLeave={scheduleClose}
                >
                  <Link
                    href={item.href}
                    onFocus={() => openGroup(item.id)}
                    className={[
                      "flex items-center gap-1.5 px-3 text-xs whitespace-nowrap transition relative",
                      groupActive || isOpen
                        ? "text-primary font-semibold"
                        : "text-charcoal-soft hover:text-charcoal",
                    ].join(" ")}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                    {item.custom && (
                      <span className="text-[8px] uppercase tracking-wide bg-primary/15 text-primary px-1 rounded">
                        new
                      </span>
                    )}
                    <span
                      className={[
                        "text-[8px] transition-transform",
                        isOpen ? "rotate-180" : "",
                      ].join(" ")}
                    >
                      ▾
                    </span>
                    {(groupActive || isOpen) && (
                      <span className="absolute left-2 right-2 -bottom-px h-0.5 bg-primary rounded-t" />
                    )}
                  </Link>

                  {/* 드롭다운 */}
                  <div
                    className={[
                      "absolute left-0 top-full pt-1.5 z-50 transition-opacity duration-150",
                      isOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none",
                    ].join(" ")}
                  >
                    <div className="min-w-60 bg-white border border-border rounded-xl shadow-xl ring-1 ring-black/5 overflow-hidden py-1.5">
                      {item.children.map((c, idx) => {
                        const childActive = isItemActive(c.href, pathname);
                        return (
                          <Link
                            key={c.href}
                            href={c.href}
                            className={[
                              "flex items-center px-4 py-2 text-xs transition group",
                              childActive
                                ? "bg-primary/5 text-primary font-medium"
                                : "text-charcoal-soft hover:bg-offwhite hover:text-charcoal",
                            ].join(" ")}
                          >
                            <span className="flex-1">{c.label}</span>
                            <span className="text-[10px] text-charcoal-soft opacity-0 group-hover:opacity-100 transition">
                              →
                            </span>
                          </Link>
                        );
                      })}
                      <div className="border-t border-border mt-1 pt-1">
                        <Link
                          href={item.href}
                          className="flex items-center px-4 py-2 text-[11px] text-primary hover:bg-primary/5 transition"
                        >
                          <span className="flex-1">
                            {item.label} 전체보기
                          </span>
                          <span className="opacity-60">→</span>
                        </Link>
                      </div>
                      {canEdit && item.custom && (
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                `"${item.label}" 업무 그룹과 그 안의 모든 가이드 페이지를 삭제할까요?`,
                              )
                            ) {
                              removeGroup(item.id);
                              setOpenGroupId(null);
                            }
                          }}
                          className="w-full text-left px-4 py-2 text-[11px] text-danger hover:bg-danger/5 border-t border-border transition"
                        >
                          ✕ 이 그룹 삭제
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {canEdit && (
              <div className="relative flex items-center ml-1.5">
                {showAddForm ? (
                  <div className="absolute right-0 top-12 z-50">
                    <AddGroupForm
                      onSubmit={handleAddGroup}
                      onCancel={() => setShowAddForm(false)}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="text-[11px] text-charcoal-soft hover:text-primary border border-dashed border-border px-2.5 py-1 rounded-md transition"
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

      {/* 모바일 메뉴 */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-border max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          <nav className="px-4 py-3 space-y-1.5">
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
                  className="border border-border rounded-md overflow-hidden"
                >
                  <summary className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm font-medium">
                    <span>{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    {item.custom && (
                      <span className="text-[8px] uppercase tracking-wide bg-primary/15 text-primary px-1 rounded">
                        new
                      </span>
                    )}
                  </summary>
                  <div className="border-t border-border bg-offwhite/40">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="block px-5 py-2 text-xs text-charcoal-soft hover:text-charcoal hover:bg-white transition"
                      >
                        {c.label}
                      </Link>
                    ))}
                    <Link
                      href={item.href}
                      className="block px-5 py-2 text-[11px] text-primary hover:bg-primary/10 border-t border-border transition"
                    >
                      → {item.label} 전체보기
                    </Link>
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
    <div className="flex gap-0.5 bg-offwhite border border-border rounded-md p-0.5">
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
            <span className="hidden sm:inline">{opt.label}</span>
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
    <div className="bg-white border border-primary/40 rounded-lg p-3 space-y-2 shadow-xl ring-1 ring-black/5 w-72">
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
