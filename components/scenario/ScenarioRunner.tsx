"use client";

import { useState } from "react";
import type {
  FlowResult,
  Scenario,
  ScenarioNode,
  ScenarioOption,
} from "@/lib/types";
import { COUNTRIES } from "@/lib/data";
import { CountryPicker } from "./CountryPicker";

type Props = { scenario: Scenario };

type RunnerState = {
  currentNodeId: string;
  history: string[];
  inputs: Record<string, string | number>;
};

export function ScenarioRunner({ scenario }: Props) {
  const [state, setState] = useState<RunnerState>({
    currentNodeId: scenario.rootNodeId,
    history: [],
    inputs: {},
  });

  const node = scenario.nodes[state.currentNodeId];

  const goTo = (nextId: string) => {
    setState((s) => ({
      ...s,
      currentNodeId: nextId,
      history: [...s.history, s.currentNodeId],
    }));
  };

  const goBack = () => {
    setState((s) => {
      if (s.history.length === 0) return s;
      const prev = s.history[s.history.length - 1];
      return {
        ...s,
        currentNodeId: prev,
        history: s.history.slice(0, -1),
      };
    });
  };

  const reset = () => {
    setState({
      currentNodeId: scenario.rootNodeId,
      history: [],
      inputs: {},
    });
  };

  const setInput = (key: string, value: string | number) => {
    setState((s) => ({ ...s, inputs: { ...s.inputs, [key]: value } }));
  };

  return (
    <div className="grid md:grid-cols-[1fr_280px] gap-6 items-start">
      <section className="bg-white border border-border rounded-xl p-6">
        <div className="mb-5">
          {node.title && (
            <p className="text-xs text-primary font-medium tracking-wide mb-1">
              {node.title}
            </p>
          )}
          <h2 className="text-xl font-semibold leading-snug">{node.question}</h2>
          {node.hint && (
            <p className="text-sm text-charcoal-soft mt-2 bg-offwhite border border-border rounded-md px-3 py-2">
              💡 {node.hint}
            </p>
          )}
        </div>

        {node.type === "input" && (
          <InputNodeView
            node={node}
            inputs={state.inputs}
            setInput={setInput}
            onNext={() => {
              const firstNext = node.options?.[0]?.next;
              if (firstNext) goTo(firstNext);
            }}
          />
        )}

        {node.type === "select" && (
          <SelectNodeView node={node} onSelect={(opt) => goTo(opt.next)} />
        )}

        {node.type === "result" && node.result && (
          <ResultNodeView result={node.result} />
        )}

        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-border">
          <button
            onClick={goBack}
            disabled={state.history.length === 0}
            className="px-3 py-1.5 text-sm text-charcoal-soft hover:text-charcoal disabled:opacity-30 disabled:hover:text-charcoal-soft"
          >
            ← 뒤로
          </button>
          <button
            onClick={reset}
            disabled={state.currentNodeId === scenario.rootNodeId}
            className="ml-auto px-3 py-1.5 text-sm text-charcoal-soft hover:text-primary disabled:opacity-30"
          >
            처음으로
          </button>
        </div>
      </section>

      <SummarySidebar
        inputs={state.inputs}
        steps={state.history.length + 1}
        onReset={reset}
      />
    </div>
  );
}

