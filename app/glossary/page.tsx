"use client";

import { useMemo, useState } from "react";
import { GLOSSARY } from "@/lib/data";
import type { GlossaryCategory, GlossaryTerm } from "@/lib/types";
import { useMode } from "@/components/Mode";
import { useEditableList } from "@/lib/hooks/useEditableList";
import { AdminBadge } from "@/components/admin/AdminBadge";

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

const STORAGE_KEY = "fx-guide:glossary";

export default function GlossaryPage() {
  const { mode } = useMode();
  const canEdit = mode === "hq";
  const { items, add, update, remove, reset } = useEditableList<GlossaryTerm>(
    STORAGE_KEY,
    GLOSSARY,
  );

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<GlossaryCategory | null>(
    null,
  );
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((g) => {
      if (activeCategory && g.category !== activeCategory) return false;
      if (!q) return true;
      return (
        g.term.toLowerCase().includes(q) ||
        g.definition.toLowerCase().includes(q) ||
        (g.source ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, search, activeCategory]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    items.forEach((g) => {
      map[g.category] = (map[g.category] ?? 0) + 1;
    });
    return map;
  }, [items]);

  const isSearching = search.trim().length > 0;
  const filteredIds = useMemo(() => filtered.map((g) => g.id), [filtered]);
  const allVisibleOpen =
    filteredIds.length > 0 && filteredIds.every((id) => openIds.has(id));

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllVisible = () => {
    if (allVisibleOpen) {
      setOpenIds((prev) => {
        const next = new Set(prev);
        filteredIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setOpenIds((prev) => {
        const next = new Set(prev);
        filteredIds.forEach((id) => next.add(id));
        return next;
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-6">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          외환 용어집
        </p>
        <h1 className="text-3xl font-bold mb-2">외환 용어집</h1>
        <p className="text-sm text-charcoal-soft">
          외국환거래규정 (재정경제부고시 제2026-69호) 제1-2조 본문 1차 인용. 총{" "}
          {items.length}개 용어.
        </p>
        <AdminBadge hqHint="본점 관리자 — 용어 추가·수정·삭제가 가능합니다" />
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
            label={`전체 (${items.length})`}
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
        {canEdit && (
          <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-border">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
            >
              {showAddForm ? "취소" : "+ 새 용어 추가"}
            </button>
            <button
              onClick={() => {
                if (confirm("외환 용어집을 초기 시드 데이터로 되돌립니다. 계속할까요?")) {
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

      {canEdit && showAddForm && (
        <TermForm
          onSubmit={(t) => {
            add(t);
            setShowAddForm(false);
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {filtered.length === 0 ? (
        <p className="text-center text-charcoal-soft py-12">
          검색 결과가 없습니다.
        </p>
      ) : (
        <>
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-xs text-charcoal-soft">
              {filtered.length}개 용어
            </p>
            <button
              onClick={toggleAllVisible}
              className="text-xs text-primary hover:text-primary-dark font-medium"
            >
              {allVisibleOpen ? "전체 접기" : "전체 펼치기"}
            </button>
          </div>
          <ul className="space-y-2">
            {filtered.map((g) =>
              editingId === g.id ? (
                <TermForm
                  key={g.id}
                  initial={g}
                  onSubmit={(updated) => {
                    update(g.id, updated);
                    setEditingId(null);
                  }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <TermCard
                  key={g.id}
                  term={g}
                  open={openIds.has(g.id) || isSearching}
                  onToggle={() => toggle(g.id)}
                  canEdit={canEdit}
                  onEdit={() => setEditingId(g.id)}
                  onDelete={() => {
                    if (confirm(`"${g.term}"\n\n이 용어를 삭제할까요?`)) {
                      remove(g.id);
                    }
                  }}
                />
              ),
            )}
          </ul>
        </>
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

function TermCard({
  term,
  open,
  onToggle,
  canEdit,
  onEdit,
  onDelete,
}: {
  term: GlossaryTerm;
  open: boolean;
  onToggle: () => void;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <li className="bg-white border border-border rounded-xl overflow-hidden hover:border-primary/40 transition">
      <button
        onClick={onToggle}
        className="w-full text-left px-5 py-4 hover:bg-offwhite transition flex items-start justify-between gap-3"
        aria-expanded={open}
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold">{term.term}</h3>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-charcoal-soft bg-offwhite border border-border px-2 py-0.5 rounded-full whitespace-nowrap">
            {term.category}
          </span>
          <span
            className="text-charcoal-soft text-lg leading-none w-4 text-center"
            aria-hidden
          >
            {open ? "−" : "+"}
          </span>
        </div>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-border">
          <p className="text-sm text-charcoal leading-relaxed whitespace-pre-line pt-4">
            {term.definition}
          </p>
          {term.source && (
            <p className="text-xs text-charcoal-soft mt-3 pt-3 border-t border-border">
              출처: {term.source}
            </p>
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

function TermForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: GlossaryTerm;
  onSubmit: (t: GlossaryTerm) => void;
  onCancel: () => void;
}) {
  const [term, setTerm] = useState(initial?.term ?? "");
  const [definition, setDefinition] = useState(initial?.definition ?? "");
  const [category, setCategory] = useState<GlossaryCategory>(
    initial?.category ?? "기타",
  );
  const [source, setSource] = useState(initial?.source ?? "");

  const submit = () => {
    if (!term.trim() || !definition.trim()) return;
    onSubmit({
      id: initial?.id ?? `term-${Date.now()}`,
      term: term.trim(),
      definition: definition.trim(),
      category,
      source: source.trim() || undefined,
      related: initial?.related,
    });
  };

  return (
    <li className="bg-white border-2 border-primary/50 rounded-xl p-5 space-y-3 mb-2 list-none">
      <h3 className="font-bold text-sm">
        {initial ? "용어 수정" : "새 용어 추가"}
      </h3>
      <div>
        <label className="text-[11px] text-charcoal-soft block mb-1">
          용어
        </label>
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="예: 거주자"
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
        />
      </div>
      <div>
        <label className="text-[11px] text-charcoal-soft block mb-1">
          카테고리
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as GlossaryCategory)}
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm bg-white"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-[11px] text-charcoal-soft block mb-1">
          정의
        </label>
        <textarea
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
          placeholder="정의"
          rows={6}
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
          placeholder="예: 외환규정 1-2조 29호"
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
          disabled={!term.trim() || !definition.trim()}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-50"
        >
          {initial ? "수정 저장" : "추가"}
        </button>
      </div>
    </li>
  );
}
