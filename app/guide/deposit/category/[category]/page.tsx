"use client";

import Link from "next/link";
import { use, useMemo, useState } from "react";
import { notFound } from "next/navigation";
import {
  DEPOSIT_PRODUCTS,
  type DepositProduct,
} from "@/lib/data/deposit-products";
import { AdminNote } from "@/components/admin/AdminNote";

// 카테고리 slug ↔ 한글 카테고리 매핑.
// 1개짜리 카테고리(통합통장·이체)는 상품 페이지 직접 진입이라 여기 없음.
const CATEGORY_BY_SLUG: Record<
  string,
  { key: string; label: string; icon: string; description: string }
> = {
  demand: {
    key: "수시입출",
    label: "수시입출 외화예금",
    icon: "💵",
    description:
      "입출금이 자유로운 외화 통장 3종 — 보통·당좌·MMDA. 잔액 차등금리·당좌약정 여부 등으로 선택.",
  },
  term: {
    key: "기간예치",
    label: "기간예치 외화예금",
    icon: "🏛️",
    description:
      "기간을 정해 예치하고 만기에 이자를 받는 외화예금 3종 — 통지·정기·회전복리.",
  },
  savings: {
    key: "자유적립",
    label: "자유적립 외화적금",
    icon: "💰",
    description:
      "매월 자유롭게 적립하는 외화 적금 4종 — For You(기본형)·Plus-You(장기·우대)·iM(비대면)·IDREAM(미성년 우대).",
  },
};

export default function DepositCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = use(params);
  const cat = CATEGORY_BY_SLUG[slug];
  const [search, setSearch] = useState("");

  if (!cat) {
    notFound();
  }

  const products = useMemo(
    () => DEPOSIT_PRODUCTS.filter((p) => p.category === cat.key),
    [cat.key],
  );

  // 카테고리 내 검색 인덱스
  const searchIndex = useMemo(() => {
    return products.map((p) => ({
      id: p.id,
      blob: [
        p.title,
        p.shortTitle,
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
        (p.keyClauses ?? [])
          .map((c) => `${c.ref} ${c.label} ${c.body}`)
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
  }, [products]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    const matchIds = new Set(
      searchIndex.filter((s) => s.blob.includes(q)).map((s) => s.id),
    );
    return products.filter((p) => matchIds.has(p.id));
  }, [products, search, searchIndex]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
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
        <span className="text-charcoal">{cat.label}</span>
      </nav>

      <header className="mb-4">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          {cat.icon} 카테고리
        </p>
        <h1 className="text-2xl font-bold mb-1">{cat.label}</h1>
        <p className="text-sm text-charcoal-soft leading-relaxed">
          {cat.description}
        </p>
      </header>

      <AdminNote storageKey={`fx-guide:note:guide-deposit-cat-${slug}`} />

      {/* 카테고리 내 검색 */}
      <div className="bg-white border border-border rounded-xl p-3 mb-4">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`${cat.label} 검색 — 기간·통화·중도해지·우대...`}
            className="w-full pl-9 pr-9 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
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
        <p className="text-[10px] text-charcoal-soft mt-1.5 px-1">
          이 카테고리({products.length}개) 안에서만 검색합니다. 전체 검색은{" "}
          <Link
            href="/guide/deposit/all"
            className="text-primary hover:underline"
          >
            전체 상품 비교·검색
          </Link>
          .
        </p>
      </div>

      {/* 카테고리 내 표 */}
      <section className="mb-4">
        <div className="flex items-baseline justify-between mb-2 px-1">
          <h2 className="text-[10px] font-medium text-charcoal-soft uppercase tracking-wide">
            상품 비교 ({filtered.length}개)
          </h2>
          <Link
            href="/guide/deposit/all"
            className="text-[11px] text-charcoal-soft hover:text-primary"
          >
            전체 상품 보기 →
          </Link>
        </div>
        <CategoryTable products={filtered} />
      </section>

      {/* 다른 카테고리 빠른 이동 */}
      <section className="mt-6">
        <p className="text-[10px] text-charcoal-soft uppercase tracking-wide mb-2 px-1">
          다른 외화 예금·적금
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries(CATEGORY_BY_SLUG)
            .filter(([s]) => s !== slug)
            .map(([s, c]) => (
              <Link
                key={s}
                href={`/guide/deposit/category/${s}`}
                className="bg-white border border-border rounded-lg p-2.5 hover:border-primary transition group"
              >
                <p className="text-sm font-medium group-hover:text-primary transition">
                  {c.icon} {c.label}
                </p>
                <p className="text-[10px] text-charcoal-soft mt-0.5">
                  {
                    DEPOSIT_PRODUCTS.filter((p) => p.category === c.key).length
                  }
                  개
                </p>
              </Link>
            ))}
          <Link
            href="/guide/deposit"
            className="bg-white border border-border rounded-lg p-2.5 hover:border-primary transition group"
          >
            <p className="text-sm font-medium group-hover:text-primary transition">
              ← 진입판
            </p>
            <p className="text-[10px] text-charcoal-soft mt-0.5">
              외화 예금·적금 홈
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}

// ─── 카테고리 표 ───
function CategoryTable({ products }: { products: DepositProduct[] }) {
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
            const bg = i % 2 === 1 ? "bg-offwhite/50" : "bg-white";
            return (
              <tr
                key={p.id}
                className="border-b border-border last:border-0 align-top hover:bg-primary/5 transition"
              >
                <td className={`py-2 px-3 sticky left-0 z-10 ${bg}`}>
                  <Link
                    href={`/guide/deposit/${p.id}`}
                    className="block leading-tight hover:text-primary"
                  >
                    <span className="font-semibold text-sm">{p.shortTitle}</span>
                    <span className="block text-[10px] text-charcoal-soft mt-0.5">
                      {p.title}
                    </span>
                  </Link>
                </td>
                <td className="py-2 px-3 leading-tight">{p.period ?? "—"}</td>
                <td className="py-2 px-3 leading-tight">
                  {summarizeCurrencies(p.currencies)}
                </td>
                <td className="py-2 px-3 leading-tight">
                  {summarize(p.initialDeposit) || "—"}
                </td>
                <td className="py-2 px-3 leading-tight">
                  {summarize(p.additionalDeposit) || inferAdditional(p) || "—"}
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
                <td className={`py-2 px-3 sticky right-0 z-10 text-right ${bg}`}>
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

// ─── 헬퍼 (전체 페이지와 동일 로직) ───
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