function InputNodeView({
  node,
  inputs,
  setInput,
  onNext,
}: {
  node: ScenarioNode;
  inputs: Record<string, string | number>;
  setInput: (key: string, value: string | number) => void;
  onNext: () => void;
}) {
  const canProceed = node.inputs?.every((f) => {
    const v = inputs[f.key];
    return v !== undefined && v !== "" && !(typeof v === "number" && isNaN(v));
  });

  return (
    <div className="space-y-4">
      {node.inputs?.map((f) => (
        <div key={f.key}>
          <label className="block text-sm font-medium mb-1.5">{f.label}</label>
          {f.type === "country" ? (
            <CountryPicker
              value={(inputs[f.key] as string) ?? ""}
              onChange={(id) => setInput(f.key, id)}
            />
          ) : f.type === "amountUsd" ? (
            <div className="flex items-center gap-2">
              <span className="text-charcoal-soft text-sm">USD</span>
              <input
                type="number"
                min={0}
                value={inputs[f.key] === undefined ? "" : (inputs[f.key] as number)}
                onChange={(e) =>
                  setInput(
                    f.key,
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                placeholder="예: 3000"
                className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          ) : (
            <input
              type="text"
              value={(inputs[f.key] as string) ?? ""}
              onChange={(e) => setInput(f.key, e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
            />
          )}
          {f.hint && (
            <p className="text-xs text-charcoal-soft mt-1">{f.hint}</p>
          )}
        </div>
      ))}
      <button
        onClick={onNext}
        disabled={!canProceed}
        className="w-full mt-2 bg-primary hover:bg-primary-dark text-white py-2.5 rounded-lg font-medium disabled:bg-border disabled:text-charcoal-soft disabled:cursor-not-allowed transition"
      >
        다음 →
      </button>
    </div>
  );
}

function SelectNodeView({
  node,
  onSelect,
}: {
  node: ScenarioNode;
  onSelect: (opt: ScenarioOption) => void;
}) {
  return (
    <div className="space-y-2">
      {node.options?.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt)}
          className="w-full text-left p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition group"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-medium group-hover:text-primary transition">
                {opt.label}
              </p>
              {opt.detail && (
                <p className="text-sm text-charcoal-soft mt-1">{opt.detail}</p>
              )}
            </div>
            {opt.legalRef && (
              <span className="text-xs text-charcoal-soft bg-offwhite border border-border px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                {opt.legalRef}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

function ResultNodeView({ result }: { result: FlowResult }) {
  return (
    <div className="space-y-4">
      <div className="bg-primary/5 border border-primary/30 rounded-lg p-4">
        <p className="text-xs text-primary font-medium mb-1">거래코드</p>
        <p className="text-lg font-bold text-charcoal">
          {result.transactionCode}
        </p>
        <p className="text-sm text-charcoal-soft mt-2 leading-relaxed">
          {result.legalBasis}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {result.needsBankDesignation && (
          <span className="text-xs bg-offwhite border border-border px-2.5 py-1 rounded-full">
            ✅ 거래외국환은행 지정 필요
          </span>
        )}
        {result.needsHQReview && (
          <span className="text-xs bg-warn/10 border border-warn/30 text-charcoal px-2.5 py-1 rounded-full">
            ⚠️ 본부 외환부서 협의 권장
          </span>
        )}
        <span className="text-xs bg-offwhite border border-border px-2.5 py-1 rounded-full">
          창구 처리
        </span>
      </div>

      <Section
        title="필요 서류"
        items={result.documents}
        emptyText="별도 증빙 서류 불필요"
      />
      <Section title="주의·통보의무" items={result.cautions} />
      <Section
        title="고객 응대 멘트 (직원이 그대로 읽어도 OK)"
        items={result.customerScripts}
        variant="quote"
      />

      {result.suspiciousSignals.length > 0 && (
        <details className="bg-danger/5 border border-danger/20 rounded-lg p-3 text-sm">
          <summary className="cursor-pointer font-medium text-danger">
            의심거래 신호 점검 (직원 내부 — 고객에게 비공개)
          </summary>
          <ul className="mt-2 space-y-1 list-disc list-inside text-charcoal-soft">
            {result.suspiciousSignals.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-danger font-medium">
            ⚠️ STR 검토 사실은 고객에게 절대 누설 금지 (특정금융정보법 §4⑥)
          </p>
        </details>
      )}
    </div>
  );
}

function Section({
  title,
  items,
  emptyText,
  variant,
}: {
  title: string;
  items: string[];
  emptyText?: string;
  variant?: "quote";
}) {
  if (items.length === 0) {
    if (!emptyText) return null;
    return (
      <div>
        <h3 className="text-sm font-medium mb-1.5">{title}</h3>
        <p className="text-sm text-charcoal-soft italic">{emptyText}</p>
      </div>
    );
  }
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <ul className="space-y-1.5 text-sm">
        {items.map((item, i) => (
          <li
            key={i}
            className={
              variant === "quote"
                ? "text-charcoal italic pl-3 border-l-2 border-primary/30"
                : "text-charcoal-soft pl-1 list-disc list-inside"
            }
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SummarySidebar({
  inputs,
  steps,
  onReset,
}: {
  inputs: Record<string, string | number>;
  steps: number;
  onReset: () => void;
}) {
  const countryId = inputs.countryId as string | undefined;
  const amount = inputs.amountUsd as number | undefined;
  const country = COUNTRIES.find((c) => c.id === countryId);
  return (
    <aside className="bg-white border border-border rounded-xl p-4 md:sticky md:top-20">
      <h3 className="text-xs font-medium text-charcoal-soft mb-3 tracking-wide">
        진행 상황
      </h3>
      <dl className="space-y-3 text-sm">
        <Row label="단계" value={`${steps}번째 화면`} />
        <Row
          label="받는 나라"
          value={country ? `${country.flag} ${country.name}` : "—"}
        />
        <Row
          label="금액"
          value={
            amount !== undefined
              ? `USD ${Number(amount).toLocaleString()}`
              : "—"
          }
        />
      </dl>
      <button
        onClick={onReset}
        className="mt-4 w-full text-xs text-charcoal-soft hover:text-primary py-2 border-t border-border pt-3"
      >
        상담 처음부터
      </button>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-charcoal-soft shrink-0">{label}</dt>
      <dd className="text-right text-charcoal truncate">{value}</dd>
    </div>
  );
}
