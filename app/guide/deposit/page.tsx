"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  DEPOSIT_PRODUCTS,
  depositById,
  type DepositProduct,
} from "@/lib/data/deposit-products";
import { AdminNote } from "@/components/admin/AdminNote";

// 영업점이 창구에서 급할 때 PDF보다 빠르게 찾는 페이지.
// 1) 통합 검색 (상품명·약관·응대 멘트·체크포인트 모든 텍스트 매칭)
// 2) 빠른 질문 카드 (가장 자주 묻는 케이스에 즉답)
// 3) 한 화면 비교표 (12종 상품 전체를 한 표에서 비교)
// 4) 시뮬레이터

// ─── 빠른 질문 데이터 ───
type QuickQuestion = {
  id: string;
  question: string;
  icon: string;
  answer: string;
  details?: string;
  productIds: string[];
};

const QUICK_QUESTIONS: QuickQuestion[] = [
  {
    id: "early-termination",
    question: "정기예금 중도해지 이율은?",
    icon: "📉",
    answer:
      "7일 미만 무이자 / 7~15일 1/10 / 15일~1개월 2/10 / 1~3개월 3/10 / 3~6개월 4/10 / 6~12개월 5/10",
    details:
      "상속(사망)으로 인한 중도해지는 약정이율 (단 7일 미만은 무이자). 외화예금거래기본약관 제11조 ③항.",
    productIds: ["fc-time-deposit", "fc-rolling-compound"],
  },
  {
    id: "post-maturity",
    question: "만기 지나면 이자 얼마?",
    icon: "⏰",
    answer: "만기 후 1년까지 기본금리 × 3/10 / 1년 초과 기본금리 × 1/10",
    details:
      "외화예금거래기본약관 제11조 ②항. 자동재예치 신청하면 만기일에 동일 기간으로 새 약정으로 갱신됨.",
    productIds: ["fc-time-deposit", "fc-rolling-compound", "foryou", "im-free", "idream-free"],
  },
  {
    id: "currencies-9",
    question: "9개 통화(CNY 포함) 되는 상품?",
    icon: "💱",
    answer: "보통·당좌·정기예금 + 글로벌통장(보통·정기 부분)",
    details: "9개 통화: USD/JPY/EUR/GBP/CAD/AUD/CHF/NZD/CNY",
    productIds: ["fc-ordinary", "fc-checking", "fc-time-deposit", "global-comprehensive"],
  },
  {
    id: "non-face-to-face",
    question: "비대면(모바일) 가입 가능?",
    icon: "📱",
    answer:
      "보통·통지·정기·회전복리·iM·IDREAM. 계좌당 USD 30만 미만 한도",
    details:
      "당좌예금은 영업점만 가능. iM은 비대면 전용 (영업점 가입 불가, 본부 정책 확인).",
    productIds: [
      "fc-ordinary",
      "fc-notice",
      "fc-time-deposit",
      "fc-rolling-compound",
      "im-free",
      "idream-free",
    ],
  },
  {
    id: "corporate",
    question: "법인 가입 가능한 상품?",
    icon: "🏢",
    answer: "보통·당좌·MMDA·통지·정기·회전복리·글로벌통장",
    details:
      "MMDA는 잔액·대상별 차등금리 — 법인 50만불↑이 가장 높은 금리. 자유적립 4종(For You/Plus-You/iM/IDREAM)은 개인 한정 또는 본부 확인.",
    productIds: ["fc-mmda", "fc-time-deposit", "global-comprehensive"],
  },
  {
    id: "compound",
    question: "복리로 운용 가능?",
    icon: "🔄",
    answer: "외화회전복리예금 (1·3·6개월 회전주기)",
    details:
      "1~3년 예치. 회전주기마다 원금+이자가 새 원금. 회전주기는 가입 시 결정·변경 불가.",
    productIds: ["fc-rolling-compound"],
  },
  {
    id: "no-interest",
    question: "무이자 상품?",
    icon: "🚫",
    answer: "외화당좌예금 (당좌 약정 별도 체결 필요)",
    productIds: ["fc-checking"],
  },
  {
    id: "minor",
    question: "미성년자 우대?",
    icon: "👶",
    answer: "IDREAM 외화자유적금 — 만 19세 미만 +0.20%p",
    details:
      "외화 첫 가입 시 추가 +0.10%p. 자동이체 6회 이상 + 원화 출금계좌 조건 충족 시 적용. 최대 +0.30%p.",
    productIds: ["idream-free"],
  },
  {
    id: "max-bonus",
    question: "우대금리 가장 높은 상품?",
    icon: "🎯",
    answer: "iM 외화자유적금 — 최대 +0.50%p (자동이체 8회 +0.30%p 포함)",
    details:
      "Plus-You 36개월 +0.30%p, IDREAM 미성년·최초신규 +0.30%p, For You 우대 없음 (기본형).",
    productIds: ["im-free"],
  },
  {
    id: "fee-discount",
    question: "수수료·환율 우대 받으려면?",
    icon: "💎",
    answer:
      "Plus-You (6개월↑) — 송금 3회 면제·현찰 면제·TC 50% / 글로벌통장 + 정기·통지(5만불) — 송금 50%·현찰 50%·TC 30%",
    details:
      "Plus-You는 가입 6개월 자동 적용. 글로벌통장 우대는 대상 정기/통지예금 보유 시 자동. 대상예금 해지 시 우대 종료.",
    productIds: ["plusyou", "global-comprehensive"],
  },
  {
    id: "long-term",
    question: "최장 36개월 적립?",
    icon: "📅",
    answer: "Plus-You 자유적립 외화예금 (1~36개월)",
    details:
      "iM·IDREAM은 12개월 고정. For You는 12개월 이내. 회전복리예금은 1~3년 (예치형).",
    productIds: ["plusyou"],
  },
  {
    id: "first-foreign",
    question: "외화 첫 가입 고객 추천?",
    icon: "🌱",
    answer:
      "글로벌외화종합통장 (한 통장으로 보통+정기+통지+회전복리) + IDREAM (외화 최초 신규 +0.10%p)",
    productIds: ["global-comprehensive", "idream-free"],
  },
];

