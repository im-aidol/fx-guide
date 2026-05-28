"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  DEPOSIT_PRODUCTS,
  depositById,
  type DepositProduct,
} from "@/lib/data/deposit-products";
import { AdminNote } from "@/components/admin/AdminNote";

// 영업점이 창구에서 급할 때 PDF보다 빠르게 찾는 페이지 (가독성·정보밀도 우선).
// 1) 검색 (전 텍스트 매칭)
// 2) 자주 묻는 질문 (압축 칩 — 클릭 시 즉답)
// 3) 한 화면 표 (12종 상품 정보밀도 ↑·정렬 가능·글로벌통장 시각 강조)
// → 카드 그리드·콜아웃·시뮬레이터 진입 카드 모두 제거. 깊이는 사이드바/표의 "보기 →"로.

// ─── 자주 묻는 질문 ───
type QuickQuestion = {
  id: string;
  question: string;
  answer: string;
  details?: string;
  productIds: string[];
};

const QUICK_QUESTIONS: QuickQuestion[] = [
  {
    id: "early-termination",
    question: "정기예금 중도해지 이율",
    answer:
      "7일 미만 무이자 / 7~15일 1/10 / 15일~1개월 2/10 / 1~3개월 3/10 / 3~6개월 4/10 / 6~12개월 5/10",
    details:
      "상속(사망)으로 인한 중도해지는 약정이율 (단 7일 미만은 무이자). 외화예금거래기본약관 제11조 ③항.",
    productIds: ["fc-time-deposit", "fc-rolling-compound"],
  },
  {
    id: "post-maturity",
    question: "만기 후 이자",
    answer: "만기 후 1년까지 기본금리 × 3/10 / 1년 초과 기본금리 × 1/10",
    details:
      "외화예금거래기본약관 제11조 ②항. 자동재예치 신청하면 만기일에 동일 기간 새 약정으로 갱신.",
    productIds: ["fc-time-deposit", "fc-rolling-compound", "foryou", "im-free", "idream-free"],
  },
  {
    id: "currencies-9",
    question: "9통화(CNY 포함) 가능",
    answer: "보통·당좌·정기예금 + 글로벌통장(보통·정기 부분)",
    details: "9개 통화: USD/JPY/EUR/GBP/CAD/AUD/CHF/NZD/CNY",
    productIds: ["fc-ordinary", "fc-checking", "fc-time-deposit", "global-comprehensive"],
  },
  {
    id: "non-face-to-face",
    question: "비대면(모바일) 가입",
    answer: "보통·통지·정기·회전복리·iM·IDREAM (계좌당 USD 30만 미만)",
    details: "당좌예금은 영업점만. iM은 비대면 전용.",
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
    question: "법인 가입 가능",
    answer: "보통·당좌·MMDA·통지·정기·회전복리·글로벌통장",
    details: "MMDA는 잔액·대상별 차등금리 — 법인 50만불↑ 최고 금리.",
    productIds: ["fc-mmda", "fc-time-deposit", "global-comprehensive"],
  },
  {
    id: "compound",
    question: "복리 운용",
    answer: "외화회전복리예금 (1·3·6개월 회전주기)",
    details: "1~3년 예치. 회전주기마다 원금+이자가 새 원금.",
    productIds: ["fc-rolling-compound"],
  },
  {
    id: "no-interest",
    question: "무이자 상품",
    answer: "외화당좌예금 (당좌 약정 별도 체결)",
    productIds: ["fc-checking"],
  },
  {
    id: "minor",
    question: "미성년자 우대",
    answer: "IDREAM 외화자유적금 — 만 19세 미만 +0.20%p",
    details:
      "외화 첫 가입 +0.10%p 추가. 자동이체 6회 + 원화 출금계좌 조건. 최대 +0.30%p.",
    productIds: ["idream-free"],
  },
  {
    id: "max-bonus",
    question: "우대금리 최대",
    answer: "iM 외화자유적금 — 최대 +0.50%p (자동이체 8회 포함)",
    details: "Plus-You 36개월 +0.30%p / IDREAM 최대 +0.30%p.",
    productIds: ["im-free"],
  },
  {
    id: "fee-discount",
    question: "수수료·환율 우대",
    answer:
      "Plus-You(6개월↑) 송금 3회 면제·현찰 면제·TC 50% / 글로벌통장+정기·통지(5만불) 송금/현찰 50%·TC 30%",
    productIds: ["plusyou", "global-comprehensive"],
  },
  {
    id: "long-term",
    question: "36개월 장기 적립",
    answer: "Plus-You 자유적립 외화예금 (1~36개월)",
    productIds: ["plusyou"],
  },
  {
    id: "first-foreign",
    question: "외화 첫 가입 추천",
    answer:
      "글로벌외화종합통장 (한 통장 + 우대) + IDREAM (외화 최초 신규 +0.10%p)",
    productIds: ["global-comprehensive", "idream-free"],
  },
];

