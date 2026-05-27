"use client";

import Link from "next/link";
import { DEPOSIT_PRODUCTS } from "@/lib/data/deposit-products";
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
  highlight?: boolean;
};

// 진입 카드 6개. 카테고리 4종은 모두 4글자 명사구로 통일된 라벨.
const CARDS: HubCard[] = [
  {
    id: "global",
    href: "/guide/deposit/global-comprehensive",
    icon: "🌐",
    title: "글로벌외화종합통장",
    badge: "⭐ 첫 가입 추천",
    description:
      "보통+정기+통지+회전복리 한 통장. 정기·통지 5만불 이상 신규 시 송금·현찰 50%·TC 30% 우대.",
    highlight: true,
  },
  {
    id: "demand",
    href: "/guide/deposit/category/demand",
    icon: "💵",
    title: "수시입출",
    badge: "3종",
    description: "보통·당좌·MMDA — 입출금이 자유로운 외화 통장",
  },
  {
    id: "term",
    href: "/guide/deposit/category/term",
    icon: "🏛️",
    title: "기간예치",
    badge: "3종",
    description: "통지·정기·회전복리 — 기간을 정해 예치하고 만기에 이자 수령",
  },
  {
    id: "savings",
    href: "/guide/deposit/category/savings",
    icon: "💰",
    title: "자유적립",
    badge: "4종",
    description:
      "For You·Plus-You·iM·IDREAM — 매월 자유 적립, 우대금리 조건 다양",
  },
  {
    id: "transfer",
    href: "/guide/deposit/auto-transfer",
    icon: "🔁",
    title: "자동이체",
    badge: "도구",
    description:
      "적립 우대 트리거 — Plus-You 환율 50%, iM 자동 8회 +0.30%p, IDREAM 6회 우대",
  },
  {
    id: "simulator",
    href: "/guide/deposit/simulator",
    icon: "🧮",
    title: "이자 시뮬레이터",
    badge: "도구",
    description: "통화·기간·금액·금리 입력 → 만기 이자·원리금 미리 계산",
  },
];

export default function DepositHubPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
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
        <p className="text-sm text-charcoal-soft">
          {DEPOSIT_PRODUCTS.length}개 상품 — 카테고리·단일 상품·도구 중 선택해
          들어갑니다.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-deposit-hub" />

      {/* 진입 카드 그리드 */}
      <section className="grid md:grid-cols-2 gap-4 mb-6">
        {CARDS.map((c) => (
          <Link
            key={c.id}
            href={c.href}
            className={[
              "rounded-xl p-5 hover:translate-y-[-1px] transition group border",
              c.highlight
                ? "bg-primary/5 border-primary/30 hover:border-primary"
                : "bg-white border-border hover:border-primary",
            ].join(" ")}
          >
            <div className="flex items-start gap-3 mb-2">
              <span className="text-3xl leading-none">{c.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2
                    className={[
                      "font-bold text-lg leading-tight",
                      c.highlight
                        ? "text-primary"
                        : "group-hover:text-primary transition",
                    ].join(" ")}
                  >
                    {c.title}
                  </h2>
                  {c.badge && (
                    <span
                      className={[
                        "text-[10px] px-1.5 py-0.5 rounded-full border whitespace-nowrap",
                        c.highlight
                          ? "text-primary border-primary/30 bg-white"
                          : "text-charcoal-soft border-border bg-offwhite",
                      ].join(" ")}
                    >
                      {c.badge}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-sm text-charcoal-soft leading-relaxed">
              {c.description}
            </p>
            <span
              className={[
                "text-sm font-medium mt-3 inline-block group-hover:translate-x-1 transition",
                c.highlight ? "text-primary" : "text-primary",
              ].join(" ")}
            >
              들어가기 →
            </span>
          </Link>
        ))}
      </section>

      {/* 보조 — 전체 검색·표 */}
      <Link
        href="/guide/deposit/all"
        className="block bg-white border border-border rounded-xl p-4 hover:border-primary transition group"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔍</span>
            <div>
              <h3 className="font-bold text-sm group-hover:text-primary transition">
                전체 상품 한 화면 비교·검색
              </h3>
              <p className="text-xs text-charcoal-soft mt-0.5">
                {DEPOSIT_PRODUCTS.length}개 상품 통합 검색 · 자주 묻는 질문 12개 ·
                정렬 가능한 표
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
