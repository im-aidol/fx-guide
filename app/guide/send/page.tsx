"use client";

import Link from "next/link";
import { useMemo } from "react";
import { BUSINESS_GUIDE } from "@/lib/data";
import { AdminNote } from "@/components/admin/AdminNote";

// /guide/send 진입판 — /guide와 동일한 단계적 선택 패턴.
// 핵심 도구(당발송금 도우미) + 사유별 가이드 + 자주 묻는 정보 카드들.

type HubCard = {
  id: string;
  href: string;
  icon: string;
  title: string;
  badge?: string;
  description: string;
  highlight?: boolean;
};

export default function SendHubPage() {
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    BUSINESS_GUIDE.forEach((g) => {
      map[g.category] = (map[g.category] ?? 0) + 1;
    });
    return map;
  }, []);

  const cards: HubCard[] = [
    {
      id: "simulator",
      href: "/simulator",
      icon: "🎯",
      title: "당발송금 도우미",
      badge: "⭐ 사유 모를 때",
      description:
        "고객 답변 따라 클릭으로 좁혀가는 트리식 가이드. 거래코드·한도·서류·통보·응대 멘트까지 자동 도출. 입력 금액 기준 USD 1만/5만/10만 임계 자동 점검.",
      highlight: true,
    },
    {
      id: "cases",
      href: "/guide/send/cases",
      icon: "📋",
      title: "사유별 가이드",
      badge: `${BUSINESS_GUIDE.length}개 사유`,
      description:
        "사유가 명확할 때 한 카드 보고 빠르게 처리. 경상거래·자산이전·외국인송금·자본거래·기타 카테고리별 검색·필터링.",
    },
  ];

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
          📤 당발송금 (한국 → 해외)
        </p>
        <h1 className="text-3xl font-bold mb-2">
          어떻게 시작하시겠어요?
        </h1>
        <p className="text-sm text-charcoal-soft">
          고객 사유 모르면 도우미, 사유 분명하면 사유별 가이드. 하단에 자주 묻는
          정보(한도·통보·필수 기재국) 모음.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-send-hub" />

      {/* 메인 진입 카드 2개 */}
      <section className="grid md:grid-cols-2 gap-4 mb-6">
        {cards.map((c) => (
          <Link
            key={c.id}
            href={c.href}
            className={[
              "rounded-xl p-5 hover:translate-y-[-1px] transition group border flex flex-col",
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
            <p className="text-sm text-charcoal-soft leading-relaxed flex-1">
              {c.description}
            </p>
            <span className="text-sm text-primary font-medium mt-3 inline-block group-hover:translate-x-1 transition">
              들어가기 →
            </span>
          </Link>
        ))}
      </section>

      {/* 사유 카테고리 빠른 진입 */}
      <section className="bg-white border border-border rounded-xl p-4 mb-6">
        <p className="text-[10px] font-medium text-charcoal-soft uppercase tracking-wide mb-2 px-1">
          📋 사유 카테고리 빠른 진입 (사유별 가이드 내 필터)
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
          {(["경상거래", "자산이전", "외국인송금", "자본거래", "기타"] as const).map(
            (cat) => {
              const count = categoryCounts[cat] ?? 0;
              if (count === 0) return null;
              return (
                <Link
                  key={cat}
                  href={`/guide/send/cases?cat=${encodeURIComponent(cat)}`}
                  className="bg-offwhite border border-border rounded-md px-2.5 py-2 text-xs text-charcoal-soft hover:border-primary hover:text-primary transition text-center"
                >
                  <p className="font-medium">{cat}</p>
                  <p className="text-[10px] mt-0.5">{count}개 사유</p>
                </Link>
              );
            },
          )}
        </div>
      </section>

      {/* 자주 묻는 정보 — 한도·통보·필수국 */}
      <section className="mb-6">
        <p className="text-[10px] font-medium text-charcoal-soft uppercase tracking-wide mb-2 px-1">
          📐 자주 묻는 당발송금 정보
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          <InfoCard
            icon="📏"
            title="자주 찾는 한도·통보 임계"
            items={[
              ["거주자 무증빙", "연 USD 100,000 (4-3조 ①1호)"],
              ["외국인·비거주자 국내소득송금", "연 USD 50,000 (iM뱅크 안내)"],
              ["건당 무증빙 (10만불 초과 시 OK)", "USD 5,000 (4-3조 ②가목)"],
              ["국세청·관세청·금감원 통보", "USD 10,000 초과 (4-8조 ①·②·③)"],
            ]}
          />
          <InfoCard
            icon="🌐"
            title="송금사유 필수 기재국 (12종)"
            items={[
              ["UAE·사우디·쿠웨이트·카타르", "중동 산유국 — 사유 누락 시 반환·지연"],
              ["말레이시아·우즈벡·파키스탄", "외환 통제 강한 국가"],
              ["요르단·모로코·동티모르", "송금사유 명시 의무"],
              ["미국·인도", "고액 송금 사유 확인"],
            ]}
            note="출처: iM뱅크 모바일앱 해외송금 안내"
          />
        </div>
      </section>

      {/* FAQ 진입 */}
      <Link
        href="/faq?q=송금"
        className="block bg-white border border-border rounded-xl p-4 hover:border-primary transition group"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔍</span>
            <div>
              <h3 className="font-bold text-sm group-hover:text-primary transition">
                FAQ에서 송금 관련 질문 검색
              </h3>
              <p className="text-xs text-charcoal-soft mt-0.5">
                SWIFT·10만불·해외이주비 등 키워드로 즉답 찾기
              </p>
            </div>
          </div>
          <span className="text-charcoal-soft group-hover:text-primary group-hover:translate-x-1 transition">
            →
          </span>
        </div>
      </Link>

      {/* 외환규정 공통 안내 */}
      <details className="mt-4 bg-offwhite border border-border rounded-xl text-xs text-charcoal-soft">
        <summary className="cursor-pointer p-3 font-medium text-charcoal hover:text-primary">
          📋 당발송금 공통 원칙 (펼치기)
        </summary>
        <ul className="px-3 pb-3 space-y-0.5 list-disc list-inside leading-relaxed">
          <li>
            모든 거래코드·한도·신고요건은 <strong className="text-charcoal">외환규정 원문</strong> 기준 (재정경제부고시 제2026-69호, 2025-4호·2025-57호 개정 반영)
          </li>
          <li>
            iM뱅크 홈페이지와 외환규정 차이 시{" "}
            <strong className="text-charcoal">외환규정 우선</strong>
          </li>
          <li>
            <strong className="text-charcoal">의심거래보고(STR) 사실 누설 절대 금지</strong> (특정금융정보법 제4조 제6항)
          </li>
          <li>핀테크 송금 업체(Wise·한패스·센트비 등) 일체 언급 금지 — iM뱅크 창구 직원 전용</li>
          <li>
            응대 멘트는 따뜻한 어조 — 협박조·강압적 톤 금지
          </li>
        </ul>
      </details>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  items,
  note,
}: {
  icon: string;
  title: string;
  items: [string, string][];
  note?: string;
}) {
  return (
    <div className="bg-white border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <h3 className="font-bold text-sm">{title}</h3>
      </div>
      <ul className="space-y-1.5 text-xs">
        {items.map(([label, value]) => (
          <li
            key={label}
            className="flex items-baseline justify-between gap-2 pb-1.5 border-b border-border last:border-0 last:pb-0"
          >
            <span className="text-charcoal min-w-0">{label}</span>
            <span className="text-charcoal-soft text-right whitespace-nowrap text-[11px]">
              {value}
            </span>
          </li>
        ))}
      </ul>
      {note && (
        <p className="text-[10px] text-charcoal-soft mt-2 pt-2 border-t border-border">
          {note}
        </p>
      )}
    </div>
  );
}
