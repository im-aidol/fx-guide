"use client";

import { useMemo, useState } from "react";
import { CURRENCY_SAMPLES } from "@/lib/data/currency-samples";
import type { CurrencySample, Denomination } from "@/lib/types";
import { Flag } from "@/components/Flag";
import { useMode } from "@/components/Mode";
import { useEditableList } from "@/lib/hooks/useEditableList";
import { AdminBadge } from "@/components/admin/AdminBadge";

const STORAGE_KEY = "fx-guide:currency-samples";

export default function SamplesPage() {
  const { mode } = useMode();
  const canEdit = mode === "hq";
  const { items, update, reset } = useEditableList<CurrencySample>(
    STORAGE_KEY,
    CURRENCY_SAMPLES,
  );

  const primary = useMemo(() => items.filter((c) => c.primary), [items]);
  const others = useMemo(() => items.filter((c) => !c.primary), [items]);

  const [selectedId, setSelectedId] = useState<string>(
    primary[0]?.id ?? items[0]?.id ?? "",
  );
  const selected =
    items.find((c) => c.id === selectedId) ?? primary[0] ?? items[0];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-6">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          통화 견본
        </p>
        <h1 className="text-3xl font-bold mb-2">환전 매입 가능 통화 확인</h1>
        <p className="text-sm text-charcoal-soft">
          환전 시 매입 가능 여부를 권종별로 확인. 통화를 클릭하면 권종별
          사진·시리즈·매입 여부가 표시됩니다.
        </p>
        <div className="flex items-center gap-2 flex-wrap mt-2">
          <AdminBadge hqHint="본점 관리자 — 통화별 매입·매도 정책 수정 가능" />
          {canEdit && (
            <button
              onClick={() => {
                if (
                  confirm(
                    "통화 견양 데이터를 초기 시드 데이터로 되돌립니다. 계속할까요?",
                  )
                ) {
                  reset();
                }
              }}
              className="text-[11px] text-charcoal-soft hover:text-charcoal"
            >
              ↺ 초기화
            </button>
          )}
        </div>
      </header>

      <section className="mb-6">
        <h2 className="text-sm font-medium text-charcoal-soft uppercase tracking-wide mb-2">
          주요 통화
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {primary.map((c) => (
            <CurrencyCard
              key={c.id}
              sample={c}
              selected={c.id === selectedId}
              onClick={() => setSelectedId(c.id)}
              large
            />
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-sm font-medium text-charcoal-soft uppercase tracking-wide mb-2">
          기타 통화
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {others.map((c) => (
            <CurrencyCard
              key={c.id}
              sample={c}
              selected={c.id === selectedId}
              onClick={() => setSelectedId(c.id)}
            />
          ))}
        </div>
      </section>

      {selected && (
        <CurrencyDetail
          sample={selected}
          canEdit={canEdit}
          onUpdate={(patch) => update(selected.id, patch)}
        />
      )}
    </div>
  );
}

function CurrencyCard({
  sample,
  selected,
  onClick,
  large,
}: {
  sample: CurrencySample;
  selected: boolean;
  onClick: () => void;
  large?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "border rounded-lg transition text-left",
        large ? "p-4" : "p-2.5",
        selected
          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
          : "bg-white border-border hover:border-primary",
      ].join(" ")}
    >
      <div
        className={
          large ? "flex items-center gap-2.5 mb-1" : "flex items-center gap-1.5"
        }
      >
        <Flag
          code={sample.countryCode}
          className={large ? "w-10 shrink-0 shadow-sm" : "w-6 shrink-0"}
        />
        <div className="min-w-0">
          <p
            className={
              large ? "font-bold text-base" : "font-medium text-sm truncate"
            }
          >
            {sample.countryName}
          </p>
          {large && <p className="text-xs text-charcoal-soft">{sample.code}</p>}
        </div>
      </div>
      {large && (
        <p className="text-[10px] text-charcoal-soft mt-1">
          {sample.denominations.length}개 권종
        </p>
      )}
      {!large && (
        <p className="text-[10px] text-charcoal-soft mt-0.5">{sample.code}</p>
      )}
    </button>
  );
}

