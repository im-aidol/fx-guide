import Link from "next/link";
import { AdminNote } from "@/components/admin/AdminNote";

// 무역금융 진입판 — 영업점/본점이 수출입 업무 첫 분기로 사용.
// 1차 자료: 수출입 업무의 이해 연수교재 (HR부, 2025.06) + UCP 600 / URC 522 / ISBP 745.

type GuideCard = {
  href: string;
  icon: string;
  title: string;
  description: string;
  ruleRef?: string;
};

const MAIN_GUIDES: GuideCard[] = [
  {
    href: "/guide/trade-finance/overview",
    icon: "🌐",
    title: "수출입 업무 개요",
    description:
      "수출입 정의·INCOTERMS 2020 11조건·결제방식 분류(신용장/무신용장/송금). 무역금융 들어가기 전 큰 그림.",
    ruleRef: "대외무역법 / INCOTERMS 2020",
  },
  {
    href: "/guide/trade-finance/import-lc",
    icon: "📥",
    title: "수입 신용장 업무",
    description:
      "일람불·기한부(S/U·B/U·D/U) 구분, 개설 FLOW, MT700/707/740/747, L/G·T/R, 결제지연이자·수수료.",
    ruleRef: "UCP 600",
  },
  {
    href: "/guide/trade-finance/export-lc",
    icon: "📤",
    title: "수출 신용장 업무",
    description:
      "신용장 통지, 매입/추심(CLEAN vs 하자), 매입제한국, 7종 서류(환어음·B/L·AWB·송장 등), 부도처리.",
    ruleRef: "UCP 600 / ISBP 745",
  },
  {
    href: "/guide/trade-finance/collection",
    icon: "🔄",
    title: "추심 (D/P·D/A)",
    description:
      "무신용장 추심 — 지급인도조건(D/P) vs 인수인도조건(D/A). 은행은 중개인 역할만, 지급보증 없음.",
    ruleRef: "URC 522",
  },
  {
    href: "/guide/trade-finance/tt-import",
    icon: "💰",
    title: "T/T수입금융",
    description:
      "송금방식(T/T) 수입거래에 대한 은행 신용공여 상품. 사전·사후송금 모두 가능, USD·JPY·EUR.",
    ruleRef: "외국환거래 추가약정서[T/T수입금융]",
  },
  {
    href: "/guide/trade-finance/lc-amendment",
    icon: "📝",
    title: "신용장 조건변경",
    description:
      "MT707 전문 기반 조건변경. 당사자 전원 합의, 효력 발생 시기, 증액·감액·가격조건·필드별 ADD/DELETE/REPLACE ALL.",
    ruleRef: "UCP 600 제10조",
  },
];

const TOOLS: GuideCard[] = [
  {
    href: "/guide/trade-finance/flow-lc",
    icon: "🗺️",
    title: "신용장 거래 흐름도",
    description:
      "12단계 인터랙티브 흐름도. 각 단계 클릭 → 행위 주체·관련 서류·고객 응대 멘트 표시.",
  },
  {
    href: "/guide/trade-finance/flow-collection",
    icon: "🔁",
    title: "추심 거래 흐름도",
    description:
      "8단계 D/P·D/A 흐름도. URC 522 기반 무신용장 거래 절차.",
  },
  {
    href: "/guide/trade-finance/lc-fields",
    icon: "📑",
    title: "신용장 19개 필드 가이드",
    description:
      "각 필드의 UCP 600·ISBP 745 근거, 작성 주의사항, 하자 가능성. 신용장 개설·점검 시 참조.",
  },
  {
    href: "/guide/trade-finance/lc-checker",
    icon: "🔍",
    title: "신용장 하자 점검 도구",
    description:
      "신용장 문구 붙여넣기 → 독소조항·불명확 용어·서류 요건 자동 점검 (UCP 600·ISBP 745 룰셋).",
  },
  {
    href: "/guide/trade-finance/document-guide",
    icon: "📑",
    title: "서류별 ISBP 작성 가이드",
    description:
      "환어음·상업송장·B/L·AWB·보험증권·원산지증명서 6종 서류별 필드 가이드. 매입 시 점검 포인트.",
  },
];

const TERMS: { term: string; def: string }[] = [
  { term: "화환어음", def: "선적서류 첨부 발행 환어음" },
  { term: "무화환어음", def: "환어음에 선적서류 없이 증명서·확인서 첨부 발행" },
  {
    term: "내국신용장",
    def: "수출물품·수출용 원자재 국내 구매용 신용장",
  },
  {
    term: "선적통지부 사후송금방식 (Open Account)",
    def: "수출상 선적 + 운송서류 수입상 직접 발송, 일정기간 후 은행계좌 입금",
  },
  { term: "대도 (T/R)", def: "대금 결제 전 은행이 소유권 유지한 채 수입화물 처분 허용" },
  { term: "일람출급", def: "서류 제시 후 즉시 대금 지급" },
  { term: "기한부출급", def: "30·60·90일 등 일정기간 후 대금 지급" },
  {
    term: "수입화물선취보증서 (L/G)",
    def: "수입물품 도착·운송서류 미도착 시, 선하증권 대신 제출하고 화물 인도받는 보증서",
  },
];

