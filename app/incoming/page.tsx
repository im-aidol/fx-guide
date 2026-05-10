"use client";

import { useState } from "react";

// iM뱅크 타발 송금 수취 정보 (출처: imbank.co.kr 공식 안내)
const BANK_INFO = {
  name: "iM Bank (FORMERLY DAEGU BANK)",
  swift: "DAEBKR22",
  address: "2310, DALGUBEOL-DAERO, SUSEONG-GU, DAEGU, SOUTH KOREA",
};

export default function IncomingPage() {
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [address, setAddress] = useState("");

  const clear = () => {
    setName("");
    setAccount("");
    setAddress("");
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 print:py-4 print:max-w-full">
      <header className="mb-6 print:mb-4">
        <p className="text-xs text-primary font-medium tracking-wide mb-1 print:hidden">
          타발 송금 (해외 → 한국)
        </p>
        <h1 className="text-3xl font-bold mb-2 print:text-2xl">
          타발 송금 안내서
        </h1>
        <p className="text-sm text-charcoal-soft print:hidden">
          해외에서 iM뱅크로 송금 받을 때 송금자에게 전달할 정보. 입력 후 인쇄해 고객에게 드리기.
        </p>
      </header>

      <section className="bg-white border border-border rounded-xl p-6 mb-4 print:rounded-md print:border-charcoal print:p-4 print:mb-3">
        <h2 className="text-sm font-medium text-primary mb-3 print:text-charcoal print:font-bold print:text-base">
          ① Beneficiary Bank · 수취 은행 (고정)
        </h2>
        <dl className="space-y-2 text-sm print:text-xs">
          <Row label="Bank Name" value={BANK_INFO.name} />
          <Row label="SWIFT / BIC Code" value={BANK_INFO.swift} bold />
          <Row label="Bank Address" value={BANK_INFO.address} />
        </dl>
      </section>

      <section className="bg-white border border-border rounded-xl p-6 mb-4 print:rounded-md print:border-charcoal print:p-4 print:mb-3">
        <h2 className="text-sm font-medium text-primary mb-3 print:text-charcoal print:font-bold print:text-base">
          ② Beneficiary · 수취인 정보
        </h2>
        <div className="space-y-3">
          <InputRow
            label="Beneficiary Name (영문성명)"
            value={name}
            onChange={setName}
            placeholder="HONG GIL DONG"
          />
          <InputRow
            label="Beneficiary Account No. (계좌번호)"
            value={account}
            onChange={setAccount}
            placeholder="000-00-000000"
            transformUpper={false}
          />
          <InputRow
            label="Beneficiary Address (영문주소)"
            value={address}
            onChange={setAddress}
            placeholder="123, GANGNAM-DAERO, GANGNAM-GU, SEOUL, SOUTH KOREA"
          />
        </div>
      </section>

      <section className="bg-offwhite border border-border rounded-xl p-5 mb-6 print:rounded-md print:border-charcoal print:p-3 text-sm print:text-[11px]">
        <h2 className="text-sm font-medium mb-2 print:font-bold">
          참고 — 수취 시 안내사항
        </h2>
        <ul className="space-y-1 text-charcoal-soft list-disc list-inside print:text-charcoal">
          <li>USD 5,000 이하 — 거래입증서류 불필요</li>
          <li>
            USD 5,000 초과 ~ USD 100,000 이하 — 거래입증서류 있으면 제출 권장
          </li>
          <li>USD 100,000 초과 — 거래 영업점에 거래입증서류 제출 필요</li>
          <li>미화 1만불 상당액 초과 수취 시 국세청 자동 통보</li>
        </ul>
        <p className="text-[10px] text-charcoal-soft mt-3 print:text-[9px]">
          본 정보는 iM뱅크 공식 안내(www.imbank.co.kr) 기준.
        </p>
      </section>

      <div className="flex gap-2 print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-medium transition"
        >
          🖨️ 인쇄하기
        </button>
        <button
          onClick={clear}
          className="border border-border px-5 py-2.5 rounded-lg text-charcoal-soft hover:text-charcoal transition"
        >
          입력 비우기
        </button>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-1.5 border-b border-border last:border-0">
      <dt className="text-charcoal-soft text-xs sm:w-44 sm:shrink-0 uppercase tracking-wide print:text-charcoal print:font-medium">
        {label}
      </dt>
      <dd
        className={
          bold
            ? "font-bold text-base font-mono tracking-wider"
            : "font-mono text-sm"
        }
      >
        {value}
      </dd>
    </div>
  );
}

function InputRow({
  label,
  value,
  onChange,
  placeholder,
  transformUpper = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  transformUpper?: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-1.5 border-b border-border last:border-0">
      <label className="text-charcoal-soft text-xs sm:w-44 sm:shrink-0 uppercase tracking-wide print:text-charcoal print:font-medium">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) =>
          onChange(transformUpper ? e.target.value.toUpperCase() : e.target.value)
        }
        placeholder={placeholder}
        className="flex-1 border-0 border-b border-dashed border-border focus:outline-none focus:border-primary font-mono uppercase bg-transparent py-1 print:border-charcoal print:border-solid print:placeholder-transparent"
      />
    </div>
  );
}
