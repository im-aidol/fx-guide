"use client";

import { useState } from "react";
import { CURRENCY_SAMPLES } from "@/lib/data/currency-samples";
import type { CurrencySample, Denomination } from "@/lib/types";

const PRIMARY = CURRENCY_SAMPLES.filter((c) => c.primary);
const OTHERS = CURRENCY_SAMPLES.filter((c) => !c.primary);

export default function SamplesPage() {
  const [selectedId, setSelectedId] = useState<string>(PRIMARY[0]?.id ?? "");
  const selected = CURRENCY_SAMPLES.find((c) => c.id === selectedId);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-6">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          외국통화 견양
        </p>
        <h1 className="text-3xl font-bold mb-2">환전 매입 가능 통화 확인</h1>
        <p className="text-sm text-charcoal-soft">
          환전 시 매입 가능 여부를 권종별로 확인. 통화를 클릭하면 권종별
          사진·시리즈·매입 여부가 표시됩니다.
        </p>
      </header>

      {/* 주요 통화 */}
      <section className="mb-6">
        <h2 className="text-sm font-medium text-charcoal-soft uppercase tracking-wide mb-2">
          주요 통화
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PRIMARY.map((c) => (
            <CurrencyCard
              key={c.id}
              sample={c}
              selected={c.id === selectedId}
              onClick={() => setSelectedId(c.id)}
              large
            />
          ))}
        </div>
      </section>

      {/* 기타 통화 */}
      <section className="mb-6">
        <h2 className="text-sm font-medium text-charcoal-soft uppercase tracking-wide mb-2">
          기타 통화
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {OTHERS.map((c) => (
            <CurrencyCard
              key={c.id}
              sample={c}
              selected={c.id === selectedId}
              onClick={() => setSelectedId(c.id)}
            />
          ))}
        </div>
      </section>

      {/* 선택된 통화 상세 */}
      {selected && <CurrencyDetail sample={selected} />}
    </div>
  );
}

function CurrencyCard({
  sample,
  selected,
  onClick,
  large,
}: {
  sample: CurrencySample;
  selected: boolean;
  onClick: () => void;
  large?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "border rounded-lg transition text-left",
        large ? "p-4" : "p-2.5",
        selected
          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
          : "bg-white border-border hover:border-primary",
      ].join(" ")}
    >
      <div className={large ? "flex items-center gap-2.5 mb-1" : "flex items-center gap-1.5"}>
        <Flag
          code={sample.countryCode}
          className={large ? "w-9 h-7 shrink-0 shadow-sm" : "w-6 h-[18px] shrink-0"}
        />
        <div className="min-w-0">
          <p className={large ? "font-bold text-base" : "font-medium text-sm truncate"}>
            {sample.countryName}
          </p>
          {large && (
            <p className="text-xs text-charcoal-soft">{sample.code}</p>
          )}
        </div>
      </div>
      {large && (
        <p className="text-[10px] text-charcoal-soft mt-1">
          {sample.denominations.length}개 권종
        </p>
      )}
      {!large && (
        <p className="text-[10px] text-charcoal-soft mt-0.5">{sample.code}</p>
      )}
    </button>
  );
}

function Flag({ code, className }: { code: string; className?: string }) {
  // flag-icons 는 background-image 로 국기 표시. 인라인 width/height 또는 Tailwind class로 크기 지정.
  return (
    <span
      className={[
        "fi",
        `fi-${code.toLowerCase()}`,
        "inline-block rounded-sm border border-border bg-offwhite",
        className ?? "",
      ].join(" ")}
      aria-label={`${code} flag`}
    />
  );
}

function CurrencyDetail({ sample }: { sample: CurrencySample }) {
  return (
    <section className="bg-white border border-border rounded-xl p-5">
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
        <Flag
          code={sample.countryCode}
          className="w-14 h-10 shrink-0 shadow-sm"
        />
        <div>
          <h2 className="text-xl font-bold">
            {sample.countryName}{" "}
            <span className="text-charcoal-soft font-medium">({sample.code})</span>
          </h2>
          <p className="text-xs text-charcoal-soft">
            권종별 매입 가능 여부 확인 — 총 {sample.denominations.length}개
          </p>
        </div>
      </div>

      {/* 권종 카드 그리드 */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
        {sample.denominations.map((d, i) => (
          <DenominationCard key={`${sample.id}-${i}`} denomination={d} />
        ))}
      </div>

      {/* 일반 유의사항 */}
      {sample.generalNotes && sample.generalNotes.length > 0 && (
        <div className="bg-offwhite border border-border rounded-md p-3 text-sm">
          <p className="text-xs font-medium text-charcoal-soft uppercase tracking-wide mb-2">
            매입 일반 유의사항
          </p>
          <ul className="space-y-1 text-charcoal-soft list-disc list-inside">
            {sample.generalNotes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function DenominationCard({ denomination }: { denomination: Denomination }) {
  return (
    <article
      className={[
        "border rounded-lg overflow-hidden flex flex-col",
        denomination.acceptable
          ? "bg-white border-border"
          : "bg-danger/5 border-danger/30",
      ].join(" ")}
    >
      {/* 사진 영역 (placeholder) */}
      <div className="aspect-[5/3] bg-offwhite border-b border-border flex items-center justify-center text-charcoal-soft text-xs">
        {denomination.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={denomination.imageUrl}
            alt={denomination.value}
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-center px-2">
            🖼️ 사진 자리
            <br />
            <span className="text-[10px]">
              public/currency-samples/ 에 추가
            </span>
          </span>
        )}
      </div>

      {/* 정보 */}
      <div className="p-3 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="font-bold">{denomination.value}</p>
          {denomination.acceptable ? (
            <span className="text-[10px] text-primary border border-primary/30 bg-primary/10 px-2 py-0.5 rounded-full whitespace-nowrap">
              ✓ 매입
            </span>
          ) : (
            <span className="text-[10px] text-danger border border-danger/30 bg-danger/10 px-2 py-0.5 rounded-full whitespace-nowrap">
              ✗ 매입 불가
            </span>
          )}
        </div>
        {denomination.series && (
          <p className="text-xs text-charcoal-soft mb-1">{denomination.series}</p>
        )}
        {denomination.notes && (
          <p className="text-[11px] text-charcoal-soft mt-auto pt-2 border-t border-border italic">
            {denomination.notes}
          </p>
        )}
      </div>
    </article>
  );
}
