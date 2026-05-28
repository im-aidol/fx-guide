import Link from "next/link";
import { AdminNote } from "@/components/admin/AdminNote";
import {
  USANCE_VARIANTS,
  LC_SETTLEMENT_METHODS,
  SWIFT_MESSAGES,
  LC_OPENING_REQUIRED_DOCS,
  LG_INFO,
  TR_INFO,
  IMPORT_FEES,
} from "@/lib/data/trade-finance";

// 수입 신용장 — 일람불·기한부 / 개설 FLOW / L/G·T/R / 수수료.

export default function ImportLcPage() {
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
        <span className="text-charcoal">수입 신용장</span>
      </nav>

      <header className="mb-5">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          📥 무역금융 · 수입
        </p>
        <h1 className="text-2xl font-bold mb-1">수입 신용장 업무</h1>
        <p className="text-sm text-charcoal-soft leading-relaxed">
          일람불 vs 기한부 (S/U·B/U·D/U), 개설 FLOW, MT 전문, L/G·T/R, 결제지연이자 등 수입 LC 업무 전반.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-trade-import-lc" />

      {/* 일람불 vs 기한부 */}
      <section className="mb-5">
        <h2 className="font-bold text-sm mb-2 px-1">⏱️ 일람불 vs 기한부</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="bg-primary/5 border border-primary/30 rounded-xl p-4">
            <p className="font-bold mb-1.5 text-sm">일람불 신용장 (At Sight)</p>
            <p className="text-xs text-charcoal-soft leading-relaxed mb-2">
              내도된 선적서류가 신용장 조건과 일치하게 제시되었을 때 일람 후 대금지급을 확약하는 신용장.
            </p>
            <p className="text-[11px] bg-white border border-border rounded px-2 py-1.5">
              ⏰ <strong>결제 만기:</strong> 서류도착등록 익일로부터 5영업일 이내 결제
            </p>
          </div>
          <div className="bg-warn/5 border border-warn/30 rounded-xl p-4">
            <p className="font-bold mb-1.5 text-sm">기한부 신용장 (Usance)</p>
            <p className="text-xs text-charcoal-soft leading-relaxed mb-2">
              수입상에게 일정기간 수입대금 결제를 유예. 신용 공여 주체에 따라 S/U·B/U·D/U 3가지 중 택일.
            </p>
            <p className="text-[11px] bg-white border border-border rounded px-2 py-1.5">
              ⏰ <strong>인수 만기:</strong> 서류도착등록 익일로부터 5영업일 이내 인수 (만기일에 결제)
            </p>
          </div>
        </div>
      </section>

      {/* USANCE 3종 */}
      <section className="mb-5">
        <h2 className="font-bold text-sm mb-2 px-1">
          🏦 기한부 신용장 — 신용공여 주체 3종
        </h2>
        <div className="grid lg:grid-cols-3 gap-3">
          {USANCE_VARIANTS.map((u) => (
            <div
              key={u.id}
              className="bg-white border border-border rounded-xl p-4"
            >
              <div className="mb-2">
                <p className="font-mono font-bold text-primary text-sm">
                  {u.id}
                </p>
                <p className="font-bold text-sm">{u.korFullName}</p>
                <p className="text-[10px] text-charcoal-soft">{u.fullName}</p>
              </div>
              <div className="text-[11px] mb-2 bg-offwhite border border-border rounded p-2">
                <p>
                  <strong>신용 공여:</strong> {u.creditProvider}
                </p>
                <p>
                  <strong>Drawee:</strong> {u.drawee}
                </p>
              </div>
              <div className="text-[11px] mb-1.5">
                <p className="font-medium text-primary mb-0.5">✅ 장점</p>
                <ul className="list-disc list-inside text-charcoal-soft space-y-0.5 leading-relaxed">
                  {u.pros.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
              <div className="text-[11px]">
                <p className="font-medium text-danger mb-0.5">⚠️ 단점</p>
                <ul className="list-disc list-inside text-charcoal-soft space-y-0.5 leading-relaxed">
                  {u.cons.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-charcoal-soft mt-2 leading-relaxed bg-offwhite border border-border rounded-lg p-3">
          💡 <strong>비용 측면:</strong> B/U와 D/U는 어음 할인 인수비용·환가료를 수입상이 부담. S/U는 수출상이
          매입은행에 &lsquo;매입&rsquo; 요청하여 환가료 지급 후 자금화 → 수입상에게 유리.
        </p>
      </section>

      {/* 신용장 개설 FLOW */}
      <section className="bg-white border border-border rounded-xl p-4 mb-5">
        <h2 className="font-bold text-sm mb-3">📋 수입 신용장 개설 FLOW</h2>
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          {[
            { label: "외국환거래 약정", who: "영업점" },
            { label: "외환기본부 등록", who: "영업점" },
            { label: "외화한도 확인", who: "영업점" },
            { label: "외화한도 등록", who: "영업점" },
            { label: "수입신용장 개설", who: "영업점" },
            { label: "BPR Step 생성·센터전송", who: "영업점" },
            { label: "커버페이지·MT700 전문 작성", who: "외환사업부" },
            { label: "외신무역망 발신", who: "외환사업부" },
            { label: "통지은행으로 발신", who: "통지은행" },
          ].map((step, idx, arr) => (
            <div key={idx} className="flex items-center gap-1">
              <div
                className={[
                  "px-2.5 py-1.5 rounded border whitespace-nowrap",
                  step.who === "영업점"
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : step.who === "외환사업부"
                      ? "bg-warn/10 border-warn/30 text-warn"
                      : "bg-charcoal/10 border-charcoal/20 text-charcoal",
                ].join(" ")}
              >
                <p className="font-medium">{step.label}</p>
                <p className="text-[9px] opacity-70">{step.who}</p>
              </div>
              {idx < arr.length - 1 && (
                <span className="text-charcoal-soft">→</span>
              )}
            </div>
          ))}
        </div>
        <p className="text-[10px] text-charcoal-soft mt-3">
          📌 영업점 방문, 인터넷뱅킹, EDI로 신청 가능.
        </p>
      </section>

      {/* 개설 시 필수 서류 */}
      <section className="mb-5">
        <h2 className="font-bold text-sm mb-2 px-1">📄 개설 시 필수 서류</h2>
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-offwhite text-charcoal-soft">
              <tr className="border-b border-border">
                <Th className="w-12">필수</Th>
                <Th className="w-64">서류명</Th>
                <Th>비고</Th>
              </tr>
            </thead>
            <tbody>
              {LC_OPENING_REQUIRED_DOCS.map((d, i) => (
                <tr
                  key={d.title}
                  className={[
                    "border-b border-border last:border-0 align-top",
                    i % 2 === 1 ? "bg-offwhite/30" : "",
                  ].join(" ")}
                >
                  <td className="py-2 px-3 text-center">
                    {d.required ? (
                      <span className="bg-danger/10 text-danger text-[10px] px-1.5 py-0.5 rounded font-medium">
                        필수
                      </span>
                    ) : (
                      <span className="text-charcoal-soft text-[10px]">조건부</span>
                    )}
                  </td>
                  <td className="py-2 px-3 font-medium">{d.title}</td>
                  <td className="py-2 px-3 text-charcoal-soft leading-relaxed">
                    {d.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SWIFT 전문 */}
      <section className="mb-5">
        <h2 className="font-bold text-sm mb-2 px-1">📡 SWIFT 전문 유형</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {SWIFT_MESSAGES.map((s) => (
            <div
              key={s.type}
              className="bg-white border border-border rounded-lg p-3"
            >
              <p className="font-mono font-bold text-primary">{s.type}</p>
              <p className="text-xs font-medium">{s.korName}</p>
              <p className="text-[10px] text-charcoal-soft mt-0.5 leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 결제(상환) 방식 */}
      <section className="mb-5">
        <h2 className="font-bold text-sm mb-2 px-1">
          💱 신용장 대금 결제 방식
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {LC_SETTLEMENT_METHODS.map((m) => (
            <div
              key={m.id}
              className="bg-white border border-border rounded-xl p-3"
            >
              <p className="font-bold text-sm">{m.korTitle}</p>
              <p className="text-[10px] text-charcoal-soft">{m.engTitle}</p>
              <p className="text-xs text-charcoal-soft mt-2 leading-relaxed">
                {m.flow}
              </p>
              {m.notes && (
                <p className="text-[10px] text-warn mt-2 leading-relaxed bg-warn/5 border border-warn/20 rounded px-2 py-1">
                  ⚠️ {m.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* L/G */}
      <section className="bg-white border border-border rounded-xl p-4 mb-5">
        <h2 className="font-bold text-sm mb-2">
          🛡️ 수입물품선취보증 (L/G — Letter of Guarantee)
        </h2>
        <p className="text-xs text-charcoal-soft leading-relaxed mb-3">
          {LG_INFO.purpose}
        </p>

        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-[10px] font-medium text-charcoal-soft uppercase tracking-wide mb-1">
              필요 서류
            </p>
            <ul className="text-xs text-charcoal-soft list-disc list-inside space-y-0.5 leading-relaxed">
              {LG_INFO.requiredDocs.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-medium text-charcoal-soft uppercase tracking-wide mb-1">
              보증료
            </p>
            <ul className="text-xs text-charcoal-soft space-y-0.5 leading-relaxed">
              <li>
                <strong>요율:</strong> {LG_INFO.fee.rate}
              </li>
              <li>
                <strong>기준:</strong> {LG_INFO.fee.base}
              </li>
              <li>
                <strong>기간:</strong> {LG_INFO.fee.period}
              </li>
            </ul>
            <p className="text-[10px] text-charcoal-soft mt-2 leading-relaxed bg-offwhite border border-border rounded p-2">
              📌 {LG_INFO.fee.purpose}
            </p>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-medium text-charcoal-soft uppercase tracking-wide mb-1">
            보증금 적립 면제 (적립면제 시 반드시 T/R 선행)
          </p>
          <ul className="text-xs text-charcoal-soft list-decimal list-inside space-y-0.5 leading-relaxed">
            {LG_INFO.depositExemption.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* T/R */}
      <section className="bg-white border border-border rounded-xl p-4 mb-5">
        <h2 className="font-bold text-sm mb-2">
          📦 수입물품대도 (T/R — Trust Receipt)
        </h2>
        <p className="text-xs text-charcoal-soft leading-relaxed mb-3">
          {TR_INFO.purpose}
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-medium text-charcoal-soft uppercase tracking-wide mb-1">
              대상·시기
            </p>
            <ul className="text-xs text-charcoal-soft list-disc list-inside space-y-0.5 leading-relaxed">
              {TR_INFO.trigger.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-medium text-charcoal-soft uppercase tracking-wide mb-1">
              면제
            </p>
            <p className="text-xs text-charcoal-soft leading-relaxed">{TR_INFO.exemption}</p>
          </div>
        </div>
      </section>

      {/* 수수료 */}
      <section className="mb-5">
        <h2 className="font-bold text-sm mb-2 px-1">💰 수입 수수료·이자</h2>
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-offwhite text-charcoal-soft">
              <tr className="border-b border-border">
                <Th className="w-44">수수료명</Th>
                <Th>설명</Th>
              </tr>
            </thead>
            <tbody>
              {IMPORT_FEES.map((f, i) => (
                <tr
                  key={f.name}
                  className={[
                    "border-b border-border last:border-0 align-top",
                    i % 2 === 1 ? "bg-offwhite/30" : "",
                  ].join(" ")}
                >
                  <td className="py-2 px-3 font-medium leading-tight">
                    {f.name}
                  </td>
                  <td className="py-2 px-3 text-charcoal-soft leading-relaxed">
                    <p>{f.description}</p>
                    {f.target && (
                      <p className="text-[10px] mt-1">
                        <strong>대상:</strong> {f.target}
                      </p>
                    )}
                    {f.period && (
                      <p className="text-[10px]">
                        <strong>기간:</strong> {f.period}
                      </p>
                    )}
                    {f.rate && (
                      <p className="text-[10px]">
                        <strong>요율:</strong> {f.rate}
                      </p>
                    )}
                    {f.note && (
                      <p className="text-[10px] mt-1 text-warn">📌 {f.note}</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 만기/대지급/부도 */}
      <section className="bg-white border border-border rounded-xl p-4 mb-5">
        <h2 className="font-bold text-sm mb-2">⚖️ 대지급 · 만기연장 · 조기상환</h2>
        <dl className="text-xs space-y-2">
          <Item
            term="대지급"
            def="수입상이 ① 하자 내용에 인수동의하거나 ② 하자 없이 송부된 운송서류를 결제만기일까지 결제하지 못한 경우 대지급 처리. A/S = 운송서류 도착 익일로부터 6영업일째, U/S = 만기일 익영업일. 사후 대외적으로 수입상 대신 당행이 매입은행에 결제, 대내적으로 업체 외환한도계좌를 연체계좌 전환."
          />
          <Item
            term="부도결제(등록)와 구분"
            def="수입상이 조건불일치한 선적서류를 결제(인수) 거절 → 부도결제(등록) 처리."
          />
          <Item
            term="만기연장"
            def="기한부 수입환어음 건별 만기연장은 원칙적 불가. 영업점장이 채권보전·법령 이상 없을 시 이해당사자 사전동의 받고 인수일로부터 최장 360일 이내 예외적 취급 가능."
          />
          <Item
            term="조기상환"
            def="원 만기일까지 선취한 내국수입유산스 이자 환출. D/U·S/U·B/U 모두 적용."
          />
        </dl>
      </section>

      <div className="grid sm:grid-cols-2 gap-3">
        <Link
          href="/guide/trade-finance/lc-fields"
          className="bg-primary/5 border border-primary/30 rounded-xl p-3 hover:border-primary transition group"
        >
          <p className="font-bold text-sm group-hover:text-primary transition">
            📑 신용장 19개 필드 가이드 →
          </p>
          <p className="text-xs text-charcoal-soft mt-0.5">
            각 필드별 UCP 600·ISBP 745 근거와 작성 주의사항
          </p>
        </Link>
        <Link
          href="/guide/trade-finance/flow-lc"
          className="bg-white border border-border rounded-xl p-3 hover:border-primary transition group"
        >
          <p className="font-bold text-sm group-hover:text-primary transition">
            🗺️ 신용장 거래 흐름도 →
          </p>
          <p className="text-xs text-charcoal-soft mt-0.5">
            12단계 인터랙티브 흐름도
          </p>
        </Link>
      </div>
    </div>
  );
}

function Item({ term, def }: { term: string; def: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3 py-1 border-b border-border last:border-0">
      <dt className="font-medium sm:w-32 sm:shrink-0">{term}</dt>
      <dd className="text-charcoal-soft leading-relaxed">{def}</dd>
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
