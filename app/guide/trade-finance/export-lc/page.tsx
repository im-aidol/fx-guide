import Link from "next/link";
import { AdminNote } from "@/components/admin/AdminNote";
import {
  SHIPPING_DOCUMENTS,
  EXPORT_NEGO_VS_COLLECTION,
  EXPORT_DEFAULT_HANDLING,
} from "@/lib/data/trade-finance";

// 수출 신용장 — 통지·매입·추심·부도처리·서류 7종.

export default function ExportLcPage() {
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
        <span className="text-charcoal">수출 신용장</span>
      </nav>

      <header className="mb-5">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          📤 무역금융 · 수출
        </p>
        <h1 className="text-2xl font-bold mb-1">수출 신용장 업무</h1>
        <p className="text-sm text-charcoal-soft leading-relaxed">
          신용장 통지 → 매입/추심(CLEAN vs 하자) → 매입제한국 → 7종 서류 점검 → 부도처리.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-trade-export-lc" />

      {/* 통지 */}
      <section className="bg-white border border-border rounded-xl p-4 mb-5">
        <h2 className="font-bold text-sm mb-2">📬 신용장 통지 (Advising)</h2>
        <p className="text-xs text-charcoal-soft leading-relaxed mb-3">
          신용장 개설은행의 의뢰에 의하여 통지은행이 신용장의 개설사실을 수익자에게 통지하는 것.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div>
            <p className="font-medium mb-1">통지의 종류</p>
            <ul className="text-charcoal-soft list-disc list-inside leading-relaxed">
              <li>우편신용장 통지</li>
              <li>전신신용장 통지</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">통지 절차</p>
            <ul className="text-charcoal-soft list-disc list-inside leading-relaxed">
              <li>신속히 수익자에게 신용장 도착 통지</li>
              <li>
                「ORIGINAL」 각 장 날인 + 책임자 서명·직인 + 신용장 각 장간 간인 + 『수출 신용장
                접수증』 징구
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-3 grid sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-offwhite border border-border rounded-lg p-2.5">
            <p className="font-medium mb-1">📝 조건변경·취소</p>
            <ul className="text-charcoal-soft list-disc list-inside leading-relaxed space-y-0.5">
              <li>고객 통지는 신용장 교부 절차에 따름</li>
              <li>
                조건변경 부분적 동의 불가 — 전체 승낙·거절 중 선택 (UCP 600 제10조)
              </li>
              <li>수익자 동의 유보 시 조건변경 불성립</li>
              <li>
                BUT 변경된 내용 일치 서류 제시 시 동의로 간주
              </li>
              <li>취소 시 「수출신용장 취소 동의(의뢰)서」 추가 징구 + 신용장 원본 회수</li>
            </ul>
          </div>
          <div className="bg-offwhite border border-border rounded-lg p-2.5">
            <p className="font-medium mb-1">🗂️ 분실·훼손</p>
            <ul className="text-charcoal-soft list-disc list-inside leading-relaxed space-y-0.5">
              <li>분실 신고 후 주무부서를 통해 국내 각 외국환은행에 통보</li>
              <li>분실재발급/훼손재발급: &ldquo;원본대조필&rdquo; 날인된 사본 교부</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 매입 vs 추심 */}
      <section className="mb-5">
        <h2 className="font-bold text-sm mb-2 px-1">
          💱 수출환어음 매입 vs 추심
        </h2>
        <div className="bg-white border border-border rounded-xl p-4 mb-3">
          <p className="font-bold mb-1 text-sm">
            {EXPORT_NEGO_VS_COLLECTION.nego.title}
          </p>
          <p className="text-xs text-charcoal-soft leading-relaxed">
            {EXPORT_NEGO_VS_COLLECTION.nego.description}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="bg-primary/5 border border-primary/30 rounded-xl p-4">
            <p className="font-bold text-sm mb-1.5">
              ✅ {EXPORT_NEGO_VS_COLLECTION.clean.title}
            </p>
            <p className="text-xs text-charcoal-soft leading-relaxed">
              {EXPORT_NEGO_VS_COLLECTION.clean.description}
            </p>
          </div>
          <div className="bg-danger/5 border border-danger/30 rounded-xl p-4">
            <p className="font-bold text-sm mb-1.5">
              ⚠️ {EXPORT_NEGO_VS_COLLECTION.discrepancy.title}
            </p>
            <p className="text-xs text-charcoal-soft leading-relaxed mb-2">
              {EXPORT_NEGO_VS_COLLECTION.discrepancy.description}
            </p>
            <ol className="text-[11px] text-charcoal-soft list-decimal list-inside space-y-0.5 bg-white border border-border rounded p-2">
              {EXPORT_NEGO_VS_COLLECTION.discrepancy.handling.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ol>
          </div>
        </div>

        <div className="bg-warn/5 border border-warn/30 rounded-xl p-4 mt-3">
          <p className="font-bold text-sm mb-1.5">
            🚫 {EXPORT_NEGO_VS_COLLECTION.collectionLimitCountries.title}
          </p>
          <p className="text-xs text-charcoal-soft leading-relaxed mb-2">
            {EXPORT_NEGO_VS_COLLECTION.collectionLimitCountries.description}
          </p>
          <ul className="text-[11px] text-charcoal-soft list-disc list-inside space-y-0.5 bg-white border border-border rounded p-2">
            {EXPORT_NEGO_VS_COLLECTION.collectionLimitCountries.exceptions.map(
              (e, i) => (
                <li key={i}>{e}</li>
              ),
            )}
          </ul>
          <p className="text-[10px] text-charcoal-soft mt-2">
            📌 매입제한 국가는 NEXPIA 7052 국가정보 조회로 확인.
          </p>
        </div>
      </section>

      {/* 매입 전결권 */}
      <section className="bg-white border border-border rounded-xl p-4 mb-5">
        <h2 className="font-bold text-sm mb-2">⚖️ 수출환어음의 추심·매입 전결권</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-offwhite text-charcoal-soft">
              <tr className="border-b border-border">
                <Th>구분</Th>
                <Th>책임자</Th>
                <Th>영업점장</Th>
                <Th>부서장</Th>
                <Th>본부장</Th>
              </tr>
            </thead>
            <tbody className="text-charcoal">
              <tr className="border-b border-border">
                <td className="py-2 px-3 font-medium">추심</td>
                <td className="py-2 px-3">전결</td>
                <td className="py-2 px-3">영업점장</td>
                <td className="py-2 px-3 text-charcoal-soft">—</td>
                <td className="py-2 px-3 text-charcoal-soft">—</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 px-3 font-medium">매입 – CLEAN</td>
                <td className="py-2 px-3">100</td>
                <td className="py-2 px-3 text-charcoal-soft">—</td>
                <td className="py-2 px-3 text-charcoal-soft">—</td>
                <td className="py-2 px-3 text-charcoal-soft">—</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium">매입 – 하자</td>
                <td className="py-2 px-3 text-charcoal-soft">—</td>
                <td className="py-2 px-3">전결</td>
                <td className="py-2 px-3">300 / 400</td>
                <td className="py-2 px-3">전결</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-charcoal-soft mt-2 leading-relaxed">
          📌 수출환어음의 추심 전 매입건의 경우 당행 신용 7등급 이하, 자산건전성 요주의 이하, 워크아웃·화의개시·법정관리
          업체의 경우 하자여부 상관없이 보증부(하자)의 전결권 적용.
        </p>
        <div className="mt-3 bg-offwhite border border-border rounded-lg p-3 text-[11px]">
          <p className="font-medium mb-1">하자매입 잔액 한도 (상장법인 또는 직수출입 실적 1천만미불 이상)</p>
          <ul className="text-charcoal-soft list-disc list-inside leading-relaxed space-y-0.5">
            <li>신용 5+ 등급 이상: 2,000 천미불 이하</li>
            <li>신용 5등급 이하: 1,000 천미불 이하</li>
          </ul>
        </div>
      </section>

      {/* 서류 7종 */}
      <section className="mb-5">
        <h2 className="font-bold text-sm mb-2 px-1">📑 수출환어음 서류 7종</h2>
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-offwhite text-charcoal-soft">
              <tr className="border-b border-border">
                <Th className="w-32">서류명</Th>
                <Th>설명</Th>
                <Th className="w-32">UCP / ISBP</Th>
              </tr>
            </thead>
            <tbody>
              {SHIPPING_DOCUMENTS.map((d, i) => (
                <tr
                  key={d.korName}
                  className={[
                    "border-b border-border last:border-0 align-top",
                    i % 2 === 1 ? "bg-offwhite/30" : "",
                  ].join(" ")}
                >
                  <td className="py-2 px-3 leading-tight">
                    <p className="font-medium">{d.korName}</p>
                    <p className="text-[10px] text-charcoal-soft">
                      {d.engName}
                    </p>
                  </td>
                  <td className="py-2 px-3 text-charcoal-soft leading-relaxed">
                    {d.description}
                  </td>
                  <td className="py-2 px-3 text-[10px] text-charcoal-soft leading-tight">
                    {d.ucpRef && <p>📘 {d.ucpRef}</p>}
                    {d.isbpRef && <p>📗 {d.isbpRef}</p>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 부도처리 */}
      <section className="bg-danger/5 border border-danger/30 rounded-xl p-4 mb-5">
        <h2 className="font-bold text-sm mb-2">
          ❌ {EXPORT_DEFAULT_HANDLING.title}
        </h2>
        <p className="text-xs text-charcoal-soft leading-relaxed mb-3">
          {EXPORT_DEFAULT_HANDLING.trigger}
        </p>

        <p className="text-[10px] font-medium text-charcoal-soft uppercase tracking-wide mb-1">
          부도처리 대상·시기
        </p>
        <div className="bg-white border border-border rounded-lg overflow-hidden mb-3">
          <table className="w-full text-xs">
            <thead className="bg-offwhite text-charcoal-soft">
              <tr className="border-b border-border">
                <Th>구분</Th>
                <Th>시기</Th>
              </tr>
            </thead>
            <tbody>
              {EXPORT_DEFAULT_HANDLING.cases.map((c, i) => (
                <tr
                  key={c.type}
                  className={[
                    "border-b border-border last:border-0 align-top",
                    i % 2 === 1 ? "bg-offwhite/30" : "",
                  ].join(" ")}
                >
                  <td className="py-2 px-3 font-medium leading-tight">{c.type}</td>
                  <td className="py-2 px-3 text-charcoal-soft leading-relaxed">
                    {c.timing}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[10px] font-medium text-charcoal-soft uppercase tracking-wide mb-1">
          부도처리 유예
        </p>
        <ul className="text-xs text-charcoal-soft list-decimal list-inside space-y-0.5 leading-relaxed">
          {EXPORT_DEFAULT_HANDLING.grace.map((g, i) => (
            <li key={i}>{g}</li>
          ))}
        </ul>
      </section>

      <div className="grid sm:grid-cols-2 gap-3">
        <Link
          href="/guide/trade-finance/lc-checker"
          className="bg-primary/5 border border-primary/30 rounded-xl p-3 hover:border-primary transition group"
        >
          <p className="font-bold text-sm group-hover:text-primary transition">
            🔍 신용장 하자 점검 도구 →
          </p>
          <p className="text-xs text-charcoal-soft mt-0.5">
            서류 매입 전 UCP 600·ISBP 745 룰 자동 점검
          </p>
        </Link>
        <Link
          href="/guide/trade-finance/collection"
          className="bg-white border border-border rounded-xl p-3 hover:border-primary transition group"
        >
          <p className="font-bold text-sm group-hover:text-primary transition">
            🔄 추심 가이드 (D/P·D/A) →
          </p>
          <p className="text-xs text-charcoal-soft mt-0.5">
            URC 522 기반 무신용장 거래
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
