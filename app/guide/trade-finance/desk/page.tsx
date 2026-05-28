"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminNote } from "@/components/admin/AdminNote";
import {
  TRADE_SCENARIOS,
  type TradeScenario,
  type TradeScenarioCategory,
  type TradeScenarioSubCategory,
} from "@/lib/data/trade-scenarios";

// 무역금융 영업점 응대 도우미 — 손님 와서 무엇을 가져왔는지 물으며 좁혀가는 가이드.

const CATEGORY_LABEL: Record<TradeScenarioCategory, { icon: string; title: string; desc: string }> = {
  import: {
    icon: "📥",
    title: "수입 (Importer)",
    desc: "수입상이 찾아왔어요 — 신용장 개설·서류 결제·L/G·T/T수입금융·추심 등",
  },
  export: {
    icon: "📤",
    title: "수출 (Exporter)",
    desc: "수출상이 찾아왔어요 — 신용장 통지·매입(네고)·추심·부도처리 등",
  },
};

const SUB_LABEL: Record<TradeScenarioSubCategory, string> = {
  "lc-open": "신용장 개설",
  "lc-amend": "조건변경",
  "lc-receive": "서류 도착·결제·인수",
  "lc-issue": "통지·교부",
  nego: "매입 (NEGO)",
  collection: "추심 (D/P·D/A)",
  "lg-tr": "L/G·T/R",
  "tt-finance": "T/T수입금융",
  default: "부도·연체·만기",
};

