"use client";

import { useEffect, useState } from "react";
import type {
  Country,
  FlowResult,
  Scenario,
  ScenarioNode,
  ScenarioOption,
} from "@/lib/types";
import { COUNTRIES, getSendableCurrencies, isImBankSendable } from "@/lib/data";
import {
  fetchUsdRates,
  localToUsd,
  type UsdRates,
} from "@/lib/exchange-rates";
import { CountryPicker } from "./CountryPicker";
import { Flag } from "@/components/Flag";

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

  const [rates, setRates] = useState<UsdRates | null>(null);
  const [ratesError, setRatesError] = useState<boolean>(false);

  useEffect(() => {
    fetchUsdRates()
      .then(setRates)
      .catch(() => setRatesError(true));
  }, []);

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
    setState((s) => {
      const newInputs: Record<string, string | number> = {
        ...s.inputs,
        [key]: value,
      };

      // 나라 변경 시 금액·통화 선택 초기화
      if (key === "countryId") {
        delete newInputs.amountLocal;
        delete newInputs.amountUsd;
        delete newInputs.amountCurrency;
      }

      // amountLocal 또는 amountCurrency 변경 시 USD 자동 환산
      if (key === "amountLocal" || key === "amountCurrency") {
        const countryId =
          (newInputs.countryId as string) || (s.inputs.countryId as string);
        const country = COUNTRIES.find((c) => c.id === countryId);
        const selectedCurrency =
          (newInputs.amountCurrency as string) ||
          country?.currency ||
          "USD";
        const amount = newInputs.amountLocal as number | undefined;

        if (typeof amount === "number" && !isNaN(amount)) {
          if (selectedCurrency === "USD") {
            newInputs.amountUsd = amount;
          } else if (rates) {
            const usd = localToUsd(amount, selectedCurrency, rates);
            if (usd !== null) newInputs.amountUsd = usd;
          }
        }
      }

      return { ...s, inputs: newInputs };
    });
  };

  const selectedCountry = COUNTRIES.find(
    (c) => c.id === (state.inputs.countryId as string),
  );

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
            country={selectedCountry}
            rates={rates}
            ratesError={ratesError}
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
          <ResultNodeView
            result={node.result}
            amountUsd={state.inputs.amountUsd as number | undefined}
            amountLocal={state.inputs.amountLocal as number | undefined}
            inputCurrency={
              (state.inputs.amountCurrency as string) ||
              selectedCountry?.currency
            }
          />
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
        country={selectedCountry}
        rates={rates}
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
  country,
  rates,
  ratesError,
  onNext,
}: {
  node: ScenarioNode;
  inputs: Record<string, string | number>;
  setInput: (key: string, value: string | number) => void;
  country: Country | undefined;
  rates: UsdRates | null;
  ratesError: boolean;
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
          ) : f.type === "amount" ? (
            <AmountInput
              fieldKey={f.key}
              inputs={inputs}
              setInput={setInput}
              country={country}
              rates={rates}
              ratesError={ratesError}
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

function AmountInput({
  fieldKey,
  inputs,
  setInput,
  country,
  rates,
  ratesError,
}: {
  fieldKey: string;
  inputs: Record<string, string | number>;
  setInput: (key: string, value: string | number) => void;
  country: Country | undefined;
  rates: UsdRates | null;
  ratesError: boolean;
}) {
  const sendableCurrencies = country ? getSendableCurrencies(country) : [];
  const selectedCurrency =
    (inputs.amountCurrency as string) ||
    sendableCurrencies[0] ||
    "USD";

  const amountLocal = inputs[fieldKey];
  const amountUsd = inputs.amountUsd as number | undefined;

  const placeholder =
    selectedCurrency === "VND"
      ? "예: 5000000"
      : selectedCurrency === "JPY"
        ? "예: 100000"
        : selectedCurrency === "IDR"
          ? "예: 5000000"
          : "예: 3000";

  return (
    <div className="space-y-2">
      {/* 통화 토글 (자국통화 vs USD) */}
      {country && sendableCurrencies.length > 1 && (
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-charcoal-soft mr-1">송금 통화</span>
          {sendableCurrencies.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setInput("amountCurrency", c)}
              className={[
                "px-2.5 py-1 rounded-md border transition font-medium",
                selectedCurrency === c
                  ? "bg-primary text-white border-primary"
                  : "bg-white border-border text-charcoal-soft hover:border-primary",
              ].join(" ")}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          value={amountLocal === undefined ? "" : (amountLocal as number)}
          onChange={(e) =>
            setInput(
              fieldKey,
              e.target.value === "" ? "" : Number(e.target.value),
            )
          }
          placeholder={placeholder}
          disabled={!country}
          className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary disabled:bg-offwhite disabled:cursor-not-allowed"
        />
        <span className="text-charcoal-soft text-sm font-medium whitespace-nowrap min-w-[3rem] text-center border border-border rounded-md px-2 py-1.5 bg-offwhite">
          {country ? selectedCurrency : "—"}
        </span>
      </div>

      {!country ? (
        <p className="text-xs text-warn">⚠️ 받는 나라를 먼저 선택하세요.</p>
      ) : (
        <AmountFooter
          currency={selectedCurrency}
          amountLocal={amountLocal}
          amountUsd={amountUsd}
          rates={rates}
          ratesError={ratesError}
        />
      )}
    </div>
  );
}

function AmountFooter({
  currency,
  amountLocal,
  amountUsd,
  rates,
  ratesError,
}: {
  currency: string;
  amountLocal: string | number | undefined;
  amountUsd: number | undefined;
  rates: UsdRates | null;
  ratesError: boolean;
}) {
  const isUsd = currency === "USD";
  const rate = rates?.rates[currency.toLowerCase()];
  // iM뱅크 SWIFT 송금 가능 17종 통화 외(예: VND/CNY/INR)는 입력만 자국통화로,
  // 실제 송금은 USD로 처리됨을 안내.
  const needsUsdConversion = !isUsd && !isImBankSendable(currency);

  return (
    <div className="text-xs bg-offwhite border border-border rounded-md px-3 py-2 space-y-0.5">
      {isUsd ? (
        <p className="text-charcoal-soft">USD 직접 입력</p>
      ) : ratesError ? (
        <p className="text-warn">
          ⚠️ 환율 가져오기 실패 — USD 환산은 직접 계산 필요
        </p>
      ) : !rates ? (
        <p className="text-charcoal-soft">환율 가져오는 중…</p>
      ) : amountLocal === "" || amountLocal === undefined ? (
        <p className="text-charcoal-soft">
          금액 입력 시 USD 환산 자동 표시 · 환율 1 USD ={" "}
          {rate?.toLocaleString()} {currency} ({rates.date} 갱신)
        </p>
      ) : amountUsd === undefined ? (
        <p className="text-warn">⚠️ 환산 불가</p>
      ) : (
        <>
          <p className="text-charcoal font-semibold">
            ≈ USD{" "}
            {amountUsd.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-charcoal-soft">
            환율 1 USD = {rate?.toLocaleString()} {currency} ({rates.date}{" "}
            갱신)
          </p>
          {needsUsdConversion && (
            <p className="text-warn text-[11px] mt-1 pt-1 border-t border-border">
              ℹ️ {currency}는 iM뱅크 SWIFT 송금 17종 미포함 — 실제 송금은 USD로
              환산 처리됩니다 (현지에서 {currency}로 환전 수령).
            </p>
          )}
          <p className="text-[10px] text-charcoal-soft mt-1">
            ⚠️ 참고용 환율. 실제 거래는 iM뱅크 매매기준율 적용
          </p>
        </>
      )}
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

function ResultNodeView({
  result,
  amountUsd,
  amountLocal,
  inputCurrency,
}: {
  result: FlowResult;
  amountUsd?: number;
  amountLocal?: number;
  inputCurrency?: string;
}) {
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

      {amountUsd !== undefined && (
        <ThresholdCheck
          amount={amountUsd}
          amountLocal={amountLocal}
          inputCurrency={inputCurrency}
        />
      )}

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

      <DocumentsChecklist
        key={result.transactionCode}
        items={result.documents}
      />
      <Section
        title="주의·통보의무"
        icon="⚠️"
        items={result.cautions}
        variant="caution"
      />
      <Section
        title="고객 응대 멘트"
        subtitle="직원이 그대로 읽어도 OK"
        icon="💬"
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

function DocumentsChecklist({ items }: { items: string[] }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  if (items.length === 0) {
    return (
      <section className="bg-offwhite border border-border rounded-lg p-4">
        <h3 className="text-sm font-medium mb-1.5 flex items-center gap-2">
          <span>📋</span>
          <span>필요 서류</span>
        </h3>
        <p className="text-sm text-charcoal-soft italic">
          별도 증빙 서류 불필요
        </p>
      </section>
    );
  }

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const allChecked = checked.size === items.length;
  const toggleAll = () => {
    setChecked(allChecked ? new Set() : new Set(items.map((_, i) => i)));
  };

  return (
    <section className="bg-primary/5 border border-primary/20 rounded-lg p-4">
      <div className="flex items-baseline justify-between mb-2 gap-2">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <span>📋</span>
          <span>필요 서류</span>
          <span className="text-xs text-charcoal-soft font-normal">
            ({checked.size}/{items.length} 확인)
          </span>
        </h3>
        <button
          type="button"
          onClick={toggleAll}
          className="text-xs text-primary hover:text-primary-dark font-medium shrink-0"
        >
          {allChecked ? "전체 해제" : "전체 체크"}
        </button>
      </div>
      <ul className="space-y-1">
        {items.map((item, i) => {
          const isChecked = checked.has(i);
          return (
            <li key={i}>
              <label className="flex items-start gap-2 py-1.5 px-2 -mx-2 rounded-md hover:bg-offwhite cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggle(i)}
                  className="peer sr-only"
                  aria-label={item}
                />
                <span
                  aria-hidden="true"
                  className={[
                    "mt-0.5 w-4 h-4 shrink-0 rounded border flex items-center justify-center transition",
                    "peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-1",
                    isChecked
                      ? "bg-primary border-primary"
                      : "bg-white border-charcoal-soft/40",
                  ].join(" ")}
                >
                  {isChecked && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </span>
                <span
                  className={[
                    "text-sm leading-relaxed select-none",
                    isChecked
                      ? "text-charcoal-soft line-through"
                      : "text-charcoal",
                  ].join(" ")}
                >
                  {item}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Section({
  title,
  subtitle,
  icon,
  items,
  emptyText,
  variant,
}: {
  title: string;
  subtitle?: string;
  icon?: string;
  items: string[];
  emptyText?: string;
  variant?: "quote" | "caution";
}) {
  // 색상 분기
  const bgClass =
    variant === "caution"
      ? "bg-warn/10 border-warn/30"
      : variant === "quote"
        ? "bg-offwhite border-border"
        : "bg-white border-border";

  if (items.length === 0) {
    if (!emptyText) return null;
    return (
      <section className={`border rounded-lg p-4 ${bgClass}`}>
        <h3 className="text-sm font-semibold mb-1.5 flex items-center gap-2">
          {icon && <span>{icon}</span>}
          <span>{title}</span>
        </h3>
        <p className="text-sm text-charcoal-soft italic">{emptyText}</p>
      </section>
    );
  }
  return (
    <section className={`border rounded-lg p-4 ${bgClass}`}>
      <div className="mb-2 flex items-baseline justify-between gap-2 flex-wrap">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          {icon && <span>{icon}</span>}
          <span>{title}</span>
        </h3>
        {subtitle && (
          <span className="text-[11px] text-charcoal-soft">{subtitle}</span>
        )}
      </div>
      <ul className="space-y-1.5 text-sm">
        {items.map((item, i) => (
          <li
            key={i}
            className={
              variant === "quote"
                ? "text-charcoal italic pl-3 border-l-2 border-primary/30"
                : variant === "caution"
                  ? "text-charcoal pl-1 list-disc list-inside"
                  : "text-charcoal-soft pl-1 list-disc list-inside"
            }
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

// 입력한 USD 환산 금액 기준 임계값 자동 점검.
// 외환규정 4-3조 ①·②·4-4조·4-8조 + iM뱅크 안내 한도 기준.
// 외환규정 임계값은 모두 USD("미화") 기준이라 자국통화 입력 시 USD로 환산해 점검.
function ThresholdCheck({
  amount,
  amountLocal,
  inputCurrency,
}: {
  amount: number;
  amountLocal?: number;
  inputCurrency?: string;
}) {
  type Severity = "ok" | "info" | "warn" | "danger";
  type Check = {
    label: string;
    desc: string;
    sev: Severity;
  };

  const checks: Check[] = [];

  if (amount <= 0) return null;

  // 무증빙 단계
  if (amount <= 5000) {
    checks.push({
      label: "USD 5,000 이하",
      desc: "건당 무증빙 송금 가능 (4-3조 ②가목 / 4-4조 ④1호)",
      sev: "ok",
    });
  } else if (amount <= 10000) {
    checks.push({
      label: "USD 5,000 ~ 10,000",
      desc: "증빙 또는 외국환은행장 확인 (4-3조 ② 적용)",
      sev: "info",
    });
  }

  // 통보 의무
  if (amount > 10000) {
    checks.push({
      label: "USD 10,000 초과",
      desc: "국세청·관세청·금감원 통보 발동 (외환규정 4-8조 ①·②·③)",
      sev: "warn",
    });
  }

  // 외국인·비거주자 한도
  if (amount > 50000) {
    checks.push({
      label: "USD 50,000 초과",
      desc: "외국인·비거주자라면 연간 국내소득송금 한도(iM뱅크 안내) 초과 — 거래외국환은행 지정 필수",
      sev: "warn",
    });
  }

  // 거주자 무증빙 한도
  if (amount > 100000) {
    checks.push({
      label: "USD 100,000 초과",
      desc: "거주자 무증빙 연간 한도(4-3조 ①1호) 초과 — 증빙 제출 또는 외국환은행장 확인 필요",
      sev: "danger",
    });
  }

  if (checks.length === 0) return null;

  const fmt = (n: number) =>
    n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  // 입력값이 USD가 아닌 경우 헤더에 원본 통화·금액 + USD 환산 함께 표시
  const hasLocalInput =
    inputCurrency &&
    inputCurrency !== "USD" &&
    typeof amountLocal === "number" &&
    !isNaN(amountLocal);

  return (
    <div className="bg-offwhite border border-border rounded-lg p-3">
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <p className="text-xs font-medium text-charcoal-soft uppercase tracking-wide">
          💰 임계 점검 (1회 송금 기준)
        </p>
        <p className="text-[10px] text-charcoal-soft">
          외환규정 임계값은 모두 USD 기준
        </p>
      </div>
      <p className="text-sm font-semibold mb-2 pb-2 border-b border-border">
        {hasLocalInput ? (
          <>
            {fmt(amountLocal)} {inputCurrency}{" "}
            <span className="text-charcoal-soft font-normal">
              → ≈ USD {fmt(amount)} 로 환산해 점검
            </span>
          </>
        ) : (
          <>USD {fmt(amount)}</>
        )}
      </p>
      <ul className="space-y-1.5 text-sm">
        {checks.map((c, i) => (
          <CheckItem key={i} check={c} />
        ))}
      </ul>
      <p className="text-[10px] text-charcoal-soft mt-2 pt-2 border-t border-border">
        ⚠️ 연간 누계 한도는 별도 — 본부 시스템·고객 누계 별도 확인 필요
      </p>
    </div>
  );
}

function CheckItem({
  check,
}: {
  check: { label: string; desc: string; sev: "ok" | "info" | "warn" | "danger" };
}) {
  const colors = {
    ok: { icon: "✓", text: "text-primary", bg: "bg-primary/5" },
    info: { icon: "ⓘ", text: "text-charcoal-soft", bg: "bg-white" },
    warn: { icon: "⚠️", text: "text-charcoal", bg: "bg-warn/10" },
    danger: { icon: "❌", text: "text-danger", bg: "bg-danger/10" },
  }[check.sev];

  return (
    <li
      className={`flex items-start gap-2 px-2 py-1.5 rounded ${colors.bg}`}
    >
      <span className={`${colors.text} font-bold shrink-0`}>{colors.icon}</span>
      <div className="min-w-0">
        <p className={`text-xs font-medium ${colors.text}`}>{check.label}</p>
        <p className="text-xs text-charcoal-soft leading-relaxed">{check.desc}</p>
      </div>
    </li>
  );
}

function SummarySidebar({
  inputs,
  country,
  rates,
  steps,
  onReset,
}: {
  inputs: Record<string, string | number>;
  country: Country | undefined;
  rates: UsdRates | null;
  steps: number;
  onReset: () => void;
}) {
  const amountLocal = inputs.amountLocal as number | undefined;
  const amountUsd = inputs.amountUsd as number | undefined;
  const sendableCurrencies = country ? getSendableCurrencies(country) : [];
  const selectedCurrency =
    (inputs.amountCurrency as string) || sendableCurrencies[0];

  return (
    <aside className="md:sticky md:top-4 space-y-3">
      <div className="bg-white border border-border rounded-xl p-4">
        <h3 className="text-xs font-medium text-charcoal-soft mb-3 tracking-wide">
          진행 상황
        </h3>
        <dl className="space-y-3 text-sm">
          <Row label="단계" value={`${steps}번째 화면`} />
          <div className="flex justify-between gap-2 items-center">
            <dt className="text-charcoal-soft shrink-0">받는 나라</dt>
            <dd className="text-right text-charcoal flex items-center gap-1.5">
              {country ? (
                <>
                  <Flag code={country.code} className="w-5" />
                  <span className="truncate">{country.name}</span>
                </>
              ) : (
                "—"
              )}
            </dd>
          </div>
          <Row
            label="송금 금액"
            value={
              amountLocal !== undefined && selectedCurrency
                ? `${Number(amountLocal).toLocaleString()} ${selectedCurrency}`
                : "—"
            }
          />
          <Row
            label="USD 환산"
            value={
              amountUsd !== undefined
                ? `USD ${amountUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                : "—"
            }
          />
        </dl>
        {rates && (
          <p className="text-[10px] text-charcoal-soft mt-3 pt-3 border-t border-border">
            환율 {rates.date} 기준 · 참고용
          </p>
        )}
        <button
          onClick={onReset}
          className="mt-3 w-full text-xs text-charcoal-soft hover:text-primary py-2 border-t border-border pt-3"
        >
          상담 처음부터
        </button>
      </div>

      {country && <CountryNotesPanel country={country} />}
    </aside>
  );
}

function CountryNotesPanel({ country }: { country: Country }) {
  // BLOCKED 국가는 CountryPicker에서 필터링되어 여기 도달 안 함
  return (
    <div className="bg-white border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Flag code={country.code} className="w-5 shrink-0" />
          <h3 className="text-xs font-medium text-charcoal-soft tracking-wide truncate">
            {country.name} 유의사항
          </h3>
        </div>
        <span className="text-[9px] text-charcoal-soft shrink-0">⚠️ 검증 필요</span>
      </div>
      <div className="flex flex-wrap gap-1 mb-3">
        {country.ibanRequired && (
          <Chip>IBAN {country.ibanLength}자리</Chip>
        )}
        {country.routingType && country.routingType !== "SWIFT_only" && (
          <Chip>
            {labelForRoutingShort(country.routingType, country.routingDigits)}
          </Chip>
        )}
        {country.routingType === "SWIFT_only" && <Chip>SWIFT BIC</Chip>}
        {country.purposeCodeRequired && (
          <Chip variant="warn">사유코드 필수</Chip>
        )}
        {country.riskLevel === "WATCH" && (
          <Chip variant="warn">주의 국가</Chip>
        )}
      </div>
      {country.remarks && country.remarks.length > 0 && (
        <ul className="text-xs text-charcoal space-y-1 list-disc list-inside leading-relaxed">
          {country.remarks.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function labelForRoutingShort(t: string, digits?: number): string {
  switch (t) {
    case "ABA":
      return `ABA ${digits ?? "?"}자리`;
    case "BSB":
      return `BSB ${digits ?? "?"}자리`;
    case "SortCode":
      return `Sort ${digits ?? "?"}자리`;
    case "Transit":
      return "Transit/Inst.";
    case "IFSC":
      return `IFSC ${digits ?? "?"}자리`;
    case "CNAPS":
      return `CNAPS ${digits ?? "?"}자리`;
    case "CLABE":
      return `CLABE ${digits ?? "?"}자리`;
    case "JapaneseBank":
      return "은행/지점/계좌";
    default:
      return t;
  }
}

function Chip({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant?: "warn";
}) {
  return (
    <span
      className={[
        "text-[10px] px-1.5 py-0.5 rounded-full border",
        variant === "warn"
          ? "bg-warn/10 border-warn/40 text-charcoal"
          : "bg-offwhite border-border text-charcoal-soft",
      ].join(" ")}
    >
      {children}
    </span>
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