function CurrencyDetail({
  sample,
  canEdit,
  onUpdate,
}: {
  sample: CurrencySample;
  canEdit: boolean;
  onUpdate: (patch: Partial<CurrencySample>) => void;
}) {
  const [editing, setEditing] = useState(false);

  const score = (d: Denomination): number => {
    if (d.buyable && d.sellable) return 2;
    if (d.buyable && !d.sellable) return 1;
    return 0;
  };
  const sorted = [...sample.denominations]
    .map((d, originalIndex) => ({ d, originalIndex }))
    .sort((a, b) => score(b.d) - score(a.d));

  const fullyOk = sorted.filter(({ d }) => d.buyable && d.sellable);
  const buyOnly = sorted.filter(({ d }) => d.buyable && !d.sellable);
  const neither = sorted.filter(({ d }) => !d.buyable && !d.sellable);

  return (
    <section className="bg-white border border-border rounded-xl p-5">
      <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Flag
            code={sample.countryCode}
            className="w-16 shrink-0 shadow-sm"
          />
          <div>
            <h2 className="text-xl font-bold">
              {sample.countryName}{" "}
              <span className="text-charcoal-soft font-medium">
                ({sample.code})
              </span>
            </h2>
            <p className="text-xs text-charcoal-soft">
              권종별 매입·매도 가능 여부 확인 — 총{" "}
              {sample.denominations.length}개
            </p>
          </div>
        </div>
        {canEdit && (
          <button
            onClick={() => setEditing(!editing)}
            className={[
              "text-xs px-3 py-1.5 rounded-lg border font-medium transition shrink-0",
              editing
                ? "bg-charcoal text-white border-charcoal"
                : "bg-primary text-white border-primary hover:bg-primary-dark",
            ].join(" ")}
          >
            {editing ? "편집 종료" : "✏️ 이 통화 편집"}
          </button>
        )}
      </div>

      {canEdit && editing ? (
        <CurrencyEditor sample={sample} onUpdate={onUpdate} />
      ) : (
        <>
          {fullyOk.length > 0 && (
            <DenominationGroup
              title="매입·매도 모두 가능"
              color="green"
              items={fullyOk}
              sampleId={sample.id}
            />
          )}
          {buyOnly.length > 0 && (
            <DenominationGroup
              title="매입만 가능 (매도 불가)"
              color="warn"
              items={buyOnly}
              sampleId={sample.id}
            />
          )}
          {neither.length > 0 && (
            <DenominationGroup
              title="매입·매도 모두 불가"
              color="danger"
              items={neither}
              sampleId={sample.id}
            />
          )}

          {sample.generalNotes && sample.generalNotes.length > 0 && (
            <div className="bg-offwhite border border-border rounded-md p-3 text-sm mt-5">
              <p className="text-xs font-medium text-charcoal-soft uppercase tracking-wide mb-2">
                일반 유의사항
              </p>
              <ul className="space-y-1 text-charcoal-soft list-disc list-inside">
                {sample.generalNotes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function CurrencyEditor({
  sample,
  onUpdate,
}: {
  sample: CurrencySample;
  onUpdate: (patch: Partial<CurrencySample>) => void;
}) {
  const [denoms, setDenoms] = useState<Denomination[]>(sample.denominations);
  const [notesRaw, setNotesRaw] = useState(
    (sample.generalNotes ?? []).join("\n"),
  );

  const updateDenom = (idx: number, patch: Partial<Denomination>) => {
    setDenoms((prev) =>
      prev.map((d, i) => (i === idx ? { ...d, ...patch } : d)),
    );
  };

  const addDenom = () => {
    setDenoms((prev) => [
      ...prev,
      {
        value: "신규 권종",
        buyable: true,
        sellable: true,
      },
    ]);
  };

  const removeDenom = (idx: number) => {
    if (!confirm("이 권종을 삭제할까요?")) return;
    setDenoms((prev) => prev.filter((_, i) => i !== idx));
  };

  const save = () => {
    const generalNotes = notesRaw
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    onUpdate({
      denominations: denoms,
      generalNotes: generalNotes.length > 0 ? generalNotes : undefined,
    });
    alert("저장되었습니다. (브라우저 로컬에 영속화)");
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">권종별 편집</h3>
          <button
            onClick={addDenom}
            className="text-xs bg-offwhite border border-border text-charcoal-soft hover:text-charcoal px-2 py-1 rounded"
          >
            + 권종 추가
          </button>
        </div>
        <ul className="space-y-2">
          {denoms.map((d, idx) => (
            <li
              key={idx}
              className="border border-border rounded-lg p-3 grid grid-cols-1 md:grid-cols-12 gap-2 items-start"
            >
              <input
                type="text"
                value={d.value}
                onChange={(e) => updateDenom(idx, { value: e.target.value })}
                placeholder="권종 표기 (예: $100, 10,000엔)"
                className="md:col-span-3 px-2 py-1.5 border border-border rounded text-sm focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                value={d.series ?? ""}
                onChange={(e) => updateDenom(idx, { series: e.target.value })}
                placeholder="시리즈/연도 (선택)"
                className="md:col-span-3 px-2 py-1.5 border border-border rounded text-sm focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                value={d.notes ?? ""}
                onChange={(e) => updateDenom(idx, { notes: e.target.value })}
                placeholder="특이사항 (선택)"
                className="md:col-span-3 px-2 py-1.5 border border-border rounded text-sm focus:outline-none focus:border-primary"
              />
              <div className="md:col-span-2 flex items-center gap-2 text-xs">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={d.buyable}
                    onChange={(e) =>
                      updateDenom(idx, { buyable: e.target.checked })
                    }
                  />
                  매입
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={d.sellable}
                    onChange={(e) =>
                      updateDenom(idx, { sellable: e.target.checked })
                    }
                  />
                  매도
                </label>
              </div>
              <button
                onClick={() => removeDenom(idx)}
                className="md:col-span-1 text-xs text-danger hover:underline justify-self-end"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          일반 유의사항 (줄바꿈으로 항목 구분)
        </label>
        <textarea
          value={notesRaw}
          onChange={(e) => setNotesRaw(e.target.value)}
          rows={4}
          placeholder="예: 훼손권은 매입 불가"
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm resize-y"
        />
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          onClick={save}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          저장
        </button>
      </div>
    </div>
  );
}

function DenominationGroup({
  title,
  color,
  items,
  sampleId,
}: {
  title: string;
  color: "green" | "warn" | "danger";
  items: { d: Denomination; originalIndex: number }[];
  sampleId: string;
}) {
  const dot = {
    green: "bg-primary",
    warn: "bg-warn",
    danger: "bg-danger",
  }[color];

  return (
    <div className="mb-5 last:mb-0">
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-2 h-2 rounded-full ${dot}`} />
        <h3 className="text-sm font-medium text-charcoal-soft uppercase tracking-wide">
          {title}{" "}
          <span className="text-[10px] normal-case ml-0.5">
            ({items.length})
          </span>
        </h3>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map(({ d, originalIndex }) => (
          <DenominationCard
            key={`${sampleId}-${originalIndex}`}
            denomination={d}
          />
        ))}
      </div>
    </div>
  );
}

function DenominationCard({ denomination }: { denomination: Denomination }) {
  const bothOk = denomination.buyable && denomination.sellable;
  const buyOnly = denomination.buyable && !denomination.sellable;

  const bgClass = bothOk
    ? "bg-white border-border"
    : buyOnly
      ? "bg-warn/5 border-warn/30"
      : "bg-danger/5 border-danger/30";

  return (
    <article
      className={["border rounded-lg overflow-hidden flex flex-col", bgClass].join(
        " ",
      )}
    >
      <div className="aspect-[5/3] bg-offwhite border-b border-border flex items-center justify-center text-charcoal-soft text-xs">
        {denomination.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={denomination.imageUrl}
            alt={denomination.value}
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-center px-2">
            🖼️ 사진 자리
            <br />
            <span className="text-[10px]">
              public/currency-samples/ 에 추가
            </span>
          </span>
        )}
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <p className="font-bold mb-1.5">{denomination.value}</p>

        <div className="flex flex-wrap gap-1 mb-2">
          <StatusChip label="매입" ok={denomination.buyable} />
          <StatusChip label="매도" ok={denomination.sellable} />
        </div>

        {denomination.series && (
          <p className="text-xs text-charcoal-soft mb-1">
            {denomination.series}
          </p>
        )}
        {denomination.notes && (
          <p className="text-[11px] text-charcoal-soft mt-auto pt-2 border-t border-border italic">
            {denomination.notes}
          </p>
        )}
      </div>
    </article>
  );
}

function StatusChip({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span
      className={[
        "text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap font-medium",
        ok
          ? "text-primary border-primary/30 bg-primary/10"
          : "text-danger border-danger/30 bg-danger/10",
      ].join(" ")}
    >
      {ok ? "✓" : "✗"} {label}
    </span>
  );
}
