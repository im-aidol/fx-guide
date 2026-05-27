"use client";

// 환전 계산기 — 영업점 창구에서 고객 상담 시 활용.
// 원화↔외화 환산, 환율 종류 선택, 환율우대(할인률) 적용.
// ⚠️ 실시간 환율 변동에 따라 상담 시 금액과 실제 금액이 상이할 수 있음.

import { useEffect, useMemo, useState } from "react";
import { fetchUsdRates, type UsdRates } from "@/lib/exchange-rates";

// 환율 종류 — 영업점 게시 환율 5종.
// 적용 시점: 매도(고객이 외화를 살 때) / 매입(고객이 외화를 팔 때).
const RATE_TYPES = [
  {
    key: "base",
    label: "매매기준율",
    description: "기준 — 우대·환산의 출발점",
    direction: "base" as const,
  },
  {
    key: "tt-sell",
    label: "전신환매도율",
    description: "송금·외화 매수 (현찰 외)",
    direction: "sell" as const,
  },
  {
    key: "tt-buy",
    label: "전신환매입율",
    description: "외화 매도 (현찰 외)",
    direction: "buy" as const,
  },
  {
    key: "cash-sell",
    label: "현찰매도율",
    description: "고객이 외화 현찰을 살 때",
    direction: "sell" as const,
  },
  {
    key: "cash-buy",
    label: "현찰매입율",
    description: "고객이 외화 현찰을 팔 때",
    direction: "buy" as const,
  },
] as const;
type RateKey = (typeof RATE_TYPES)[number]["key"];

// 통화별 마진(스프레드) 추정치 — 매매기준율 대비 %.
// 실제 마진은 매일·통화·은행마다 다름. 영업점이 게시 환율 직접 입력 권장.
const DEFAULT_SPREAD: Record<string, { tt: number; cash: number }> = {
  USD: { tt: 0.0098, cash: 0.0175 },
  JPY: { tt: 0.012, cash: 0.0185 },
  EUR: { tt: 0.0105, cash: 0.019 },
  GBP: { tt: 0.012, cash: 0.0205 },
  CNY: { tt: 0.012, cash: 0.025 },
  CAD: { tt: 0.013, cash: 0.022 },
  AUD: { tt: 0.013, cash: 0.022 },
  CHF: { tt: 0.013, cash: 0.022 },
  NZD: { tt: 0.0135, cash: 0.023 },
};

const CURRENCIES = ["USD", "JPY", "EUR", "GBP", "CNY", "CAD", "AUD", "CHF", "NZD"] as const;
type Currency = (typeof CURRENCIES)[number];

// 매매기준율 + 환율 종류 + 우대율 → 적용 환율 계산
function computeApplied(
  base: number,
  rateKey: RateKey,
  currency: Currency,
  preferentialPct: number,
  manualPosted?: number,
): number {
  const cfg = RATE_TYPES.find((r) => r.key === rateKey)!;
  if (cfg.direction === "base") return base;

  // 게시 환율을 사용자가 직접 입력했으면 그 값을 기준으로 우대 적용.
  let posted: number;
  if (manualPosted && manualPosted > 0) {
    posted = manualPosted;
  } else {
    const spreadKey = rateKey.startsWith("tt") ? "tt" : "cash";
    const spread = DEFAULT_SPREAD[currency]?.[spreadKey] ?? 0.012;
    posted =
      cfg.direction === "sell" ? base * (1 + spread) : base * (1 - spread);
  }

  // 우대(할인) 적용: 매매기준율과 게시 환율의 차이를 N% 줄임.
  const margin = posted - base;
  const reducedMargin = margin * (1 - preferentialPct / 100);
  return base + reducedMargin;
}

// 통화별 자릿수
function decimalsFor(c: Currency): number {
  if (c === "JPY") return 2; // 100엔당 또는 원 환산 시 소수
  return 2;
}

