"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminNote } from "@/components/admin/AdminNote";
import { LC_FIELDS } from "@/lib/data/trade-finance";

// 신용장 19개 필드 가이드 — UCP 600·ISBP 745 근거.

export default function LcFieldsPage() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return LC_FIELDS;
    return LC_FIELDS.filter((f) => {
      const blob = [
        f.korName,
        f.engName,
        f.swift ?? "",
        f.description,
        f.ucpRef ?? "",
        f.isbpRef ?? "",
        (f.cautions ?? []).join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    });
  }, [search]);

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
        <span className="text-charcoal">신용장 19개 필드</span>
      </nav>

      <header className="mb-5">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          📑 무역금융 · 도구
        </p>
        <h1 className="text-2xl font-bold mb-1">
          신용장 19개 필드 가이드
        </h1>
        <p className="text-sm text-charcoal-soft leading-relaxed">
          신용장 작성·점검 시 각 필드의 UCP 600·ISBP 745 근거와 주의사항. 행 클릭 시 상세 펼치기.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-trade-lc-fields" />

      {/* 검색 */}
      <div className="bg-white border border-border rounded-xl p-3 mb-4">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="검색 — SWIFT 코드 / 필드명 / UCP 조항 / 키워드..."
            className="w-full pl-9 pr-9 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
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
        <p className="text-[10px] text-charcoal-soft mt-1.5 px-1">
          🔖 UCP 600 = 신용장통일규칙 / ISBP 745 = 국제표준은행관행 (ICC 발간).
        </p>
      </div>

      {/* 표 */}
      <section className="bg-white border border-border rounded-xl overflow-hidden mb-4">
        <table className="w-full text-xs">
          <thead className="bg-offwhite text-charcoal-soft">
            <tr className="border-b border-border">
              <Th className="w-10">#</Th>
              <Th className="w-20">SWIFT</Th>
              <Th>필드명</Th>
              <Th>설명</Th>
              <Th className="w-32">UCP / ISBP</Th>
              <Th className="w-10">{""}</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f, i) => {
              const isOpen = expanded === f.no;
              const striped = i % 2 === 1;
              return (
                <FieldRows
                  key={f.no}
                  field={f}
                  isOpen={isOpen}
                  striped={striped}
                  onToggle={() =>
                    setExpanded(isOpen ? null : f.no)
                  }
                />
              );
            })}
          </tbody>
        </table>
      </section>

      {filtered.length === 0 && (
        <div className="bg-white border border-border rounded-xl p-6 text-center text-sm text-charcoal-soft">
          일치하는 필드가 없습니다.
        </div>
      )}

      <section className="bg-offwhite border border-border rounded-xl p-4 text-xs">
        <h3 className="font-medium mb-2">📚 참조 규정</h3>
        <ul className="space-y-1 text-charcoal-soft list-disc list-inside">
          <li>
            <strong>UCP 600</strong> — 신용장통일규칙 (ICC, 2007년 7월 1일 발효)
          </li>
          <li>
            <strong>ISBP 745</strong> — 신용장 서류 심사를 위한 국제표준은행관행 (ICC, 2013년 4월)
          </li>
          <li>
            <strong>엄격일치의 원칙</strong>: 상업송장 물품명세
          </li>
          <li>
            <strong>실질일치(상당일치)의 원칙</strong>: 상업송장 이외 서류
          </li>
        </ul>
        <p className="text-[10px] text-charcoal-soft mt-3">
          출처: 수출입 업무의 이해 연수교재 (HR부, 2025.06) Section 2 수입 신용장 19개 필드 + UCP
          600·ISBP 745 본문.
        </p>
      </section>

      <Link
        href="/guide/trade-finance/lc-checker"
        className="block bg-primary/5 border border-primary/30 rounded-xl p-3 hover:border-primary transition group mt-4"
      >
        <p className="font-bold text-sm group-hover:text-primary transition">
          🔍 신용장 하자 점검 도구 →
        </p>
        <p className="text-xs text-charcoal-soft mt-0.5">
          신용장 문구 붙여넣기 → 독소조항·불명확 용어·서류 요건 자동 점검
        </p>
      </Link>
    </div>
  );
}

function FieldRows({
  field: f,
  isOpen,
  striped,
  onToggle,
}: {
  field: (typeof LC_FIELDS)[number];
  isOpen: boolean;
  striped: boolean;
  onToggle: () => void;
}) {
  const rowBg = striped ? "bg-offwhite/30" : "bg-white";
  return (
    <>
      <tr
        className={[
          "border-b border-border last:border-0 align-top cursor-pointer transition",
          rowBg,
          isOpen ? "bg-primary/5" : "hover:bg-primary/5",
        ].join(" ")}
        onClick={onToggle}
      >
        <td className="py-2 px-3 font-bold text-charcoal-soft">
          {String(f.no).padStart(2, "0")}
        </td>
        <td className="py-2 px-3 font-mono text-[11px]">
          {f.swift ? (
            <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded">
              {f.swift}
            </span>
          ) : (
            <span className="text-charcoal-soft">—</span>
          )}
        </td>
        <td className="py-2 px-3 leading-tight">
          <p className="font-semibold">{f.korName}</p>
          <p className="text-[10px] text-charcoal-soft">{f.engName}</p>
        </td>
        <td className="py-2 px-3 leading-relaxed text-charcoal-soft">
          {f.description}
        </td>
        <td className="py-2 px-3 text-[10px] leading-tight">
          {f.ucpRef && <p className="text-primary">📘 {f.ucpRef}</p>}
          {f.isbpRef && (
            <p className="text-charcoal-soft mt-0.5">📗 {f.isbpRef}</p>
          )}
        </td>
        <td className="py-2 px-3 text-charcoal-soft text-center">
          {isOpen ? "▾" : "▸"}
        </td>
      </tr>
      {isOpen && (f.cautions || f.examples) && (
        <tr className={rowBg}>
          <td colSpan={6} className="py-3 px-4 border-b border-border">
            <div className="grid sm:grid-cols-2 gap-3">
              {f.cautions && f.cautions.length > 0 && (
                <div className="bg-warn/5 border border-warn/30 rounded-lg p-3">
                  <p className="text-[10px] font-medium text-warn uppercase tracking-wide mb-1.5">
                    ⚠️ 작성·점검 주의사항
                  </p>
                  <ul className="text-xs text-charcoal-soft list-disc list-inside leading-relaxed space-y-0.5">
                    {f.cautions.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
              {f.examples && f.examples.length > 0 && (
                <div className="bg-primary/5 border border-primary/30 rounded-lg p-3">
                  <p className="text-[10px] font-medium text-primary uppercase tracking-wide mb-1.5">
                    💡 예시
                  </p>
                  <ul className="text-xs text-charcoal-soft list-disc list-inside leading-relaxed space-y-0.5">
                    {f.examples.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
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
