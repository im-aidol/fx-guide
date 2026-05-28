"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminNote } from "@/components/admin/AdminNote";
import { DOCUMENT_PREP_GUIDES } from "@/lib/data/trade-finance";

// 서류별 ISBP 작성 가이드 — 신용장 매입 시 서류 작성·점검.

const ICONS: Record<string, string> = {
  환어음: "📜",
  상업송장: "📄",
  선하증권: "🚢",
  항공운송장: "✈️",
  보험증권: "🛡️",
  원산지증명서: "📍",
};

export default function DocumentGuidePage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = DOCUMENT_PREP_GUIDES[activeIdx];

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
        <span className="text-charcoal">서류별 ISBP 작성 가이드</span>
      </nav>

      <header className="mb-5">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          📑 무역금융 · 도구
        </p>
        <h1 className="text-2xl font-bold mb-1">
          서류별 ISBP 작성 가이드
        </h1>
        <p className="text-sm text-charcoal-soft leading-relaxed">
          신용장 매입 시 서류 작성·점검 룰. UCP 600·ISBP 745 본문 기반의 6종 서류별 필드 가이드.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-trade-document-guide" />

      {/* 서류 선택 탭 */}
      <div className="bg-white border border-border rounded-xl p-2 mb-4 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {DOCUMENT_PREP_GUIDES.map((g, i) => {
            const active = i === activeIdx;
            return (
              <button
                key={g.korName}
                onClick={() => setActiveIdx(i)}
                className={[
                  "px-3 py-2 rounded-lg text-xs transition whitespace-nowrap",
                  active
                    ? "bg-primary text-white font-medium"
                    : "text-charcoal-soft hover:bg-offwhite hover:text-charcoal",
                ].join(" ")}
              >
                <span className="text-base mr-1">
                  {ICONS[g.korName] ?? "📄"}
                </span>
                <span>{g.korName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 활성 서류 가이드 */}
      <section className="bg-white border border-border rounded-xl overflow-hidden mb-4">
        <div className="bg-offwhite px-4 py-3 border-b border-border">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h2 className="font-bold text-base">
              {ICONS[active.korName] ?? "📄"} {active.korName}
            </h2>
            <p className="text-xs text-charcoal-soft">{active.engName}</p>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-charcoal-soft mt-1">
            {active.ucpRef && <span>📘 {active.ucpRef}</span>}
            {active.isbpRef && <span>📗 {active.isbpRef}</span>}
          </div>
        </div>

        <table className="w-full text-xs">
          <thead className="bg-offwhite/50 text-charcoal-soft">
            <tr className="border-b border-border">
              <Th className="w-10">#</Th>
              <Th className="w-40">필드</Th>
              <Th>작성 내용</Th>
              <Th className="w-56">주의사항</Th>
            </tr>
          </thead>
          <tbody>
            {active.fields.map((f, i) => (
              <tr
                key={f.no}
                className={[
                  "border-b border-border last:border-0 align-top",
                  i % 2 === 1 ? "bg-offwhite/30" : "",
                ].join(" ")}
              >
                <td className="py-3 px-3 font-bold text-charcoal-soft">
                  {String(f.no).padStart(2, "0")}
                </td>
                <td className="py-3 px-3 font-medium leading-tight">
                  {f.name}
                </td>
                <td className="py-3 px-3 text-charcoal-soft leading-relaxed">
                  {f.description}
                </td>
                <td className="py-3 px-3">
                  {f.caution && (
                    <div className="bg-warn/5 border border-warn/30 rounded p-1.5 text-[11px] text-charcoal-soft leading-relaxed">
                      ⚠️ {f.caution}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 점검 원칙 */}
      <section className="grid sm:grid-cols-2 gap-3 mb-4">
        <div className="bg-primary/5 border border-primary/30 rounded-xl p-4">
          <p className="font-bold text-sm mb-1">🎯 엄격일치 원칙</p>
          <p className="text-xs text-charcoal-soft leading-relaxed">
            <strong>상업송장</strong>의 물품명세는 신용장 물품명세와 엄격하게 일치 (Strict Compliance).
            단순 오타·재배열도 하자 가능.
          </p>
          <p className="text-[10px] text-primary mt-2 font-medium">
            📘 UCP 600 제18조 c항
          </p>
        </div>
        <div className="bg-warn/5 border border-warn/30 rounded-xl p-4">
          <p className="font-bold text-sm mb-1">🔄 실질일치(상당일치) 원칙</p>
          <p className="text-xs text-charcoal-soft leading-relaxed">
            <strong>상업송장 이외 서류</strong>는 신용장·다른 서류·국제표준은행관행과 충돌하지 않으면 허용.
            완전 동일할 필요는 없음.
          </p>
          <p className="text-[10px] text-warn mt-2 font-medium">
            📘 UCP 600 제14조 d항
          </p>
        </div>
      </section>

      <section className="bg-offwhite border border-border rounded-xl p-4 text-xs">
        <h3 className="font-medium mb-2">📚 참조 규정</h3>
        <ul className="space-y-1 text-charcoal-soft list-disc list-inside">
          <li>
            <strong>UCP 600</strong> — Uniform Customs and Practice for
            Documentary Credits (ICC, 2007년 7월 1일 발효)
          </li>
          <li>
            <strong>ISBP 745</strong> — International Standard Banking Practice
            for the Examination of Documents under UCP 600 (ICC, 2013년 4월)
          </li>
        </ul>
        <p className="text-[10px] text-charcoal-soft mt-3">
          출처: 수출입 업무의 이해 연수교재 (HR부, 2025.06) Section 3 서류별 작성 가이드 + ISBP 745·UCP 600 본문.
        </p>
      </section>

      <div className="grid sm:grid-cols-2 gap-3 mt-4">
        <Link
          href="/guide/trade-finance/lc-checker"
          className="bg-primary/5 border border-primary/30 rounded-xl p-3 hover:border-primary transition group"
        >
          <p className="font-bold text-sm group-hover:text-primary transition">
            🔍 신용장 하자 점검 도구 →
          </p>
          <p className="text-xs text-charcoal-soft mt-0.5">
            자동 룰셋 매칭
          </p>
        </Link>
        <Link
          href="/guide/trade-finance/export-lc"
          className="bg-white border border-border rounded-xl p-3 hover:border-primary transition group"
        >
          <p className="font-bold text-sm group-hover:text-primary transition">
            📤 수출 신용장 가이드 →
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
