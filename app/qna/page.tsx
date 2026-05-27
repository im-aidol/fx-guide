"use client";

import { useEffect, useMemo, useState } from "react";
import type { QnaItem, QnaStatus } from "@/lib/types";
import { QNA_SEED } from "@/lib/data/qna-seed";
import { useMode } from "@/components/Mode";

const STORAGE_KEY = "fx-guide:qna";
const STATUS: (QnaStatus | "전체")[] = ["전체", "대기", "완료"];

export default function QnaPage() {
  const { mode } = useMode();
  const isBranch = mode === "branch";
  const isHq = mode === "hq";
  const [items, setItems] = useState<QnaItem[]>([]);
  const [filter, setFilter] = useState<QnaStatus | "전체">("전체");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setItems(JSON.parse(raw));
      } else {
        setItems(QNA_SEED);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(QNA_SEED));
      }
    } catch {
      setItems(QNA_SEED);
    }
  }, []);

  const persist = (next: QnaItem[]) => {
    setItems(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const filtered = useMemo(() => {
    const list =
      filter === "전체"
        ? items
        : items.filter((q) =>
            filter === "대기" ? !q.answer : Boolean(q.answer),
          );
    return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [items, filter]);

  const counts = useMemo(
    () => ({
      total: items.length,
      pending: items.filter((q) => !q.answer).length,
      done: items.filter((q) => q.answer).length,
    }),
    [items],
  );

  const addQuestion = (
    title: string,
    question: string,
    isAnonymous: boolean,
    name?: string,
  ) => {
    const next: QnaItem = {
      id: `q${Date.now()}`,
      title,
      question,
      isAnonymous,
      questionerName: isAnonymous ? undefined : name,
      createdAt: new Date().toISOString(),
    };
    persist([next, ...items]);
    setShowForm(false);
  };

  const addAnswer = (id: string, answer: string, answeredBy: string) => {
    const next = items.map((q) =>
      q.id === id
        ? {
            ...q,
            answer,
            answeredBy: answeredBy || "외환사업부",
            answeredAt: new Date().toISOString(),
          }
        : q,
    );
    persist(next);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-6">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          익명 Q&amp;A
        </p>
        <h1 className="text-3xl font-bold mb-2">외환 문답 게시판</h1>
        <p className="text-sm text-charcoal-soft">
          영업점 직원이 익명으로 질문하면 본부 외환사업부가 답변합니다. 답변
          누적분은 향후 FAQ로 승격됩니다.
        </p>
        <p className="text-xs text-charcoal-soft mt-2">
          현재 모드:{" "}
          <span className="font-medium text-charcoal">
            {isHq
              ? "🏛️ 본점 (관리자 — 답변 작성)"
              : "🏢 영업점 (질문 등록 가능)"}
          </span>
        </p>
      </header>

      <DemoNotice />

      <div className="bg-white border border-border rounded-xl p-4 mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {STATUS.map((s) => {
            const count =
              s === "전체"
                ? counts.total
                : s === "대기"
                  ? counts.pending
                  : counts.done;
            return (
              <Chip
                key={s}
                label={`${s} (${count})`}
                active={filter === s}
                onClick={() => setFilter(s)}
              />
            );
          })}
        </div>
        {isBranch && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            {showForm ? "취소" : "+ 새 질문 등록"}
          </button>
        )}
      </div>

      {isBranch && showForm && <NewQuestionForm onSubmit={addQuestion} />}

      {filtered.length === 0 ? (
        <p className="text-center text-charcoal-soft py-12">질문이 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((q) => (
            <QnaCard
              key={q.id}
              item={q}
              onAnswer={addAnswer}
              canAnswer={isHq}
            />
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
      다른 사용자와 공유되지 않습니다. 실제 도입 시 내부망 인증·답변 책임자
      지정·민감정보 노출 방지 등 운영 정책 별도 수립 필요.
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

function NewQuestionForm({
  onSubmit,
}: {
  onSubmit: (
    title: string,
    question: string,
    isAnonymous: boolean,
    name?: string,
  ) => void;
}) {
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [name, setName] = useState("");

  const submit = () => {
    if (!title.trim() || !question.trim()) return;
    onSubmit(
      title.trim(),
      question.trim(),
      isAnonymous,
      isAnonymous ? undefined : name.trim() || undefined,
    );
  };

  return (
    <div className="bg-white border border-border rounded-xl p-5 mb-4 space-y-3">
      <h3 className="font-bold text-sm">새 질문 등록</h3>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="질문 제목 (한 줄)"
        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
      />
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="질문 내용을 자세히 작성해주세요"
        rows={5}
        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm resize-y"
      />
      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          익명으로 등록
        </label>
        {!isAnonymous && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="작성자 (선택)"
            className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
          />
        )}
        <button
          onClick={submit}
          disabled={!title.trim() || !question.trim()}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          등록
        </button>
      </div>
    </div>
  );
}

function QnaCard({
  item,
  onAnswer,
  canAnswer,
}: {
  item: QnaItem;
  onAnswer: (id: string, answer: string, answeredBy: string) => void;
  canAnswer: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answer, setAnswer] = useState("");
  const [answeredBy, setAnsweredBy] = useState("외환사업부");

  const date = new Date(item.createdAt);
  const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  const status: QnaStatus = item.answer ? "완료" : "대기";

  const submit = () => {
    if (!answer.trim()) return;
    onAnswer(item.id, answer.trim(), answeredBy.trim() || "외환사업부");
    setAnswer("");
    setShowAnswerForm(false);
  };

  return (
    <li className="bg-white border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-4 hover:bg-offwhite transition"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span
                className={[
                  "text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap",
                  status === "완료"
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-warn/10 border-warn/40 text-charcoal",
                ].join(" ")}
              >
                {status === "완료" ? "✓ 답변완료" : "● 답변대기"}
              </span>
              <span className="text-[10px] text-charcoal-soft">
                {item.isAnonymous ? "익명" : (item.questionerName ?? "—")} ·{" "}
                {dateStr}
              </span>
            </div>
            <h3 className="font-medium">{item.title}</h3>
          </div>
          <span className="text-charcoal-soft text-lg shrink-0">
            {open ? "−" : "+"}
          </span>
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-border">
          <div className="pt-3">
            <p className="text-[10px] text-charcoal-soft uppercase tracking-wide mb-1">
              질문
            </p>
            <p className="text-sm text-charcoal whitespace-pre-line leading-relaxed">
              {item.question}
            </p>
          </div>

          {item.answer ? (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-[10px] text-primary uppercase tracking-wide mb-1">
                답변 · {item.answeredBy ?? "외환사업부"}
              </p>
              <p className="text-sm text-charcoal whitespace-pre-line leading-relaxed">
                {item.answer}
              </p>
            </div>
          ) : canAnswer ? (
            <div className="mt-4 pt-4 border-t border-border">
              {showAnswerForm ? (
                <div className="space-y-2">
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="답변 작성 (외환사업부)"
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm resize-y"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={answeredBy}
                      onChange={(e) => setAnsweredBy(e.target.value)}
                      placeholder="답변자 (예: 외환사업부)"
                      className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
                    />
                    <button
                      onClick={() => setShowAnswerForm(false)}
                      className="text-xs text-charcoal-soft hover:text-charcoal px-2"
                    >
                      취소
                    </button>
                    <button
                      onClick={submit}
                      disabled={!answer.trim()}
                      className="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-50"
                    >
                      답변 등록
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAnswerForm(true)}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  + 답변 작성 (본부)
                </button>
              )}
            </div>
          ) : (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-charcoal-soft italic">
                답변 대기 중입니다. 본부 외환사업부에서 곧 답변 드립니다.
              </p>
            </div>
          )}
        </div>
      )}
    </li>
  );
}
