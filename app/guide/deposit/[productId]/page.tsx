"use client";

import Link from "next/link";
import { use } from "react";
import {
  COMMON_CLAUSES,
  depositById,
  DEPOSIT_PRODUCTS,
  type DepositProduct,
} from "@/lib/data/deposit-products";
import { AdminNote } from "@/components/admin/AdminNote";
import { InterestSimulator } from "@/components/deposit/InterestSimulator";

export default function DepositProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = use(params);
  const product = depositById(productId);

  if (!product) {
    return (
      <div className="max-w-[clamp(840px,92vw,1280px)] mx-auto px-6 py-12">
        <Link
          href="/guide/deposit"
          className="text-xs text-charcoal-soft hover:text-primary inline-flex items-center gap-1 mb-3"
        >
          ← 외화 예금·적금 목록
        </Link>
        <p className="text-sm text-charcoal-soft">
          상품을 찾을 수 없습니다. (id: {productId})
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[clamp(960px,92vw,1440px)] mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-charcoal-soft mb-3 flex items-center gap-1">
        <Link href="/guide" className="hover:text-primary">
          가이드 홈
        </Link>
        <span>›</span>
        <Link href="/guide/deposit" className="hover:text-primary">
          외화 예금·적금
        </Link>
        <span>›</span>
        <span className="text-charcoal">{product.title}</span>
      </nav>

      <header className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] text-charcoal-soft bg-offwhite border border-border px-2 py-0.5 rounded-full">
            {product.category}
          </span>
          <span className="text-xs text-primary font-medium tracking-wide">
            iM뱅크 외화 상품
          </span>
        </div>
        <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
        <p className="text-sm text-charcoal-soft leading-relaxed">
          {product.description}
        </p>
      </header>

      <AdminNote storageKey={`fx-guide:note:deposit:${product.id}`} />

      {/* TOC */}
      <Toc product={product} />

      {/* 기본정보 */}
      <Section id="basic" title="기본 정보" icon="📋">
        <BasicTable product={product} />
      </Section>

      {/* 우대금리·부가혜택 */}
      {((product.bonusRate && product.bonusRate.length > 0) ||
        (product.benefits && product.benefits.length > 0)) && (
        <Section id="benefits" title="우대금리·부가혜택" icon="🎁">
          {product.bonusRate && product.bonusRate.length > 0 && (
            <SubSection title="우대금리">
              <ul className="space-y-1.5 text-sm">
                {product.bonusRate.map((b, i) => (
                  <li
                    key={i}
                    className="text-charcoal-soft pl-1 list-disc list-inside"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </SubSection>
          )}
          {product.benefits && product.benefits.length > 0 && (
            <SubSection title="부가혜택·특이사항">
              <ul className="space-y-1.5 text-sm">
                {product.benefits.map((b, i) => (
                  <li
                    key={i}
                    className="text-charcoal-soft pl-1 list-disc list-inside"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </SubSection>
          )}
        </Section>
      )}

      {/* 이자 계산 */}
      {(product.interestFormula ||
        (product.examples && product.examples.length > 0)) && (
        <Section id="interest" title="이자 계산" icon="🧮">
          {product.interestFormula && (
            <div className="bg-offwhite border border-border rounded-lg p-4 mb-3">
              <p className="text-[11px] text-charcoal-soft uppercase tracking-wide mb-1">
                산식
              </p>
              <p className="text-sm text-charcoal font-medium leading-relaxed">
                {product.interestFormula}
              </p>
            </div>
          )}
          {product.examples && product.examples.length > 0 && (
            <SubSection title="계산 예시">
              <ul className="space-y-3">
                {product.examples.map((ex, i) => (
                  <li
                    key={i}
                    className="bg-white border border-border rounded-lg p-4 text-sm"
                  >
                    <p className="text-charcoal font-medium mb-1">
                      {ex.scenario}
                    </p>
                    <p className="text-charcoal-soft font-mono text-xs mb-2 leading-relaxed">
                      {ex.calculation}
                    </p>
                    <p className="text-primary font-bold">→ {ex.result}</p>
                  </li>
                ))}
              </ul>
            </SubSection>
          )}
        </Section>
      )}

      {/* 시뮬레이터 */}
      {product.simulatable && (
        <Section id="simulator" title="이자 시뮬레이터" icon="💰">
          <InterestSimulator initialProductId={product.id} />
        </Section>
      )}

      {/* 해지·만기 */}
      {(product.earlyTermination ||
        product.postMaturity ||
        product.autoRenew ||
        product.partialWithdraw) && (
        <Section id="termination" title="해지·만기" icon="🔚">
          <dl className="space-y-3">
            {product.earlyTermination && (
              <DetailRow label="중도해지" value={product.earlyTermination} />
            )}
            {product.partialWithdraw && (
              <DetailRow label="일부해지" value={product.partialWithdraw} />
            )}
            {product.postMaturity && (
              <DetailRow label="만기 후 이자" value={product.postMaturity} />
            )}
            {product.autoRenew && (
              <DetailRow label="자동재예치" value={product.autoRenew} />
            )}
          </dl>
        </Section>
      )}

      {/* 약관 본문 인용 */}
      {(product.keyClauses && product.keyClauses.length > 0) && (
        <Section id="clauses" title="약관·상품설명서 본문 인용" icon="📖">
          <ul className="space-y-3">
            {product.keyClauses.map((c, i) => (
              <li
                key={i}
                className="bg-white border border-border rounded-lg p-4"
              >
                <p className="text-xs text-primary font-medium mb-1">
                  📌 {c.ref}
                </p>
                <p className="text-sm font-medium text-charcoal mb-1">
                  {c.label}
                </p>
                <p className="text-sm text-charcoal-soft leading-relaxed whitespace-pre-wrap">
                  {c.body}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* 공통 약관 (외화예금거래기본약관) */}
      <Section id="common-clauses" title="외화예금거래기본약관 (공통)" icon="📚">
        <p className="text-xs text-charcoal-soft mb-3">
          모든 외화예금 공통 적용. 각 상품 특약·상품설명서에서 정하지 않은 사항은
          이 기본약관 우선.
        </p>
        <ul className="space-y-3">
          {COMMON_CLAUSES.map((c, i) => (
            <li
              key={i}
              className="bg-offwhite border border-border rounded-lg p-4"
            >
              <p className="text-xs text-primary font-medium mb-1">
                📌 {c.ref}
              </p>
              <p className="text-sm font-medium text-charcoal mb-1">
                {c.label}
              </p>
              <p className="text-sm text-charcoal-soft leading-relaxed whitespace-pre-wrap">
                {c.body}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* 고객 응대 멘트 */}
      {product.customerScripts && product.customerScripts.length > 0 && (
        <Section id="scripts" title="고객 응대 멘트" icon="💬">
          <p className="text-xs text-charcoal-soft mb-3">
            창구에서 그대로 사용 가능한 따뜻한 어조 멘트.
          </p>
          <ul className="space-y-3">
            {product.customerScripts.map((s, i) => (
              <li
                key={i}
                className="bg-white border-l-4 border-primary/40 pl-4 py-2 pr-3"
              >
                <p className="text-[11px] text-charcoal-soft uppercase tracking-wide mb-1">
                  {s.situation}
                </p>
                <p className="text-sm text-charcoal italic leading-relaxed">
                  &ldquo;{s.line}&rdquo;
                </p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* 영업점 자주 실수 체크포인트 */}
      {product.staffChecklist && product.staffChecklist.length > 0 && (
        <Section id="checklist" title="영업점 자주 실수 체크" icon="✅">
          <ul className="space-y-2">
            {product.staffChecklist.map((c, i) => (
              <li
                key={i}
                className="bg-warn/5 border border-warn/30 rounded-lg p-3 text-sm flex items-start gap-2"
              >
                <span className="text-warn shrink-0">⚠️</span>
                <span className="text-charcoal leading-relaxed">{c}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* 출처 */}
      <section className="mt-8 pt-6 border-t border-border">
        <p className="text-xs text-charcoal-soft">
          📄 <strong>출처</strong>: {product.source}
        </p>
        <p className="text-[10px] text-charcoal-soft mt-1">
          본 페이지는 영업점 직원 참조용. 실제 가입·해지 처리 시 본부 외환사업부
          매뉴얼 또는 상품설명서·특약 원본 확인 필수.
        </p>
      </section>

      {/* 다른 상품 둘러보기 */}
      <RelatedProducts current={product} />
    </div>
  );
}

// ─── 보조 컴포넌트 ───
function Toc({ product }: { product: DepositProduct }) {
  const items = [
    { href: "#basic", label: "기본 정보", show: true },
    {
      href: "#benefits",
      label: "우대금리·부가혜택",
      show:
        (product.bonusRate && product.bonusRate.length > 0) ||
        (product.benefits && product.benefits.length > 0),
    },
    {
      href: "#interest",
      label: "이자 계산",
      show:
        !!product.interestFormula ||
        (product.examples && product.examples.length > 0),
    },
    {
      href: "#simulator",
      label: "이자 시뮬레이터",
      show: !!product.simulatable,
    },
    {
      href: "#termination",
      label: "해지·만기",
      show:
        !!product.earlyTermination ||
        !!product.postMaturity ||
        !!product.autoRenew ||
        !!product.partialWithdraw,
    },
    {
      href: "#clauses",
      label: "약관 본문",
      show: !!(product.keyClauses && product.keyClauses.length > 0),
    },
    { href: "#common-clauses", label: "공통 기본약관", show: true },
    {
      href: "#scripts",
      label: "고객 응대",
      show: !!(product.customerScripts && product.customerScripts.length > 0),
    },
    {
      href: "#checklist",
      label: "체크포인트",
      show: !!(product.staffChecklist && product.staffChecklist.length > 0),
    },
  ].filter((it) => it.show);

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

function Section({
  id,
  title,
  icon,
  children,
}: {
  id: string;
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-8 scroll-mt-20">
      <h2 className="text-xl font-bold mb-3">
        <span className="mr-2">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <h3 className="text-xs font-medium text-charcoal-soft uppercase tracking-wide mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

function BasicTable({ product }: { product: DepositProduct }) {
  const rows: { label: string; value?: string }[] = [
    { label: "가입대상", value: product.eligibility },
    { label: "가입기간", value: product.period },
    { label: "가입통화", value: product.currencies },
    { label: "채널", value: product.channels },
    { label: "최초 가입금액", value: product.initialDeposit },
    { label: "추가 입금", value: product.additionalDeposit },
    { label: "계좌 한도", value: product.accountLimit },
    { label: "이자지급 방식", value: product.interestPayment },
    { label: "기본금리", value: product.baseRate },
    { label: "현찰수수료", value: product.cashFee },
    { label: "예금자보호", value: product.protection },
    { label: "세제혜택", value: product.taxBenefit },
  ];
  const visible = rows.filter((r) => r.value);
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <dl>
        {visible.map((r, i) => (
          <div
            key={i}
            className={[
              "grid sm:grid-cols-[140px_1fr] gap-1 sm:gap-4 p-3 sm:p-4 text-sm",
              i < visible.length - 1 ? "border-b border-border" : "",
            ].join(" ")}
          >
            <dt className="text-xs text-charcoal-soft uppercase tracking-wide sm:pt-0.5">
              {r.label}
            </dt>
            <dd className="text-charcoal leading-relaxed">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid sm:grid-cols-[120px_1fr] gap-1 sm:gap-4 p-3 bg-white border border-border rounded-lg text-sm">
      <dt className="text-xs text-charcoal-soft uppercase tracking-wide sm:pt-0.5">
        {label}
      </dt>
      <dd className="text-charcoal leading-relaxed">{value}</dd>
    </div>
  );
}

function RelatedProducts({ current }: { current: DepositProduct }) {
  const sameCategory = DEPOSIT_PRODUCTS.filter(
    (p) => p.category === current.category && p.id !== current.id,
  );
  if (sameCategory.length === 0) return null;
  return (
    <section className="mt-8 pt-6 border-t border-border">
      <h3 className="text-sm font-medium text-charcoal-soft uppercase tracking-wide mb-3">
        같은 카테고리 ({current.category})
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {sameCategory.map((p) => (
          <Link
            key={p.id}
            href={`/guide/deposit/${p.id}`}
            className="bg-white border border-border rounded-lg p-3 hover:border-primary transition group"
          >
            <p className="font-medium text-sm group-hover:text-primary transition">
              {p.title}
            </p>
            <p className="text-xs text-charcoal-soft mt-0.5 line-clamp-2">
              {p.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
