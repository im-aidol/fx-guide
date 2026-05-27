"use client";

// 외화 예적금 이자 시뮬레이터.
// 통화·기간·금액·금리를 입력하면 만기 이자/만기 원리금 예상치 계산.
// "참고용" — 실제 적용 금리는 영업점/홈페이지 게시 기준.
// 환율 변동(원화 환산)은 표시 안 함 — exchange-rates는 별도 모듈.

import { useMemo, useState } from "react";
import {
  simulatableProducts,
  depositById,
  type DepositProduct,
} from "@/lib/data/deposit-products";

const CURRENCIES = [
  "USD",
  "JPY",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "CHF",
  "NZD",
  "CNY",
] as const;
type Currency = (typeof CURRENCIES)[number];

// 통화별 연 기준 일수 (외화예금거래기본약관 제4조)
function daysBase(currency: Currency): number {
  return currency === "JPY" || currency === "GBP" ? 365 : 360;
}

// 단리 이자 계산
function calcSimple(
  principal: number,
  ratePct: number,
  days: number,
  currency: Currency,
): number {
  return (principal * (ratePct / 100) * days) / daysBase(currency);
}

// 복리 (회전주기) 이자 계산
function calcCompound(
  principal: number,
  ratePct: number,
  totalDays: number,
  rotationDays: number,
  currency: Currency,
): number {
  const base = daysBase(currency);
  const rotations = Math.floor(totalDays / rotationDays);
  const remainder = totalDays - rotations * rotationDays;
  let balance = principal;
  for (let i = 0; i < rotations; i++) {
    balance += (balance * (ratePct / 100) * rotationDays) / base;
  }
  // 나머지 일수는 단리로
  const remainderInterest = (balance * (ratePct / 100) * remainder) / base;
  return balance - principal + remainderInterest;
}

