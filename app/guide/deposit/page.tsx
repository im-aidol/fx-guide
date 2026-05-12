"use client";

import Link from "next/link";
import { useState } from "react";
import {
  DEPOSIT_PRODUCTS,
  type DepositProduct,
} from "@/lib/data/deposit-products";

const SAVINGS_IDS = ["foryou", "plusyou", "im-free", "idream-free"];
const SAVINGS = DEPOSIT_PRODUCTS.filter((p) => SAVINGS_IDS.includes(p.id));
const OTHERS = DEPOSIT_PRODUCTS.filter((p) => !SAVINGS_IDS.includes(p.id));

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
          iM뱅크 외화 적금 4종 비교 + 글로벌외화종합통장 + 외화 자동이체. 각
          상품 본문(특약) 기준으로 한눈에 비교.
        </p>
      </header>

      {/* 공통 안내 */}
      <section className="bg-offwhite border border-border rounded-xl p-5 mb-6 text-sm">
        <p className="font-medium mb-2">📋 모든 외화 예금·적금 공통</p>
        <ul className="space-y-1 text-charcoal-soft list-disc list-inside">
          <li>
            <strong>기본 약관</strong>: 외환거래 기본약관 + 외화예금 거래기본약관 (특약에서 정하지 않은 사항은 기본약관 준용)
          </li>
          <li>외국인거주자도 가입 가능 (단 한도 관리 별도)</li>
          <li>USD 10,000 초과 입금 시 외환통계 자료로 국세청 통보 대상</li>
          <li>예금자보호법 적용 (한도는 원화 환산 기준)</li>
        </ul>
      </section>

      {/* 적금 4종 비교표 — 핵심 차이만 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">📊 외화 적금 4종 비교</h2>
        <div className="overflow-x-auto bg-white border border-border rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-offwhite">
                <th className="text-left p-3 text-xs text-charcoal-soft uppercase tracking-wide w-32">
                  항목
                </th>
                {SAVINGS.map((p) => (
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
              <CompareRow label="가입대상" rows={SAVINGS} get={(p) => p.eligibility} />
              <CompareRow label="가입기간" rows={SAVINGS} get={(p) => p.period} />
              <CompareRow label="가입통화" rows={SAVINGS} get={(p) => p.currencies} />
              <CompareRow label="가입방법" rows={SAVINGS} get={(p) => p.channels} />
              <CompareRow label="최초 가입" rows={SAVINGS} get={(p) => p.initialDeposit} />
              <CompareRow label="추가 입금" rows={SAVINGS} get={(p) => p.additionalDeposit} />
              <CompareRow label="계좌 한도" rows={SAVINGS} get={(p) => p.accountLimit} />
              <CompareRow label="일부해지" rows={SAVINGS} get={(p) => p.partialWithdraw} />
              <CompareRow label="자동재예치" rows={SAVINGS} get={(p) => p.autoRenew} />
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-charcoal-soft mt-2">
          ⚠️ 중도해지·만기 후 이자·우대금리 등은 각 상품 상세 카드에서 확인.
        </p>
      </section>

      {/* 적금 4종 상세 카드 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">📑 적금 상품 상세</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {SAVINGS.map((p) => (
            <ProductDetailCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 글로벌통장 + 자동이체 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">🏦 통장 / 자동이체</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {OTHERS.map((p) => (
            <ProductDetailCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 안내 */}
      <section className="bg-offwhite border border-border rounded-xl p-5 text-sm">
        <h3 className="font-medium mb-2">⚠️ 영업점 가입 시 확인</h3>
        <ul className="space-y-1 text-charcoal-soft list-disc list-inside">
          <li>위 정보는 각 상품 특약 본문 기준. 적용 금리·환율우대 등 수치는 영업점 게시 또는 본부 매뉴얼 기준</li>
          <li>iM·IDREAM은 비대면(모바일) 가입 채널 중심. 영업점 가입 가능 여부는 본부 확인</li>
          <li>Plus-You의 환율우대(50%·30%)·수수료 면제는 신규 가입 시점 약정 기준</li>
        </ul>
      </section>
    </div>
  );
}

function CompareRow({
  label,
  rows,
  get,
}: {
  label: string;
  rows: DepositProduct[];
  get: (p: DepositProduct) => string | undefined;
}) {
  const allEmpty = rows.every((p) => !get(p));
  if (allEmpty) return null;
  return (
    <tr className="border-b border-border last:border-0 align-top">
      <td className="p-3 text-xs text-charcoal-soft uppercase tracking-wide whitespace-nowrap">
        {label}
      </td>
      {rows.map((p) => (
        <td key={p.id} className="p-3 text-charcoal-soft leading-relaxed">
          {get(p) || "—"}
        </td>
      ))}
    </tr>
  );
}

function ProductDetailCard({ product }: { product: DepositProduct }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="bg-white border border-border rounded-xl p-5 flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-bold leading-tight">{product.title}</h3>
        <span className="text-[10px] text-charcoal-soft bg-offwhite border border-border px-2 py-0.5 rounded-full whitespace-nowrap">
          {product.category}
        </span>
      </div>
      <p className="text-sm text-charcoal-soft mb-3 leading-relaxed">
        {product.description}
      </p>

      <dl className="space-y-2 text-sm">
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
        <Section title="부가 혜택">
          {product.benefits.map((b, i) => (
            <li key={i} className="text-charcoal pl-1 list-disc list-inside">
              {b}
            </li>
          ))}
        </Section>
      )}

      {/* 펼침 영역 — 중도해지/만기후 이자 */}
      {(product.earlyTermination || product.postMaturity) && (
        <details
          className="mt-3 pt-3 border-t border-border text-sm"
          onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
        >
          <summary className="cursor-pointer text-charcoal-soft hover:text-primary text-xs uppercase tracking-wide font-medium">
            {open ? "▼" : "▶"} 해지·만기 상세
          </summary>
          <dl className="mt-2 space-y-2">
            {product.earlyTermination && (
              <Row label="중도해지" value={product.earlyTermination} />
            )}
            {product.postMaturity && (
              <Row label="만기 후 이자" value={product.postMaturity} />
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3">
      <dt className="text-xs text-charcoal-soft sm:w-20 sm:shrink-0 uppercase tracking-wide">
        {label}
      </dt>
      <dd className="text-charcoal leading-relaxed">{value}</dd>
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
