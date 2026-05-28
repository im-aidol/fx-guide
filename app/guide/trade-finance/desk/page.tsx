"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminNote } from "@/components/admin/AdminNote";
import {
  TRADE_SCENARIOS,
  type TradeScenario,
  type TradeScenarioCategory,
  type TradeScenarioSubCategory,
} from "@/lib/data/trade-scenarios";

// 무역금융 영업점 응대 도우미.
// 좌측 sticky 시나리오 리스트 + 우측 상세 — 스크롤 따로, 시나리오 전환 시 우측만 바뀜.
// 모바일: 시나리오 선택 시 상세 풀화면 모드.

const CATEGORY_LABEL: Record<
  TradeScenarioCategory,
  { icon: string; title: string }
> = {
  import: { icon: "📥", title: "수입 (Importer)" },
  export: { icon: "📤", title: "수출 (Exporter)" },
};

const SUB_LABEL: Record<TradeScenarioSubCategory, string> = {
  "lc-open": "신용장 개설",
  "lc-amend": "조건변경",
  "lc-receive": "서류 도착·결제·인수",
  "lc-issue": "통지·교부",
  nego: "매입 (NEGO)",
  collection: "추심 (D/P·D/A)",
  "lg-tr": "L/G·T/R",
  "tt-finance": "T/T수입금융",
  default: "부도·연체·만기",
};

