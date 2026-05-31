"use client";

import { useEffect, useState } from "react";
import {
  fetchMajorRatesKrw,
  type MajorRatesKrw,
} from "@/lib/exchange-rate-history";
import { RateHistoryModal } from "./RateHistoryModal";

type SelectedRate = {
  currency: string;
  label: string;
  unit: string;
  flag: string;
  scale?: number;
};

export function HomeRatePanel() {
  const [rates, setRates] = useState<MajorRatesKrw | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<SelectedRate | null>(null);

  const load = () => {
    setLoading(true);
    setError(false);
    fetchMajorRatesKrw()
      .then((r) => {
        setRates(r);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  return (
    <section className="bg-white border border-border rounded-xl p-5 mt-8">
      <div className="flex items-baseline justify-between mb-3 gap-2">
        <h2 className="font-semibold">💱 참고 환율 (주요 통화)</h2>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="text-xs text-primary hover:underline disabled:opacity-50 disabled:no-underline"
          aria-label="환율 새로고침"
        >
          {loading ? "갱신 중…" : "↻ 새로고침"}
        </button>
      </div>

      {error ? (
        <p className="text-sm text-warn">환율을 가져오지 못했습니다.</p>
      ) : !rates ? (
        <p className="text-sm text-charcoal-soft">환율 가져오는 중…</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <RateCard
            flag="🇺🇸"
            label="USD"
            unit="1 USD"
            krw={rates.usd}
            onClick={() =>
              setSelected({
                currency: "USD",
                label: "USD",
                unit: "1 USD",
                flag: "🇺🇸",
              })
            }
          />
          <RateCard
            flag="🇯🇵"
            label="JPY"
            unit="100 JPY"
            krw={rates.jpy * 100}
            onClick={() =>
              setSelected({
                currency: "JPY",
                label: "JPY",
                unit: "100 JPY",
                flag: "🇯🇵",
                scale: 100,
              })
            }
          />
          <RateCard
            flag="🇨🇳"
            label="CNY"
            unit="1 CNY"
            krw={rates.cny}
            onClick={() =>
              setSelected({
                currency: "CNY",
                label: "CNY",
                unit: "1 CNY",
                flag: "🇨🇳",
              })
            }
          />
          <RateCard
            flag="🇪🇺"
            label="EUR"
            unit="1 EUR"
            krw={rates.eur}
            onClick={() =>
              setSelected({
                currency: "EUR",
                label: "EUR",
                unit: "1 EUR",
                flag: "🇪🇺",
              })
            }
          />
        </div>
      )}

      <p className="text-[10px] text-charcoal-soft mt-3">
        {rates ? `${rates.date} 기준 · ECB (Frankfurter API)` : "출처: ECB (Frankfurter API)"}
        {" · "}카드 클릭 → 30일 추세 보기
        {" · "}⚠️ 해당 환율은 참고용으로, 실제 환율과 차이가 있을 수 있어요
      </p>
      <p className="text-[10px] text-charcoal-soft mt-1">
        ⚠️ ECB가 한국 시각 23시경에 환율을 고시해 영업시간에는 전 영업일 환율이 최신으로 표시돼요. 참고용이라 실제 거래는 iM뱅크 매매기준율을 적용해요.
      </p>

      {selected && (
        <RateHistoryModal
          currency={selected.currency}
          label={selected.label}
          unit={selected.unit}
          flag={selected.flag}
          scale={selected.scale}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}

function RateCard({
  flag,
  label,
  unit,
  krw,
  onClick,
}: {
  flag: string;
  label: string;
  unit: string;
  krw: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-offwhite border border-border rounded-lg p-3 text-left hover:border-primary hover:bg-primary/5 transition cursor-pointer"
      aria-label={`${label} 30일 환율 추세 보기`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">{flag}</span>
        <span className="text-xs text-charcoal-soft">{label}</span>
      </div>
      <p className="text-lg font-bold tabular-nums">
        {krw.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        <span className="text-xs font-normal text-charcoal-soft ml-1">원</span>
      </p>
      <p className="text-[10px] text-charcoal-soft mt-0.5">{unit} 기준</p>
    </button>
  );
}
