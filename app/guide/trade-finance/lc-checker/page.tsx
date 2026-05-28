"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminNote } from "@/components/admin/AdminNote";
import { DISCREPANCY_RULES } from "@/lib/data/trade-finance";

// 신용장 하자 점검 도구.
// 신용장 문구를 붙여넣으면 룰셋(UCP600·ISBP745 기반)에 따라 자동 점검.

const SAMPLE_TEXT = `:31D:251231SEOUL
:50:ABC TRADING CO., LTD
:59:XYZ EXPORT CO.
:32B:USD 100000,00
:41A:ANY BANK BY NEGOTIATION
:42C:90 DAYS AFTER SIGHT
:43P:ALLOWED
:43T:NOT ALLOWED
:44E:BUSAN PORT
:44F:LONG BEACH PORT
:44C:251115
:45A:5,000 PCS OF MEN'S COTTON T-SHIRTS
CIF LONG BEACH
:46A:+SIGNED COMMERCIAL INVOICE IN 3 COPIES
+FULL SET OF CLEAN ON BOARD OCEAN B/L MADE OUT TO THE ORDER OF iM BANK
+PACKING LIST IN 3 COPIES
+CERTIFICATE OF ORIGIN ISSUED BY KOREA CHAMBER OF COMMERCE
:47A:+ALL DOCUMENTS MUST BEAR THE L/C NUMBER
+Non-negotiable documents are acceptable
:71B:CHARGES OUTSIDE KOREA ARE FOR BENEFICIARY'S ACCOUNT
:48:DOCUMENTS TO BE PRESENTED WITHIN 21 DAYS
:49:WITHOUT`;

type CheckResult = {
  rule: (typeof DISCREPANCY_RULES)[number];
  matchedText: string;
};

