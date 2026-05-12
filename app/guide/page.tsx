"use client";

import { useMemo, useState } from "react";
import { BUSINESS_GUIDE } from "@/lib/data";
import type {
  BusinessGuideCategory,
  BusinessGuideItem,
} from "@/lib/types";

const CATEGORIES: BusinessGuideCategory[] = [
  "경상거래",
  "자산이전",
  "외국인송금",
  "자본거래",
  "기타",
];

export default function GuidePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<BusinessGuideCategory | null>(null);

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
        g.requiredDocs.join(" "),
        g.cautions.join(" "),
        g.source,
      ]
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    });
  }, [search, activeCategory]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    BUSINESS_GUIDE.forEach((g) => {
      map[g.category] = (map[g.category] ?? 0) + 1;
    });
    return map;
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-6">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          영업점 외환 가이드
        </p>
        <h1 className="text-3xl font-bold mb-2">사유별 업무 가이드</h1>
        <p className="text-sm text-charcoal-soft">
          사유가 명확할 때 빠르게 참조하는 카드 목록. 시뮬레이터는 사유를 모를
          때 좁혀가는 도구입니다. 총 {BUSINESS_GUIDE.length}개 사유.
        </p>
      </header>

      <div className="bg-white border border-border rounded-xl p-4 mb-4 sticky top-16 z-10">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="사유·조항·서류 검색 (예: 유학, 4-3조, 인보이스)"
          className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:border-primary"
        />
        <div className="flex flex-wrap gap-1.5 mt-3">
          <Chip
            label={`전체 (${BUSINESS_GUIDE.length})`}
            active={activeCategory === null}
            onClick={() => setActiveCategory(null)}
          />
          {CATEGORIES.map((c) =>
            counts[c] ? (
              <Chip
                key={c}
                label={`${c} (${counts[c]})`}
                active={activeCategory === c}
                onClick={() => setActiveCategory(c)}
              />
            ) : null,
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-charcoal-soft py-12">
          검색 결과가 없습니다.
        </p>
      ) : (
        <ul className="grid md:grid-cols-2 gap-4">
          {filtered.map((g) => (
            <GuideCard key={g.id} item={g} />
          ))}
        </ul>
      )}
    </div>
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
        "text-xs px-3 py-1 rounded-full border transition",
        active
          ? "bg-primary text-white border-primary"
          : "bg-white border-border text-charcoal-soft hover:border-primary",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function GuideCard({ item }: { item: BusinessGuideItem }) {
  const designationLabel: Record<typeof item.designationMethod, string> = {
    외화송금신청서로_직접: "✅ 외화송금신청서로 직접",
    별도_신청서_필요: "⚠️ 별도 지정 신청서 필요",
    지정_불요: "지정 불요",
  };
  const designationColor: Record<typeof item.designationMethod, string> = {
    외화송금신청서로_직접: "bg-primary/10 text-primary border-primary/30",
    별도_신청서_필요: "bg-warn/10 text-charcoal border-warn/40",
    지정_불요: "bg-offwhite text-charcoal-soft border-border",
  };

  return (
    <li className="bg-white border border-border rounded-xl p-5 hover:border-primary/40 transition flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-base font-bold leading-tight">{item.title}</h3>
        <span className="text-[10px] text-charcoal-soft bg-offwhite border border-border px-2 py-0.5 rounded-full whitespace-nowrap">
          {item.category}
        </span>
      </div>
      {item.subtitle && (
        <p className="text-xs text-charcoal-soft mb-3">{item.subtitle}</p>
      )}

      <dl className="space-y-2 text-sm flex-1">
        {item.transactionCode && (
          <Row label="거래코드" value={item.transactionCode} mono />
        )}
        <Row label="근거 조항" value={item.legalRef} />
        <Row
          label="거래외국환은행 지정"
          value={
            <span
              className={[
                "text-xs border px-2 py-0.5 rounded-full",
                designationColor[item.designationMethod],
              ].join(" ")}
            >
              {designationLabel[item.designationMethod]}
            </span>
          }
        />
        {item.annualLimit && <Row label="한도" value={item.annualLimit} />}
      </dl>

      {item.requiredDocs.length > 0 && (
        <Section title="필요 서류" items={item.requiredDocs} />
      )}
      {item.cautions.length > 0 && (
        <Section title="주의·통보의무" items={item.cautions} />
      )}
      {item.customerScripts && item.customerScripts.length > 0 && (
        <Section
          title="고객 응대 멘트"
          items={item.customerScripts}
          variant="quote"
        />
      )}

      {item.relatedTerms && item.relatedTerms.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {item.relatedTerms.map((t) => (
            <span
              key={t}
              className="text-[10px] text-charcoal-soft bg-offwhite border border-border px-2 py-0.5 rounded-full"
            >
              📄 {t}
            </span>
          ))}
        </div>
      )}

      <p className="text-[10px] text-charcoal-soft mt-3 pt-3 border-t border-border">
        출처: {item.source}
      </p>
    </li>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3">
      <dt className="text-xs text-charcoal-soft sm:w-28 sm:shrink-0">{label}</dt>
      <dd className={mono ? "font-mono text-sm" : "text-sm"}>{value}</dd>
    </div>
  );
}

function Section({
  title,
  items,
  variant,
}: {
  title: string;
  items: string[];
  variant?: "quote";
}) {
  return (
    <div className="mt-3">
      <h4 className="text-xs font-medium text-charcoal-soft mb-1.5 uppercase tracking-wide">
        {title}
      </h4>
      <ul className="space-y-1 text-sm">
        {items.map((s, i) => (
          <li
            key={i}
            className={
              variant === "quote"
                ? "text-charcoal italic pl-3 border-l-2 border-primary/30"
                : "text-charcoal-soft pl-1 list-disc list-inside"
            }
          >
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}
