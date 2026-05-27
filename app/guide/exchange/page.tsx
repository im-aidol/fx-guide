"use client";

import Link from "next/link";
import { AdminNote } from "@/components/admin/AdminNote";

// /guide/exchange 진입판 — /guide와 /guide/deposit과 같은 단계적 선택 패턴.
// 외화 매매(환전) 관련 4가지 화면 + 외화 배송(비대면 외화 수령)을 환전 안에 통합.

type HubCard = {
  id: string;
  href: string;
  icon: string;
  title: string;
  badge?: string;
  description: string;
  highlight?: boolean;
};

const CARDS: HubCard[] = [
  {
    id: "calculator",
    href: "/guide/exchange/calculator",
    icon: "🧮",
    title: "환전 계산기",
    badge: "⭐ 상담 도구",
    description:
      "원화↔외화 환산, 환율 종류 선택(매매기준율·전신환·현찰), 환율우대 적용. 고객 상담 시 즉석 계산.",
    highlight: true,
  },
  {
    id: "info",
    href: "/guide/exchange/info",
    icon: "📐",
    title: "환율 산출·BuyAndSell 안내",
    description:
      "매매기준율·전신환·현찰 환율 원리 + 실시간/희망환율 BuyAndSell 비교 + 영업점 환전 임계값.",
  },
  {
    id: "samples",
    href: "/samples",
    icon: "💴",
    title: "통화 견본",
    description:
      "권종별 사진·시리즈·매입/매도 가능 여부. 환전 시 매입 여부 즉시 확인.",
  },
  {
    id: "delivery",
    href: "/guide/delivery",
    icon: "📦",
    title: "외화 배송·기프티콘",
    description:
      "비대면 외화 수령 — iM외화배송 서비스 + 외화 기프티콘(외화수령증).",
  },
];

export default function ExchangeHubPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link
        href="/guide"
        className="text-xs text-charcoal-soft hover:text-primary inline-flex items-center gap-1 mb-3"
      >
        ← 가이드 홈
      </Link>
      <header className="mb-6">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          💱 환전 (외화 매매)
        </p>
        <h1 className="text-3xl font-bold mb-2">어떤 환전 화면을 보시겠어요?</h1>
        <p className="text-sm text-charcoal-soft">
          외화 매수(사기) / 매도(팔기) 관련 도구·안내·자료. 외화 배송도 비대면
          환전 수령 채널로 함께 안내합니다.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-exchange-hub" />

      <section className="grid md:grid-cols-2 gap-4 mb-4">
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
            <span className="text-sm text-primary font-medium mt-3 inline-block group-hover:translate-x-1 transition">
              들어가기 →
            </span>
          </Link>
        ))}
      </section>

      {/* 공통 안내 */}
      <details className="bg-offwhite border border-border rounded-xl text-xs text-charcoal-soft">
        <summary className="cursor-pointer p-3 font-medium text-charcoal hover:text-primary">
          📋 환전 공통 안내 (펼치기)
        </summary>
        <ul className="px-3 pb-3 space-y-0.5 list-disc list-inside leading-relaxed">
          <li>
            <strong className="text-charcoal">매매기준율</strong>: 외환규정 1-2조
            7호 — 외국환중개회사 시장평균환율 (USD·CNY 직접 산출, 그 외 통화는
            재정환율).
          </li>
          <li>
            <strong className="text-charcoal">환율 종류</strong>: 매매기준율 /
            전신환매도·매입 (송금·계좌) / 현찰매도·매입 (외화 지폐) /
            여행자수표매도 등.
          </li>
          <li>
            <strong className="text-charcoal">USD 10,000 초과 휴대 출국</strong>은
            세관 신고 의무 (외환거래법).
          </li>
          <li>
            <strong className="text-charcoal">분할 환전 의심</strong> 시 STR 검토
            대상 (특정금융정보법 — 누설 금지).
          </li>
          <li>
            모든 환산·계산기 결과는 참고용 — 실제 거래는 거래 시점 영업점 게시
            환율·당행 매매기준율 기준.
          </li>
        </ul>
      </details>
    </div>
  );
}