// ─── 카테고리 ───
const CATEGORY_ORDER: Array<{ key: string; label: string; icon: string }> = [
  { key: "통합통장", label: "통합통장", icon: "🌐" },
  { key: "수시입출", label: "수시입출", icon: "💵" },
  { key: "예치형", label: "예치형", icon: "🏛️" },
  { key: "적금", label: "적금", icon: "💰" },
  { key: "이체", label: "이체", icon: "🔁" },
];

// 카테고리 헤더 + 그리드로 노출할 카테고리 (1개짜리는 별도 콜아웃으로 처리).
const MULTI_PRODUCT_CATEGORIES = ["수시입출", "예치형", "적금"] as const;

export default function DepositGuidePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);

  // 검색용 인덱스: 상품의 모든 텍스트 합치기
  const searchIndex = useMemo(() => {
    return DEPOSIT_PRODUCTS.map((p) => ({
      id: p.id,
      blob: [
        p.title,
        p.shortTitle,
        p.category,
        p.description,
        p.eligibility,
        p.period,
        p.currencies,
        p.channels,
        p.initialDeposit,
        p.additionalDeposit,
        p.accountLimit,
        p.interestPayment,
        p.baseRate,
        p.interestFormula,
        (p.bonusRate ?? []).join(" "),
        (p.benefits ?? []).join(" "),
        p.earlyTermination,
        p.postMaturity,
        p.autoRenew,
        p.partialWithdraw,
        p.cashFee,
        (p.keyClauses ?? [])
          .map((c) => `${c.ref} ${c.label} ${c.body}`)
          .join(" "),
        (p.examples ?? [])
          .map((e) => `${e.scenario} ${e.calculation} ${e.result}`)
          .join(" "),
        (p.customerScripts ?? [])
          .map((s) => `${s.situation} ${s.line}`)
          .join(" "),
        (p.staffChecklist ?? []).join(" "),
        p.source,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    }));
  }, []);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    let result = DEPOSIT_PRODUCTS;
    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (q) {
      const matchIds = new Set(
        searchIndex.filter((s) => s.blob.includes(q)).map((s) => s.id),
      );
      result = result.filter((p) => matchIds.has(p.id));
    }
    return result;
  }, [search, activeCategory, searchIndex]);

  const isSearching = search.trim().length > 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Link
        href="/guide"
        className="text-xs text-charcoal-soft hover:text-primary inline-flex items-center gap-1 mb-3"
      >
        ← 가이드 홈
      </Link>
      <header className="mb-4">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          🏦 외화 통장·적금
        </p>
        <h1 className="text-3xl font-bold mb-1">외화 예금·적금</h1>
        <p className="text-sm text-charcoal-soft">
          영업점 빠른 참조 — 검색·빠른 질문·전체 비교표·이자 시뮬레이터. 총{" "}
          {DEPOSIT_PRODUCTS.length}개 상품.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-deposit" />

      {/* 검색창 + 카테고리 필터 */}
      <div className="mb-4">
        <div className="bg-white border border-border rounded-xl p-3">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="검색 — 정기예금 중도해지 / 9통화 / 비대면 / 법인 / 미성년 / 복리 / 36개월 ..."
              className="w-full pl-9 pr-9 py-2.5 border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
              autoFocus
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-soft pointer-events-none">
              🔍
            </span>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-soft hover:text-charcoal text-sm"
                aria-label="검색 지우기"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            <Chip
              label={`전체 (${DEPOSIT_PRODUCTS.length})`}
              active={activeCategory === null}
              onClick={() => setActiveCategory(null)}
            />
            {CATEGORY_ORDER.map((c) => {
              const count = DEPOSIT_PRODUCTS.filter(
                (p) => p.category === c.key,
              ).length;
              return (
                <Chip
                  key={c.key}
                  label={`${c.icon} ${c.label} (${count})`}
                  active={activeCategory === c.key}
                  onClick={() =>
                    setActiveCategory(activeCategory === c.key ? null : c.key)
                  }
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* 검색 중일 때: 결과만 노출 */}
      {isSearching ? (
        <section className="mb-8">
          <h2 className="text-sm font-medium text-charcoal-soft uppercase tracking-wide mb-3">
            검색 결과 ({filteredProducts.length}개)
          </h2>
          {filteredProducts.length === 0 ? (
            <p className="bg-white border border-border rounded-xl p-6 text-center text-charcoal-soft text-sm">
              일치하는 상품이 없습니다. 다른 키워드로 검색해 주세요.
            </p>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </section>
      ) : (
        <>
          {/* 빠른 질문 — 검색 안 할 때 노출 */}
          <section className="mb-8">
            <h2 className="text-sm font-medium text-charcoal-soft uppercase tracking-wide mb-3">
              ⚡ 자주 묻는 질문 — 클릭하면 즉답
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {QUICK_QUESTIONS.map((q) => (
                <QuickQuestionCard
                  key={q.id}
                  q={q}
                  open={openQuestionId === q.id}
                  onToggle={() =>
                    setOpenQuestionId(openQuestionId === q.id ? null : q.id)
                  }
                />
              ))}
            </div>
          </section>

          {/* 전체 비교표 */}
          <section className="mb-8">
            <h2 className="text-sm font-medium text-charcoal-soft uppercase tracking-wide mb-3">
              📊 전체 상품 한 화면 비교 ({filteredProducts.length}개)
            </h2>
            <FullCompareTable products={filteredProducts} />
          </section>

          {/* 카테고리별 카드.
              1개짜리 카테고리(통합통장·이체)는 일반 카테고리 헤더 대신 특수 처리:
              · 글로벌외화종합통장 = 영업점 첫 가입 추천 → 상단 큰 콜아웃 카드
              · 외화 자동이체     = 적금 우대와 연관 도구 → 적금 다음 작은 진입 카드 */}
          {!activeCategory ? (
            <>
              <GlobalHero />

              {MULTI_PRODUCT_CATEGORIES.map((key) => {
                const items = filteredProducts.filter(
                  (p) => p.category === key,
                );
                if (items.length === 0) return null;
                const conf = CATEGORY_ORDER.find((c) => c.key === key)!;
                return (
                  <section
                    key={key}
                    id={`cat-${key}`}
                    className="mb-8 scroll-mt-20"
                  >
                    <h2 className="text-sm font-medium text-charcoal-soft uppercase tracking-wide mb-3 flex items-center gap-1.5">
                      <span className="text-base">{conf.icon}</span>
                      <span>{conf.label}</span>
                      <span className="text-[10px]">({items.length})</span>
                    </h2>
                    <ProductGrid products={items} />
                  </section>
                );
              })}

              <AutoTransferCallout />
            </>
          ) : (
            <section
              id={`cat-${activeCategory}`}
              className="mb-8 scroll-mt-20"
            >
              <h2 className="text-sm font-medium text-charcoal-soft uppercase tracking-wide mb-3">
                {activeCategory} 상품
              </h2>
              <ProductGrid products={filteredProducts} />
            </section>
          )}

          {/* 시뮬레이터 진입 카드 — 별도 페이지로 분리 */}
          <section className="mb-8">
            <Link
              href="/guide/deposit/simulator"
              className="block bg-primary/5 border border-primary/30 rounded-xl p-5 hover:bg-primary/10 transition group"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-primary font-medium tracking-wide mb-1">
                    🧮 도구
                  </p>
                  <h2 className="font-bold text-lg group-hover:text-primary transition">
                    이자 시뮬레이터
                  </h2>
                  <p className="text-sm text-charcoal-soft mt-1">
                    통화·기간·금액·금리 입력 → 만기 이자·원리금 미리 계산. 별도
                    페이지에서 집중해서 사용하세요.
                  </p>
                </div>
                <span className="text-2xl text-primary group-hover:translate-x-1 transition">
                  →
                </span>
              </div>
            </Link>
          </section>

          {/* 공통 안내 */}
          <section className="bg-offwhite border border-border rounded-xl p-4 text-xs text-charcoal-soft">
            <p className="font-medium text-charcoal mb-1.5">📋 모든 외화 예금·적금 공통</p>
            <ul className="space-y-0.5 list-disc list-inside">
              <li>
                예금자보호법 적용 — 원금+이자 <strong className="text-charcoal">1인당 1억원까지</strong> (본 은행 여타 보호상품과 합산)
              </li>
              <li>비과세종합저축 가입 불가 · 공동명의 가입 불가</li>
              <li>
                현찰수수료: USD/JPY/EUR/GBP/CAD/AUD/CHF/NZD 1.5%, CNY 4.0% (USD 외 현찰 입금 또는 송금 입금분 현찰 출금 시)
              </li>
              <li>
                원화 출금 시 <strong className="text-charcoal">대고객 전신환매입율</strong> 적용 (외화예금거래기본약관 제5조)
              </li>
              <li>
                이자 계산 기준일수: USD 등 360일 · <strong className="text-charcoal">JPY·GBP만 365일</strong> (외화예금거래기본약관 제4조)
              </li>
            </ul>
          </section>
        </>
      )}
    </div>
  );
}

// ─── 빠른 질문 카드 ───
function QuickQuestionCard({
  q,
  open,
  onToggle,
}: {
  q: QuickQuestion;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      className={[
        "border rounded-xl transition cursor-pointer",
        open
          ? "bg-primary/5 border-primary/40"
          : "bg-white border-border hover:border-primary/40",
      ].join(" ")}
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-3 flex items-start gap-2"
      >
        <span className="text-lg shrink-0">{q.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-charcoal leading-snug">
            {q.question}
          </p>
        </div>
        <span className="text-charcoal-soft text-base shrink-0">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div className="px-3 pb-3 border-t border-border/60 pt-2.5">
          <p className="text-sm text-charcoal leading-relaxed mb-1.5">
            <strong className="text-primary">→ </strong>
            {q.answer}
          </p>
          {q.details && (
            <p className="text-xs text-charcoal-soft leading-relaxed mb-2">
              {q.details}
            </p>
          )}
          {q.productIds.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {q.productIds.map((pid) => {
                const p = depositById(pid);
                if (!p) return null;
                return (
                  <Link
                    key={pid}
                    href={`/guide/deposit/${pid}`}
                    className="text-[11px] bg-white border border-primary/30 text-primary px-2 py-0.5 rounded-full hover:bg-primary hover:text-white transition"
                  >
                    {p.shortTitle} →
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

// ─── 전체 한 화면 비교표 ───
function FullCompareTable({ products }: { products: DepositProduct[] }) {
  return (
    <div className="overflow-x-auto bg-white border border-border rounded-xl">
      <table className="w-full text-xs">
        <thead className="bg-offwhite">
          <tr className="border-b border-border">
            <th className="text-left p-2.5 text-charcoal-soft uppercase tracking-wide sticky left-0 bg-offwhite z-10 min-w-32">
              상품
            </th>
            <th className="text-left p-2.5 text-charcoal-soft uppercase tracking-wide">
              구분
            </th>
            <th className="text-left p-2.5 text-charcoal-soft uppercase tracking-wide">
              기간
            </th>
            <th className="text-left p-2.5 text-charcoal-soft uppercase tracking-wide">
              통화
            </th>
            <th className="text-left p-2.5 text-charcoal-soft uppercase tracking-wide">
              최소가입
            </th>
            <th className="text-left p-2.5 text-charcoal-soft uppercase tracking-wide">
              추가입금
            </th>
            <th className="text-left p-2.5 text-charcoal-soft uppercase tracking-wide">
              일부해지
            </th>
            <th className="text-left p-2.5 text-charcoal-soft uppercase tracking-wide">
              비대면
            </th>
            <th className="text-left p-2.5 text-charcoal-soft uppercase tracking-wide">
              핵심
            </th>
            <th className="text-left p-2.5 text-charcoal-soft uppercase tracking-wide sticky right-0 bg-offwhite z-10">
              상세
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr
              key={p.id}
              className={[
                "border-b border-border last:border-0 align-top",
                i % 2 === 1 ? "bg-offwhite/40" : "",
              ].join(" ")}
            >
              <td className="p-2.5 sticky left-0 bg-white z-10 group-hover:bg-offwhite">
                <Link
                  href={`/guide/deposit/${p.id}`}
                  className="font-semibold text-charcoal hover:text-primary text-sm block leading-tight"
                >
                  {p.title}
                </Link>
                <span className="text-[10px] text-charcoal-soft">
                  {p.shortTitle}
                </span>
              </td>
              <td className="p-2.5 text-charcoal-soft">{p.category}</td>
              <td className="p-2.5 text-charcoal">{p.period ?? "—"}</td>
              <td className="p-2.5 text-charcoal">
                {summarizeCurrencies(p.currencies)}
              </td>
              <td className="p-2.5 text-charcoal-soft">
                {summarize(p.initialDeposit)}
              </td>
              <td className="p-2.5 text-charcoal-soft">
                {summarize(p.additionalDeposit) ||
                  inferAdditional(p) ||
                  "—"}
              </td>
              <td className="p-2.5 text-charcoal-soft">
                {summarize(p.partialWithdraw) || inferPartial(p) || "—"}
              </td>
              <td className="p-2.5">
                {channelOnline(p.channels) ? (
                  <span className="inline-block text-[10px] bg-primary/10 text-primary border border-primary/30 px-1.5 py-0.5 rounded-full">
                    ✓ 가능
                  </span>
                ) : (
                  <span className="text-charcoal-soft">—</span>
                )}
              </td>
              <td className="p-2.5 text-charcoal-soft">{coreHighlight(p)}</td>
              <td className="p-2.5 sticky right-0 bg-white z-10">
                <Link
                  href={`/guide/deposit/${p.id}`}
                  className="text-primary hover:text-primary-dark font-medium whitespace-nowrap"
                >
                  보기 →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function summarize(s?: string): string {
  if (!s) return "";
  if (s.length <= 24) return s;
  return s.slice(0, 22) + "…";
}

function summarizeCurrencies(s?: string): string {
  if (!s) return "—";
  const match = s.match(/(\d+)\s*개?\s*통화/);
  if (match) return `${match[1]}종`;
  return summarize(s);
}

function channelOnline(channels?: string): boolean {
  if (!channels) return false;
  return /인터넷|모바일|비대면|앱뱅킹/.test(channels);
}

function inferAdditional(p: DepositProduct): string {
  if (p.category === "수시입출" || p.category === "통합통장")
    return "자유";
  return "";
}

function inferPartial(p: DepositProduct): string {
  if (p.category === "수시입출") return "자유";
  if (p.category === "예치형") return "불가";
  return "";
}

function coreHighlight(p: DepositProduct): string {
  switch (p.id) {
    case "global-comprehensive":
      return "수수료 우대";
    case "fc-ordinary":
      return "기본 외화통장";
    case "fc-checking":
      return "무이자·당좌";
    case "fc-mmda":
      return "잔액 차등금리";
    case "fc-notice":
      return "7일 갱신";
    case "fc-time-deposit":
      return "표준 정기예금";
    case "fc-rolling-compound":
      return "복리";
    case "foryou":
      return "기본 자유적립";
    case "plusyou":
      return "장기 우대 + 수수료";
    case "im-free":
      return "비대면·최대 +0.50%";
    case "idream-free":
      return "미성년·외화 첫 +0.30%";
    case "auto-transfer":
      return "적립 우대 트리거";
    default:
      return "";
  }
}

// ─── 압축 카드 그리드 ───
function ProductGrid({ products }: { products: DepositProduct[] }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {products.map((p) => (
        <CompactCard key={p.id} product={p} />
      ))}
    </ul>
  );
}

function CompactCard({ product }: { product: DepositProduct }) {
  return (
    <li>
      <Link
        href={`/guide/deposit/${product.id}`}
        className="block bg-white border border-border rounded-xl p-4 hover:border-primary transition group h-full"
      >
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-bold text-sm leading-tight group-hover:text-primary transition">
            {product.title}
          </h3>
          <span className="text-[9px] text-charcoal-soft bg-offwhite border border-border px-1.5 py-0.5 rounded-full whitespace-nowrap shrink-0">
            {product.category}
          </span>
        </div>
        <p className="text-xs text-charcoal-soft mb-2.5 leading-relaxed line-clamp-2">
          {product.description}
        </p>
        <dl className="text-[11px] space-y-1">
          {product.period && (
            <CompactRow label="기간" value={product.period} />
          )}
          {product.currencies && (
            <CompactRow
              label="통화"
              value={summarizeCurrencies(product.currencies)}
            />
          )}
          {product.baseRate && (
            <CompactRow label="금리" value={product.baseRate} truncate />
          )}
        </dl>
        <p className="text-[10px] text-primary font-medium mt-2.5 group-hover:translate-x-0.5 transition inline-block">
          상세 → 약관·시뮬레이터·응대 멘트
        </p>
      </Link>
    </li>
  );
}

function CompactRow({
  label,
  value,
  truncate,
}: {
  label: string;
  value: string;
  truncate?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt className="text-charcoal-soft uppercase tracking-wide shrink-0 w-9">
        {label}
      </dt>
      <dd
        className={[
          "text-charcoal flex-1 min-w-0 leading-snug",
          truncate ? "line-clamp-2" : "",
        ].join(" ")}
      >
        {value}
      </dd>
    </div>
  );
}

// ─── 1개짜리 카테고리 특수 콜아웃 ───
function GlobalHero() {
  const p = depositById("global-comprehensive");
  if (!p) return null;
  return (
    <section id="cat-통합통장" className="mb-8 scroll-mt-20">
      <Link
        href={`/guide/deposit/${p.id}`}
        className="block bg-primary/5 border border-primary/30 rounded-xl p-5 hover:border-primary hover:bg-primary/10 transition group"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] text-primary font-medium uppercase tracking-wide">
                ⭐ 영업점 첫 가입 추천
              </span>
              <span className="text-[9px] text-charcoal-soft bg-white border border-border px-1.5 py-0.5 rounded-full">
                통합통장
              </span>
            </div>
            <h2 className="text-lg font-bold group-hover:text-primary transition mb-1.5">
              🌐 {p.title}
            </h2>
            <p className="text-sm text-charcoal-soft leading-relaxed">
              {p.description}
            </p>
            <p className="text-xs text-charcoal-soft mt-2">
              💎 외화통지·정기예금 미화 5만불 이상(법인 10만불) 신규 시{" "}
              <strong className="text-charcoal">
                해외송금수수료 50% · 외화현찰수수료 50% · TC 매도수수료 30%
              </strong>{" "}
              우대.
            </p>
          </div>
          <span className="text-2xl text-primary group-hover:translate-x-1 transition shrink-0">
            →
          </span>
        </div>
      </Link>
    </section>
  );
}

function AutoTransferCallout() {
  const p = depositById("auto-transfer");
  if (!p) return null;
  return (
    <section id="cat-이체" className="mb-8 scroll-mt-20">
      <Link
        href={`/guide/deposit/${p.id}`}
        className="block bg-white border border-border rounded-xl p-4 hover:border-primary transition group"
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">🔁</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-sm group-hover:text-primary transition">
                외화 자동이체
              </h3>
              <span className="text-[9px] text-charcoal-soft bg-offwhite border border-border px-1.5 py-0.5 rounded-full">
                도구
              </span>
            </div>
            <p className="text-xs text-charcoal-soft leading-relaxed mb-1">
              적금 우대 트리거 — Plus-You 환율우대 50%, iM 자동이체 8회 +0.30%p,
              IDREAM 6회 우대 조건 충족.
            </p>
            <p className="text-[10px] text-primary font-medium group-hover:translate-x-0.5 transition inline-block">
              자동이체 상세 → 약관·체크포인트
            </p>
          </div>
        </div>
      </Link>
    </section>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "text-xs px-2.5 py-1 rounded-full border transition",
        active
          ? "bg-primary text-white border-primary"
          : "bg-white border-border text-charcoal-soft hover:border-primary",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
