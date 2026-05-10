"use client";

import { useMemo, useState } from "react";
import { FAQS } from "@/lib/data";
import type { Faq } from "@/lib/types";

export default function FaqPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const categories = useMemo(() => {
    const set = new Set<string>();
    FAQS.forEach((f) => set.add(f.category));
    return Array.from(set);
  }, []);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    FAQS.forEach((f) => {
      map[f.category] = (map[f.category] ?? 0) + 1;
    });
    return map;
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return FAQS.filter((f) => {
      if (activeCategory && f.category !== activeCategory) return false;
      if (!q) return true;
      return (
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        (f.keywords ?? []).some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [search, activeCategory]);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-6">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          FAQ
        </p>
        <h1 className="text-3xl font-bold mb-2">자주 묻는 질문</h1>
        <p className="text-sm text-charcoal-soft">
          외환규정 본문과 iM뱅크 공식 안내에서 도출. 모든 답변에 1차 출처 표기.
          총 {FAQS.length}개.
        </p>
      </header>

      <div className="bg-white border border-border rounded-xl p-4 mb-4 sticky top-16 z-10">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="질문·답변·키워드 검색 (예: SWIFT, 10만불, 해외이주비)"
          className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:border-primary"
        />
        <div className="flex flex-wrap gap-1.5 mt-3">
          <CategoryChip
            label={`전체 (${FAQS.length})`}
            active={activeCategory === null}
            onClick={() => setActiveCategory(null)}
          />
          {categories.map((c) => (
            <CategoryChip
              key={c}
              label={`${c} (${counts[c]})`}
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
        <ul className="space-y-2">
          {filtered.map((f) => (
            <FaqCard
              key={f.id}
              faq={f}
              open={openIds.has(f.id)}
              onToggle={() => toggle(f.id)}
            />
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

function FaqCard({
  faq,
  open,
  onToggle,
}: {
  faq: Faq;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <li className="bg-white border border-border rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full text-left p-4 hover:bg-offwhite transition flex items-start justify-between gap-3"
      >
        <div className="flex-1">
          <span className="text-[10px] text-charcoal-soft uppercase tracking-wide">
            {faq.category}
          </span>
          <h3 className="font-medium mt-0.5">{faq.question}</h3>
        </div>
        <span className="text-charcoal-soft text-lg shrink-0 mt-1">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-border">
          <div className="text-sm text-charcoal leading-relaxed whitespace-pre-line pt-3">
            {renderAnswer(faq.answer)}
          </div>
          {faq.source && (
            <p className="text-[11px] text-charcoal-soft mt-3 pt-3 border-t border-border">
              출처: {faq.source}
            </p>
          )}
          {faq.keywords && faq.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {faq.keywords.map((k) => (
                <span
                  key={k}
                  className="text-[10px] text-charcoal-soft bg-offwhite border border-border px-2 py-0.5 rounded-full"
                >
                  #{k}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </li>
  );
}

// 매우 단순한 마크다운 풍 강조 (**bold** 처리)
function renderAnswer(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{p}</span>;
  });
}
