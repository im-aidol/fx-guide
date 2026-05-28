"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BUSINESS_GUIDE } from "@/lib/data";
import type {
  BusinessGuideCategory,
  BusinessGuideItem,
} from "@/lib/types";
import { AdminNote } from "@/components/admin/AdminNote";

// 사유별 가이드 — 표 중심 (영업점 빠른 참조용).
// 검색·카테고리·정렬 가능, 행에서 상세 페이지로 진입.

const CATEGORIES: BusinessGuideCategory[] = [
  "경상거래",
  "자산이전",
  "외국인송금",
  "자본거래",
  "기타",
];

const CATEGORY_RANK: Record<string, number> = Object.fromEntries(
  CATEGORIES.map((c, i) => [c, i]),
);

const DESIGNATION_LABEL: Record<
  BusinessGuideItem["designationMethod"],
  string
> = {
  외화송금신청서로_직접: "신청서로 직접",
  별도_신청서_필요: "별도 신청서",
  지정_불요: "지정 불요",
};

type SortKey = "default" | "title" | "category" | "code";

export default function SendCasesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<BusinessGuideCategory | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("default");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("cat");
    if (cat && (CATEGORIES as readonly string[]).includes(cat)) {
      setActiveCategory(cat as BusinessGuideCategory);
    }
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return BUSINESS_GUIDE.filter((g) => {
      if (activeCategory && g.category !== activeCategory) return false;
      if (!q) return true;
      const blob = [
        g.title,
        g.subtitle ?? "",
        g.transactionCode ?? "",
        g.legalRef,
        g.annualLimit ?? "",
        g.requiredDocs.join(" "),
        g.cautions.join(" "),
        (g.customerScripts ?? []).join(" "),
        (g.relatedTerms ?? []).join(" "),
        g.source,
      ]
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    });
  }, [search, activeCategory]);

  const sorted = useMemo(() => {
    if (sortKey === "default") {
      return [...filtered].sort((a, b) => {
        const ra = CATEGORY_RANK[a.category] ?? 99;
        const rb = CATEGORY_RANK[b.category] ?? 99;
        if (ra !== rb) return ra - rb;
        return a.title.localeCompare(b.title, "ko");
      });
    }
    if (sortKey === "title") {
      return [...filtered].sort((a, b) =>
        a.title.localeCompare(b.title, "ko"),
      );
    }
    if (sortKey === "category") {
      return [...filtered].sort(
        (a, b) =>
          (CATEGORY_RANK[a.category] ?? 99) -
          (CATEGORY_RANK[b.category] ?? 99),
      );
    }
    if (sortKey === "code") {
      return [...filtered].sort((a, b) =>
        (a.transactionCode ?? "zzz").localeCompare(
          b.transactionCode ?? "zzz",
          "ko",
        ),
      );
    }
    return filtered;
  }, [filtered, sortKey]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    BUSINESS_GUIDE.forEach((g) => {
      map[g.category] = (map[g.category] ?? 0) + 1;
    });
    return map;
  }, []);

  return (
    <div className="max-w-[clamp(1024px,94vw,1680px)] mx-auto px-6 py-8">
      <nav className="text-xs text-charcoal-soft mb-3 flex items-center gap-1">
        <Link href="/guide" className="hover:text-primary">
          가이드 홈
        </Link>
        <span>›</span>
        <Link href="/guide/send" className="hover:text-primary">
          당발송금
        </Link>
        <span>›</span>
        <span className="text-charcoal">사유별 가이드</span>
      </nav>

      <header className="mb-4">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          📋 당발송금 · 사유별 가이드
        </p>
        <h1 className="text-2xl font-bold mb-1">
          사유별 가이드 ({BUSINESS_GUIDE.length}개)
        </h1>
        <p className="text-xs text-charcoal-soft">
          영업점 빠른 참조 — 검색·카테고리 필터·정렬 가능. 행 클릭 시 필요
          서류·주의·응대 멘트 상세 페이지로 이동.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-send-cases" />

      {/* 검색·필터 */}
      <div className="bg-white border border-border rounded-xl p-3 mb-4">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="검색 — 유학 / 02 / 4-3조 / 인보이스 / 10만불 / 해외이주비 ..."
            className="w-full pl-9 pr-9 py-2.5 border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
            autoFocus
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-soft pointer-events-none">
            🔍
          </span>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-soft hover:text-charcoal text-sm"
              aria-label="검색 지우기"
            >
              ✕
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          <Chip
            label={`전체 ${BUSINESS_GUIDE.length}`}
            active={activeCategory === null}
            onClick={() => setActiveCategory(null)}
          />
          {CATEGORIES.map((c) => {
            const count = counts[c] ?? 0;
            if (count === 0) return null;
            return (
              <Chip
                key={c}
                label={`${c} ${count}`}
                active={activeCategory === c}
                onClick={() =>
                  setActiveCategory(activeCategory === c ? null : c)
                }
              />
            );
          })}
        </div>
      </div>

      {/* 표 */}
      <section className="mb-4">
        <div className="flex items-baseline justify-between mb-2 px-1">
          <h2 className="text-[10px] font-medium text-charcoal-soft uppercase tracking-wide">
            📊 결과 {sorted.length}개
          </h2>
          <div className="flex items-center gap-1 text-[10px] text-charcoal-soft">
            <span>정렬</span>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="bg-white border border-border rounded px-1.5 py-0.5 text-[11px] focus:outline-none focus:border-primary"
            >
              <option value="default">기본 (카테고리)</option>
              <option value="title">사유명 가나다순</option>
              <option value="category">카테고리만</option>
              <option value="code">거래코드</option>
            </select>
          </div>
        </div>
        <CasesTable items={sorted} />
      </section>

      {/* 도움말 */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Link
          href="/simulator"
          className="bg-primary/5 border border-primary/30 rounded-xl p-4 hover:border-primary transition group"
        >
          <p className="font-bold text-sm group-hover:text-primary transition mb-0.5">
            🎯 사유를 모르시면 → 당발송금 도우미
          </p>
          <p className="text-xs text-charcoal-soft leading-relaxed">
            고객 답변 따라 클릭으로 좁혀가는 트리식 가이드. 사유 분기 → 거래코드·
            서류·응대 멘트까지 자동 도출
          </p>
        </Link>
        <Link
          href="/guide/send"
          className="bg-white border border-border rounded-xl p-4 hover:border-primary transition group"
        >
          <p className="font-bold text-sm group-hover:text-primary transition mb-0.5">
            📤 당발송금 전체보기
          </p>
          <p className="text-xs text-charcoal-soft leading-relaxed">
            한도·필수 기재국·송금 채널(SWIFT·BARO·WU) 등 다른 화면 둘러보기
          </p>
        </Link>
      </div>
    </div>
  );
}

