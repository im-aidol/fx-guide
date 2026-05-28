"use client";

import { useEffect, useMemo, useState } from "react";
import type { Notice, NoticeCategory } from "@/lib/types";
import { NOTICES_SEED } from "@/lib/data/notices-seed";
import { useMode } from "@/components/Mode";

const STORAGE_KEY = "fx-guide:notices";
const CATEGORIES: NoticeCategory[] = ["공지", "가이드", "정책변경"];

export default function NoticesPage() {
  const { mode } = useMode();
  const canEdit = mode === "hq";
  const [notices, setNotices] = useState<Notice[]>([]);
  const [activeCategory, setActiveCategory] =
    useState<NoticeCategory | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setNotices(JSON.parse(raw));
      } else {
        setNotices(NOTICES_SEED);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(NOTICES_SEED));
      }
    } catch {
      setNotices(NOTICES_SEED);
    }
  }, []);

  const persist = (next: Notice[]) => {
    setNotices(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const filtered = useMemo(() => {
    const list = activeCategory
      ? notices.filter((n) => n.category === activeCategory)
      : notices;
    return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [notices, activeCategory]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    notices.forEach((n) => {
      map[n.category] = (map[n.category] ?? 0) + 1;
    });
    return map;
  }, [notices]);

  const addNotice = (
    category: NoticeCategory,
    title: string,
    content: string,
    author: string,
  ) => {
    const next: Notice = {
      id: `n${Date.now()}`,
      category,
      title,
      content,
      author,
      createdAt: new Date().toISOString(),
    };
    persist([next, ...notices]);
    setShowForm(false);
  };

  return (
    <div className="max-w-[clamp(840px,92vw,1280px)] mx-auto px-6 py-12">
      <header className="mb-6">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          공지사항
        </p>
        <h1 className="text-3xl font-bold mb-2">외환사업부 공지·가이드</h1>
        <p className="text-sm text-charcoal-soft">
          본부 외환사업부가 직접 작성·게시하는 공지, 가이드, 정책 변경 사항.
          영업점은 검색·필터로 빠르게 조회.
        </p>
        <p className="text-xs text-charcoal-soft mt-2">
          현재 모드:{" "}
          <span className="font-medium text-charcoal">
            {canEdit ? "🏛️ 본점 (관리자 — 작성·게시 가능)" : "🏢 영업점 (조회 전용)"}
          </span>
        </p>
      </header>

      <DemoNotice />

      <div className="bg-white border border-border rounded-xl p-4 mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          <Chip
            label={`전체 (${notices.length})`}
            active={activeCategory === null}
            onClick={() => setActiveCategory(null)}
          />
          {CATEGORIES.map((c) => (
            <Chip
              key={c}
              label={`${c} (${counts[c] ?? 0})`}
              active={activeCategory === c}
              onClick={() => setActiveCategory(c)}
            />
          ))}
        </div>
        {canEdit && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            {showForm ? "취소" : "+ 새 글 작성"}
          </button>
        )}
      </div>

      {canEdit && showForm && <NewNoticeForm onSubmit={addNotice} />}

      {filtered.length === 0 ? (
        <p className="text-center text-charcoal-soft py-12">게시글이 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((n) => (
            <NoticeCard key={n.id} notice={n} />
          ))}
        </ul>
      )}
    </div>
  );
}

function DemoNotice() {
  return (
    <div className="bg-warn/10 border border-warn/30 rounded-md px-4 py-2 mb-4 text-xs text-charcoal-soft">
      ⚠️ 시연용 데모입니다. 작성 내용은 브라우저에 저장되며 새로고침 시 유지되나
      다른 사용자와 공유되지 않습니다. 실제 도입 시 내부망 인증·중앙 저장소
      연동 필요.
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

function NewNoticeForm({
  onSubmit,
}: {
  onSubmit: (
    c: NoticeCategory,
    title: string,
    content: string,
    author: string,
  ) => void;
}) {
  const [category, setCategory] = useState<NoticeCategory>("공지");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("외환사업부");

  const submit = () => {
    if (!title.trim() || !content.trim()) return;
    onSubmit(category, title.trim(), content.trim(), author.trim() || "외환사업부");
  };

  return (
    <div className="bg-white border border-border rounded-xl p-5 mb-4 space-y-3">
      <h3 className="font-bold text-sm">새 글 작성</h3>
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs text-charcoal-soft">카테고리</label>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={[
              "text-xs px-2.5 py-1 rounded-md border transition",
              category === c
                ? "bg-primary text-white border-primary"
                : "bg-white border-border text-charcoal-soft hover:border-primary",
            ].join(" ")}
          >
            {c}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목"
        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="내용"
        rows={6}
        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm resize-y"
      />
      <div className="flex items-center justify-between gap-3">
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="작성자 (예: 외환사업부)"
          className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
        />
        <button
          onClick={submit}
          disabled={!title.trim() || !content.trim()}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          게시
        </button>
      </div>
    </div>
  );
}

function NoticeCard({ notice }: { notice: Notice }) {
  const [open, setOpen] = useState(false);
  const date = new Date(notice.createdAt);
  const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;

  const categoryColor: Record<NoticeCategory, string> = {
    공지: "bg-offwhite border-border text-charcoal-soft",
    가이드: "bg-primary/10 border-primary/30 text-primary",
    정책변경: "bg-warn/10 border-warn/40 text-charcoal",
  };

  return (
    <li className="bg-white border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-4 hover:bg-offwhite transition"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={[
                  "text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap",
                  categoryColor[notice.category],
                ].join(" ")}
              >
                {notice.category}
              </span>
              <span className="text-[10px] text-charcoal-soft">
                {notice.author} · {dateStr}
              </span>
            </div>
            <h3 className="font-medium">{notice.title}</h3>
          </div>
          <span className="text-charcoal-soft text-lg shrink-0">
            {open ? "−" : "+"}
          </span>
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-border">
          <div className="text-sm text-charcoal leading-relaxed whitespace-pre-line pt-3">
            {notice.content}
          </div>
        </div>
      )}
    </li>
  );
}
