"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useMode, type Mode } from "@/components/Mode";
import { useCustomMenus, slugify } from "@/lib/custom-menus";

// 사이드바 메뉴는 단일 항목(item)과 자식 항목을 가진 그룹(group) 두 가지.
// 그룹은 1차 메뉴 클릭 시 href로 이동하면서 자동 펼침, 자식 페이지에 있을 때도 펼침.
// 본점 직원이 본점 모드에서 직접 "새 업무 추가"로 사용자 정의 그룹·페이지를 만들 수 있음.
type NavGroup = {
  type: "group";
  id: string;
  label: string;
  icon: string;
  href: string;
  children: { href: string; label: string }[];
  custom?: boolean; // 본점이 직접 만든 그룹 표시 (삭제 버튼 노출)
};

type NavItem =
  | { type: "item"; href: string; label: string; icon: string }
  | NavGroup;

const NAV_TOP: NavItem[] = [
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
];

const NAV_BOTTOM: NavItem[] = [
  { type: "item", href: "/notices", label: "공지사항", icon: "📣" },
  { type: "item", href: "/qna", label: "익명 Q&A", icon: "💬" },
  { type: "item", href: "/faq", label: "FAQ", icon: "❓" },
  { type: "item", href: "/glossary", label: "외환 용어집", icon: "📖" },
];

function isItemActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function isGroupActive(group: NavGroup, pathname: string): boolean {
  return group.children.some((c) => isItemActive(c.href, pathname));
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { mode } = useMode();
  const canEdit = mode === "hq";
  const { groups: customGroups, addGroup, removeGroup, slugExists } =
    useCustomMenus();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // 사용자 정의 그룹을 NavGroup 형태로 변환
  const customNav: NavGroup[] = useMemo(
    () =>
      customGroups.map((g) => ({
        type: "group",
        id: g.id,
        label: g.label,
        icon: g.icon,
        href: g.items[0]
          ? `/guide/custom/${g.items[0].slug}`
          : "/guide",
        children: g.items.map((it) => ({
          href: `/guide/custom/${it.slug}`,
          label: it.label,
        })),
        custom: true,
      })),
    [customGroups],
  );

  const fullNav: NavItem[] = useMemo(
    () => [...NAV_TOP, ...customNav, ...NAV_BOTTOM],
    [customNav],
  );

  const activeGroupId = useMemo(() => {
    for (const item of fullNav) {
      if (item.type === "group" && isGroupActive(item, pathname)) {
        return item.id;
      }
    }
    return null;
  }, [fullNav, pathname]);

  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(activeGroupId ? [activeGroupId] : []),
  );

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
          "이 페이지는 본점 외환사업부에서 직접 작성합니다.\n\n" +
          "오른쪽 위 “✏️ 페이지 수정” 버튼을 눌러 본문을 채우세요.\n\n" +
          "## 작성 팁\n" +
          "- 외환규정 조항·iM뱅크 안내·약관 등 1차 자료 출처를 함께 적어주세요.\n" +
          "- **bold**, # 헤딩, --- 구분선, - 리스트 사용 가능합니다.\n",
        source: "",
      },
    });
    setShowAddForm(false);
    router.push(`/guide/custom/${finalSlug}`);
  };

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
            {NAV_TOP.map((item) =>
              renderNavNode(
                item,
                pathname,
                expandedIds,
                toggleGroup,
                closeMobile,
                canEdit,
                removeGroup,
              ),
            )}

            {customNav.map((g) =>
              renderNavNode(
                g,
                pathname,
                expandedIds,
                toggleGroup,
                closeMobile,
                canEdit,
                removeGroup,
              ),
            )}

            {canEdit && (
              <li className="pt-1">
                {showAddForm ? (
                  <AddGroupForm
                    onSubmit={handleAddGroup}
                    onCancel={() => setShowAddForm(false)}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddForm(true)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-charcoal-soft hover:bg-offwhite hover:text-primary border border-dashed border-border transition"
                  >
                    <span>➕</span>
                    <span>새 업무 추가 (본점)</span>
                  </button>
                )}
              </li>
            )}

            <li className="pt-2 mt-1 border-t border-border" aria-hidden />

            {NAV_BOTTOM.map((item) =>
              renderNavNode(
                item,
                pathname,
                expandedIds,
                toggleGroup,
                closeMobile,
                canEdit,
                removeGroup,
              ),
            )}
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

function renderNavNode(
  item: NavItem,
  pathname: string,
  expandedIds: Set<string>,
  toggleGroup: (id: string) => void,
  closeMobile: () => void,
  canEdit: boolean,
  removeGroup: (id: string) => void,
) {
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
          <span className="text-base leading-none">{item.icon}</span>
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
          <span className="text-base leading-none">{item.icon}</span>
          <span className="truncate">{item.label}</span>
          {item.custom && (
            <span
              title="본점이 추가한 업무"
              className="text-[9px] uppercase tracking-wide bg-primary/15 text-primary px-1 rounded shrink-0"
            >
              new
            </span>
          )}
        </Link>
        {canEdit && item.custom && (
          <button
            type="button"
            onClick={() => {
              if (
                confirm(
                  `"${item.label}" 업무 그룹과 그 안의 모든 가이드 페이지를 삭제할까요?`,
                )
              ) {
                removeGroup(item.id);
              }
            }}
            className="px-1.5 py-2 text-xs text-charcoal-soft hover:text-danger shrink-0"
            aria-label={`${item.label} 그룹 삭제`}
          >
            ✕
          </button>
        )}
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
    <div className="bg-offwhite border border-primary/40 rounded-lg p-2.5 space-y-2">
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
          className="w-10 text-center px-1 py-1.5 border border-border rounded text-sm focus:outline-none focus:border-primary bg-white"
          aria-label="아이콘 (이모지)"
        />
        <input
          type="text"
          value={groupLabel}
          onChange={(e) => setGroupLabel(e.target.value)}
          placeholder="업무 이름 (예: 외환대출)"
          className="flex-1 px-2 py-1.5 border border-border rounded text-xs focus:outline-none focus:border-primary bg-white"
          autoFocus
        />
      </div>
      <input
        type="text"
        value={pageLabel}
        onChange={(e) => setPageLabel(e.target.value)}
        placeholder="첫 가이드 페이지 제목 (선택)"
        className="w-full px-2 py-1.5 border border-border rounded text-xs focus:outline-none focus:border-primary bg-white"
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
          추가 + 페이지 열기
        </button>
      </div>
    </div>
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
