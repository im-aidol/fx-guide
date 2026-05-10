"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchUsdRates, type UsdRates } from "@/lib/exchange-rates";

const PURPOSE_REQUIRED_COUNTRIES: { flag: string; name: string }[] = [
  { flag: "🇦🇪", name: "UAE" },
  { flag: "🇸🇦", name: "사우디" },
  { flag: "🇰🇼", name: "쿠웨이트" },
  { flag: "🇲🇾", name: "말레이시아" },
  { flag: "🇺🇿", name: "우즈벡" },
  { flag: "🇵🇰", name: "파키스탄" },
  { flag: "🇯🇴", name: "요르단" },
  { flag: "🇲🇦", name: "모로코" },
  { flag: "🇹🇱", name: "동티모르" },
  { flag: "🇶🇦", name: "카타르" },
  { flag: "🇺🇸", name: "미국" },
  { flag: "🇮🇳", name: "인도" },
];

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <header className="mb-8">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          외환 길잡이 · 대시보드
        </p>
        <h1 className="text-3xl font-bold mb-2">오늘의 외환 업무</h1>
        <p className="text-sm text-charcoal-soft">
          외국환거래규정(재정경제부고시 제2026-69호, 시행 2026.3.30.) 기준 ·
          창구 상담용 빠른 참조
        </p>
      </header>

      <RatePanel />

      <section className="grid md:grid-cols-3 gap-4 mb-6">
        <QuickStartCard />
        <IncomingCard />
        <SearchCard />
      </section>

      <section className="grid md:grid-cols-2 gap-4 mb-6">
        <LimitsCard />
        <PurposeCountriesCard />
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <SmallLink
          href="/guide"
          title="업무별 가이드"
          desc="송금 케이스별 절차·서류 (작성 예정)"
        />
        <SmallLink
          href="/faq"
          title="FAQ"
          desc="13개 — 한도·통보·국가별 코드"
        />
        <SmallLink
          href="/glossary"
          title="용어 사전"
          desc="50여개 — 외환규정 1-2조 본문 인용"
        />
      </section>
    </div>
  );
}

