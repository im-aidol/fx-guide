"use client";

import Link from "next/link";
import { AdminNote } from "@/components/admin/AdminNote";

// /guide/deposit 진입판 — /guide의 6개 업무 선택과 동일한 패턴.
// 영업점이 외화 예금·적금 안에서 어디로 갈지 한눈에 선택.
// 깊은 정보는 각 진입 카드 클릭 시의 페이지에서 (카테고리 / 상품 상세 / 시뮬레이터 / 전체검색).

type HubCard = {
  id: string;
  href: string;
  icon: string;
  title: string;
  badge?: string;
  description: string;
  variant?: "product" | "tool";
};

const CARD_LINK_CLASS =
  "h-full flex flex-col rounded-xl p-5 hover:translate-y-[-1px] transition group border";
const CARD_BADGE_CLASS =
  "text-[10px] px-1.5 py-0.5 rounded-full border whitespace-nowrap";
const CARD_TITLE_CLASS = "font-bold text-lg leading-tight transition";

const CARD_VARIANTS = {
  product: {
    link: "bg-white border-border hover:border-primary",
    title: "text-charcoal",
    badge: "text-charcoal-soft border-border bg-offwhite",
  },
  tool: {
    link: "bg-primary/5 border-primary/30 hover:border-primary shadow-[0_0_0_1px_rgba(62,178,134,0.12)]",
    title: "text-primary",
    badge: "text-primary border-primary/30 bg-white",
  },
} as const;

// 진입 카드 4개. 원하는 순서대로 정렬.
const CARDS: HubCard[] = [
  {
    id: "global",
    href: "/guide/deposit/global-comprehensive",
    icon: "🌐",
    title: "글로벌외화종합통장",
    description: "다양한 통화를 한 통장으로 이용 가능한 외화 입출금통장",
  },
  {
    id: "term",
    href: "/guide/deposit/category/term",
    icon: "🏛️",
    title: "외화예금",
    badge: "5종",
    description: "For-You 자유적립, Plus-You 자유적립, 정기예금, 회전복리, 통지예금",
  },
  {
    id: "savings",
    href: "/guide/deposit/category/savings",
    icon: "💰",
    title: "외화적금",
    badge: "2종",
    description: "IDREAM외화자유적금, iM외화자유적금",
  },
  {
    id: "simulator",
    href: "/guide/deposit/simulator",
    icon: "🧮",
    title: "이자 계산기",
    description: "만기 이자·원리금 미리 계산",
    variant: "tool",
  },
];

export default function DepositHubPage() {
  return (
    <div className="max-w-[clamp(960px,92vw,1440px)] mx-auto px-6 py-10">
      <Link
        href="/guide"
        className="text-xs text-charcoal-soft hover:text-primary inline-flex items-center gap-1 mb-3"
      >
        ← 가이드 홈
      </Link>
      <header className="mb-6">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          🏦 외화 예금·적금
        </p>
        <h1 className="text-3xl font-bold mb-2">
          어떤 상품을 보시겠어요?
        </h1>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-deposit-hub" />

      {/* 진입 카드 그리드 */}
      <section className="grid md:grid-cols-2 md:auto-rows-fr gap-4 mb-6">
        {CARDS.map((c) => {
          const variant = CARD_VARIANTS[c.variant ?? "product"];

          return (
            <Link
              key={c.id}
              href={c.href}
              className={`${CARD_LINK_CLASS} ${variant.link}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl leading-none">{c.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h2 className={`${CARD_TITLE_CLASS} ${variant.title}`}>{c.title}</h2>
                    {c.badge && (
                      <span className={`${CARD_BADGE_CLASS} ${variant.badge}`}>
                        {c.badge}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-sm text-charcoal-soft leading-relaxed flex-1">
                {c.description}
              </p>
              <span className="text-sm font-medium mt-3 inline-block text-primary group-hover:translate-x-1 transition">
                들어가기 →
              </span>
            </Link>
          );
        })}
      </section>

      {/* 보조 — 전체 상품 비교 */}
      <Link
        href="/guide/deposit/all"
        className="block bg-white border border-border rounded-xl p-4 hover:border-primary transition group"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔍</span>
            <div>
              <h3 className="font-bold text-sm group-hover:text-primary transition">
                전체 상품 비교·검색
              </h3>
              <p className="text-xs text-charcoal-soft mt-0.5">
                외화예금·적금 상품을 한 화면에서 비교하고 찾아보세요.
              </p>
            </div>
          </div>
          <span className="text-charcoal-soft group-hover:text-primary group-hover:translate-x-1 transition">
            →
          </span>
        </div>
      </Link>

      {/* 공통 안내 */}
      <details className="mt-4 bg-offwhite border border-border rounded-xl text-xs text-charcoal-soft">
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
            원화 출금 시{" "}
            <strong className="text-charcoal">대고객 전신환매입율</strong> 적용
            (외화예금거래기본약관 제5조)
          </li>
          <li>
            이자 기준 일수: USD 등 360일 ·{" "}
            <strong className="text-charcoal">JPY·GBP 365일</strong>{" "}
            (외화예금거래기본약관 제4조)
          </li>
        </ul>
      </details>
    </div>
  );
}
