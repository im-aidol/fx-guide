import Link from "next/link";
import { AdminNote } from "@/components/admin/AdminNote";
import { TT_IMPORT_FINANCE } from "@/lib/data/trade-finance";

// T/T수입금융 — 송금방식 수입거래 신용공여 상품.

export default function TTImportPage() {
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
        <span className="text-charcoal">T/T수입금융</span>
      </nav>

      <header className="mb-5">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          💰 무역금융 · 수입금융
        </p>
        <h1 className="text-2xl font-bold mb-1">
          T/T수입금융 (송금방식 수입거래 신용공여)
        </h1>
        <p className="text-sm text-charcoal-soft leading-relaxed">
          {TT_IMPORT_FINANCE.description}
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-trade-tt-import" />

      {/* 이용대상 */}
      <section className="bg-white border border-border rounded-xl p-4 mb-4">
        <h2 className="font-bold text-sm mb-3">👥 이용대상 및 신청기준</h2>
        <dl className="text-xs space-y-2">
          <Item term="대상고객" def={TT_IMPORT_FINANCE.eligibility.customers} />
          <Item
            term="거래가능통화"
            def={TT_IMPORT_FINANCE.eligibility.currencies.join(" / ")}
          />
          <div className="border-b border-border py-1 last:border-0">
            <dt className="font-medium mb-1">대상 거래</dt>
            <dd className="text-charcoal-soft leading-relaxed">
              <ul className="list-disc list-inside space-y-0.5">
                {TT_IMPORT_FINANCE.eligibility.targets.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </dd>
          </div>
          <Item term="송금가능일자" def={TT_IMPORT_FINANCE.schedule.sendDate} />
          <Item term="신용공여기간" def={TT_IMPORT_FINANCE.schedule.creditPeriod} />
          <Item term="연장·조기상환" def={TT_IMPORT_FINANCE.schedule.extension} />
        </dl>
      </section>

      {/* 수수료 */}
      <section className="mb-4">
        <h2 className="font-bold text-sm mb-2 px-1">💸 고객 부담 비용</h2>
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-offwhite text-charcoal-soft">
              <tr className="border-b border-border">
                <Th className="w-32">수수료명</Th>
                <Th>금액·요율</Th>
                <Th className="w-24">시점</Th>
              </tr>
            </thead>
            <tbody>
              {TT_IMPORT_FINANCE.fees.map((f, i) => (
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
                    <p>{f.amount}</p>
                    {f.formula && (
                      <p className="text-[10px] mt-1 bg-offwhite border border-border rounded p-1.5 font-mono">
                        {f.formula}
                      </p>
                    )}
                  </td>
                  <td className="py-2 px-3 text-charcoal-soft">{f.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 대지급 */}
      <section className="bg-danger/5 border border-danger/30 rounded-xl p-4 mb-4">
        <h2 className="font-bold text-sm mb-2">
          ❌ {TT_IMPORT_FINANCE.default.title}
        </h2>
        <ul className="text-xs text-charcoal-soft list-disc list-inside space-y-1 leading-relaxed">
          {TT_IMPORT_FINANCE.default.rules.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </section>

      {/* 유의사항 */}
      <section className="bg-warn/5 border border-warn/30 rounded-xl p-4 mb-4">
        <h2 className="font-bold text-sm mb-2">⚠️ 기타 서비스 주요내용·유의사항</h2>
        <ul className="text-xs text-charcoal-soft list-disc list-inside space-y-1 leading-relaxed">
          {TT_IMPORT_FINANCE.cautions.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </section>

      {/* 영업점 응대 멘트 */}
      <section className="bg-primary/5 border border-primary/30 rounded-xl p-4 mb-4">
        <h2 className="font-bold text-sm mb-2">💬 영업점 응대 멘트</h2>
        <ul className="text-xs text-charcoal space-y-1.5 leading-relaxed">
          <li>
            ▶ &ldquo;송금방식(T/T) 수입거래 중이세요? 만기에 결제하시는 신용공여 상품이 있어요.&rdquo;
          </li>
          <li>
            ▶ &ldquo;사전송금이면 신청 후 2개월 이내 선적, 사후송금이면 선적일로부터 3개월 이내 지급 예정이어야 해요.&rdquo;
          </li>
          <li>
            ▶ &ldquo;신용공여기간은 송금희망일로부터 1년 이내, 신청은 송금희망일 최소 3영업일 전에 해 주세요.&rdquo;
          </li>
          <li>
            ▶ &ldquo;인수수수료는 신용등급별로 연 1.5~2.3%이고, 해외인수은행이 청구하는 A/D Charge가 별도예요.&rdquo;
          </li>
        </ul>
      </section>

      <section className="bg-offwhite border border-border rounded-xl p-4 text-xs">
        <h3 className="font-medium mb-2">📄 적용 약정·법규</h3>
        <p className="text-charcoal-soft leading-relaxed">
          {TT_IMPORT_FINANCE.contractRef}
        </p>
        <p className="text-[10px] text-charcoal-soft mt-3">
          출처: {TT_IMPORT_FINANCE.source}
        </p>
      </section>

      <div className="grid sm:grid-cols-2 gap-3 mt-4">
        <Link
          href="/guide/trade-finance/import-lc"
          className="bg-white border border-border rounded-xl p-3 hover:border-primary transition group"
        >
          <p className="font-bold text-sm group-hover:text-primary transition">
            📥 수입 신용장 가이드 →
          </p>
          <p className="text-xs text-charcoal-soft mt-0.5">
            신용장 방식 수입거래 (B/U·D/U·S/U)
          </p>
        </Link>
        <Link
          href="/guide/trade-finance"
          className="bg-white border border-border rounded-xl p-3 hover:border-primary transition group"
        >
          <p className="font-bold text-sm group-hover:text-primary transition">
            ← 무역금융 진입판
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
