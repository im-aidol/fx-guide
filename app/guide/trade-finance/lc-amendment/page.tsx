import Link from "next/link";
import { AdminNote } from "@/components/admin/AdminNote";
import { LC_AMENDMENT } from "@/lib/data/trade-finance";

// 신용장 조건변경 (Amendment) — MT707 전문 기반.

export default function LcAmendmentPage() {
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
        <span className="text-charcoal">신용장 조건변경</span>
      </nav>

      <header className="mb-5">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          📝 무역금융 · 수입
        </p>
        <h1 className="text-2xl font-bold mb-1">
          신용장 조건변경 (Amendment)
        </h1>
        <p className="text-sm text-charcoal-soft leading-relaxed">
          {LC_AMENDMENT.definition}
        </p>
        <p className="text-xs text-primary font-medium mt-1">
          🔖 {LC_AMENDMENT.swiftMessage}
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-trade-lc-amendment" />

      {/* 당사자 */}
      <section className="grid sm:grid-cols-2 gap-3 mb-4">
        <div className="bg-primary/5 border border-primary/30 rounded-xl p-4">
          <h2 className="font-bold text-sm mb-2">
            ✅ 조건변경의 당사자 (전원 합의 필요)
          </h2>
          <p className="text-[10px] text-charcoal-soft mb-2">
            UCP 600 제10조 — 당사자 전원의 합의가 있어야 효력 발생.
          </p>
          <ul className="text-xs text-charcoal-soft list-disc list-inside space-y-1 leading-relaxed">
            {LC_AMENDMENT.parties.required.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
        <div className="bg-warn/5 border border-warn/30 rounded-xl p-4">
          <h2 className="font-bold text-sm mb-2">⚠️ 당사자가 아닌 자</h2>
          <ul className="text-xs text-charcoal-soft list-disc list-inside space-y-1 leading-relaxed">
            {LC_AMENDMENT.parties.notParty.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 효력 발생 시기 */}
      <section className="bg-white border border-border rounded-xl p-4 mb-4">
        <h2 className="font-bold text-sm mb-3">⏱️ 조건변경의 효력 발생 시기</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-offwhite text-charcoal-soft">
              <tr className="border-b border-border">
                <Th>상황</Th>
                <Th className="w-20 text-center">효력</Th>
                <Th>비고</Th>
              </tr>
            </thead>
            <tbody>
              {LC_AMENDMENT.effectiveTiming.map((t, i) => (
                <tr
                  key={i}
                  className={[
                    "border-b border-border last:border-0 align-top",
                    i % 2 === 1 ? "bg-offwhite/30" : "",
                  ].join(" ")}
                >
                  <td className="py-2 px-3 leading-relaxed text-charcoal">
                    {t.situation}
                  </td>
                  <td className="py-2 px-3 text-center">
                    {t.effective ? (
                      <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded font-medium">
                        O
                      </span>
                    ) : (
                      <span className="bg-charcoal/10 text-charcoal-soft text-[10px] px-2 py-0.5 rounded font-medium">
                        X
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-charcoal-soft leading-relaxed">
                    {t.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-charcoal-soft mt-3 leading-relaxed bg-danger/5 border border-danger/30 rounded-lg p-3">
          🚫 <strong>부분적 수락 금지:</strong> {LC_AMENDMENT.partialAcceptance}
        </p>
      </section>

      {/* 필드별 변경 가이드 */}
      <section className="mb-4">
        <h2 className="font-bold text-sm mb-2 px-1">
          🔧 MT707 필드별 조건변경 가이드
        </h2>
        <div className="space-y-3">
          {LC_AMENDMENT.fields.map((g) => (
            <div
              key={g.group}
              className="bg-white border border-border rounded-xl overflow-hidden"
            >
              <div className="bg-offwhite px-3 py-2 border-b border-border">
                <p className="text-xs font-bold text-charcoal">{g.group}</p>
              </div>
              <table className="w-full text-xs">
                <tbody>
                  {g.items.map((item, i) => (
                    <tr
                      key={item.name}
                      className={[
                        "border-b border-border last:border-0 align-top",
                        i % 2 === 1 ? "bg-offwhite/30" : "",
                      ].join(" ")}
                    >
                      <td className="py-2 px-3 font-mono font-medium w-56 align-top leading-tight">
                        {item.name}
                      </td>
                      <td className="py-2 px-3 text-charcoal-soft leading-relaxed">
                        {item.desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </section>

      {/* 영업점 응대 멘트 */}
      <section className="bg-primary/5 border border-primary/30 rounded-xl p-4 mb-4">
        <h2 className="font-bold text-sm mb-2">💬 영업점 응대 멘트</h2>
        <ul className="text-xs text-charcoal space-y-1.5 leading-relaxed">
          <li>
            ▶ &ldquo;조건변경은 개설은행·확인은행·수익자 전원의 합의가 필요해요. 수출상 동의 없이는 변경되지 않아요.&rdquo;
          </li>
          <li>
            ▶ &ldquo;증액하실 경우 한도잔액 확인이 먼저예요. 부족하면 보증금을 추가 적립하셔야 해요.&rdquo;
          </li>
          <li>
            ▶ &ldquo;수입자 부보 조건이시면 증액분만큼 추가 보험가입하고 보험증권 원본도 가져와 주세요.&rdquo;
          </li>
          <li>
            ▶ &ldquo;가격조건(FOB → CIF 등) 바꾸시면 운임·보험서류·도착지 등 연결된 항목도 함께 확인해야 해요.&rdquo;
          </li>
          <li>
            ▶ &ldquo;감액은 수출상 동의 전문 받은 뒤에 변경 거래 가능해요. ALIOS-대외전문송신의뢰서(수입)로 발신해요.&rdquo;
          </li>
        </ul>
      </section>

      <div className="grid sm:grid-cols-2 gap-3 mt-4">
        <Link
          href="/guide/trade-finance/import-lc"
          className="bg-white border border-border rounded-xl p-3 hover:border-primary transition group"
        >
          <p className="font-bold text-sm group-hover:text-primary transition">
            📥 수입 신용장 가이드 →
          </p>
        </Link>
        <Link
          href="/guide/trade-finance/lc-fields"
          className="bg-white border border-border rounded-xl p-3 hover:border-primary transition group"
        >
          <p className="font-bold text-sm group-hover:text-primary transition">
            📑 신용장 19개 필드 →
          </p>
        </Link>
      </div>
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
