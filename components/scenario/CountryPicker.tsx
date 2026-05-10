"use client";

import { useState } from "react";
import { COUNTRIES } from "@/lib/data";
import type { Country, CountryRoutingType } from "@/lib/types";

type Props = {
  value: string;
  onChange: (id: string) => void;
};

export function CountryPicker({ value, onChange }: Props) {
  const [showOthers, setShowOthers] = useState(false);
  const [search, setSearch] = useState("");

  const popular = COUNTRIES.filter((c) => c.popular && c.riskLevel !== "BLOCKED");
  const others = COUNTRIES.filter((c) => !c.popular);

  const filteredOthers = search.trim()
    ? others.filter(
        (c) =>
          c.name.includes(search.trim()) ||
          c.code.toUpperCase().includes(search.trim().toUpperCase()),
      )
    : others;

  const selected = COUNTRIES.find((c) => c.id === value);

  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs text-charcoal-soft mb-2">자주 송금하는 국가</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {popular.map((c) => (
            <CountryCard
              key={c.id}
              country={c}
              selected={c.id === value}
              onClick={() => onChange(c.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowOthers(!showOthers)}
          className="text-sm text-charcoal-soft hover:text-primary transition"
        >
          {showOthers ? "▼" : "▶"} 기타 국가
          {!showOthers && <span className="ml-1 text-xs">(클릭해서 펼치기)</span>}
        </button>
        {showOthers && (
          <div className="mt-2 space-y-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="나라 검색 (예: 독일, DE)"
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-72 overflow-y-auto pr-1">
              {filteredOthers.map((c) => (
                <CountryCard
                  key={c.id}
                  country={c}
                  selected={c.id === value}
                  onClick={() => onChange(c.id)}
                />
              ))}
              {filteredOthers.length === 0 && (
                <p className="col-span-full text-sm text-charcoal-soft py-4 text-center">
                  검색 결과 없음. 데이터 추가가 필요한 국가일 수 있어요.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {selected && <CountryRemarks country={selected} />}
    </div>
  );
}

function CountryCard({
  country,
  selected,
  onClick,
}: {
  country: Country;
  selected: boolean;
  onClick: () => void;
}) {
  const blocked = country.riskLevel === "BLOCKED";
  const watch = country.riskLevel === "WATCH";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={blocked}
      className={[
        "text-left p-3 border rounded-lg transition",
        selected
          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
          : blocked
            ? "border-danger/30 bg-danger/5 opacity-70 cursor-not-allowed"
            : "border-border hover:border-primary hover:bg-primary/5",
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl leading-none">{country.flag}</span>
        <span className="font-medium text-sm">{country.name}</span>
      </div>
      <p className="text-[10px] text-charcoal-soft mt-1 truncate">
        {blocked
          ? "❌ 송금 불가"
          : watch
            ? "⚠️ 주의 국가"
            : describeShort(country)}
      </p>
    </button>
  );
}

function describeShort(c: Country): string {
  if (c.ibanRequired && c.ibanLength) return `IBAN ${c.ibanLength}자리`;
  if (c.routingType === "ABA") return `ABA ${c.routingDigits}자리`;
  if (c.routingType === "BSB") return `BSB ${c.routingDigits}자리`;
  if (c.routingType === "IFSC") return `IFSC ${c.routingDigits}자리`;
  if (c.routingType === "CNAPS") return `CNAPS ${c.routingDigits}자리`;
  if (c.routingType === "Transit") return "Institution + Transit";
  if (c.routingType === "JapaneseBank") return "은행/지점/계좌";
  if (c.routingType === "SortCode") return `Sort Code ${c.routingDigits}자리`;
  if (c.routingType === "CLABE") return `CLABE ${c.routingDigits}자리`;
  if (c.routingType === "SWIFT_only") return "SWIFT BIC";
  return "";
}

function CountryRemarks({ country }: { country: Country }) {
  if (country.riskLevel === "BLOCKED") {
    return (
      <div className="bg-danger/5 border border-danger/30 rounded-lg p-4">
        <p className="text-sm font-bold text-danger mb-2">
          ❌ {country.flag} {country.name} — 송금 불가
        </p>
        <ul className="text-sm text-charcoal-soft space-y-0.5 list-disc list-inside">
          {country.remarks?.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="bg-offwhite border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium">
          {country.flag} {country.name} 송금 시 유의사항
        </p>
        <span className="text-[10px] text-charcoal-soft border border-border bg-white px-2 py-0.5 rounded-full whitespace-nowrap">
          ⚠️ 데이터 검증 필요
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {country.ibanRequired && (
          <Chip>IBAN {country.ibanLength}자리 필수</Chip>
        )}
        {country.routingType && country.routingType !== "SWIFT_only" && (
          <Chip>{labelForRouting(country.routingType, country.routingDigits)}</Chip>
        )}
        {country.routingType === "SWIFT_only" && <Chip>SWIFT BIC만</Chip>}
        {country.purposeCodeRequired && (
          <Chip variant="warn">송금사유 코드 필수</Chip>
        )}
        {country.riskLevel === "WATCH" && (
          <Chip variant="warn">주의 국가</Chip>
        )}
      </div>

      {country.remarks && country.remarks.length > 0 && (
        <ul className="text-sm text-charcoal space-y-1 list-disc list-inside">
          {country.remarks.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function labelForRouting(t: CountryRoutingType, digits?: number): string {
  switch (t) {
    case "ABA":
      return `ABA 라우팅 ${digits ?? "?"}자리`;
    case "BSB":
      return `BSB ${digits ?? "?"}자리`;
    case "SortCode":
      return `Sort Code ${digits ?? "?"}자리`;
    case "Transit":
      return "Institution + Transit Number";
    case "IFSC":
      return `IFSC ${digits ?? "?"}자리`;
    case "CNAPS":
      return `CNAPS ${digits ?? "?"}자리`;
    case "CLABE":
      return `CLABE ${digits ?? "?"}자리`;
    case "JapaneseBank":
      return "은행 4 + 지점 3 + 계좌 7";
    case "SWIFT_only":
      return "SWIFT BIC";
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
        "text-xs px-2 py-0.5 rounded-full border",
        variant === "warn"
          ? "bg-warn/10 border-warn/40 text-charcoal"
          : "bg-white border-border text-charcoal-soft",
      ].join(" ")}
    >
      {children}
    </span>
  );
}
