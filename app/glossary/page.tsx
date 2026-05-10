"use client";

import { useMemo, useState } from "react";
import { GLOSSARY } from "@/lib/data";
import type { GlossaryCategory, GlossaryTerm } from "@/lib/types";

const CATEGORIES: GlossaryCategory[] = [
  "거주성",
  "거래",
  "지급수단",
  "환율",
  "신고제출",
  "외국환은행",
  "기관",
  "파생상품",
  "송금경비",
  "현지금융",
  "수입금융",
  "기타",
];

export default function GlossaryPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<GlossaryCategory | null>(
    null,
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return GLOSSARY.filter((g) => {
      if (activeCategory && g.category !== activeCategory) return false;
      if (!q) return true;
      return (
        g.term.toLowerCase().includes(q) ||
        g.definition.toLowerCase().includes(q) ||
        (g.source ?? "").toLowerCase().includes(q)
      );
    });
  }, [search, activeCategory]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    GLOSSARY.forEach((g) => {
      map[g.category] = (map[g.category] ?? 0) + 1;
    });
    return map;
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-6">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          용어 사전
        </p>
        <h1 className="text-3xl font-bold mb-2">외환 용어 사전</h1>
        <p className="text-sm text-charcoal-soft">
          외국환거래규정 (재정경제부고시 제2026-69호) 제1-2조 본문 1차 인용. 총{" "}
          {GLOSSARY.length}개 용어.
        </p>
      </header>

      <div className="bg-white border border-border rounded-xl p-4 mb-4 sticky top-16 z-10">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="용어 또는 정의 검색 (예: 거주자, 매매기준율, 1-2조)"
          className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:border-primary"
        />
        <div className="flex flex-wrap gap-1.5 mt-3">
          <CategoryChip
            label={`전체 (${GLOSSARY.length})`}
            active={activeCategory === null}
            onClick={() => setActiveCategory(null)}
          />
          {CATEGORIES.map((c) => (
            <CategoryChip
              key={c}
              label={`${c} (${counts[c] ?? 0})`}
              active={activeCategory === c}
              onClick={() => setActiveCategory(c)}
            />
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-charcoal-soft py-12">
          검색 결과가 없습니다.
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((g) => (
            <TermCard key={g.id} term={g} />
          ))}
        </ul>
      )}
    </div>
  );
}

function CategoryChip({
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

function TermCard({ term }: { term: GlossaryTerm }) {
  return (
    <li className="bg-white border border-border rounded-xl p-5 hover:border-primary/40 transition">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-lg font-bold">{term.term}</h3>
        <span className="text-[10px] text-charcoal-soft bg-offwhite border border-border px-2 py-0.5 rounded-full whitespace-nowrap">
          {term.category}
        </span>
      </div>
      <p className="text-sm text-charcoal leading-relaxed whitespace-pre-line">
        {term.definition}
      </p>
      {term.source && (
        <p className="text-[11px] text-charcoal-soft mt-3 pt-3 border-t border-border">
          출처: {term.source}
        </p>
      )}
    </li>
  );
}
