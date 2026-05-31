import Link from "next/link";
import { AdminNote } from "@/components/admin/AdminNote";

// 타발 송금 진입판 — 다른 카테고리(/guide/send, /guide/exchange 등)와 일관된 카드형.

type GuideCard = {
  href: string;
  icon: string;
  title: string;
  description: string;
};

const MAIN_CARDS: GuideCard[] = [
  {
    href: "/guide/receive/swift",
    icon: "🏦",
    title: "iM뱅크 수취 정보 (SWIFT/BIC)",
    description:
      "해외 송금자에게 전달할 영문 은행 정보. SWIFT DAEBKR22 + 은행명·주소.",
  },
  {
    href: "/guide/receive/thresholds",
    icon: "📏",
    title: "수취 임계값 가이드",
    description:
      "5천불 이하·5천~10만불·10만불 초과 거래입증서류 요건 + 1만불 초과 국세청 자동 통보.",
  },
  {
    href: "/guide/receive/wu",
    icon: "⚡",
    title: "웨스턴유니온 (WU) 수령",
    description:
      "신분증 + MTCN 필수, 건당 USD 7,000, AML 점검, 45일 환급 등 약관 본문.",
  },
  {
    href: "/guide/receive/print-card",
    icon: "🖨️",
    title: "인쇄용 고객 안내서",
    description:
      "수취인 영문 정보 입력 → 인쇄해서 고객에게 전달. 송금자에게 그대로 보내드릴 수 있는 양식.",
  },
];

export default function ReceiveGuidePage() {
  return (
    <div className="max-w-[clamp(960px,92vw,1440px)] mx-auto px-6 py-8">
      <nav className="text-xs text-charcoal-soft mb-3 flex items-center gap-1">
        <Link href="/guide" className="hover:text-primary">
          가이드 홈
        </Link>
        <span>›</span>
        <span className="text-charcoal">타발 송금</span>
      </nav>

      <header className="mb-5">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          📥 타발 송금 (해외 → 한국)
        </p>
        <h1 className="text-2xl font-bold mb-1">송금 받기</h1>
        <p className="text-sm text-charcoal-soft leading-relaxed">
          해외에서 iM뱅크 계좌로 송금받을 때 절차 — 수취 정보 전달부터 임계값 확인·WU 수령·인쇄용 안내서까지.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-receive" />

      {/* 핵심 정보 요약 */}
      <section className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-5">
        <div className="flex items-baseline justify-between mb-2 gap-2 flex-wrap">
          <h2 className="font-bold text-sm">🏦 iM뱅크 수취 정보 (요약)</h2>
          <Link
            href="/guide/receive/swift"
            className="text-xs text-primary hover:underline font-medium"
          >
            상세 보기 →
          </Link>
        </div>
        <dl className="grid sm:grid-cols-3 gap-3 text-xs">
          <div>
            <dt className="text-charcoal-soft uppercase tracking-wide text-[10px] mb-0.5">
              SWIFT / BIC
            </dt>
            <dd className="font-mono font-bold text-base text-primary tracking-wider">
              DAEBKR22
            </dd>
          </div>
          <div>
            <dt className="text-charcoal-soft uppercase tracking-wide text-[10px] mb-0.5">
              Bank Name
            </dt>
            <dd className="font-mono">iM Bank (FORMERLY DAEGU BANK)</dd>
          </div>
          <div>
            <dt className="text-charcoal-soft uppercase tracking-wide text-[10px] mb-0.5">
              Address
            </dt>
            <dd className="font-mono text-[11px] leading-snug">
              2310, DALGUBEOL-DAERO, SUSEONG-GU, DAEGU, SOUTH KOREA
            </dd>
          </div>
        </dl>
      </section>

      {/* 자식 카드 4개 */}
      <section className="mb-5">
        <h2 className="text-[10px] font-medium text-charcoal-soft uppercase tracking-wide mb-2 px-1">
          📚 세부 가이드
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {MAIN_CARDS.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="bg-white border border-border rounded-xl p-4 hover:border-primary transition group"
            >
              <p className="font-bold text-sm group-hover:text-primary transition mb-1">
                {c.icon} {c.title}
              </p>
              <p className="text-xs text-charcoal-soft leading-relaxed">
                {c.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 관련 자료 */}
      <section className="bg-offwhite border border-border rounded-xl p-4 text-xs">
        <h3 className="font-medium mb-2">📄 관련 약관·서식</h3>
        <ul className="space-y-1 text-charcoal-soft list-disc list-inside">
          <li>외환거래 기본약관 (모든 외환 거래 공통)</li>
          <li>웨스턴유니온 특급송금 신청서 (Receive money 체크)</li>
          <li>웨스턴유니온 특급송금 약관 (신청서 뒷면)</li>
        </ul>
        <p className="text-[10px] text-charcoal-soft mt-3">
          출처: iM뱅크 공식 안내(imbank.co.kr) + 웨스턴유니온 특급송금 거래약관 본문.
        </p>
      </section>
    </div>
  );
}
