"use client";

import { useEffect, useState } from "react";
import {
  fetchRateHistory,
  type RateHistoryPoint,
} from "@/lib/exchange-rate-history";

type Props = {
  currency: string; // "USD" | "JPY" | "CNY" | "EUR"
  label: string;
  unit: string; // "1 USD", "100 JPY" 등
  flag: string;
  /** 표시 단위 환산 배수 (예: JPY 차트를 100엔 기준으로 보이려면 100). 기본 1. */
  scale?: number;
  onClose: () => void;
};

export function RateHistoryModal({
  currency,
  label,
  unit,
  flag,
  scale = 1,
  onClose,
}: Props) {
  const [points, setPoints] = useState<RateHistoryPoint[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setPoints(null);
    setError(false);
    fetchRateHistory(currency, 30)
      .then((raw) =>
        scale === 1
          ? setPoints(raw)
          : setPoints(raw.map((p) => ({ ...p, rate: p.rate * scale }))),
      )
      .catch(() => setError(true));
  }, [currency, scale]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rate-history-title"
    >
      <div
        className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-baseline justify-between mb-4 gap-2">
          <h3 id="rate-history-title" className="font-bold text-lg">
            <span className="mr-2">{flag}</span>
            {label} 30일 환율 추세
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-charcoal-soft hover:text-charcoal text-2xl leading-none"
          >
            ×
          </button>
        </header>

        {error ? (
          <p className="text-sm text-warn py-10 text-center">
            환율 추세를 가져오지 못했습니다.
          </p>
        ) : !points ? (
          <p className="text-sm text-charcoal-soft py-10 text-center">
            데이터 불러오는 중…
          </p>
        ) : points.length === 0 ? (
          <p className="text-sm text-warn py-10 text-center">
            표시할 데이터가 없습니다.
          </p>
        ) : (
          <Chart points={points} unit={unit} />
        )}

        <p className="text-[10px] text-charcoal-soft mt-4">
          출처: ECB (Frankfurter API) · ⚠️ 해당 환율은 참고용으로, 실제 환율과 차이가 있을 수 있어요
        </p>
      </div>
    </div>
  );
}

function formatMD(date: string): string {
  const [, m, d] = date.split("-");
  return `${Number(m)}월 ${Number(d)}일`;
}

function Chart({
  points,
  unit,
}: {
  points: RateHistoryPoint[];
  unit: string;
}) {
  const W = 600;
  const H = 240;
  const PAD = { top: 16, right: 16, bottom: 28, left: 56 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const rates = points.map((p) => p.rate);
  const dataMin = Math.min(...rates);
  const dataMax = Math.max(...rates);
  const minIdx = rates.indexOf(dataMin);
  const maxIdx = rates.indexOf(dataMax);
  const span = dataMax - dataMin || 1;
  const yMin = dataMin - span * 0.1;
  const yMax = dataMax + span * 0.1;
  const yRange = yMax - yMin;

  const x = (i: number) =>
    points.length === 1
      ? PAD.left + innerW / 2
      : PAD.left + (i / (points.length - 1)) * innerW;
  const y = (rate: number) => PAD.top + (1 - (rate - yMin) / yRange) * innerH;

  const path = points
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(p.rate).toFixed(1)}`,
    )
    .join(" ");

  const first = points[0].rate;
  const last = points[points.length - 1].rate;
  const change = last - first;
  const changePct = (change / first) * 100;
  const up = change >= 0;

  const yTicks = [yMin + yRange * 0.15, yMin + yRange * 0.5, yMin + yRange * 0.85];
  const xTickIndices = [
    0,
    Math.floor(points.length / 2),
    points.length - 1,
  ];

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3 px-1 gap-3">
        <div>
          <p className="text-2xl font-bold tabular-nums">
            {last.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            <span className="text-sm font-normal text-charcoal-soft ml-1">
              원
            </span>
          </p>
          <p className="text-[10px] text-charcoal-soft">
            {unit} · {formatMD(points[points.length - 1].date)}
          </p>
        </div>
        <div
          className={`text-right text-sm font-medium ${
            up ? "text-danger" : "text-primary"
          }`}
        >
          <span className="tabular-nums">
            {up ? "▲" : "▼"}{" "}
            {Math.abs(change).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
            <span className="text-xs ml-1">
              ({changePct >= 0 ? "+" : ""}
              {changePct.toFixed(2)}%)
            </span>
          </span>
          <p className="text-[10px] text-charcoal-soft font-normal">
            30일 전 대비
          </p>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label="30일 환율 추세 그래프"
      >
        {yTicks.map((v, i) => (
          <g key={`y-${i}`}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(v)}
              y2={y(v)}
              stroke="#e5e7e0"
              strokeWidth="1"
            />
            <text
              x={PAD.left - 6}
              y={y(v)}
              fontSize="10"
              textAnchor="end"
              dominantBaseline="middle"
              fill="#4a524d"
            >
              {v.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </text>
          </g>
        ))}

        {xTickIndices.map((i) => (
          <text
            key={`x-${i}`}
            x={x(i)}
            y={H - PAD.bottom + 16}
            fontSize="10"
            textAnchor="middle"
            fill="#4a524d"
          >
            {formatMD(points[i].date)}
          </text>
        ))}

        <path d={path} stroke="#3eb286" strokeWidth="2" fill="none" />

        <ExtremeLabel
          idx={maxIdx}
          value={dataMax}
          color="#d94c4c"
          tag="최고"
          place="above"
          x={x}
          y={y}
          points={points}
        />
        <ExtremeLabel
          idx={minIdx}
          value={dataMin}
          color="#3eb286"
          tag="최저"
          place="below"
          x={x}
          y={y}
          points={points}
        />

        <circle
          cx={x(points.length - 1)}
          cy={y(last)}
          r="3.5"
          fill="#3eb286"
        />
      </svg>
    </div>
  );
}

function ExtremeLabel({
  idx,
  value,
  color,
  tag,
  place,
  x,
  y,
  points,
}: {
  idx: number;
  value: number;
  color: string;
  tag: "최고" | "최저";
  place: "above" | "below";
  x: (i: number) => number;
  y: (rate: number) => number;
  points: RateHistoryPoint[];
}) {
  const cx = x(idx);
  const cy = y(value);
  const textY = place === "above" ? cy - 9 : cy + 18;

  // 좌우 끝에 가까우면 텍스트가 차트 밖으로 튀어나가지 않도록 정렬 조정
  const near = 3;
  const anchor: "start" | "middle" | "end" =
    idx <= near ? "start" : idx >= points.length - 1 - near ? "end" : "middle";
  const textX = anchor === "start" ? cx + 5 : anchor === "end" ? cx - 5 : cx;

  return (
    <g>
      <circle cx={cx} cy={cy} r="3.5" fill={color} />
      <text
        x={textX}
        y={textY}
        fontSize="11"
        fontWeight="600"
        textAnchor={anchor}
        fill={color}
      >
        {tag} {value.toLocaleString(undefined, { maximumFractionDigits: 2 })}원 ({formatMD(points[idx].date)})
      </text>
    </g>
  );
}
