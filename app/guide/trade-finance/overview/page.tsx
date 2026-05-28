import Link from "next/link";
import { AdminNote } from "@/components/admin/AdminNote";
import {
  INCOTERMS_2020,
  SETTLEMENT_METHODS,
} from "@/lib/data/trade-finance";

// 수출입 업무 개요 — INCOTERMS 2020 + 결제방식 분류.

export default function TradeOverviewPage() {
  const seaIncoterms = INCOTERMS_2020.filter((i) => i.transport === "sea-only");
  const anyIncoterms = INCOTERMS_2020.filter((i) => i.transport === "any");
  const lcMethods = SETTLEMENT_METHODS.filter((m) => m.parent === "lc");
  const collectionMethods = SETTLEMENT_METHODS.filter(
    (m) => m.parent === "collection",
  );
  const remittanceMethods = SETTLEMENT_METHODS.filter(
    (m) => m.parent === "remittance",
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
        <span className="text-charcoal">수출입 업무 개요</span>
      </nav>

      <header className="mb-5">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          🌐 무역금융 · 개요
        </p>
        <h1 className="text-2xl font-bold mb-1">수출입 업무 개요</h1>
        <p className="text-sm text-charcoal-soft">
          수출입 정의 · INCOTERMS 2020 11조건 · 결제방식 분류. 신용장·추심·송금 진입 전 큰 그림.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-trade-overview" />

      {/* 수출입 정의 */}
      <section className="bg-white border border-border rounded-xl p-4 mb-4">
        <h2 className="font-bold mb-3 text-sm">📦 수출입 정의 (대외무역법 2조 1호)</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="border-l-2 border-primary/40 pl-3">
            <p className="font-medium text-sm mb-1">수출 (Export)</p>
            <ul className="text-xs text-charcoal-soft leading-relaxed list-disc list-inside space-y-0.5">
              <li>국내에서 외국으로 물품 이동 (매매·교환·임대차·증여 등)</li>
              <li>유상으로 외국에서 외국으로 물품 인도 (외국인도수출·중계무역)</li>
              <li>거주자가 비거주자에게 특정 용역 제공 또는 전자적 형태 무체물 통신망 전송·인도</li>
            </ul>
          </div>
          <div className="border-l-2 border-primary/40 pl-3">
            <p className="font-medium text-sm mb-1">수입 (Import)</p>
            <ul className="text-xs text-charcoal-soft leading-relaxed list-disc list-inside space-y-0.5">
              <li>외국으로부터 국내로 물품 이동</li>
              <li>유상으로 외국에서 외국으로부터 물품 인수 (외국인수수입)</li>
              <li>거주자가 비거주자에게 특정 용역 제공받거나 전자적 형태 무체물 수신·인수</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 특수무역 형태 */}
      <section className="bg-white border border-border rounded-xl p-4 mb-4">
        <h2 className="font-bold mb-3 text-sm">🔁 특수 무역 형태</h2>
        <dl className="text-xs space-y-2">
          <Item
            term="중계무역 (Intermediary Trade)"
            def="매매차익 목적. 제3국 물품을 자신 명의로 매입·재판매."
          />
          <Item
            term="중개무역 (Merchandising Trade)"
            def="중개수수료 수취 목적. 무역외 거래."
          />
          <Item
            term="외국인도수출"
            def="국내로 통관되지 않은 물품을 외국으로 인도. 대금은 국내 수령. (위탁가공무역 등)"
          />
          <Item
            term="외국인수수입"
            def="수입대금은 국내에서 지급. 수입물품은 외국에서 인수. (해외 필요 기재자 조달 등)"
          />
          <Item
            term="위탁가공무역"
            def="가공임 지급 조건으로 원료 일부/전부를 거래상대방에 유·무상 수출 → 가공 후 다시 국내 수입 또는 외국 판매."
          />
          <Item
            term="수탁가공무역"
            def="가득액 영수 위해 원자재를 거래상대방 위탁으로 수입 → 가공 후 위탁자에 수출."
          />
        </dl>
      </section>

      {/* INCOTERMS 2020 */}
      <section className="mb-4">
        <h2 className="font-bold mb-2 text-sm px-1">
          📐 INCOTERMS 2020 — 11가지 가격조건
        </h2>
        <p className="text-xs text-charcoal-soft mb-3 px-1 leading-relaxed">
          위험부담의 분기점·운송수단·운임 부담 주체·보험 가입 주체·통관 의무 당사자를 정함.
          수출상이 위험·비용을 어디까지 부담하는지가 핵심.
        </p>

        <div className="grid lg:grid-cols-2 gap-3">
          {/* 해상 전용 */}
          <div className="bg-white border border-border rounded-xl overflow-hidden">
            <div className="bg-offwhite px-3 py-2 border-b border-border">
              <p className="text-[10px] font-medium text-charcoal-soft uppercase tracking-wide">
                🚢 해상·내수로 전용 (4종)
              </p>
            </div>
            <table className="w-full text-xs">
              <thead className="bg-offwhite/50 text-charcoal-soft">
                <tr className="border-b border-border">
                  <Th>코드</Th>
                  <Th>한글명</Th>
                  <Th>위험 이전</Th>
                  <Th>보험</Th>
                </tr>
              </thead>
              <tbody>
                {seaIncoterms.map((i, idx) => (
                  <IncotermRow key={i.code} incoterm={i} striped={idx % 2 === 1} />
                ))}
              </tbody>
            </table>
          </div>

          {/* 모든 운송수단 */}
          <div className="bg-white border border-border rounded-xl overflow-hidden">
            <div className="bg-offwhite px-3 py-2 border-b border-border">
              <p className="text-[10px] font-medium text-charcoal-soft uppercase tracking-wide">
                ✈️ 모든 운송수단 (7종)
              </p>
            </div>
            <table className="w-full text-xs">
              <thead className="bg-offwhite/50 text-charcoal-soft">
                <tr className="border-b border-border">
                  <Th>코드</Th>
                  <Th>한글명</Th>
                  <Th>위험 이전</Th>
                  <Th>보험</Th>
                </tr>
              </thead>
              <tbody>
                {anyIncoterms.map((i, idx) => (
                  <IncotermRow key={i.code} incoterm={i} striped={idx % 2 === 1} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-3 grid sm:grid-cols-2 gap-2 text-[11px]">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-2.5">
            <p className="font-medium mb-1">📍 운임 표기</p>
            <p className="text-charcoal-soft leading-relaxed">
              <strong>COLLECT</strong> = 수입상 후불 + 출발지 가격조건<br />
              <strong>PREPAID</strong> = 수출상 선불 + 도착지 가격조건
            </p>
          </div>
          <div className="bg-warn/5 border border-warn/30 rounded-lg p-2.5">
            <p className="font-medium mb-1">🛡️ 보험 가입 주체</p>
            <p className="text-charcoal-soft leading-relaxed">
              <strong>매도인 부보(CIF·CIP·D조건)</strong> = L/C상 보험서류 요구<br />
              <strong>매수인 부보(FOB·EXW 등)</strong> = 개설 당일 보험증권 징구
            </p>
          </div>
        </div>
      </section>

      {/* 결제방식 분류 */}
      <section className="mb-4">
        <h2 className="font-bold mb-2 text-sm px-1">💸 결제방식 분류</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <MethodCard
            color="primary"
            title="신용장방식 (L/C)"
            sub="Documentary Credit"
            rule="UCP 600 적용"
            methods={lcMethods.map((m) => ({
              title: m.korTitle,
              sub: m.engTitle,
              desc: m.description,
            }))}
            link={{ href: "/guide/trade-finance/import-lc", label: "수입 LC 가이드 →" }}
          />
          <MethodCard
            color="warn"
            title="무신용장방식 (추심)"
            sub="Collection"
            rule="URC 522 적용"
            methods={collectionMethods.map((m) => ({
              title: m.korTitle,
              sub: m.engTitle,
              desc: m.description,
            }))}
            link={{
              href: "/guide/trade-finance/collection",
              label: "추심 가이드 →",
            }}
          />
          <MethodCard
            color="info"
            title="송금방식"
            sub="Remittance"
            rule="당발·타발 송금"
            methods={remittanceMethods.map((m) => ({
              title: m.korTitle,
              sub: m.engTitle,
              desc: m.description,
            }))}
            link={{ href: "/simulator", label: "당발송금 도우미 →" }}
          />
        </div>
      </section>

      <section className="bg-offwhite border border-border rounded-xl p-4 text-xs">
        <p className="text-charcoal-soft">
          출처: 수출입 업무의 이해 연수교재 (HR부, 2025.06) Section 1 · INCOTERMS 2020 · UCP 600 · URC
          522.
        </p>
      </section>
    </div>
  );
}

function Item({ term, def }: { term: string; def: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3 py-1 border-b border-border last:border-0">
      <dt className="font-medium sm:w-44 sm:shrink-0">{term}</dt>
      <dd className="text-charcoal-soft leading-relaxed">{def}</dd>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left py-2 px-3 uppercase tracking-wide text-[10px] font-medium">
      {children}
    </th>
  );
}

function IncotermRow({
  incoterm: i,
  striped,
}: {
  incoterm: (typeof INCOTERMS_2020)[number];
  striped: boolean;
}) {
  return (
    <tr
      className={[
        "border-b border-border last:border-0 align-top",
        striped ? "bg-offwhite/30" : "",
      ].join(" ")}
    >
      <td className="py-2 px-3 font-mono font-semibold">{i.code}</td>
      <td className="py-2 px-3 leading-tight">
        <p className="font-medium">{i.korName}</p>
        <p className="text-[10px] text-charcoal-soft">{i.name}</p>
      </td>
      <td className="py-2 px-3 leading-tight text-charcoal-soft">
        {i.riskTransferPoint}
      </td>
      <td className="py-2 px-3 text-center">
        {i.insuranceRequired ? (
          <span className="text-primary font-medium">매도인</span>
        ) : (
          <span className="text-charcoal-soft">매수인</span>
        )}
      </td>
    </tr>
  );
}

function MethodCard({
  color,
  title,
  sub,
  rule,
  methods,
  link,
}: {
  color: "primary" | "warn" | "info";
  title: string;
  sub: string;
  rule: string;
  methods: { title: string; sub: string; desc: string }[];
  link: { href: string; label: string };
}) {
  const colorCls = {
    primary: "bg-primary/5 border-primary/30 text-primary",
    warn: "bg-warn/5 border-warn/30 text-warn",
    info: "bg-charcoal/5 border-charcoal/20 text-charcoal",
  }[color];

  return (
    <div className={`border rounded-xl overflow-hidden ${colorCls.split(" ").slice(0, 2).join(" ")}`}>
      <div className={`px-4 py-2.5 ${colorCls.split(" ").slice(0, 2).join(" ")} border-b ${colorCls.split(" ")[1]}`}>
        <p className={`font-bold text-sm ${colorCls.split(" ")[2]}`}>{title}</p>
        <p className="text-[10px] text-charcoal-soft">{sub} · {rule}</p>
      </div>
      <div className="bg-white px-3 py-2 space-y-1.5">
        {methods.map((m) => (
          <div key={m.title} className="text-xs border-b border-border last:border-0 pb-1.5 last:pb-0">
            <p className="font-medium">{m.title}</p>
            <p className="text-[10px] text-charcoal-soft">{m.sub}</p>
            <p className="text-[11px] text-charcoal-soft leading-relaxed mt-0.5">
              {m.desc}
            </p>
          </div>
        ))}
        <Link
          href={link.href}
          className={`block text-center text-[11px] font-medium ${colorCls.split(" ")[2]} hover:underline pt-1`}
        >
          {link.label}
        </Link>
      </div>
    </div>
  );
}
