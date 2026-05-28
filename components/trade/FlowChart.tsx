"use client";

import { useState } from "react";
import type { FlowStep } from "@/lib/data/trade-finance";

// 거래 흐름도 인터랙티브 컴포넌트 — 신용장·추심 공용.
// 단계별 카드 클릭 → 상세 패널에 행위 주체·내용·고객 응대 멘트 표시.

const CATEGORY_COLOR: Record<NonNullable<FlowStep["category"]>, string> = {
  contract: "bg-charcoal/10 text-charcoal border-charcoal/20",
  shipment: "bg-warn/10 text-warn border-warn/30",
  documents: "bg-primary/10 text-primary border-primary/30",
  payment: "bg-danger/10 text-danger border-danger/30",
  post: "bg-offwhite text-charcoal-soft border-border",
};

const CATEGORY_LABEL: Record<NonNullable<FlowStep["category"]>, string> = {
  contract: "계약",
  shipment: "선적",
  documents: "서류",
  payment: "결제",
  post: "사후",
};

export function FlowChart({ steps }: { steps: FlowStep[] }) {
  const [activeStep, setActiveStep] = useState<number>(steps[0]?.step ?? 1);
  const active = steps.find((s) => s.step === activeStep) ?? steps[0];

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      {/* 단계 카드 그리드 */}
      <div className="bg-offwhite/40 border-b border-border p-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {steps.map((s) => {
            const isActive = s.step === activeStep;
            const cat = s.category ?? "documents";
            return (
              <button
                key={s.step}
                onClick={() => setActiveStep(s.step)}
                className={[
                  "text-left p-2.5 rounded-lg border-2 transition",
                  isActive
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white border-border hover:border-primary/50",
                ].join(" ")}
                aria-pressed={isActive}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={[
                      "text-[10px] font-bold",
                      isActive ? "text-white/80" : "text-charcoal-soft",
                    ].join(" ")}
                  >
                    {String(s.step).padStart(2, "0")}
                  </span>
                  <span
                    className={[
                      "text-[9px] px-1.5 py-0.5 rounded-full border",
                      isActive
                        ? "bg-white/20 border-white/30 text-white"
                        : CATEGORY_COLOR[cat],
                    ].join(" ")}
                  >
                    {CATEGORY_LABEL[cat]}
                  </span>
                </div>
                <p
                  className={[
                    "text-[11px] font-medium leading-tight",
                    isActive ? "text-white" : "text-charcoal",
                  ].join(" ")}
                >
                  {s.action}
                </p>
                <p
                  className={[
                    "text-[10px] mt-0.5 leading-tight",
                    isActive ? "text-white/80" : "text-charcoal-soft",
                  ].join(" ")}
                >
                  {s.actor}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 상세 패널 */}
      {active && (
        <div className="p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="bg-primary text-white rounded-lg w-12 h-12 flex items-center justify-center font-bold shrink-0">
              {String(active.step).padStart(2, "0")}
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                <h3 className="font-bold">{active.action}</h3>
                {active.category && (
                  <span
                    className={[
                      "text-[10px] px-1.5 py-0.5 rounded-full border",
                      CATEGORY_COLOR[active.category],
                    ].join(" ")}
                  >
                    {CATEGORY_LABEL[active.category]}
                  </span>
                )}
              </div>
              <p className="text-xs text-charcoal-soft">
                <strong>{active.actor}</strong>
                {active.actorEng && (
                  <span className="text-[10px] ml-1.5">({active.actorEng})</span>
                )}
              </p>
            </div>
          </div>

          <div className="bg-offwhite border border-border rounded-lg p-3 mb-3">
            <p className="text-[10px] font-medium text-charcoal-soft uppercase tracking-wide mb-1">
              상세 내용
            </p>
            <p className="text-xs text-charcoal leading-relaxed whitespace-pre-wrap">
              {active.detail}
            </p>
          </div>

          {active.scriptForCustomer && (
            <div className="bg-primary/5 border border-primary/30 rounded-lg p-3">
              <p className="text-[10px] font-medium text-primary uppercase tracking-wide mb-1">
                💬 영업점 응대 멘트
              </p>
              <p className="text-xs text-charcoal leading-relaxed">
                &ldquo;{active.scriptForCustomer}&rdquo;
              </p>
            </div>
          )}

          <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
            <button
              onClick={() => setActiveStep(Math.max(1, active.step - 1))}
              disabled={active.step === 1}
              className="text-xs text-charcoal-soft hover:text-primary disabled:opacity-30 disabled:hover:text-charcoal-soft"
            >
              ← 이전 단계
            </button>
            <p className="text-[10px] text-charcoal-soft">
              {active.step} / {steps.length}
            </p>
            <button
              onClick={() =>
                setActiveStep(Math.min(steps.length, active.step + 1))
              }
              disabled={active.step === steps.length}
              className="text-xs text-charcoal-soft hover:text-primary disabled:opacity-30 disabled:hover:text-charcoal-soft"
            >
              다음 단계 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
