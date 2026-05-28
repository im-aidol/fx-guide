"use client";

import Link from "next/link";
import { use } from "react";
import { notFound } from "next/navigation";
import { AdminNote } from "@/components/admin/AdminNote";
import {
  TRADE_SCENARIOS,
  type TradeScenarioSubCategory,
} from "@/lib/data/trade-scenarios";

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

export default function TradeCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const s = TRADE_SCENARIOS.find((it) => it.id === id);

  if (!s) {
    notFound();
  }

  return (
    <div className="max-w-[clamp(840px,92vw,1280px)] mx-auto px-6 py-8">
      <nav className="text-xs text-charcoal-soft mb-3 flex items-center gap-1">
        <Link href="/guide" className="hover:text-primary">
          가이드 홈
        </Link>
        <span>›</span>
        <Link href="/guide/trade-finance" className="hover:text-primary">
          무역금융
        </Link>
        <span>›</span>
        <Link href="/guide/trade-finance/cases" className="hover:text-primary">
          상황별 가이드
        </Link>
        <span>›</span>
        <span className="text-charcoal">{s.title}</span>
      </nav>

      {/* 헤더 */}
      <header className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={[
              "text-[10px] px-1.5 py-0.5 rounded-full border whitespace-nowrap font-medium",
              s.category === "import"
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-warn/10 text-warn border-warn/30",
            ].join(" ")}
          >
            {s.category === "import" ? "📥 수입" : "📤 수출"}
          </span>
          <span className="text-[10px] text-charcoal-soft">
            {SUB_LABEL[s.subCategory]}
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-2">{s.title}</h1>
        <p className="text-sm text-charcoal-soft leading-relaxed italic">
          💬 &ldquo;{s.customerSays}&rdquo;
        </p>
      </header>

      <AdminNote storageKey={`fx-guide:note:guide-trade-case-${s.id}`} />

      {/* 요약 */}
      <section className="bg-primary/5 border border-primary/30 rounded-xl p-4 mb-4">
        <p className="text-[10px] font-medium text-primary uppercase tracking-wide mb-1">
          📌 한줄 요약
        </p>
        <p className="text-sm text-charcoal leading-relaxed">{s.summary}</p>
      </section>

      {/* 가져왔어야 할 것 */}
      <section className="bg-white border border-border rounded-xl p-4 mb-4">
        <h2 className="font-bold text-sm mb-2">
          🎒 손님이 가져왔어야 할 것
        </h2>
        <ul className="text-xs text-charcoal-soft list-disc list-inside space-y-1 leading-relaxed">
          {s.whatToBring.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      </section>

      {/* 점검 항목 */}
      <section className="bg-white border border-border rounded-xl p-4 mb-4">
        <h2 className="font-bold text-sm mb-3">✅ 영업점 점검 항목</h2>
        <ul className="space-y-2.5">
          {s.checklist.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-xs">
              <span className="text-primary text-base mt-0.5">▢</span>
              <div className="flex-1">
                <p className="font-medium text-charcoal">{c.label}</p>
                {c.detail && (
                  <p className="text-[11px] text-charcoal-soft mt-0.5 leading-relaxed">
                    {c.detail}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 처리 절차 */}
      <section className="bg-warn/5 border border-warn/30 rounded-xl p-4 mb-4">
        <h2 className="font-bold text-sm mb-2">🔧 처리 절차</h2>
        <ol className="text-xs text-charcoal-soft list-decimal list-inside space-y-1.5 leading-relaxed">
          {s.procedure.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ol>
      </section>

      {/* 기한·수수료 */}
      {(s.timing || s.fees) && (
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          {s.timing && (
            <section className="bg-white border border-border rounded-xl p-4">
              <h2 className="font-bold text-sm mb-2">⏱️ 기한·만기</h2>
              <p className="text-xs text-charcoal-soft leading-relaxed">
                {s.timing}
              </p>
            </section>
          )}
          {s.fees && s.fees.length > 0 && (
            <section className="bg-white border border-border rounded-xl p-4">
              <h2 className="font-bold text-sm mb-2">💸 수수료</h2>
              <ul className="text-xs text-charcoal-soft list-disc list-inside space-y-0.5 leading-relaxed">
                {s.fees.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      {/* 주의사항 */}
      {s.cautions && s.cautions.length > 0 && (
        <section className="bg-danger/5 border border-danger/30 rounded-xl p-4 mb-4">
          <h2 className="font-bold text-sm mb-2">⚠️ 주의사항·하자 가능성</h2>
          <ul className="text-xs text-charcoal-soft list-disc list-inside space-y-1 leading-relaxed">
            {s.cautions.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </section>
      )}

      {/* 응대 멘트 */}
      <section className="bg-primary/5 border border-primary/30 rounded-xl p-4 mb-4">
        <h2 className="font-bold text-sm mb-2">💬 영업점 응대 멘트</h2>
        <ul className="text-xs text-charcoal space-y-1.5 leading-relaxed">
          {s.scripts.map((line, i) => (
            <li
              key={i}
              className="border-l-2 border-primary/40 pl-2 bg-white/60 py-1 rounded"
            >
              {line}
            </li>
          ))}
        </ul>
      </section>

      {/* 관련 가이드 */}
      {s.relatedGuides && s.relatedGuides.length > 0 && (
        <section className="bg-offwhite border border-border rounded-xl p-4 mb-4">
          <h2 className="font-bold text-sm mb-2">📚 관련 상세 가이드</h2>
          <div className="flex flex-wrap gap-2">
            {s.relatedGuides.map((g) => (
              <Link
                key={g.href}
                href={g.href}
                className="text-xs bg-white border border-border hover:border-primary text-charcoal-soft hover:text-primary px-3 py-1.5 rounded-full transition"
              >
                {g.label} →
              </Link>
            ))}
          </div>
        </section>
      )}

      <p className="text-[10px] text-charcoal-soft text-right mb-4">
        출처: {s.source}
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        <Link
          href="/guide/trade-finance/desk"
          className="bg-white border border-border rounded-xl p-3 hover:border-primary transition group"
        >
          <p className="font-bold text-sm group-hover:text-primary transition">
            🎯 영업점 도우미 (트리식) →
          </p>
        </Link>
        <Link
          href="/guide/trade-finance/cases"
          className="bg-white border border-border rounded-xl p-3 hover:border-primary transition group"
        >
          <p className="font-bold text-sm group-hover:text-primary transition">
            ← 상황별 가이드 표
          </p>
        </Link>
      </div>
    </div>
  );
}