export default function TradeDeskPage() {
  const [category, setCategory] = useState<TradeScenarioCategory | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const scenariosForCategory = useMemo(() => {
    if (!category) return [];
    return TRADE_SCENARIOS.filter((s) => s.category === category);
  }, [category]);

  const grouped = useMemo(() => {
    const map = new Map<TradeScenarioSubCategory, TradeScenario[]>();
    scenariosForCategory.forEach((s) => {
      if (!map.has(s.subCategory)) map.set(s.subCategory, []);
      map.get(s.subCategory)!.push(s);
    });
    return Array.from(map.entries());
  }, [scenariosForCategory]);

  const active = TRADE_SCENARIOS.find((s) => s.id === activeId);

  return (
    <div className="max-w-[clamp(960px,92vw,1440px)] mx-auto px-6 py-8">
      <nav className="text-xs text-charcoal-soft mb-3 flex items-center gap-1">
        <Link href="/guide" className="hover:text-primary">
          가이드 홈
        </Link>
        <span>›</span>
        <Link href="/guide/trade-finance" className="hover:text-primary">
          무역금융
        </Link>
        <span>›</span>
        <span className="text-charcoal">영업점 도우미</span>
      </nav>

      <header className="mb-5">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          🎯 무역금융 · 영업점 응대
        </p>
        <h1 className="text-2xl font-bold mb-1">무역금융 영업점 도우미</h1>
        <p className="text-sm text-charcoal-soft leading-relaxed">
          손님이 무엇을 들고 왔는지 클릭으로 좁혀가는 응대 가이드. 가져왔어야 할 서류·점검 항목·처리 절차·응대 멘트·관련 가이드까지 한 화면.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-trade-desk" />

      {/* Step 1: 수입/수출 선택 */}
      <section className="mb-4">
        <p className="text-[10px] font-medium text-charcoal-soft uppercase tracking-wide mb-2 px-1">
          ① 어떤 손님이세요?
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {(Object.keys(CATEGORY_LABEL) as TradeScenarioCategory[]).map((c) => {
            const info = CATEGORY_LABEL[c];
            const count = TRADE_SCENARIOS.filter((s) => s.category === c).length;
            const isActive = category === c;
            return (
              <button
                key={c}
                onClick={() => {
                  setCategory(c);
                  setActiveId(null);
                }}
                className={[
                  "text-left border-2 rounded-xl p-4 transition",
                  isActive
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white border-border hover:border-primary/50",
                ].join(" ")}
                aria-pressed={isActive}
              >
                <p className="text-lg font-bold mb-0.5">
                  {info.icon} {info.title}
                </p>
                <p
                  className={[
                    "text-xs leading-relaxed",
                    isActive ? "text-white/85" : "text-charcoal-soft",
                  ].join(" ")}
                >
                  {info.desc}
                </p>
                <p
                  className={[
                    "text-[10px] mt-2",
                    isActive ? "text-white/70" : "text-charcoal-soft",
                  ].join(" ")}
                >
                  {count}개 시나리오
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 2: 시나리오 선택 */}
      {category && (
        <section className="mb-4">
          <p className="text-[10px] font-medium text-charcoal-soft uppercase tracking-wide mb-2 px-1">
            ② 무슨 일로 오셨는지 골라주세요
          </p>
          <div className="space-y-3">
            {grouped.map(([sub, items]) => (
              <div
                key={sub}
                className="bg-white border border-border rounded-xl overflow-hidden"
              >
                <div className="bg-offwhite px-3 py-2 border-b border-border">
                  <p className="text-xs font-bold text-charcoal">
                    {SUB_LABEL[sub]}
                  </p>
                </div>
                <div className="divide-y divide-border">
                  {items.map((s) => {
                    const isActive = s.id === activeId;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setActiveId(isActive ? null : s.id)}
                        className={[
                          "w-full text-left px-3 py-2.5 transition",
                          isActive
                            ? "bg-primary/10"
                            : "hover:bg-offwhite/60",
                        ].join(" ")}
                      >
                        <div className="flex items-start gap-2">
                          <span
                            className={[
                              "text-base shrink-0",
                              isActive ? "text-primary" : "text-charcoal-soft",
                            ].join(" ")}
                          >
                            {isActive ? "▾" : "▸"}
                          </span>
                          <div className="flex-1">
                            <p
                              className={[
                                "text-sm font-medium leading-tight",
                                isActive ? "text-primary" : "text-charcoal",
                              ].join(" ")}
                            >
                              {s.title}
                            </p>
                            <p className="text-[11px] text-charcoal-soft mt-0.5 leading-relaxed">
                              💬 {s.customerSays}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Step 3: 시나리오 상세 */}
      {active && <ScenarioDetail scenario={active} />}

      {/* 빠른 링크 */}
      <section className="grid sm:grid-cols-2 gap-3 mt-5">
        <Link
          href="/guide/trade-finance/cases"
          className="bg-white border border-border rounded-xl p-3 hover:border-primary transition group"
        >
          <p className="font-bold text-sm group-hover:text-primary transition">
            📋 상황별 가이드 (표) →
          </p>
          <p className="text-xs text-charcoal-soft mt-0.5">
            전체 시나리오 검색·필터·정렬
          </p>
        </Link>
        <Link
          href="/guide/trade-finance"
          className="bg-white border border-border rounded-xl p-3 hover:border-primary transition group"
        >
          <p className="font-bold text-sm group-hover:text-primary transition">
            ← 무역금융 진입판
          </p>
          <p className="text-xs text-charcoal-soft mt-0.5">
            학습용 상세 가이드·도구 전체
          </p>
        </Link>
      </section>
    </div>
  );
}

function ScenarioDetail({ scenario: s }: { scenario: TradeScenario }) {
  return (
    <section className="bg-white border-2 border-primary rounded-xl overflow-hidden mb-4 shadow-sm">
      <div className="bg-primary text-white px-4 py-3">
        <p className="text-[10px] uppercase tracking-wide opacity-80">
          {SUB_LABEL[s.subCategory]}
        </p>
        <h2 className="font-bold text-lg">{s.title}</h2>
        <p className="text-xs mt-1 opacity-90 leading-relaxed">
          💬 &ldquo;{s.customerSays}&rdquo;
        </p>
      </div>

      <div className="p-4 space-y-4">
        <p className="text-xs text-charcoal leading-relaxed bg-offwhite border border-border rounded-lg p-3">
          📌 <strong>요약:</strong> {s.summary}
        </p>

        {/* 가져왔어야 할 것 */}
        <DetailBlock
          title="🎒 손님이 가져왔어야 할 것"
          color="primary"
        >
          <ul className="text-xs text-charcoal-soft list-disc list-inside space-y-1 leading-relaxed">
            {s.whatToBring.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </DetailBlock>

        {/* 점검 항목 */}
        <DetailBlock title="✅ 영업점 점검 항목" color="primary">
          <ul className="text-xs text-charcoal-soft space-y-2">
            {s.checklist.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary mt-0.5">▢</span>
                <div className="flex-1">
                  <p className="font-medium text-charcoal">{c.label}</p>
                  {c.detail && (
                    <p className="text-[11px] mt-0.5 leading-relaxed">
                      {c.detail}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </DetailBlock>

        {/* 처리 절차 */}
        <DetailBlock title="🔧 처리 절차" color="warn">
          <ol className="text-xs text-charcoal-soft list-decimal list-inside space-y-1 leading-relaxed">
            {s.procedure.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ol>
        </DetailBlock>

        {/* 기한·수수료 */}
        {(s.timing || s.fees) && (
          <div className="grid sm:grid-cols-2 gap-3">
            {s.timing && (
              <DetailBlock title="⏱️ 기한·만기" color="info" compact>
                <p className="text-xs text-charcoal-soft leading-relaxed">
                  {s.timing}
                </p>
              </DetailBlock>
            )}
            {s.fees && s.fees.length > 0 && (
              <DetailBlock title="💸 수수료" color="info" compact>
                <ul className="text-xs text-charcoal-soft list-disc list-inside space-y-0.5 leading-relaxed">
                  {s.fees.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </DetailBlock>
            )}
          </div>
        )}

        {/* 주의사항 */}
        {s.cautions && s.cautions.length > 0 && (
          <DetailBlock title="⚠️ 주의사항·하자 가능성" color="danger">
            <ul className="text-xs text-charcoal-soft list-disc list-inside space-y-1 leading-relaxed">
              {s.cautions.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </DetailBlock>
        )}

        {/* 응대 멘트 */}
        <DetailBlock title="💬 영업점 응대 멘트" color="primary">
          <ul className="text-xs text-charcoal space-y-1.5 leading-relaxed">
            {s.scripts.map((line, i) => (
              <li key={i} className="border-l-2 border-primary/40 pl-2">
                {line}
              </li>
            ))}
          </ul>
        </DetailBlock>

        {/* 관련 가이드 */}
        {s.relatedGuides && s.relatedGuides.length > 0 && (
          <DetailBlock title="📚 관련 상세 가이드" color="info" compact>
            <div className="flex flex-wrap gap-2">
              {s.relatedGuides.map((g) => (
                <Link
                  key={g.href}
                  href={g.href}
                  className="text-[11px] bg-white border border-border hover:border-primary text-charcoal-soft hover:text-primary px-2.5 py-1 rounded-full transition"
                >
                  {g.label} →
                </Link>
              ))}
            </div>
          </DetailBlock>
        )}

        <p className="text-[10px] text-charcoal-soft text-right">
          출처: {s.source}
        </p>
      </div>
    </section>
  );
}

function DetailBlock({
  title,
  color,
  compact,
  children,
}: {
  title: string;
  color: "primary" | "warn" | "danger" | "info";
  compact?: boolean;
  children: React.ReactNode;
}) {
  const cls = {
    primary: "bg-primary/5 border-primary/30",
    warn: "bg-warn/5 border-warn/30",
    danger: "bg-danger/5 border-danger/30",
    info: "bg-offwhite border-border",
  }[color];
  const titleCls = {
    primary: "text-primary",
    warn: "text-warn",
    danger: "text-danger",
    info: "text-charcoal-soft",
  }[color];

  return (
    <div className={`border rounded-lg ${cls} ${compact ? "p-2.5" : "p-3"}`}>
      <p
        className={`text-[10px] font-medium uppercase tracking-wide mb-1.5 ${titleCls}`}
      >
        {title}
      </p>
      {children}
    </div>
  );
}