export default function TradeFinanceGuidePage() {
  return (
    <div className="max-w-[clamp(960px,92vw,1440px)] mx-auto px-6 py-8">
      <nav className="text-xs text-charcoal-soft mb-3 flex items-center gap-1">
        <Link href="/guide" className="hover:text-primary">
          가이드 홈
        </Link>
        <span>›</span>
        <span className="text-charcoal">무역금융</span>
      </nav>

      <header className="mb-5">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          🏭 무역금융
        </p>
        <h1 className="text-2xl font-bold mb-1">수출입·신용장·추심</h1>
        <p className="text-sm text-charcoal-soft leading-relaxed">
          UCP 600·ISBP 745·URC 522·INCOTERMS 2020 기반. 외국환거래약정서로 시작하는 무역금융 거래
          전반.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-trade-finance" />

      {/* 시작 — 외국환거래약정서 */}
      <section className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
        <h2 className="font-bold mb-2 text-sm">
          📑 영업점 첫 단계 — 외국환거래약정서
        </h2>
        <p className="text-xs text-charcoal mb-2 leading-relaxed">
          무역회사 고객과 처음 거래 시 받는 기본 약정서. 이 약정 하에 모든 후속 거래(신용장 개설·매입·결제)가
          적용됨.
        </p>
        <p className="text-xs text-charcoal-soft">
          준용 규정: UCP(신용장통일규칙) · URC(추심에 관한 통일규칙) · URR(은행간 신용장대금상환 통일규칙) ·
          기타 국제규약 · 전자무역업무표준약관 · 은행 관련 규정.
        </p>
      </section>

      {/* 메인 가이드 4종 */}
      <section className="mb-5">
        <h2 className="text-[10px] font-medium text-charcoal-soft uppercase tracking-wide mb-2 px-1">
          📚 무역금융 핵심 가이드
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {MAIN_GUIDES.map((g) => (
            <CardLink key={g.href} {...g} />
          ))}
        </div>
      </section>

      {/* 도구 4종 */}
      <section className="mb-5">
        <h2 className="text-[10px] font-medium text-charcoal-soft uppercase tracking-wide mb-2 px-1">
          🛠️ 실무 도구
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {TOOLS.map((g) => (
            <CardLink key={g.href} {...g} />
          ))}
        </div>
      </section>

      {/* 주요 용어 */}
      <section className="bg-white border border-border rounded-xl p-4 mb-5">
        <h2 className="font-bold mb-3 text-sm">📖 주요 용어 (약정서 1-2조)</h2>
        <dl className="space-y-1.5 text-xs">
          {TERMS.map((t) => (
            <div
              key={t.term}
              className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3 py-1 border-b border-border last:border-0"
            >
              <dt className="font-medium sm:w-44 sm:shrink-0">{t.term}</dt>
              <dd className="text-charcoal-soft leading-relaxed">{t.def}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-offwhite border border-border rounded-xl p-4 text-xs">
        <h3 className="font-medium mb-2">📄 관련 자료·약관</h3>
        <ul className="space-y-1 text-charcoal-soft list-disc list-inside">
          <li>외국환거래약정서 (무역금융 거래 기본 약정)</li>
          <li>전자무역업무 기본약관 (전자무역 거래)</li>
          <li>외환거래 기본약관 (공통)</li>
          <li>UCP 600 (신용장통일규칙 · ICC)</li>
          <li>ISBP 745 (국제표준은행관행 · ICC)</li>
          <li>URC 522 (추심에 관한 통일규칙 · ICC)</li>
          <li>INCOTERMS 2020 (국제상업거래조건 · ICC)</li>
        </ul>
        <p className="text-[10px] text-charcoal-soft mt-3">
          출처: 2025년 상반기 중견신입행원 연수교재 &ldquo;수출입 업무의 이해&rdquo; (HR부, 2025.06) · UCP 600 ·
          ISBP 745 · URC 522 본문.
        </p>
      </section>
    </div>
  );
}

function CardLink({ href, icon, title, description, ruleRef }: GuideCard) {
  return (
    <Link
      href={href}
      className="bg-white border border-border rounded-xl p-4 hover:border-primary transition group"
    >
      <p className="font-bold text-sm group-hover:text-primary transition mb-1">
        {icon} {title}
      </p>
      <p className="text-xs text-charcoal-soft leading-relaxed">{description}</p>
      {ruleRef && (
        <p className="text-[10px] text-primary/80 mt-2 font-medium">
          🔖 {ruleRef}
        </p>
      )}
    </Link>
  );
}
