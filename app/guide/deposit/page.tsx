"use client";

import Link from "next/link";
import { useState } from "react";
import {
  DEPOSIT_PRODUCTS,
  depositsByCategory,
  type DepositProduct,
} from "@/lib/data/deposit-products";
import { AdminNote } from "@/components/admin/AdminNote";

const COMPREHENSIVE = depositsByCategory("통합통장");
const DEMAND = depositsByCategory("수시입출");
const TERM = depositsByCategory("예치형");
const SAVINGS = depositsByCategory("적금");
const TRANSFER = depositsByCategory("이체");

export default function DepositGuidePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Link
        href="/guide"
        className="text-xs text-charcoal-soft hover:text-primary inline-flex items-center gap-1 mb-3"
      >
        ← 가이드 홈
      </Link>
      <header className="mb-6">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          🏦 외화 통장·적금
        </p>
        <h1 className="text-3xl font-bold mb-2">외화 예금·적금 상품</h1>
        <p className="text-sm text-charcoal-soft">
          iM뱅크 외화 통장(브랜드) 1종 + 예금 6종 + 적금 4종 + 자동이체. 각 상품
          본문(상품설명서·특약) 기준으로 한눈에 비교.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-deposit" />

      <Toc />

      {/* 공통 안내 */}
      <section
        id="common"
        className="bg-offwhite border border-border rounded-xl p-5 mb-6 text-sm scroll-mt-20"
      >
        <p className="font-medium mb-2">📋 모든 외화 예금·적금 공통</p>
        <ul className="space-y-1 text-charcoal-soft list-disc list-inside">
          <li>
            <strong>기본 약관</strong>: 외환거래 기본약관 + 외화예금 거래기본약관
            (특약·상품설명서에서 정하지 않은 사항은 기본약관 준용)
          </li>
          <li>공동명의 가입 불가 (전 상품)</li>
          <li>
            예금자보호법 적용 — 원금+이자 <strong>1인당 1억원까지</strong> (본 은행
            여타 보호상품과 합산)
          </li>
          <li>비과세종합저축 가입 불가</li>
          <li>
            현찰수수료 (대부분 상품 동일): USD/JPY/EUR/GBP/CAD/AUD/CHF/NZD 1.5%, CNY
            4.0% (USD 외 현찰 입금 또는 송금 입금분을 현찰로 출금 시)
          </li>
          <li>원화 출금 시 환율변동으로 이익/손실 발생 가능</li>
        </ul>
      </section>

      {/* 통합통장 — 강조 */}
      {COMPREHENSIVE.length > 0 && (
        <section id="comprehensive" className="mb-8 scroll-mt-20">
          <SectionTitle icon="🌐" title="외화 종합통장 (브랜드)">
            보통예금이 기본계좌, 통지·정기·회전복리가 연결계좌. 영업점 첫 가입
            추천.
          </SectionTitle>
          <div className="grid md:grid-cols-1 gap-4">
            {COMPREHENSIVE.map((p) => (
              <ProductDetailCard key={p.id} product={p} highlight />
            ))}
          </div>
        </section>
      )}

      {/* 수시입출 예금 3종 비교 */}
      <section id="demand" className="mb-8 scroll-mt-20">
        <SectionTitle icon="💵" title="수시입출 외화예금 (3종)">
          입출금이 자유로운 외화 통장 — 용도·금리 구조로 선택.
        </SectionTitle>
        <CompareTable products={DEMAND} compareKeys={DEMAND_COMPARE_KEYS} />
        <div className="grid md:grid-cols-3 gap-3 mt-4">
          {DEMAND.map((p) => (
            <ProductDetailCard key={p.id} product={p} compact />
          ))}
        </div>
      </section>

      {/* 예치형 예금 3종 비교 */}
      <section id="term" className="mb-8 scroll-mt-20">
        <SectionTitle icon="🏛️" title="예치형 외화예금 (3종)">
          기간을 정해 예치하는 외화예금 — 단기·중기·장기 운용에 따라 선택.
        </SectionTitle>
        <CompareTable products={TERM} compareKeys={TERM_COMPARE_KEYS} />
        <div className="grid md:grid-cols-3 gap-3 mt-4">
          {TERM.map((p) => (
            <ProductDetailCard key={p.id} product={p} compact />
          ))}
        </div>
      </section>

      {/* 적금 4종 비교 */}
      <section id="savings" className="mb-8 scroll-mt-20">
        <SectionTitle icon="💰" title="외화 적금 (4종)">
          자유적립식 외화 예금 — 기본형·장기우대·비대면·미성년자 우대.
        </SectionTitle>
        <CompareTable products={SAVINGS} compareKeys={SAVINGS_COMPARE_KEYS} />
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {SAVINGS.map((p) => (
            <ProductDetailCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 자동이체 */}
      {TRANSFER.length > 0 && (
        <section id="transfer" className="mb-8 scroll-mt-20">
          <SectionTitle icon="🔁" title="외화 자동이체">
            예금·적금 적립용 정기 이체.
          </SectionTitle>
          <div className="grid md:grid-cols-1 gap-4">
            {TRANSFER.map((p) => (
              <ProductDetailCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 안내 */}
      <section className="bg-offwhite border border-border rounded-xl p-5 text-sm">
        <h3 className="font-medium mb-2">⚠️ 영업점 가입 시 확인</h3>
        <ul className="space-y-1 text-charcoal-soft list-disc list-inside">
          <li>
            위 정보는 상품설명서·특약 본문 기준. 실시간 적용 금리·환율우대 수치는
            영업점 게시 또는 본부 매뉴얼 기준
          </li>
          <li>iM·IDREAM은 비대면(모바일) 가입 채널 중심. 영업점 가입 가능 여부는 본부 확인</li>
          <li>
            글로벌통장 수수료 우대 (송금 50% / 현찰 50% / TC 30%)는 외화통지·정기예금
            보유 + 신규금액 요건 충족 + 대상예금 유지 시에만 적용
          </li>
          <li>총 {DEPOSIT_PRODUCTS.length}개 상품. 모든 항목 출처는 각 카드 하단 명시</li>
        </ul>
      </section>
    </div>
  );
}

// ─── 비교표 ───
type CompareKey = {
  label: string;
  get: (p: DepositProduct) => string | undefined | string[];
};

const DEMAND_COMPARE_KEYS: CompareKey[] = [
  { label: "가입대상", get: (p) => p.eligibility },
  { label: "통화", get: (p) => p.currencies },
  { label: "이자", get: (p) => p.baseRate },
  { label: "이자지급", get: (p) => p.interestPayment },
  { label: "가입금액", get: (p) => p.initialDeposit },
];

const TERM_COMPARE_KEYS: CompareKey[] = [
  { label: "기간", get: (p) => p.period },
  { label: "통화", get: (p) => p.currencies },
  { label: "금리방식", get: (p) => p.baseRate },
  { label: "중도해지", get: (p) => p.earlyTermination },
  { label: "재예치", get: (p) => p.autoRenew },
];

const SAVINGS_COMPARE_KEYS: CompareKey[] = [
  { label: "가입대상", get: (p) => p.eligibility },
  { label: "기간", get: (p) => p.period },
  { label: "통화", get: (p) => p.currencies },
  { label: "채널", get: (p) => p.channels },
  { label: "최초가입", get: (p) => p.initialDeposit },
  { label: "추가입금", get: (p) => p.additionalDeposit },
  { label: "계좌한도", get: (p) => p.accountLimit },
  { label: "일부해지", get: (p) => p.partialWithdraw },
  { label: "자동재예치", get: (p) => p.autoRenew },
];

function CompareTable({
  products,
  compareKeys,
}: {
  products: DepositProduct[];
  compareKeys: CompareKey[];
}) {
  return (
    <div className="overflow-x-auto bg-white border border-border rounded-xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-offwhite">
            <th className="text-left p-3 text-xs text-charcoal-soft uppercase tracking-wide w-28">
              항목
            </th>
            {products.map((p) => (
              <th
                key={p.id}
                className="text-left p-3 text-charcoal font-semibold"
              >
                {p.shortTitle}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {compareKeys.map((k) => {
            const allEmpty = products.every((p) => {
              const v = k.get(p);
              if (Array.isArray(v)) return v.length === 0;
              return !v;
            });
            if (allEmpty) return null;
            return (
              <tr
                key={k.label}
                className="border-b border-border last:border-0 align-top"
              >
                <td className="p-3 text-xs text-charcoal-soft uppercase tracking-wide whitespace-nowrap">
                  {k.label}
                </td>
                {products.map((p) => {
                  const v = k.get(p);
                  const text = Array.isArray(v)
                    ? v.join(" · ")
                    : (v ?? "—");
                  return (
                    <td
                      key={p.id}
                      className="p-3 text-charcoal-soft leading-relaxed text-xs"
                    >
                      {text}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── 상품 상세 카드 ───
function ProductDetailCard({
  product,
  highlight,
  compact,
}: {
  product: DepositProduct;
  highlight?: boolean;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <article
      className={[
        "border rounded-xl p-5 flex flex-col",
        highlight
          ? "bg-primary/5 border-primary/30"
          : "bg-white border-border",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className={highlight ? "font-bold text-lg leading-tight" : "font-bold leading-tight"}>
          {product.title}
        </h3>
        <span className="text-[10px] text-charcoal-soft bg-offwhite border border-border px-2 py-0.5 rounded-full whitespace-nowrap">
          {product.category}
        </span>
      </div>
      <p className="text-sm text-charcoal-soft mb-3 leading-relaxed">
        {product.description}
      </p>

      {/* 핵심 정보 */}
      <dl className="space-y-2 text-sm">
        {!compact && product.eligibility && (
          <Row label="가입대상" value={product.eligibility} />
        )}
        {product.period && <Row label="기간" value={product.period} />}
        {!compact && product.currencies && (
          <Row label="통화" value={product.currencies} />
        )}
        {!compact && product.channels && (
          <Row label="채널" value={product.channels} />
        )}
        {product.initialDeposit && (
          <Row label="가입금액" value={product.initialDeposit} />
        )}
        {!compact && product.additionalDeposit && (
          <Row label="추가입금" value={product.additionalDeposit} />
        )}
        {product.interestPayment && (
          <Row label="이자지급" value={product.interestPayment} />
        )}
        {product.baseRate && <Row label="기본금리" value={product.baseRate} />}
      </dl>

      {product.bonusRate && product.bonusRate.length > 0 && (
        <Section title="우대금리">
          {product.bonusRate.map((b, i) => (
            <li key={i} className="text-charcoal pl-1 list-disc list-inside">
              {b}
            </li>
          ))}
        </Section>
      )}

      {product.benefits && product.benefits.length > 0 && (
        <Section title="부가 혜택·특이사항">
          {product.benefits.map((b, i) => (
            <li key={i} className="text-charcoal pl-1 list-disc list-inside">
              {b}
            </li>
          ))}
        </Section>
      )}

      {/* 펼침 — 중도해지/만기후/현찰수수료/예금자보호 */}
      {(product.earlyTermination ||
        product.postMaturity ||
        product.cashFee ||
        product.protection ||
        product.taxBenefit ||
        product.autoRenew ||
        product.partialWithdraw) && (
        <details
          className="mt-3 pt-3 border-t border-border text-sm"
          onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
        >
          <summary className="cursor-pointer text-charcoal-soft hover:text-primary text-xs uppercase tracking-wide font-medium">
            {open ? "▼" : "▶"} 해지·만기·수수료 상세
          </summary>
          <dl className="mt-2 space-y-2">
            {product.earlyTermination && (
              <Row label="중도해지" value={product.earlyTermination} />
            )}
            {product.partialWithdraw && (
              <Row label="일부해지" value={product.partialWithdraw} />
            )}
            {product.postMaturity && (
              <Row label="만기 후 이자" value={product.postMaturity} />
            )}
            {product.autoRenew && (
              <Row label="자동재예치" value={product.autoRenew} />
            )}
            {product.cashFee && <Row label="현찰수수료" value={product.cashFee} />}
            {product.protection && (
              <Row label="예금자보호" value={product.protection} />
            )}
            {product.taxBenefit && (
              <Row label="세제혜택" value={product.taxBenefit} />
            )}
          </dl>
        </details>
      )}

      <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-border">
        <Tag>{product.termsFile}</Tag>
      </div>
      <p className="text-[10px] text-charcoal-soft mt-2">
        출처: {product.source}
      </p>
    </article>
  );
}

// ─── 보조 ───
function Toc() {
  const items = [
    { href: "#common", label: "공통 약관·예금자보호" },
    { href: "#comprehensive", label: "🌐 글로벌외화종합통장" },
    { href: "#demand", label: "💵 수시입출 (3종)" },
    { href: "#term", label: "🏛️ 예치형 (3종)" },
    { href: "#savings", label: "💰 적금 (4종)" },
    { href: "#transfer", label: "🔁 자동이체" },
  ];
  return (
    <nav className="bg-white border border-border rounded-xl p-3 mb-6 flex flex-wrap gap-1.5 text-xs">
      <span className="text-charcoal-soft uppercase tracking-wide px-1 py-1">
        바로가기
      </span>
      {items.map((it) => (
        <a
          key={it.href}
          href={it.href}
          className="px-2.5 py-1 rounded-full border border-border text-charcoal-soft hover:border-primary hover:text-primary transition"
        >
          {it.label}
        </a>
      ))}
    </nav>
  );
}

function SectionTitle({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <h2 className="text-xl font-bold">
        <span className="mr-2">{icon}</span>
        {title}
      </h2>
      {children && (
        <p className="text-xs text-charcoal-soft mt-1">{children}</p>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3">
      <dt className="text-xs text-charcoal-soft sm:w-24 sm:shrink-0 uppercase tracking-wide">
        {label}
      </dt>
      <dd className="text-charcoal leading-relaxed text-sm flex-1">{value}</dd>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-3">
      <h4 className="text-xs font-medium text-charcoal-soft mb-1.5 uppercase tracking-wide">
        {title}
      </h4>
      <ul className="space-y-1 text-sm">{children}</ul>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] text-charcoal-soft bg-offwhite border border-border px-2 py-0.5 rounded-full">
      📄 {children}
    </span>
  );
}