export default function LcCheckerPage() {
  const [lcText, setLcText] = useState("");

  const results = useMemo<CheckResult[]>(() => {
    if (!lcText.trim()) return [];
    const lower = lcText.toLowerCase();
    const found: CheckResult[] = [];

    DISCREPANCY_RULES.forEach((rule) => {
      rule.triggers.forEach((trigger) => {
        if (trigger.in !== "lcText") return;
        trigger.matchAny.forEach((pattern) => {
          const idx = lower.indexOf(pattern.toLowerCase());
          if (idx !== -1) {
            const start = Math.max(0, idx - 20);
            const end = Math.min(lcText.length, idx + pattern.length + 20);
            const snippet = lcText.slice(start, end);
            const already = found.some(
              (f) => f.rule.id === rule.id && f.matchedText === snippet,
            );
            if (!already) {
              found.push({ rule, matchedText: snippet });
            }
          }
        });
      });
    });

    return found;
  }, [lcText]);

  const errors = results.filter((r) => r.rule.severity === "error");
  const warnings = results.filter((r) => r.rule.severity === "warning");
  const manualChecks = DISCREPANCY_RULES.filter(
    (r) => r.triggers.length === 0,
  );

  return (
    <div className="max-w-[clamp(960px,92vw,1440px)] mx-auto px-6 py-8">
      <nav className="text-xs text-charcoal-soft mb-3 flex items-center gap-1">
        <Link href="/guide" className="hover:text-primary">
          가이드 홈
        </Link>
        <span>›</span>
        <Link href="/guide/trade-finance" className="hover:text-primary">
          무역금융
        </Link>
        <span>›</span>
        <span className="text-charcoal">신용장 하자 점검</span>
      </nav>

      <header className="mb-5">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          🔍 무역금융 · 도구
        </p>
        <h1 className="text-2xl font-bold mb-1">신용장 하자 점검 도구</h1>
        <p className="text-sm text-charcoal-soft leading-relaxed">
          신용장 문구를 붙여넣으면 UCP 600·ISBP 745 룰셋에 따라 독소조항·불명확 용어를 자동 점검합니다.
          서류 단계 점검 항목도 참조 가능.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-trade-lc-checker" />

      <p className="text-[11px] text-charcoal-soft bg-warn/5 border border-warn/30 rounded-lg p-2.5 mb-4 leading-relaxed">
        ⚠️ 본 도구는 영업점 빠른 점검용 보조 도구입니다. 최종 판단은 외환사업부·매입은행이 UCP 600·ISBP 745
        원문에 따라 수행해야 합니다.
      </p>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* 입력 */}
        <section className="bg-white border border-border rounded-xl p-4">
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="font-bold text-sm">📝 신용장 문구 입력</h2>
            <button
              onClick={() => setLcText(SAMPLE_TEXT)}
              className="text-[10px] text-primary hover:underline"
            >
              샘플 불러오기
            </button>
          </div>
          <textarea
            value={lcText}
            onChange={(e) => setLcText(e.target.value)}
            placeholder="MT700 전문 또는 신용장 본문을 붙여넣으세요..."
            className="w-full h-96 p-3 border border-border rounded-lg focus:outline-none focus:border-primary text-xs font-mono leading-relaxed resize-y"
            spellCheck={false}
          />
          <div className="flex items-center justify-between mt-2 text-[10px] text-charcoal-soft">
            <span>{lcText.length.toLocaleString()}자</span>
            {lcText && (
              <button
                onClick={() => setLcText("")}
                className="text-charcoal-soft hover:text-danger"
              >
                ✕ 비우기
              </button>
            )}
          </div>
        </section>

        {/* 점검 결과 */}
        <section className="bg-white border border-border rounded-xl p-4">
          <h2 className="font-bold text-sm mb-2">📋 점검 결과</h2>

          {!lcText.trim() && (
            <div className="bg-offwhite border border-border rounded-lg p-4 text-xs text-charcoal-soft text-center">
              왼쪽에 신용장 문구를 입력하면 점검 결과가 표시됩니다.
            </div>
          )}

          {lcText.trim() && results.length === 0 && (
            <div className="bg-primary/5 border border-primary/30 rounded-lg p-4 text-xs text-primary">
              ✅ 자동 룰셋에서 독소조항·불명확 용어가 발견되지 않았습니다. 단,
              아래 수동 점검 항목은 별도로 확인 필요합니다.
            </div>
          )}

          {/* 에러 */}
          {errors.length > 0 && (
            <div className="mb-3">
              <p className="text-[10px] font-medium text-danger uppercase tracking-wide mb-1.5">
                🚫 독소조항·심각 문제 ({errors.length}건)
              </p>
              <ul className="space-y-2">
                {errors.map((r, i) => (
                  <ResultCard
                    key={`${r.rule.id}-${i}`}
                    result={r}
                    color="danger"
                  />
                ))}
              </ul>
            </div>
          )}

          {/* 경고 */}
          {warnings.length > 0 && (
            <div>
              <p className="text-[10px] font-medium text-warn uppercase tracking-wide mb-1.5">
                ⚠️ 점검 권장 ({warnings.length}건)
              </p>
              <ul className="space-y-2">
                {warnings.map((r, i) => (
                  <ResultCard
                    key={`${r.rule.id}-${i}`}
                    result={r}
                    color="warn"
                  />
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>

      {/* 수동 점검 항목 */}
      <section className="mt-5">
        <h2 className="font-bold text-sm mb-2 px-1">
          ✋ 수동 점검 항목 — 서류 매입 시 확인
        </h2>
        <p className="text-[11px] text-charcoal-soft mb-3 px-1">
          자동 룰로는 잡기 어려운 항목들. 실제 서류와 대조하여 점검하세요.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {manualChecks.map((r) => (
            <div
              key={r.id}
              className="bg-white border border-border rounded-xl p-3"
            >
              <p className="text-[10px] uppercase tracking-wide text-charcoal-soft mb-1">
                {CATEGORY_LABEL[r.category]}
              </p>
              <p className="font-bold text-sm mb-1">{r.korTitle}</p>
              <p className="text-xs text-charcoal-soft leading-relaxed mb-2">
                {r.description}
              </p>
              <div className="text-[10px] text-charcoal-soft">
                {r.ucpRef && <p>📘 {r.ucpRef}</p>}
                {r.isbpRef && <p>📗 {r.isbpRef}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-offwhite border border-border rounded-xl p-4 text-xs mt-5">
        <h3 className="font-medium mb-2">🔖 점검 기준</h3>
        <ul className="space-y-1 text-charcoal-soft list-disc list-inside">
          <li>
            <strong>UCP 600 제14조 d항</strong>: 서류상의 자료는 신용장·서류·국제표준은행관행에 따라
            해석하였을 때 충돌되지 않아야 함.
          </li>
          <li>
            <strong>UCP 600 제18조 c항</strong>: 상업송장의 물품명세는 신용장상 물품명세와 일치해야 함 (엄격일치).
          </li>
          <li>
            <strong>ISBP 745 A19</strong>: 유효기일·선적기일 표기 일관성.
          </li>
          <li>
            <strong>독소조항 7종</strong>: PDF 연수교재 Section 2 &ldquo;개설은행 담보권을 저해하는 조건&rdquo; 인용.
          </li>
        </ul>
      </section>
    </div>
  );
}

const CATEGORY_LABEL: Record<
  (typeof DISCREPANCY_RULES)[number]["category"],
  string
> = {
  general: "일반",
  invoice: "상업송장",
  bl: "선하증권",
  awb: "항공운송장",
  insurance: "보험서류",
  draft: "환어음",
  co: "원산지증명서",
};

function ResultCard({
  result,
  color,
}: {
  result: CheckResult;
  color: "danger" | "warn";
}) {
  const cls =
    color === "danger"
      ? "bg-danger/5 border-danger/30"
      : "bg-warn/5 border-warn/30";
  return (
    <li className={`border rounded-lg p-2.5 ${cls}`}>
      <p className="text-[10px] uppercase tracking-wide text-charcoal-soft">
        {CATEGORY_LABEL[result.rule.category]}
      </p>
      <p className="font-bold text-xs mb-1">{result.rule.korTitle}</p>
      <p className="text-[11px] text-charcoal-soft leading-relaxed mb-1.5">
        {result.rule.description}
      </p>
      <code className="block bg-white border border-border rounded p-1.5 text-[10px] font-mono text-charcoal-soft leading-relaxed">
        ...{result.matchedText}...
      </code>
      <div className="flex gap-2 mt-1.5 text-[10px] text-charcoal-soft">
        {result.rule.ucpRef && <span>📘 {result.rule.ucpRef}</span>}
        {result.rule.isbpRef && <span>📗 {result.rule.isbpRef}</span>}
      </div>
    </li>
  );
}
