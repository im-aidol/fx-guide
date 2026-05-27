"use client";

import { useEffect, useState } from "react";
import { fetchUsdRates, type UsdRates } from "@/lib/exchange-rates";

export function HomeRatePanel() {
  const [rates, setRates] = useState<UsdRates | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    fetchUsdRates()
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
  }, []);

  return (
    <section className="bg-white border border-border rounded-xl p-5 mt-8">
      <div className="flex items-baseline justify-between mb-3 gap-2">
        <h2 className="font-semibold">참고 환율 (주요 통화)</h2>
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
            krw={rates.rates.krw}
          />
          <RateCard
            flag="🇯🇵"
            label="JPY (100엔)"
            unit="100 JPY"
            krw={(rates.rates.krw / rates.rates.jpy) * 100}
          />
          <RateCard
            flag="🇨🇳"
            label="CNY"
            unit="1 CNY"
            krw={rates.rates.krw / rates.rates.cny}
          />
          <RateCard
            flag="🇪🇺"
            label="EUR"
            unit="1 EUR"
            krw={rates.rates.krw / rates.rates.eur}
          />
        </div>
      )}

      <p className="text-[10px] text-charcoal-soft mt-3">
        {rates ? `${rates.date} 기준 · fawazahmed0/exchange-api` : "출처: fawazahmed0/exchange-api"}
        {" · "}⚠️ 참고용, 실제 거래는 iM뱅크 매매기준율 적용
      </p>
    </section>
  );
}

function RateCard({
  flag,
  label,
  unit,
  krw,
}: {
  flag: string;
  label: string;
  unit: string;
  krw: number;
}) {
  return (
    <div className="bg-offwhite border border-border rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">{flag}</span>
        <span className="text-xs text-charcoal-soft">{label}</span>
      </div>
      <p className="text-lg font-bold tabular-nums">
        {krw.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        <span className="text-xs font-normal text-charcoal-soft ml-1">원</span>
      </p>
      <p className="text-[10px] text-charcoal-soft mt-0.5">{unit} 기준</p>
    </div>
  );
}