function formatNumber(n: number, decimals = 2): string {
  if (!isFinite(n)) return "—";
  return n.toLocaleString("ko-KR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// 1 단위 표시: JPY는 보통 100엔 단위로 게시
function rateUnit(c: Currency): { multiplier: number; label: string } {
  if (c === "JPY") return { multiplier: 100, label: "100 JPY" };
  return { multiplier: 1, label: `1 ${c}` };
}

export function ExchangeCalculator() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [rateKey, setRateKey] = useState<RateKey>("tt-sell");
  const [preferentialPct, setPreferentialPct] = useState<number>(0);

  // 매매기준율 — 환율 API에서 자동 페치, 사용자 수정 가능
  const [base, setBase] = useState<number>(0);
  const [baseTouched, setBaseTouched] = useState(false);

  // 영업점 게시 환율 (선택) — 입력하면 그 값으로 우대 계산
  const [manualPosted, setManualPosted] = useState<string>("");

  // 양방향 입력
  const [krwInput, setKrwInput] = useState<string>("");
  const [foreignInput, setForeignInput] = useState<string>("");
  const [lastEdited, setLastEdited] = useState<"krw" | "foreign">("krw");

  // 환율 API
  const [usdRates, setUsdRates] = useState<UsdRates | null>(null);
  const [ratesError, setRatesError] = useState(false);

  useEffect(() => {
    fetchUsdRates()
      .then(setUsdRates)
      .catch(() => setRatesError(true));
  }, []);

  // 통화 변경 시 매매기준율 자동 채움 (사용자가 수정 안 했을 때만)
  useEffect(() => {
    if (!usdRates) return;
    if (baseTouched) return;
    // KRW 환산: 1 USD = X KRW
    const krwPerUsd = usdRates.rates["krw"];
    if (!krwPerUsd) return;
    if (currency === "USD") {
      setBase(Number(krwPerUsd.toFixed(2)));
    } else {
      const rate = usdRates.rates[currency.toLowerCase()];
      if (!rate) return;
      // 1 CUR = (1 USD = krwPerUsd KRW) / rate (CUR per USD)
      const krwPerCur = krwPerUsd / rate;
      // JPY는 100엔당 표기 관행
      const display = currency === "JPY" ? krwPerCur * 100 : krwPerCur;
      setBase(Number(display.toFixed(2)));
    }
  }, [currency, usdRates, baseTouched]);

  const applied = useMemo(() => {
    const manual = parseFloat(manualPosted);
    return computeApplied(
      base,
      rateKey,
      currency,
      preferentialPct,
      isNaN(manual) ? undefined : manual,
    );
  }, [base, rateKey, currency, preferentialPct, manualPosted]);

  const unit = rateUnit(currency);

  // 환산 — JPY는 100엔당 환율이므로 환산 시 보정
  const convertKrwToForeign = (krw: number): number => {
    if (applied <= 0) return 0;
    return (krw / applied) * unit.multiplier;
  };
  const convertForeignToKrw = (foreign: number): number => {
    if (applied <= 0) return 0;
    return (foreign / unit.multiplier) * applied;
  };

  // 양방향 동기화
  useEffect(() => {
    if (lastEdited === "krw") {
      const krw = parseFloat(krwInput);
      if (!isNaN(krw) && applied > 0) {
        setForeignInput(formatNumber(convertKrwToForeign(krw), 2));
      } else if (krwInput === "") {
        setForeignInput("");
      }
    } else {
      const foreign = parseFloat(foreignInput);
      if (!isNaN(foreign) && applied > 0) {
        setKrwInput(formatNumber(convertForeignToKrw(foreign), 0));
      } else if (foreignInput === "") {
        setKrwInput("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [krwInput, foreignInput, applied, lastEdited]);

  const onCurrencyChange = (c: Currency) => {
    setCurrency(c);
    setBaseTouched(false);
    setManualPosted("");
  };

  const reset = () => {
    setPreferentialPct(0);
    setKrwInput("");
    setForeignInput("");
    setManualPosted("");
    setBaseTouched(false);
  };

  const cfg = RATE_TYPES.find((r) => r.key === rateKey)!;

  return (
    <div className="bg-white border border-border rounded-xl p-5">
      <header className="mb-4">
        <h3 className="font-bold text-lg">💱 환전 계산기</h3>
        <p className="text-xs text-charcoal-soft mt-1">
          고객 상담용 — 원화↔외화 환산, 환율 종류 선택, 환율우대 적용
        </p>
      </header>

      {/* 통화 + 매매기준율 */}
      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <Field label="통화">
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value as Currency)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm bg-white"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
                {c === "JPY" && " (100엔 단위)"}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label={`매매기준율 (${unit.label} = N원)`}
          hint={
            usdRates
              ? `${usdRates.date} 참고 환율 자동 채움 — 영업점 게시 환율로 수정하세요`
              : ratesError
                ? "환율 API 오류 — 직접 입력하세요"
                : "환율 가져오는 중…"
          }
        >
          <input
            type="number"
            value={base || ""}
            onChange={(e) => {
              setBase(Number(e.target.value));
              setBaseTouched(true);
            }}
            step="0.01"
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm font-mono"
          />
        </Field>
      </div>

      {/* 환율 종류 */}
      <Field label="환율 종류">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
          {RATE_TYPES.map((r) => {
            const active = r.key === rateKey;
            return (
              <button
                key={r.key}
                onClick={() => setRateKey(r.key)}
                className={[
                  "text-xs px-2 py-1.5 rounded-md border transition leading-tight",
                  active
                    ? "bg-primary text-white border-primary font-medium"
                    : "bg-white border-border text-charcoal-soft hover:border-primary",
                ].join(" ")}
              >
                {r.label}
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-charcoal-soft mt-1.5 leading-relaxed">
          {cfg.description}
        </p>
      </Field>

      {/* 영업점 게시 환율 직접 입력 (선택) */}
      <div className="grid sm:grid-cols-2 gap-3 mt-3">
        <Field
          label={`영업점 게시 ${cfg.label} (선택)`}
          hint="입력 시 이 값으로 우대 계산. 비워두면 통화별 평균 스프레드로 추정"
        >
          <input
            type="number"
            value={manualPosted}
            onChange={(e) => setManualPosted(e.target.value)}
            placeholder={`예: ${formatNumber(
              cfg.direction === "sell" ? base * 1.01 : base * 0.99,
              2,
            )}`}
            disabled={cfg.direction === "base"}
            step="0.01"
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm font-mono disabled:bg-offwhite disabled:cursor-not-allowed"
          />
        </Field>
        <Field
          label="환율우대 (%)"
          hint="매매기준율과 게시 환율 차이(=마진)를 N% 줄임. 0=원래 환율, 100=매매기준율"
        >
          <input
            type="number"
            value={preferentialPct}
            onChange={(e) => setPreferentialPct(Number(e.target.value) || 0)}
            min={0}
            max={100}
            step={1}
            disabled={cfg.direction === "base"}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm font-mono disabled:bg-offwhite disabled:cursor-not-allowed"
          />
        </Field>
      </div>

      {/* 적용 환율 결과 */}
      <div className="bg-primary/5 border border-primary/30 rounded-lg p-3 mt-4">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-xs text-primary font-medium tracking-wide uppercase">
            적용 환율
          </p>
          <p className="text-[10px] text-charcoal-soft">
            {cfg.label}
            {cfg.direction !== "base" && preferentialPct > 0 && (
              <> · 우대 {preferentialPct}% 적용 후</>
            )}
          </p>
        </div>
        <p className="text-2xl font-bold tabular-nums text-primary mt-0.5">
          {formatNumber(applied, decimalsFor(currency))}
          <span className="text-sm font-normal text-charcoal-soft ml-2">
            원 / {unit.label}
          </span>
        </p>
      </div>

      {/* 환산 입력 */}
      <div className="grid sm:grid-cols-2 gap-3 mt-4">
        <Field label="원화 금액 (KRW)">
          <input
            type="text"
            inputMode="decimal"
            value={krwInput}
            onChange={(e) => {
              setLastEdited("krw");
              setKrwInput(e.target.value.replace(/[^0-9.,]/g, ""));
            }}
            placeholder="0"
            className="w-full px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:border-primary text-base font-mono text-right"
          />
        </Field>
        <Field label={`외화 금액 (${currency})`}>
          <input
            type="text"
            inputMode="decimal"
            value={foreignInput}
            onChange={(e) => {
              setLastEdited("foreign");
              setForeignInput(e.target.value.replace(/[^0-9.,]/g, ""));
            }}
            placeholder="0"
            className="w-full px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:border-primary text-base font-mono text-right"
          />
        </Field>
      </div>

      {/* 빠른 금액 버튼 */}
      <div className="flex flex-wrap gap-1.5 mt-2">
        {[100, 500, 1000, 5000, 10000].map((n) => (
          <button
            key={n}
            onClick={() => {
              setLastEdited("foreign");
              setForeignInput(String(n));
            }}
            className="text-[11px] px-2 py-1 rounded border border-border bg-white text-charcoal-soft hover:border-primary hover:text-primary"
          >
            {currency} {n.toLocaleString()}
          </button>
        ))}
        <button
          onClick={reset}
          className="text-[11px] px-2 py-1 rounded border border-border bg-offwhite text-charcoal-soft hover:text-charcoal ml-auto"
        >
          ↺ 초기화
        </button>
      </div>

      {/* 주의 문구 — 필수 */}
      <aside className="mt-5 bg-warn/10 border border-warn/40 rounded-lg p-3">
        <p className="text-xs text-charcoal font-medium leading-relaxed">
          ⚠️ 실시간 환율 변동에 따라 상담 시 금액과 실제 금액이 상이할 수
          있습니다.
        </p>
        <p className="text-[10px] text-charcoal-soft mt-1 leading-relaxed">
          본 계산기는 영업점 상담 보조용입니다. 실제 거래는 거래 시점 영업점
          게시 환율·당행 매매기준율에 따라 처리됩니다.
        </p>
      </aside>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-[11px] text-charcoal-soft block mb-1 uppercase tracking-wide">
        {label}
      </label>
      {children}
      {hint && (
        <p className="text-[10px] text-charcoal-soft mt-1 leading-relaxed">
          {hint}
        </p>
      )}
    </div>
  );
}