export default function TradeDeskPage() {
  const [category, setCategory] = useState<TradeScenarioCategory>("import");
  const [activeId, setActiveId] = useState<string | null>(null);

  const scenariosForCategory = useMemo(
    () => TRADE_SCENARIOS.filter((s) => s.category === category),
    [category],
  );

  const grouped = useMemo(() => {
    const map = new Map<TradeScenarioSubCategory, TradeScenario[]>();
    scenariosForCategory.forEach((s) => {
      if (!map.has(s.subCategory)) map.set(s.subCategory, []);
      map.get(s.subCategory)!.push(s);
    });
    return Array.from(map.entries());
  }, [scenariosForCategory]);

  const active = TRADE_SCENARIOS.find((s) => s.id === activeId);

  return (
    <div className="max-w-[clamp(1024px,94vw,1680px)] mx-auto px-6 py-6">
      <nav className="text-xs text-charcoal-soft mb-3 flex items-center gap-1">
        <Link href="/guide" className="hover:text-primary">
          가이드 홈
        </Link>
        <span>›</span>
        <Link href="/guide/trade-finance" className="hover:text-primary">
          무역금융
        </Link>
        <span>›</span>
        <span className="text-charcoal">영업점 도우미</span>
      </nav>

      <header className="mb-4">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          🎯 무역금융 · 영업점 응대
        </p>
        <h1 className="text-2xl font-bold mb-1">무역금융 영업점 도우미</h1>
        <p className="text-xs text-charcoal-soft leading-relaxed">
          왼쪽에서 상황을 고르면 오른쪽에 응대 내용이 나타납니다. 시나리오 전환은 왼쪽 패널에서 바로
          가능 — 스크롤 따로 동작.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-trade-desk" />

      <div className="grid lg:grid-cols-[300px_1fr] gap-4">
        {/* ─── 좌측: 시나리오 리스트 ─── */}
        <aside
          className={[
            "lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto",
            // 모바일: 시나리오 선택되면 숨김 (상세만 보이도록)
            active ? "hidden lg:block" : "block",
          ].join(" ")}
        >
          {/* 수입/수출 토글 */}
          <div className="bg-white border border-border rounded-xl p-1 mb-3 flex gap-1">
            {(Object.keys(CATEGORY_LABEL) as TradeScenarioCategory[]).map(
              (c) => {
                const info = CATEGORY_LABEL[c];
                const isActive = category === c;
                const count = TRADE_SCENARIOS.filter(
                  (s) => s.category === c,
                ).length;
                return (
                  <button
                    key={c}
                    onClick={() => {
                      setCategory(c);
                      setActiveId(null);
                    }}
                    className={[
                      "flex-1 text-center text-xs px-2 py-2 rounded-lg transition",
                      isActive
                        ? "bg-primary text-white font-semibold"
                        : "text-charcoal-soft hover:bg-offwhite",
                    ].join(" ")}
                    aria-pressed={isActive}
                  >
                    <span className="block text-base leading-none">
                      {info.icon}
                    </span>
                    <span className="block mt-1">
                      {info.title} ({count})
                    </span>
                  </button>
                );
              },
            )}
          </div>

          {/* 시나리오 리스트 */}
          <div className="space-y-2">
            {grouped.map(([sub, items]) => (
              <div
                key={sub}
                className="bg-white border border-border rounded-xl overflow-hidden"
              >
                <div className="bg-offwhite px-3 py-1.5 border-b border-border">
                  <p className="text-[10px] font-bold text-charcoal-soft uppercase tracking-wide">
                    {SUB_LABEL[sub]}
                  </p>
                </div>
                <div className="divide-y divide-border">
                  {items.map((s) => {
                    const isActive = s.id === activeId;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setActiveId(s.id)}
                        className={[
                          "w-full text-left px-3 py-2 transition",
                          isActive
                            ? "bg-primary/10 border-l-4 border-primary"
                            : "border-l-4 border-transparent hover:bg-offwhite/60 hover:border-primary/30",
                        ].join(" ")}
                      >
                        <p
                          className={[
                            "text-xs font-medium leading-tight",
                            isActive ? "text-primary" : "text-charcoal",
                          ].join(" ")}
                        >
                          {s.title}
                        </p>
                        <p className="text-[10px] text-charcoal-soft mt-0.5 leading-snug italic line-clamp-1">
                          💬 {s.customerSays}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/guide/trade-finance/cases"
            className="block mt-3 text-center text-[11px] text-charcoal-soft hover:text-primary border border-dashed border-border rounded-lg py-2"
          >
            📋 표·검색으로 보기 →
          </Link>
        </aside>

        {/* ─── 우측: 상세 ─── */}
        <main
          className={[
            "min-w-0",
            // 모바일: 시나리오 선택 안 했으면 숨김
            !active ? "hidden lg:block" : "block",
          ].join(" ")}
        >
          {active ? (
            <ScenarioDetail
              scenario={active}
              onClose={() => setActiveId(null)}
            />
          ) : (
            <EmptyState />
          )}
        </main>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white border-2 border-dashed border-border rounded-xl p-10 text-center">
      <p className="text-4xl mb-3">👈</p>
      <p className="font-medium text-charcoal mb-1">
        왼쪽에서 상황을 골라주세요
      </p>
      <p className="text-xs text-charcoal-soft leading-relaxed">
        손님이 어떤 일로 오셨는지 클릭하면<br />
        가져왔어야 할 서류·점검 항목·처리 절차·응대 멘트가 나타납니다.
      </p>
    </div>
  );
}

function ScenarioDetail({
  scenario: s,
  onClose,
}: {
  scenario: TradeScenario;
  onClose: () => void;
}) {
  return (
    <article className="bg-white border-2 border-primary rounded-xl overflow-hidden shadow-sm">
      <div className="bg-primary text-white px-4 py-3 flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-wide opacity-80">
            {SUB_LABEL[s.subCategory]}
          </p>
          <h2 className="font-bold text-lg leading-tight">{s.title}</h2>
          <p className="text-xs mt-1 opacity-90 leading-relaxed italic">
            💬 &ldquo;{s.customerSays}&rdquo;
          </p>
        </div>
        {/* 모바일에서 닫기 */}
        <button
          onClick={onClose}
          className="lg:hidden text-white/80 hover:text-white text-xl leading-none shrink-0 -mt-1"
          aria-label="닫고 시나리오 목록으로"
        >
          ✕
        </button>
      </div>

      <div className="p-4 space-y-4">
        <p className="text-xs text-charcoal leading-relaxed bg-offwhite border border-border rounded-lg p-3">
          📌 <strong>요약:</strong> {s.summary}
        </p>

        <DetailBlock title="🎒 손님이 가져왔어야 할 것" color="primary">
          <ul className="text-xs text-charcoal-soft list-disc list-inside space-y-1 leading-relaxed">
            {s.whatToBring.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </DetailBlock>

        <DetailBlock title="✅ 영업점 점검 항목" color="primary">
          <ul className="text-xs text-charcoal-soft space-y-2">
            {s.checklist.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary mt-0.5">▢</span>
                <div className="flex-1">
                  <p className="font-medium text-charcoal">{c.label}</p>
                  {c.detail && (
                    <p className="text-[11px] mt-0.5 leading-relaxed">
                      {c.detail}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </DetailBlock>

        <DetailBlock title="🔧 처리 절차" color="warn">
          <ol className="text-xs text-charcoal-soft list-decimal list-inside space-y-1 leading-relaxed">
            {s.procedure.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ol>
        </DetailBlock>

        {(s.timing || s.fees) && (
          <div className="grid sm:grid-cols-2 gap-3">
            {s.timing && (
              <DetailBlock title="⏱️ 기한·만기" color="info" compact>
                <p className="text-xs text-charcoal-soft leading-relaxed">
                  {s.timing}
                </p>
              </DetailBlock>
            )}
            {s.fees && s.fees.length > 0 && (
              <DetailBlock title="💸 수수료" color="info" compact>
                <ul className="text-xs text-charcoal-soft list-disc list-inside space-y-0.5 leading-relaxed">
                  {s.fees.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </DetailBlock>
            )}
          </div>
        )}

        {s.cautions && s.cautions.length > 0 && (
          <DetailBlock title="⚠️ 주의사항·하자 가능성" color="danger">
            <ul className="text-xs text-charcoal-soft list-disc list-inside space-y-1 leading-relaxed">
              {s.cautions.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </DetailBlock>
        )}

        <DetailBlock title="💬 영업점 응대 멘트" color="primary">
          <ul className="text-xs text-charcoal space-y-1.5 leading-relaxed">
            {s.scripts.map((line, i) => (
              <li key={i} className="border-l-2 border-primary/40 pl-2">
                {line}
              </li>
            ))}
          </ul>
        </DetailBlock>

        {s.relatedGuides && s.relatedGuides.length > 0 && (
          <DetailBlock title="📚 관련 상세 가이드" color="info" compact>
            <div className="flex flex-wrap gap-2">
              {s.relatedGuides.map((g) => (
                <Link
                  key={g.href}
                  href={g.href}
                  className="text-[11px] bg-white border border-border hover:border-primary text-charcoal-soft hover:text-primary px-2.5 py-1 rounded-full transition"
                >
                  {g.label} →
                </Link>
              ))}
            </div>
          </DetailBlock>
        )}

        <p className="text-[10px] text-charcoal-soft text-right">
          출처: {s.source}
        </p>

        {/* 모바일 — 닫고 다른 상황 보기 */}
        <button
          onClick={onClose}
          className="lg:hidden w-full text-center text-xs text-charcoal-soft hover:text-primary border border-border rounded-lg py-2"
        >
          ← 다른 상황 보기
        </button>
      </div>
    </article>
  );
}

function DetailBlock({
  title,
  color,
  compact,
  children,
}: {
  title: string;
  color: "primary" | "warn" | "danger" | "info";
  compact?: boolean;
  children: React.ReactNode;
}) {
  const cls = {
    primary: "bg-primary/5 border-primary/30",
    warn: "bg-warn/5 border-warn/30",
    danger: "bg-danger/5 border-danger/30",
    info: "bg-offwhite border-border",
  }[color];
  const titleCls = {
    primary: "text-primary",
    warn: "text-warn",
    danger: "text-danger",
    info: "text-charcoal-soft",
  }[color];

  return (
    <div className={`border rounded-lg ${cls} ${compact ? "p-2.5" : "p-3"}`}>
      <p
        className={`text-[10px] font-medium uppercase tracking-wide mb-1.5 ${titleCls}`}
      >
        {title}
      </p>
      {children}
    </div>
  );
}
