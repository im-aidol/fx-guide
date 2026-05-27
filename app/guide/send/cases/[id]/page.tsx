"use client";

import Link from "next/link";
import { use } from "react";
import { notFound } from "next/navigation";
import { BUSINESS_GUIDE } from "@/lib/data";
import type { BusinessGuideItem } from "@/lib/types";
import { AdminNote } from "@/components/admin/AdminNote";

const DESIGNATION_DETAIL: Record<
  BusinessGuideItem["designationMethod"],
  { label: string; description: string }
> = {
  외화송금신청서로_직접: {
    label: "✅ 외화송금신청서로 직접",
    description:
      "외화송금신청서에서 지정항목 ☑ 체크로 거래외국환은행 지정 가능 — 별도 신청서 불필요",
  },
  별도_신청서_필요: {
    label: "⚠️ 별도 거래외국환은행 지정 신청서 필요",
    description: "외화송금신청서 외에 별도의 거래외국환은행 지정(변경) 신청서 작성 필요",
  },
  지정_불요: {
    label: "지정 불요",
    description: "거래외국환은행 지정이 필요하지 않은 사유",
  },
};

export default function SendCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const item = BUSINESS_GUIDE.find((g) => g.id === id);

  if (!item) {
    notFound();
  }

  const designation = DESIGNATION_DETAIL[item.designationMethod];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <nav className="text-xs text-charcoal-soft mb-3 flex items-center gap-1">
        <Link href="/guide" className="hover:text-primary">
          가이드 홈
        </Link>
        <span>›</span>
        <Link href="/guide/send" className="hover:text-primary">
          당발송금
        </Link>
        <span>›</span>
        <Link href="/guide/send/cases" className="hover:text-primary">
          사유별 가이드
        </Link>
        <span>›</span>
        <span className="text-charcoal">{item.title}</span>
      </nav>

      <header className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] text-charcoal-soft bg-offwhite border border-border px-2 py-0.5 rounded-full">
            {item.category}
          </span>
          <span className="text-xs text-primary font-medium tracking-wide">
            📋 당발송금 · 사유별 가이드
          </span>
        </div>
        <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
        {item.subtitle && (
          <p className="text-sm text-charcoal-soft leading-relaxed">
            {item.subtitle}
          </p>
        )}
      </header>

      <AdminNote storageKey={`fx-guide:note:send-case:${item.id}`} />

      {/* 기본 정보 */}
      <section className="bg-white border border-border rounded-xl overflow-hidden mb-4">
        <dl>
          {item.transactionCode && (
            <DetailRow label="거래코드" mono>
              {item.transactionCode}
            </DetailRow>
          )}
          <DetailRow label="근거 조항">{item.legalRef}</DetailRow>
          <DetailRow label="거래외국환은행 지정">
            <p className="font-medium">{designation.label}</p>
            <p className="text-xs text-charcoal-soft mt-0.5">
              {designation.description}
            </p>
          </DetailRow>
          {item.annualLimit && (
            <DetailRow label="한도">{item.annualLimit}</DetailRow>
          )}
        </dl>
      </section>

      {/* 필요 서류 */}
      {item.requiredDocs.length > 0 && (
        <Section title="📋 필요 서류" subtitle="고객 안내·접수 시 확인 항목">
          <ul className="space-y-2 text-sm">
            {item.requiredDocs.map((d, i) => (
              <li
                key={i}
                className="flex items-start gap-2 bg-white border border-border rounded-md p-3"
              >
                <span className="text-primary shrink-0 mt-0.5">✓</span>
                <span className="text-charcoal leading-relaxed">{d}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* 주의·통보 의무 */}
      {item.cautions.length > 0 && (
        <Section title="⚠️ 주의·통보 의무" subtitle="영업점이 반드시 확인할 사항">
          <ul className="space-y-2 text-sm">
            {item.cautions.map((c, i) => (
              <li
                key={i}
                className="flex items-start gap-2 bg-warn/5 border border-warn/40 rounded-md p-3"
              >
                <span className="text-warn shrink-0 mt-0.5">⚠️</span>
                <span className="text-charcoal leading-relaxed">{c}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* 고객 응대 멘트 */}
      {item.customerScripts && item.customerScripts.length > 0 && (
        <Section
          title="💬 고객 응대 멘트"
          subtitle="창구에서 그대로 사용 가능한 따뜻한 어조"
        >
          <ul className="space-y-2 text-sm">
            {item.customerScripts.map((s, i) => (
              <li
                key={i}
                className="bg-white border-l-4 border-primary/40 pl-4 py-2 pr-3"
              >
                <p className="text-charcoal italic leading-relaxed">
                  &ldquo;{s}&rdquo;
                </p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* 관련 약관 */}
      {item.relatedTerms && item.relatedTerms.length > 0 && (
        <Section title="📄 관련 약관·서식">
          <div className="flex flex-wrap gap-1.5">
            {item.relatedTerms.map((t) => (
              <span
                key={t}
                className="text-[11px] bg-offwhite border border-border text-charcoal-soft px-2 py-1 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* 출처 */}
      <section className="mt-8 pt-6 border-t border-border">
        <p className="text-xs text-charcoal-soft">
          📄 <strong>출처</strong>: {item.source}
        </p>
        <p className="text-[10px] text-charcoal-soft mt-1">
          본 페이지는 영업점 직원 참조용. 실제 처리 시 본부 외환사업부 매뉴얼
          또는 외환규정 원문 확인 필수.
        </p>
      </section>

      {/* 같은 카테고리 다른 사유 */}
      <RelatedCases current={item} />
    </div>
  );
}

function DetailRow({
  label,
  mono,
  children,
}: {
  label: string;
  mono?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid sm:grid-cols-[140px_1fr] gap-1 sm:gap-4 p-3 sm:p-4 text-sm border-b border-border last:border-0">
      <dt className="text-xs text-charcoal-soft uppercase tracking-wide sm:pt-0.5">
        {label}
      </dt>
      <dd
        className={["text-charcoal leading-relaxed", mono ? "font-mono" : ""].join(
          " ",
        )}
      >
        {children}
      </dd>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6">
      <div className="mb-2.5 px-1">
        <h2 className="font-bold text-base">{title}</h2>
        {subtitle && (
          <p className="text-xs text-charcoal-soft mt-0.5">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function RelatedCases({ current }: { current: BusinessGuideItem }) {
  const same = BUSINESS_GUIDE.filter(
    (g) => g.category === current.category && g.id !== current.id,
  );
  if (same.length === 0) return null;
  return (
    <section className="mt-8 pt-6 border-t border-border">
      <h3 className="text-sm font-medium text-charcoal-soft uppercase tracking-wide mb-3">
        같은 카테고리 ({current.category}) 다른 사유
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {same.map((g) => (
          <Link
            key={g.id}
            href={`/guide/send/cases/${g.id}`}
            className="bg-white border border-border rounded-lg p-3 hover:border-primary transition group"
          >
            <p className="font-medium text-sm group-hover:text-primary transition">
              {g.title}
            </p>
            {g.subtitle && (
              <p className="text-[11px] text-charcoal-soft mt-0.5 line-clamp-2">
                {g.subtitle}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