// ─────────────────────────────────────
// 환율 패널
// ─────────────────────────────────────
function RatePanel() {
  const [rates, setRates] = useState<UsdRates | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchUsdRates()
      .then(setRates)
      .catch(() => setError(true));
  }, []);

  return (
    <section className="bg-white border border-border rounded-xl p-5 mb-4">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-semibold">참고 환율 (오늘)</h2>
        <span className="text-[10px] text-charcoal-soft">
          ⚠️ 참고용 · 실제 거래는 iM뱅크 매매기준율 적용
        </span>
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
      {rates && (
        <p className="text-[10px] text-charcoal-soft mt-3">
          {rates.date} 기준 · fawazahmed0/exchange-api
        </p>
      )}
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

// ─────────────────────────────────────
// 빠른 시작
// ─────────────────────────────────────
function QuickStartCard() {
  return (
    <Link
      href="/simulator"
      className="bg-primary text-white rounded-xl p-5 hover:bg-primary-dark transition group flex flex-col"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">🧭</span>
        <span className="text-xs uppercase tracking-wide opacity-90">
          가장 자주 쓰는 도구
        </span>
      </div>
      <h3 className="text-xl font-bold mb-2">송금 흐름 도우미</h3>
      <p className="text-sm opacity-90 flex-1 leading-relaxed">
        고객이 어떤 사유로 보내는지 모르더라도, 클릭으로 좁혀가며 거래코드·한도·서류·안내멘트까지 한 번에.
      </p>
      <span className="text-sm font-medium mt-3 group-hover:translate-x-1 transition">
        시작하기 →
      </span>
    </Link>
  );
}

// ─────────────────────────────────────
// 타발 송금
// ─────────────────────────────────────
function IncomingCard() {
  return (
    <div className="bg-white border border-border rounded-xl p-5 flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">📥</span>
        <span className="text-xs uppercase tracking-wide text-charcoal-soft">
          타발 송금 (받기)
        </span>
      </div>
      <h3 className="font-bold mb-3">iM뱅크 수취 정보</h3>
      <dl className="space-y-2 text-sm flex-1">
        <div className="flex justify-between gap-2">
          <dt className="text-charcoal-soft">SWIFT/BIC</dt>
          <dd className="font-mono font-bold">DAEBKR22</dd>
        </div>
        <div>
          <dt className="text-charcoal-soft text-xs">Bank Name</dt>
          <dd className="text-xs font-mono mt-0.5">
            iM Bank (FORMERLY DAEGU BANK)
          </dd>
        </div>
        <div>
          <dt className="text-charcoal-soft text-xs">Address</dt>
          <dd className="text-xs font-mono mt-0.5 leading-relaxed">
            2310, DALGUBEOL-DAERO,
            <br />
            SUSEONG-GU, DAEGU, SOUTH KOREA
          </dd>
        </div>
      </dl>
      <Link
        href="/incoming"
        className="text-xs text-primary hover:text-primary-dark mt-3 inline-block font-medium"
      >
        고객 정보 입력 + 인쇄 →
      </Link>
    </div>
  );
}

// ─────────────────────────────────────
// 빠른 검색
// ─────────────────────────────────────
function SearchCard() {
  return (
    <div className="bg-white border border-border rounded-xl p-5 flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">🔍</span>
        <span className="text-xs uppercase tracking-wide text-charcoal-soft">
          빠른 검색
        </span>
      </div>
      <h3 className="font-bold mb-3">자료실</h3>
      <p className="text-sm text-charcoal-soft mb-3 flex-1">
        외환규정 본문 + iM뱅크 안내 1차 자료. 모든 항목에 출처 표기.
      </p>
      <div className="space-y-1.5">
        <Link
          href="/faq"
          className="flex justify-between items-center text-sm hover:text-primary transition"
        >
          <span>FAQ</span>
          <span className="text-xs text-charcoal-soft">13개</span>
        </Link>
        <Link
          href="/glossary"
          className="flex justify-between items-center text-sm hover:text-primary transition"
        >
          <span>용어 사전</span>
          <span className="text-xs text-charcoal-soft">50+개</span>
        </Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────
// 자주 찾는 한도
// ─────────────────────────────────────
function LimitsCard() {
  return (
    <div className="bg-white border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📏</span>
        <h3 className="font-bold">자주 찾는 한도 / 통보 트리거</h3>
      </div>
      <ul className="space-y-2.5 text-sm">
        <LimitRow
          label="거주자 무증빙 송금"
          value="연 USD 100,000"
          src="외환규정 4-3조 ①1호"
        />
        <LimitRow
          label="외국인·비거주자 국내소득송금"
          value="연 USD 50,000"
          src="iM뱅크 안내"
        />
        <LimitRow
          label="건당 무증빙 (10만불 초과 시 OK)"
          value="USD 5,000"
          src="외환규정 4-3조 ②가목"
        />
        <LimitRow
          label="국세청·관세청·금감원 통보"
          value="USD 10,000 초과"
          src="외환규정 4-8조 ①·②·③"
          warn
        />
      </ul>
    </div>
  );
}

function LimitRow({
  label,
  value,
  src,
  warn,
}: {
  label: string;
  value: string;
  src: string;
  warn?: boolean;
}) {
  return (
    <li className="flex items-baseline justify-between gap-2 pb-2 border-b border-border last:border-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-charcoal">{label}</p>
        <p className="text-[10px] text-charcoal-soft mt-0.5">{src}</p>
      </div>
      <p
        className={[
          "font-bold tabular-nums whitespace-nowrap",
          warn ? "text-danger" : "text-primary",
        ].join(" ")}
      >
        {value}
      </p>
    </li>
  );
}

// ─────────────────────────────────────
// 사유 필수국
// ─────────────────────────────────────
function PurposeCountriesCard() {
  return (
    <div className="bg-white border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📝</span>
        <h3 className="font-bold">송금사유 필수 기재국</h3>
      </div>
      <p className="text-xs text-charcoal-soft mb-3">
        이 나라에 송금 시 송금목적을 반드시 기재. 누락 시 수취 측에서 반환·지연 발생 가능.
      </p>
      <div className="grid grid-cols-3 gap-1.5">
        {PURPOSE_REQUIRED_COUNTRIES.map((c) => (
          <div
            key={c.name}
            className="flex items-center gap-1.5 text-xs bg-offwhite border border-border px-2 py-1.5 rounded-md"
          >
            <span className="text-sm leading-none">{c.flag}</span>
            <span>{c.name}</span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-charcoal-soft mt-3">
        출처: iM뱅크 모바일앱 안내
      </p>
    </div>
  );
}

// ─────────────────────────────────────
// 작은 링크 카드
// ─────────────────────────────────────
function SmallLink({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white border border-border rounded-xl p-4 hover:border-primary transition group"
    >
      <h4 className="font-medium group-hover:text-primary transition">{title}</h4>
      <p className="text-xs text-charcoal-soft mt-1">{desc}</p>
    </Link>
  );
}