export function InterestSimulator({
  initialProductId,
}: {
  initialProductId?: string;
}) {
  const products = simulatableProducts();
  const defaultProduct =
    (initialProductId && depositById(initialProductId)) || products[0];

  const [productId, setProductId] = useState<string>(defaultProduct?.id ?? "");
  const product = depositById(productId);
  const sim = product?.simulator;

  const [currency, setCurrency] = useState<Currency>("USD");
  const [amount, setAmount] = useState<number>(10000);
  const [days, setDays] = useState<number>(
    sim?.maxDays && sim.maxDays >= 180 ? 180 : sim?.minDays ?? 180,
  );
  const [ratePct, setRatePct] = useState<number>(sim?.defaultRatePct ?? 4.0);
  const [rotationMonths, setRotationMonths] = useState<1 | 3 | 6>(6); // 회전복리 전용

  // 상품 변경 시 기본값 자동 반영
  const onProductChange = (id: string) => {
    setProductId(id);
    const p = depositById(id);
    if (p?.simulator) {
      if (p.simulator.defaultRatePct) setRatePct(p.simulator.defaultRatePct);
      const min = p.simulator.minDays ?? 7;
      const max = p.simulator.maxDays ?? 365;
      // iM/IDREAM처럼 12개월 고정인 상품은 자동 365
      if (min === max) setDays(min);
      else if (days < min || days > max) setDays(Math.min(180, max));
    }
  };

  const interest = useMemo(() => {
    if (!product || amount <= 0 || days <= 0) return 0;
    if (product.id === "fc-rolling-compound") {
      return calcCompound(
        amount,
        ratePct,
        days,
        rotationMonths * 30,
        currency,
      );
    }
    return calcSimple(amount, ratePct, days, currency);
  }, [product, amount, ratePct, days, rotationMonths, currency]);

  if (!product || !sim) {
    return (
      <div className="text-sm text-charcoal-soft">
        시뮬레이션 가능한 상품이 없습니다.
      </div>
    );
  }

  const total = amount + interest;
  const yearlyRate = (interest / amount) * (daysBase(currency) / days) * 100;

  return (
    <div className="bg-white border border-border rounded-xl p-5">
      <header className="mb-4">
        <h3 className="font-bold text-lg">💰 만기 이자 시뮬레이터</h3>
        <p className="text-xs text-charcoal-soft mt-1">
          외화예금거래기본약관 제4조 기준 (연 360일 / JPY·GBP는 365일).{" "}
          <strong className="text-warn">실제 거래용 아님 — 참고용입니다.</strong>{" "}
          정확한 금리는 영업점·홈페이지 게시 통화·기간별 금리.
        </p>
      </header>

      {/* 상품 선택 */}
      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <Field label="상품">
          <select
            value={productId}
            onChange={(e) => onProductChange(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm bg-white"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </Field>
        <Field label="통화">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm bg-white"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
                {(c === "JPY" || c === "GBP") && " (365일 기준)"}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        <Field label={`원금 (${currency})`}>
          <input
            type="number"
            value={amount}
            min={sim.minAmount}
            max={sim.maxAmount}
            step={100}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm font-mono"
          />
          <p className="text-[10px] text-charcoal-soft mt-1">
            허용: {sim.minAmount?.toLocaleString()} ~{" "}
            {sim.maxAmount?.toLocaleString()}
          </p>
        </Field>
        <Field label="예치일수 (일)">
          <input
            type="number"
            value={days}
            min={sim.minDays}
            max={sim.maxDays}
            step={1}
            onChange={(e) => setDays(Number(e.target.value))}
            disabled={sim.minDays === sim.maxDays}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm font-mono disabled:bg-offwhite"
          />
          <p className="text-[10px] text-charcoal-soft mt-1">
            허용: {sim.minDays} ~ {sim.maxDays}일
          </p>
        </Field>
        <Field label="적용 금리 (연 %)">
          <input
            type="number"
            value={ratePct}
            min={0}
            max={20}
            step={0.01}
            onChange={(e) => setRatePct(Number(e.target.value))}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm font-mono"
          />
          <p className="text-[10px] text-charcoal-soft mt-1">
            {sim.rateNote ?? "참고용 금리"}
          </p>
        </Field>
      </div>

      {product.id === "fc-rolling-compound" && (
        <Field label="회전주기 (개월)">
          <div className="flex gap-2">
            {([1, 3, 6] as const).map((m) => (
              <button
                key={m}
                onClick={() => setRotationMonths(m)}
                className={[
                  "px-3 py-1.5 rounded-md border text-xs transition",
                  rotationMonths === m
                    ? "bg-primary text-white border-primary"
                    : "bg-white border-border text-charcoal-soft hover:border-primary",
                ].join(" ")}
              >
                {m}개월
              </button>
            ))}
          </div>
          <p className="text-[10px] text-charcoal-soft mt-1">
            가입 시 결정 → 예치기간 중 변경 불가
          </p>
        </Field>
      )}

      {/* 결과 */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid sm:grid-cols-3 gap-2">
          <ResultCard
            label="만기 이자"
            value={`${currency} ${interest.toFixed(2)}`}
            note="(세금 납부 전)"
          />
          <ResultCard
            label="만기 원리금"
            value={`${currency} ${total.toFixed(2)}`}
            note={`원금 + 이자`}
            highlight
          />
          <ResultCard
            label="실효 연 환산"
            value={`${yearlyRate.toFixed(3)} %`}
            note={`${days}일 → 연 환산`}
          />
        </div>
      </div>

      {/* 산식·중도해지 경고 */}
      <div className="mt-4 pt-3 border-t border-border space-y-1.5 text-[11px] text-charcoal-soft">
        {product.interestFormula && (
          <p>
            <strong className="text-charcoal">산식</strong>:{" "}
            {product.interestFormula}
          </p>
        )}
        {product.earlyTermination && (
          <p>
            <strong className="text-warn">⚠️ 중도해지</strong>:{" "}
            {product.earlyTermination}
          </p>
        )}
        {product.id === "fc-rolling-compound" && (
          <p>
            <strong className="text-charcoal">복리 계산</strong>: 회전주기마다
            원금+직전 회전 이자를 새 원금으로 다시 적용. 나머지 일수는 마지막
            잔액에 단리 적용.
          </p>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-[11px] text-charcoal-soft block mb-1 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

function ResultCard({
  label,
  value,
  note,
  highlight,
}: {
  label: string;
  value: string;
  note?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-lg border p-3",
        highlight ? "bg-primary/5 border-primary/30" : "bg-offwhite border-border",
      ].join(" ")}
    >
      <p className="text-[10px] text-charcoal-soft uppercase tracking-wide">
        {label}
      </p>
      <p
        className={[
          "font-bold mt-0.5 tabular-nums",
          highlight ? "text-primary text-xl" : "text-charcoal text-lg",
        ].join(" ")}
      >
        {value}
      </p>
      {note && (
        <p className="text-[10px] text-charcoal-soft mt-0.5">{note}</p>
      )}
    </div>
  );
}

// 상품을 받지 않는 export — 다른 상품 페이지에서도 사용 (단일 상품)
export function SimpleSimulator({ product }: { product: DepositProduct }) {
  return <InterestSimulator initialProductId={product.id} />;
}
