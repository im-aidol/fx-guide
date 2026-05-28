"use client";

// 무역금융 시나리오 편집 모달.
// 본점 외환사업부만 사용. 영업점은 호출 안 함.
// 배열 필드는 줄 단위 textarea로 받아서 split.

import { useEffect, useState } from "react";
import type {
  TradeScenario,
  TradeScenarioCategory,
  TradeScenarioSubCategory,
} from "@/lib/data/trade-scenarios";

const SUB_OPTIONS: { value: TradeScenarioSubCategory; label: string }[] = [
  { value: "lc-open", label: "신용장 개설" },
  { value: "lc-amend", label: "조건변경" },
  { value: "lc-receive", label: "서류 도착·결제·인수" },
  { value: "lc-issue", label: "통지·교부" },
  { value: "nego", label: "매입 (NEGO)" },
  { value: "collection", label: "추심 (D/P·D/A)" },
  { value: "lg-tr", label: "L/G·T/R" },
  { value: "tt-finance", label: "T/T수입금융" },
  { value: "default", label: "부도·연체·만기" },
];

type EditorState = {
  id: string;
  category: TradeScenarioCategory;
  subCategory: TradeScenarioSubCategory;
  title: string;
  customerSays: string;
  summary: string;
  whatToBringText: string; // 줄 단위
  checklistText: string; // 줄 단위, label || detail 형식
  procedureText: string;
  timing: string;
  feesText: string;
  cautionsText: string;
  scriptsText: string;
  relatedGuidesText: string; // 줄 단위, label || href
  source: string;
};

function toEditorState(s: TradeScenario): EditorState {
  return {
    id: s.id,
    category: s.category,
    subCategory: s.subCategory,
    title: s.title,
    customerSays: s.customerSays,
    summary: s.summary,
    whatToBringText: s.whatToBring.join("\n"),
    checklistText: s.checklist
      .map((c) => (c.detail ? `${c.label} || ${c.detail}` : c.label))
      .join("\n"),
    procedureText: s.procedure.join("\n"),
    timing: s.timing ?? "",
    feesText: (s.fees ?? []).join("\n"),
    cautionsText: (s.cautions ?? []).join("\n"),
    scriptsText: s.scripts.join("\n"),
    relatedGuidesText: (s.relatedGuides ?? [])
      .map((g) => `${g.label} || ${g.href}`)
      .join("\n"),
    source: s.source,
  };
}

function fromEditorState(e: EditorState): TradeScenario {
  const split = (t: string) =>
    t
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

  const checklist = split(e.checklistText).map((line) => {
    const [label, detail] = line.split("||").map((p) => p.trim());
    return detail ? { label, detail } : { label };
  });

  const relatedGuides = split(e.relatedGuidesText)
    .map((line) => {
      const [label, href] = line.split("||").map((p) => p.trim());
      if (!label || !href) return null;
      return { label, href };
    })
    .filter((g): g is { label: string; href: string } => g !== null);

  return {
    id: e.id.trim() || `custom-${Date.now()}`,
    category: e.category,
    subCategory: e.subCategory,
    title: e.title.trim(),
    customerSays: e.customerSays.trim(),
    summary: e.summary.trim(),
    whatToBring: split(e.whatToBringText),
    checklist,
    procedure: split(e.procedureText),
    timing: e.timing.trim() || undefined,
    fees: split(e.feesText).length > 0 ? split(e.feesText) : undefined,
    cautions:
      split(e.cautionsText).length > 0 ? split(e.cautionsText) : undefined,
    scripts: split(e.scriptsText),
    relatedGuides: relatedGuides.length > 0 ? relatedGuides : undefined,
    source: e.source.trim(),
  };
}

function emptyScenario(): TradeScenario {
  return {
    id: `custom-${Date.now()}`,
    category: "import",
    subCategory: "lc-open",
    title: "",
    customerSays: "",
    summary: "",
    whatToBring: [],
    checklist: [],
    procedure: [],
    scripts: [],
    source: "본점 외환사업부 작성",
  };
}

type Props = {
  scenario: TradeScenario | null; // null = 새로 추가
  isOpen: boolean;
  onClose: () => void;
  onSave: (s: TradeScenario) => void;
};

