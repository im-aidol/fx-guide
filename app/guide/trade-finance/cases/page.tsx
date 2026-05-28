"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminNote } from "@/components/admin/AdminNote";
import {
  TRADE_SCENARIOS,
  type TradeScenarioCategory,
  type TradeScenarioSubCategory,
} from "@/lib/data/trade-scenarios";

// 무역금융 상황별 가이드 — 표 중심 (영업점 빠른 참조용).

const CATEGORIES: { id: TradeScenarioCategory; label: string }[] = [
  { id: "import", label: "수입" },
  { id: "export", label: "수출" },
];

const SUB_LABEL: Record<TradeScenarioSubCategory, string> = {
  "lc-open": "신용장 개설",
  "lc-amend": "조건변경",
  "lc-receive": "서류 도착·결제",
  "lc-issue": "통지·교부",
  nego: "매입 (NEGO)",
  collection: "추심",
  "lg-tr": "L/G·T/R",
  "tt-finance": "T/T수입금융",
  default: "부도·연체",
};

type SortKey = "default" | "title" | "category";

export default function TradeCasesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<TradeScenarioCategory | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("default");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return TRADE_SCENARIOS.filter((s) => {
      if (activeCategory && s.category !== activeCategory) return false;
      if (!q) return true;
      const blob = [
        s.title,
        s.customerSays,
        s.summary,
        s.whatToBring.join(" "),
        s.checklist.map((c) => `${c.label} ${c.detail ?? ""}`).join(" "),
        s.procedure.join(" "),
        s.timing ?? "",
        (s.fees ?? []).join(" "),
        (s.cautions ?? []).join(" "),
        s.scripts.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    });
  }, [search, activeCategory]);

  const sorted = useMemo(() => {
    if (sortKey === "default") {
      return [...filtered].sort((a, b) => {
        if (a.category !== b.category)
          return a.category === "import" ? -1 : 1;
        return a.title.localeCompare(b.title, "ko");
      });
    }
    if (sortKey === "title") {
      return [...filtered].sort((a, b) =>
        a.title.localeCompare(b.title, "ko"),
      );
    }
    if (sortKey === "category") {
      return [...filtered].sort((a, b) =>
        a.category.localeCompare(b.category),
      );
    }
    return filtered;
  }, [filtered, sortKey]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    TRADE_SCENARIOS.forEach((s) => {
      map[s.category] = (map[s.category] ?? 0) + 1;
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
        <Link href="/guide/trade-finance" className="hover:text-primary">
          무역금융
        </Link>
        <span>›</span>
        <span className="text-charcoal">상황별 가이드</span>
      </nav>

      <header className="mb-4">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          📋 무역금융 · 상황별 가이드
        </p>
        <h1 className="text-2xl font-bold mb-1">
          상황별 가이드 ({TRADE_SCENARIOS.length}개)
        </h1>
        <p className="text-xs text-charcoal-soft">
          영업점 빠른 참조 — 검색·카테고리 필터·정렬 가능. 행 클릭 시 가져왔어야 할 서류·점검·절차·응대 멘트 상세 페이지.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-trade-cases" />

      {/* 검색·필터 */}
      <div className="bg-white border border-border rounded-xl p-3 mb-4">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="검색 — 개설 / L/G / D/A / 하자 / 만기 / 매입 / T/T수입금융 / 부도 ..."
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
            label={`전체 ${TRADE_SCENARIOS.length}`}
            active={activeCategory === null}
            onClick={() => setActiveCategory(null)}
          />
          {CATEGORIES.map((c) => {
            const count = counts[c.id] ?? 0;
            return (
              <Chip
                key={c.id}
                label={`${c.label} ${count}`}
                active={activeCategory === c.id}
                onClick={() =>
                  setActiveCategory(activeCategory === c.id ? null : c.id)
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
              <option value="default">기본 (수입 → 수출)</option>
              <option value="title">제목 가나다순</option>
              <option value="category">카테고리</option>
            </select>
          </div>
        </div>

        {sorted.length === 0 ? (
          <div className="bg-white border border-border rounded-xl p-6 text-center text-sm text-charcoal-soft">
            일치하는 시나리오가 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto bg-white border border-border rounded-xl">
            <table className="w-full text-xs">
              <thead className="bg-offwhite text-charcoal-soft">
                <tr className="border-b border-border">
                  <Th className="w-16">유형</Th>
                  <Th className="w-32">분류</Th>
                  <Th className="min-w-48">상황</Th>
                  <Th>고객 멘트 · 요약</Th>
                  <Th className="w-16 text-right">상세</Th>
                </tr>
              </thead>
              <tbody className="text-charcoal">
                {sorted.map((s, i) => (
                  <tr
                    key={s.id}
                    className={[
                      "border-b border-border last:border-0 align-top hover:bg-primary/5 transition",
                      i % 2 === 1 ? "bg-offwhite/30" : "",
                    ].join(" ")}
                  >
                    <td className="py-2 px-3">
                      <span
                        className={[
                          "text-[10px] px-1.5 py-0.5 rounded-full border whitespace-nowrap",
                          s.category === "import"
                            ? "bg-primary/10 text-primary border-primary/30"
                            : "bg-warn/10 text-warn border-warn/30",
                        ].join(" ")}
                      >
                        {s.category === "import" ? "📥 수입" : "📤 수출"}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-charcoal-soft whitespace-nowrap">
                      {SUB_LABEL[s.subCategory]}
                    </td>
                    <td className="py-2 px-3">
                      <Link
                        href={`/guide/trade-finance/cases/${s.id}`}
                        className="block hover:text-primary leading-tight"
                      >
                        <span className="font-semibold text-sm">{s.title}</span>
                      </Link>
                    </td>
                    <td className="py-2 px-3 text-charcoal-soft leading-relaxed">
                      <p className="text-[11px] italic">💬 {s.customerSays}</p>
                      <p className="text-[11px] mt-1">{s.summary}</p>
                    </td>
                    <td className="py-2 px-3 text-right whitespace-nowrap">
                      <Link
                        href={`/guide/trade-finance/cases/${s.id}`}
                        className="text-primary hover:text-primary-dark font-medium"
                      >
                        보기 →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 도움말 */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Link
          href="/guide/trade-finance/desk"
          className="bg-primary/5 border border-primary/30 rounded-xl p-4 hover:border-primary transition group"
        >
          <p className="font-bold text-sm group-hover:text-primary transition mb-0.5">
            🎯 상황을 모르시면 → 무역금융 영업점 도우미
          </p>
          <p className="text-xs text-charcoal-soft leading-relaxed">
            손님 답변 따라 클릭으로 좁혀가는 트리식 가이드. 수입/수출 → 시나리오 → 가져온 서류·점검·응대 멘트.
          </p>
        </Link>
        <Link
          href="/guide/trade-finance"
          className="bg-white border border-border rounded-xl p-4 hover:border-primary transition group"
        >
          <p className="font-bold text-sm group-hover:text-primary transition mb-0.5">
            🏭 무역금융 진입판 전체보기
          </p>
          <p className="text-xs text-charcoal-soft leading-relaxed">
            학습용 상세 가이드 6종 + 도구 5종 — 신용장·추심·흐름도·필드·하자 점검·서류 ISBP 등.
          </p>
        </Link>
      </div>
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
