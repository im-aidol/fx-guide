"use client";

import { useMemo, useState } from "react";
import { FAQS } from "@/lib/data";
import type { Faq } from "@/lib/types";
import { useMode } from "@/components/Mode";
import { useEditableList } from "@/lib/hooks/useEditableList";
import { AdminBadge } from "@/components/admin/AdminBadge";

const STORAGE_KEY = "fx-guide:faqs";

export default function FaqPage() {
  const { mode } = useMode();
  const canEdit = mode === "hq";
  const { items, add, update, remove, reset } = useEditableList<Faq>(
    STORAGE_KEY,
    FAQS,
  );

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((f) => set.add(f.category));
    return Array.from(set);
  }, [items]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    items.forEach((f) => {
      map[f.category] = (map[f.category] ?? 0) + 1;
    });
    return map;
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((f) => {
      if (activeCategory && f.category !== activeCategory) return false;
      if (!q) return true;
      return (
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        (f.keywords ?? []).some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [items, search, activeCategory]);

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
          총 {items.length}개.
        </p>
        <AdminBadge hqHint="본점 관리자 — FAQ 추가·수정·삭제가 가능합니다" />
      </header>

      <div className="sticky top-14 md:top-0 z-10 -mx-6 px-6 pt-4 pb-4 bg-offwhite">
        <div className="bg-white border border-border rounded-xl p-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="질문·답변·키워드 검색 (예: SWIFT, 10만불, 해외이주비)"
            className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:border-primary"
          />
          <div className="flex flex-wrap gap-1.5 mt-3">
            <CategoryChip
              label={`전체 (${items.length})`}
              active={activeCategory === null}
              onClick={() => setActiveCategory(null)}
            />
            {categories.map((c) => (
              <CategoryChip
                key={c}
                label={`${c} (${counts[c] ?? 0})`}
                active={activeCategory === c}
                onClick={() => setActiveCategory(c)}
              />
            ))}
          </div>
          {canEdit && (
            <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-border">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
              >
                {showAddForm ? "취소" : "+ 새 FAQ 추가"}
              </button>
              <button
                onClick={() => {
                  if (confirm("FAQ를 초기 시드 데이터로 되돌립니다. 계속할까요?")) {
                    reset();
                    setEditingId(null);
                    setShowAddForm(false);
                  }
                }}
                className="text-[11px] text-charcoal-soft hover:text-charcoal"
              >
                ↺ 초기화
              </button>
            </div>
          )}
        </div>
      </div>

      {canEdit && showAddForm && (
        <FaqForm
          onSubmit={(faq) => {
            add(faq);
            setShowAddForm(false);
          }}
          onCancel={() => setShowAddForm(false)}
          existingCategories={categories}
        />
      )}

      {filtered.length === 0 ? (
        <p className="text-center text-charcoal-soft py-12">
          검색 결과가 없습니다.
        </p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((f) =>
            editingId === f.id ? (
              <FaqForm
                key={f.id}
                initial={f}
                onSubmit={(updated) => {
                  update(f.id, updated);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
                existingCategories={categories}
              />
            ) : (
              <FaqCard
                key={f.id}
                faq={f}
                open={openIds.has(f.id)}
                onToggle={() => toggle(f.id)}
                canEdit={canEdit}
                onEdit={() => setEditingId(f.id)}
                onDelete={() => {
                  if (confirm(`"${f.question}"\n\n이 FAQ를 삭제할까요?`)) {
                    remove(f.id);
                  }
                }}
              />
            ),
          )}
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
  canEdit,
  onEdit,
  onDelete,
}: {
  faq: Faq;
  open: boolean;
  onToggle: () => void;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
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
          {canEdit && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
              <button
                onClick={onEdit}
                className="text-xs text-primary hover:text-primary-dark font-medium"
              >
                ✏️ 수정
              </button>
              <button
                onClick={onDelete}
                className="text-xs text-danger hover:underline"
              >
                🗑️ 삭제
              </button>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

function FaqForm({
  initial,
  onSubmit,
  onCancel,
  existingCategories,
}: {
  initial?: Faq;
  onSubmit: (faq: Faq) => void;
  onCancel: () => void;
  existingCategories: string[];
}) {
  const [category, setCategory] = useState(initial?.category ?? "기타");
  const [question, setQuestion] = useState(initial?.question ?? "");
  const [answer, setAnswer] = useState(initial?.answer ?? "");
  const [source, setSource] = useState(initial?.source ?? "");
  const [keywordsRaw, setKeywordsRaw] = useState(
    (initial?.keywords ?? []).join(", "),
  );

  const submit = () => {
    if (!question.trim() || !answer.trim()) return;
    const keywords = keywordsRaw
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    onSubmit({
      id: initial?.id ?? `faq-${Date.now()}`,
      category: category.trim() || "기타",
      question: question.trim(),
      answer: answer.trim(),
      source: source.trim() || undefined,
      keywords: keywords.length > 0 ? keywords : undefined,
    });
  };

  return (
    <li className="bg-white border-2 border-primary/50 rounded-xl p-5 space-y-3 mb-2 list-none">
      <h3 className="font-bold text-sm">
        {initial ? "FAQ 수정" : "새 FAQ 추가"}
      </h3>
      <div>
        <label className="text-[11px] text-charcoal-soft block mb-1">
          카테고리
        </label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          list="faq-categories"
          placeholder="카테고리 (예: 한도, 타발 송금, 신고)"
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
        />
        <datalist id="faq-categories">
          {existingCategories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>
      <div>
        <label className="text-[11px] text-charcoal-soft block mb-1">
          질문
        </label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="질문"
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
        />
      </div>
      <div>
        <label className="text-[11px] text-charcoal-soft block mb-1">
          답변 (**bold** 강조 가능)
        </label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="답변"
          rows={8}
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm resize-y"
        />
      </div>
      <div>
        <label className="text-[11px] text-charcoal-soft block mb-1">
          출처 (1차 자료)
        </label>
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="예: 외환규정 4-3조 ①1호"
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
        />
      </div>
      <div>
        <label className="text-[11px] text-charcoal-soft block mb-1">
          키워드 (쉼표로 구분)
        </label>
        <input
          type="text"
          value={keywordsRaw}
          onChange={(e) => setKeywordsRaw(e.target.value)}
          placeholder="10만불, 무증빙, 한도"
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
        />
      </div>
      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          onClick={onCancel}
          className="text-xs text-charcoal-soft hover:text-charcoal px-3 py-1.5"
        >
          취소
        </button>
        <button
          onClick={submit}
          disabled={!question.trim() || !answer.trim()}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-50"
        >
          {initial ? "수정 저장" : "추가"}
        </button>
      </div>
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