export function ScenarioEditor({ scenario, isOpen, onClose, onSave }: Props) {
  const [state, setState] = useState<EditorState>(() =>
    toEditorState(scenario ?? emptyScenario()),
  );

  useEffect(() => {
    if (isOpen) {
      setState(toEditorState(scenario ?? emptyScenario()));
    }
  }, [scenario, isOpen]);

  if (!isOpen) return null;

  const set = <K extends keyof EditorState>(key: K, value: EditorState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const submit = () => {
    if (!state.title.trim()) {
      alert("제목은 필수입니다.");
      return;
    }
    onSave(fromEditorState(state));
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="bg-primary text-white px-5 py-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wide opacity-80">
              본점 외환사업부 · 시나리오 편집
            </p>
            <h2 className="font-bold text-lg">
              {scenario ? "시나리오 수정" : "새 시나리오 추가"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl leading-none"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* 카테고리 + 분류 */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="유형">
              <select
                value={state.category}
                onChange={(e) =>
                  set("category", e.target.value as TradeScenarioCategory)
                }
                className="w-full border border-border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-primary"
              >
                <option value="import">📥 수입</option>
                <option value="export">📤 수출</option>
              </select>
            </Field>
            <Field label="분류">
              <select
                value={state.subCategory}
                onChange={(e) =>
                  set(
                    "subCategory",
                    e.target.value as TradeScenarioSubCategory,
                  )
                }
                className="w-full border border-border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-primary"
              >
                {SUB_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* ID (편집 시 readonly) */}
          <Field
            label="ID (URL slug)"
            hint={
              scenario
                ? "기존 시나리오 ID는 변경 안 됩니다."
                : "영문·숫자·하이픈만. 비워두면 자동 생성."
            }
          >
            <input
              type="text"
              value={state.id}
              onChange={(e) => set("id", e.target.value)}
              disabled={!!scenario}
              className="w-full border border-border rounded px-2 py-1.5 text-sm font-mono focus:outline-none focus:border-primary disabled:bg-offwhite disabled:text-charcoal-soft"
            />
          </Field>

          {/* 제목 */}
          <Field label="시나리오 제목 (영업점 입장)" required>
            <input
              type="text"
              value={state.title}
              onChange={(e) => set("title", e.target.value)}
              className="w-full border border-border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-primary"
              placeholder="예: 수입 신용장 개설 의뢰"
            />
          </Field>

          {/* 고객 멘트 */}
          <Field label="고객이 와서 하는 말 (예시)">
            <input
              type="text"
              value={state.customerSays}
              onChange={(e) => set("customerSays", e.target.value)}
              className="w-full border border-border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-primary"
              placeholder="예: 수입 신용장(L/C) 개설하러 왔습니다."
            />
          </Field>

          {/* 한 줄 요약 */}
          <Field label="한 줄 요약">
            <textarea
              value={state.summary}
              onChange={(e) => set("summary", e.target.value)}
              rows={2}
              className="w-full border border-border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-primary resize-y"
            />
          </Field>

          {/* 가져왔어야 할 것 */}
          <LinesField
            label="가져왔어야 할 것 (줄당 1개)"
            value={state.whatToBringText}
            onChange={(v) => set("whatToBringText", v)}
            rows={4}
          />

          {/* 점검 항목 */}
          <LinesField
            label="점검 항목 (한 줄에 '제목 || 상세설명' 형식. 상세 없으면 제목만)"
            value={state.checklistText}
            onChange={(v) => set("checklistText", v)}
            rows={6}
            hint="예: 외화한도 잔액 확인 || 부족 시 보증금 추가 적립"
          />

          {/* 처리 절차 */}
          <LinesField
            label="처리 절차 (줄당 1단계)"
            value={state.procedureText}
            onChange={(v) => set("procedureText", v)}
            rows={5}
          />

          {/* 기한·만기 */}
          <Field label="기한·만기">
            <textarea
              value={state.timing}
              onChange={(e) => set("timing", e.target.value)}
              rows={2}
              className="w-full border border-border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-primary resize-y"
            />
          </Field>

          {/* 수수료 */}
          <LinesField
            label="수수료 (줄당 1개)"
            value={state.feesText}
            onChange={(v) => set("feesText", v)}
            rows={3}
          />

          {/* 주의사항 */}
          <LinesField
            label="주의사항·하자 가능성 (줄당 1개)"
            value={state.cautionsText}
            onChange={(v) => set("cautionsText", v)}
            rows={4}
          />

          {/* 응대 멘트 */}
          <LinesField
            label="영업점 응대 멘트 (줄당 1개)"
            value={state.scriptsText}
            onChange={(v) => set("scriptsText", v)}
            rows={5}
          />

          {/* 관련 가이드 */}
          <LinesField
            label="관련 가이드 (한 줄에 '레이블 || URL')"
            value={state.relatedGuidesText}
            onChange={(v) => set("relatedGuidesText", v)}
            rows={3}
            hint="예: 수입 신용장 가이드 || /guide/trade-finance/import-lc"
          />

          {/* 출처 */}
          <Field label="출처">
            <input
              type="text"
              value={state.source}
              onChange={(e) => set("source", e.target.value)}
              className="w-full border border-border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-primary"
            />
          </Field>
        </div>

        {/* 푸터 */}
        <div className="bg-offwhite border-t border-border px-5 py-3 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="text-xs text-charcoal-soft hover:text-charcoal px-3 py-1.5"
          >
            취소
          </button>
          <button
            onClick={submit}
            className="bg-primary hover:bg-primary-dark text-white text-xs font-medium px-4 py-1.5 rounded transition"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-charcoal-soft mb-1">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-[10px] text-charcoal-soft mt-1">{hint}</p>}
    </div>
  );
}

function LinesField({
  label,
  value,
  onChange,
  rows,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows: number;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full border border-border rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-primary resize-y leading-relaxed"
      />
    </Field>
  );
}