// ─── 표 ───
function CasesTable({ items }: { items: BusinessGuideItem[] }) {
  if (items.length === 0) {
    return (
      <div className="bg-white border border-border rounded-xl p-6 text-center text-sm text-charcoal-soft">
        일치하는 사유가 없습니다. 다른 키워드로 검색해 보세요.
      </div>
    );
  }
  return (
    <div className="overflow-x-auto bg-white border border-border rounded-xl">
      <table className="w-full text-xs">
        <thead className="bg-offwhite text-charcoal-soft">
          <tr className="border-b border-border">
            <Th className="sticky left-0 bg-offwhite z-10 min-w-44">사유</Th>
            <Th className="w-24">카테고리</Th>
            <Th className="w-32">거래코드</Th>
            <Th>근거 조항</Th>
            <Th className="w-24">은행 지정</Th>
            <Th>한도</Th>
            <Th className="sticky right-0 bg-offwhite z-10 w-16 text-right">
              상세
            </Th>
          </tr>
        </thead>
        <tbody className="text-charcoal">
          {items.map((g, i) => {
            const bg = i % 2 === 1 ? "bg-offwhite/50" : "bg-white";
            const designation = DESIGNATION_LABEL[g.designationMethod];
            return (
              <tr
                key={g.id}
                className="border-b border-border last:border-0 align-top hover:bg-primary/5 transition"
              >
                <td className={`py-2 px-3 sticky left-0 z-10 ${bg}`}>
                  <Link
                    href={`/guide/send/cases/${g.id}`}
                    className="block leading-tight hover:text-primary"
                  >
                    <span className="font-semibold text-sm">{g.title}</span>
                    {g.subtitle && (
                      <span className="block text-[10px] text-charcoal-soft mt-0.5 leading-snug">
                        {g.subtitle}
                      </span>
                    )}
                  </Link>
                </td>
                <td className="py-2 px-3 text-charcoal-soft whitespace-nowrap">
                  {g.category}
                </td>
                <td className="py-2 px-3 leading-tight font-mono text-[11px]">
                  {g.transactionCode ?? "—"}
                </td>
                <td className="py-2 px-3 leading-tight">{g.legalRef}</td>
                <td className="py-2 px-3 leading-tight">
                  <DesignationBadge method={g.designationMethod}>
                    {designation}
                  </DesignationBadge>
                </td>
                <td className="py-2 px-3 leading-tight text-charcoal-soft">
                  {g.annualLimit ?? "—"}
                </td>
                <td className={`py-2 px-3 sticky right-0 z-10 text-right ${bg}`}>
                  <Link
                    href={`/guide/send/cases/${g.id}`}
                    className="text-primary hover:text-primary-dark font-medium whitespace-nowrap"
                  >
                    보기 →
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={[
        "text-left py-2 px-3 uppercase tracking-wide text-[10px] font-medium",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </th>
  );
}

function DesignationBadge({
  method,
  children,
}: {
  method: BusinessGuideItem["designationMethod"];
  children: React.ReactNode;
}) {
  const cls =
    method === "외화송금신청서로_직접"
      ? "bg-primary/10 text-primary border-primary/30"
      : method === "별도_신청서_필요"
        ? "bg-warn/10 text-charcoal border-warn/40"
        : "bg-offwhite text-charcoal-soft border-border";
  return (
    <span
      className={["text-[10px] px-1.5 py-0.5 rounded-full border whitespace-nowrap", cls].join(" ")}
    >
      {children}
    </span>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "text-xs px-2.5 py-1 rounded-full border transition",
        active
          ? "bg-primary text-white border-primary"
          : "bg-white border-border text-charcoal-soft hover:border-primary",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