// ─── 카테고리 (모두 4글자 명사구로 통일) ───
const CATEGORY_ORDER: Array<{ key: string; label: string; icon: string }> = [
  { key: "통합통장", label: "통합통장", icon: "🌐" },
  { key: "수시입출", label: "수시입출", icon: "💵" },
  { key: "기간예치", label: "기간예치", icon: "🏛️" },
  { key: "자유적립", label: "자유적립", icon: "💰" },
  { key: "자동이체", label: "자동이체", icon: "🔁" },
];

const CATEGORY_RANK: Record<string, number> = Object.fromEntries(
  CATEGORY_ORDER.map((c, i) => [c.key, i]),
);

// ─── 정렬 키 ───
type SortKey =
  | "default"
  | "title"
  | "period"
  | "minDeposit"
  | "category";

export default function DepositGuidePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("default");

  // 검색 인덱스
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

  const sortedProducts = useMemo(() => {
    if (sortKey === "default") {
      // 기본: 카테고리 순 → 글로벌통장 우선
      return [...filteredProducts].sort((a, b) => {
        if (a.id === "global-comprehensive") return -1;
        if (b.id === "global-comprehensive") return 1;
        const ca = CATEGORY_RANK[a.category] ?? 99;
        const cb = CATEGORY_RANK[b.category] ?? 99;
        if (ca !== cb) return ca - cb;
        return 0;
      });
    }
    if (sortKey === "title") {
      return [...filteredProducts].sort((a, b) =>
        a.title.localeCompare(b.title, "ko"),
      );
    }
    if (sortKey === "category") {
      return [...filteredProducts].sort(
        (a, b) =>
          (CATEGORY_RANK[a.category] ?? 99) -
          (CATEGORY_RANK[b.category] ?? 99),
      );
    }
    if (sortKey === "minDeposit") {
      const parse = (p: DepositProduct) => {
        const m = (p.initialDeposit ?? "").match(/(\d[\d,]*)/);
        if (!m) return 0;
        return Number(m[1].replace(/,/g, ""));
      };
      return [...filteredProducts].sort((a, b) => parse(a) - parse(b));
    }
    return filteredProducts;
  }, [filteredProducts, sortKey]);

  const isSearching = search.trim().length > 0;
  const openQuestion = QUICK_QUESTIONS.find((q) => q.id === openQuestionId);

  return (
    <div className="max-w-[clamp(1024px,94vw,1680px)] mx-auto px-6 py-8">
      <nav className="text-xs text-charcoal-soft mb-3 flex items-center gap-1">
        <Link href="/guide" className="hover:text-primary">
          가이드 홈
        </Link>
        <span>›</span>
        <Link href="/guide/deposit" className="hover:text-primary">
          외화 예금·적금
        </Link>
        <span>›</span>
        <span className="text-charcoal">전체·검색</span>
      </nav>
      <header className="mb-4">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          🔍 외화 예금·적금 / 전체 검색
        </p>
        <h1 className="text-2xl font-bold mb-1">전체 상품 비교·검색</h1>
        <p className="text-xs text-charcoal-soft">
          {DEPOSIT_PRODUCTS.length}개 상품 통합 검색·자주 묻는 질문·정렬 가능한 표
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-deposit-all" />

      {/* 검색·필터 */}
      <div className="bg-white border border-border rounded-xl p-3 mb-4">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="검색 — 중도해지 / 9통화 / 비대면 / 법인 / 미성년 / 복리 / 36개월 / 자동이체 ..."
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
            label={`전체 ${DEPOSIT_PRODUCTS.length}`}
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
                label={`${c.icon} ${c.label} ${count}`}
                active={activeCategory === c.key}
                onClick={() =>
                  setActiveCategory(activeCategory === c.key ? null : c.key)
                }
              />
            );
          })}
        </div>
      </div>

      {/* 자주 묻는 질문 (압축 칩) — 검색 안 할 때만 */}
      {!isSearching && (
        <section className="mb-4">
          <div className="flex items-baseline gap-2 mb-2 px-1">
            <h2 className="text-[10px] font-medium text-charcoal-soft uppercase tracking-wide">
              ⚡ 자주 묻는 질문
            </h2>
            <span className="text-[10px] text-charcoal-soft">
              클릭하면 즉답
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {QUICK_QUESTIONS.map((q) => {
              const open = openQuestionId === q.id;
              return (
                <button
                  key={q.id}
                  onClick={() => setOpenQuestionId(open ? null : q.id)}
                  className={[
                    "text-xs px-2.5 py-1.5 rounded-full border transition",
                    open
                      ? "bg-primary text-white border-primary font-medium"
                      : "bg-white border-border text-charcoal-soft hover:border-primary hover:text-charcoal",
                  ].join(" ")}
                >
                  {q.question}
                </button>
              );
            })}
          </div>
          {openQuestion && (
            <div className="mt-2 bg-primary/5 border border-primary/30 rounded-lg p-3">
              <p className="text-sm text-charcoal leading-relaxed">
                <strong className="text-primary">→ </strong>
                {openQuestion.answer}
              </p>
              {openQuestion.details && (
                <p className="text-xs text-charcoal-soft mt-1.5 leading-relaxed">
                  {openQuestion.details}
                </p>
              )}
              {openQuestion.productIds.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-primary/20">
                  <span className="text-[10px] text-charcoal-soft uppercase tracking-wide pr-1">
                    관련 상품
                  </span>
                  {openQuestion.productIds.map((pid) => {
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
        </section>
      )}

      {/* 메인: 전체 상품 한 화면 표 */}
      <section className="mb-6">
        <div className="flex items-baseline justify-between mb-2 px-1">
          <h2 className="text-[10px] font-medium text-charcoal-soft uppercase tracking-wide">
            📊 전체 상품 ({sortedProducts.length})
          </h2>
          <div className="flex items-center gap-1 text-[10px] text-charcoal-soft">
            <span>정렬</span>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="bg-white border border-border rounded px-1.5 py-0.5 text-[11px] focus:outline-none focus:border-primary"
            >
              <option value="default">기본 (카테고리)</option>
              <option value="title">상품명 가나다순</option>
              <option value="category">카테고리만</option>
              <option value="minDeposit">최소 가입금액</option>
            </select>
          </div>
        </div>
        <DepositTable products={sortedProducts} />
      </section>

      {/* 공통 안내 — 압축 */}
      <details className="bg-offwhite border border-border rounded-xl text-xs text-charcoal-soft">
        <summary className="cursor-pointer p-3 font-medium text-charcoal hover:text-primary">
          📋 모든 외화 예금·적금 공통 안내 (펼치기)
        </summary>
        <ul className="px-3 pb-3 space-y-0.5 list-disc list-inside leading-relaxed">
          <li>
            예금자보호법 적용 — 원금+이자 1인당{" "}
            <strong className="text-charcoal">1억원까지</strong> (본 은행 여타 보호상품과 합산)
          </li>
          <li>비과세종합저축 가입 불가 · 공동명의 가입 불가</li>
          <li>
            현찰수수료: USD/JPY/EUR/GBP/CAD/AUD/CHF/NZD 1.5%, CNY 4.0% (USD 외
            현찰 입금 또는 송금 입금분 현찰 출금 시)
          </li>
          <li>
            원화 출금 시 <strong className="text-charcoal">대고객 전신환매입율</strong> 적용 (외화예금거래기본약관 제5조)
          </li>
          <li>
            이자 기준 일수: USD 등 360일 ·{" "}
            <strong className="text-charcoal">JPY·GBP 365일</strong> (외화예금거래기본약관 제4조)
          </li>
        </ul>
      </details>
    </div>
  );
}

// ─── 메인 표 ───
function DepositTable({ products }: { products: DepositProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="bg-white border border-border rounded-xl p-6 text-center text-sm text-charcoal-soft">
        일치하는 상품이 없습니다.
      </div>
    );
  }
  return (
    <div className="overflow-x-auto bg-white border border-border rounded-xl">
      <table className="w-full text-xs">
        <thead className="bg-offwhite text-charcoal-soft">
          <tr className="border-b border-border">
            <Th className="sticky left-0 bg-offwhite z-10 min-w-44">상품</Th>
            <Th className="w-20">구분</Th>
            <Th>기간</Th>
            <Th>통화</Th>
            <Th>최소가입</Th>
            <Th>추가입금</Th>
            <Th>일부해지</Th>
            <Th className="w-16">비대면</Th>
            <Th>핵심</Th>
            <Th className="sticky right-0 bg-offwhite z-10 w-20 text-right">
              상세
            </Th>
          </tr>
        </thead>
        <tbody className="text-charcoal">
          {products.map((p, i) => {
            const isGlobal = p.id === "global-comprehensive";
            const rowBg = isGlobal
              ? "bg-primary/5"
              : i % 2 === 1
                ? "bg-offwhite/50"
                : "bg-white";
            return (
              <tr
                key={p.id}
                className={[
                  "border-b border-border last:border-0 align-top hover:bg-primary/5 transition",
                  rowBg,
                ].join(" ")}
              >
                <td
                  className={[
                    "py-2 px-3 sticky left-0 z-10",
                    isGlobal ? "bg-primary/5" : i % 2 === 1 ? "bg-offwhite/50" : "bg-white",
                  ].join(" ")}
                >
                  <Link
                    href={`/guide/deposit/${p.id}`}
                    className="block leading-tight hover:text-primary group"
                  >
                    <span className="font-semibold text-sm">
                      {isGlobal && <span className="text-primary">⭐ </span>}
                      {p.shortTitle}
                    </span>
                    <span className="block text-[10px] text-charcoal-soft mt-0.5">
                      {p.title}
                    </span>
                  </Link>
                </td>
                <td className="py-2 px-3 text-charcoal-soft whitespace-nowrap">
                  {p.category}
                </td>
                <td className="py-2 px-3 leading-tight">{p.period ?? "—"}</td>
                <td className="py-2 px-3 leading-tight">
                  {summarizeCurrencies(p.currencies)}
                </td>
                <td className="py-2 px-3 leading-tight">
                  {summarize(p.initialDeposit) || "—"}
                </td>
                <td className="py-2 px-3 leading-tight">
                  {summarize(p.additionalDeposit) ||
                    inferAdditional(p) ||
                    "—"}
                </td>
                <td className="py-2 px-3 leading-tight">
                  {summarize(p.partialWithdraw) || inferPartial(p) || "—"}
                </td>
                <td className="py-2 px-3">
                  {channelOnline(p.channels) ? (
                    <span className="text-primary text-base">✓</span>
                  ) : (
                    <span className="text-charcoal-soft">—</span>
                  )}
                </td>
                <td className="py-2 px-3 leading-tight font-medium text-charcoal">
                  {coreHighlight(p)}
                </td>
                <td
                  className={[
                    "py-2 px-3 sticky right-0 z-10 text-right",
                    isGlobal ? "bg-primary/5" : i % 2 === 1 ? "bg-offwhite/50" : "bg-white",
                  ].join(" ")}
                >
                  <Link
                    href={`/guide/deposit/${p.id}`}
                    className="text-primary hover:text-primary-dark font-medium whitespace-nowrap"
                  >
                    보기 →
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={[
        "text-left py-2 px-3 uppercase tracking-wide text-[10px] font-medium",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </th>
  );
}

// ─── 헬퍼 ───
function summarize(s?: string): string {
  if (!s) return "";
  if (s.length <= 26) return s;
  return s.slice(0, 24) + "…";
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
  if (p.category === "수시입출" || p.category === "통합통장") return "자유";
  return "";
}

function inferPartial(p: DepositProduct): string {
  if (p.category === "수시입출") return "자유";
  if (p.category === "기간예치") return "불가";
  return "";
}

function coreHighlight(p: DepositProduct): string {
  switch (p.id) {
    case "global-comprehensive":
      return "수수료 우대";
    case "fc-ordinary":
      return "기본 외화통장";
    case "fc-checking":
      return "무이자·당좌약정";
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
      return "장기 우대+수수료";
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
