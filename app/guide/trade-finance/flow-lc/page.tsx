import Link from "next/link";
import { AdminNote } from "@/components/admin/AdminNote";
import { FlowChart } from "@/components/trade/FlowChart";
import { LC_FLOW } from "@/lib/data/trade-finance";

// 신용장 거래 흐름도 — 12단계 인터랙티브.

export default function FlowLcPage() {
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
        <span className="text-charcoal">신용장 거래 흐름도</span>
      </nav>

      <header className="mb-5">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          🗺️ 무역금융 · 도구
        </p>
        <h1 className="text-2xl font-bold mb-1">
          신용장 거래 흐름도 (12단계)
        </h1>
        <p className="text-sm text-charcoal-soft leading-relaxed">
          매매계약 → 신용장 개설 → 통지 → 선적 → 매입 → 서류 송부 → 결제 → 상환의 전체 과정. 각 단계를
          클릭하면 행위 주체·서류·고객 응대 멘트가 표시됩니다.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-trade-flow-lc" />

      {/* 참여 주체 범례 */}
      <section className="bg-white border border-border rounded-xl p-3 mb-4">
        <p className="text-[10px] font-medium text-charcoal-soft uppercase tracking-wide mb-2">
          📍 참여 주체
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px]">
          <Party
            kor="수입상"
            eng="Applicant / Buyer"
            desc="신용장 개설 의뢰인"
          />
          <Party
            kor="개설은행"
            eng="Issuing Bank"
            desc="iM뱅크 · 대금 결제 확약"
          />
          <Party
            kor="통지은행"
            eng="Advising Bank"
            desc="수출지 은행 · 통지 역할"
          />
          <Party
            kor="수출상"
            eng="Beneficiary / Seller"
            desc="신용장 수익자"
          />
          <Party
            kor="매입은행"
            eng="Nominated Bank"
            desc="환어음·서류 매입"
          />
          <Party
            kor="상환은행"
            eng="Reimbursing Bank"
            desc="대금 상환 (선택)"
          />
        </div>
      </section>

      <FlowChart steps={LC_FLOW} />

      <section className="bg-offwhite border border-border rounded-xl p-4 text-xs mt-5">
        <h3 className="font-medium mb-2">📚 관련 규정</h3>
        <ul className="space-y-1 text-charcoal-soft list-disc list-inside">
          <li>
            <strong>UCP 600</strong> (Uniform Customs and Practice for
            Documentary Credits) — 신용장통일규칙
          </li>
          <li>
            <strong>ISBP 745</strong> (International Standard Banking Practice)
            — 국제표준은행관행
          </li>
          <li>
            <strong>URR 725</strong> (Uniform Rules for Bank-to-Bank
            Reimbursements) — 은행간 상환 통일규칙
          </li>
          <li>
            <strong>INCOTERMS 2020</strong> — 국제상업거래조건
          </li>
        </ul>
        <p className="text-[10px] text-charcoal-soft mt-3">
          출처: 수출입 업무의 이해 연수교재 (HR부, 2025.06) Section 1·2 흐름도.
        </p>
      </section>

      <div className="grid sm:grid-cols-2 gap-3 mt-4">
        <Link
          href="/guide/trade-finance/lc-fields"
          className="bg-white border border-border rounded-xl p-3 hover:border-primary transition group"
        >
          <p className="font-bold text-sm group-hover:text-primary transition">
            📑 신용장 19개 필드 가이드 →
          </p>
        </Link>
        <Link
          href="/guide/trade-finance/flow-collection"
          className="bg-white border border-border rounded-xl p-3 hover:border-primary transition group"
        >
          <p className="font-bold text-sm group-hover:text-primary transition">
            🔁 추심 거래 흐름도 →
          </p>
        </Link>
      </div>
    </div>
  );
}

function Party({
  kor,
  eng,
  desc,
}: {
  kor: string;
  eng: string;
  desc: string;
}) {
  return (
    <div className="bg-offwhite border border-border rounded-lg p-2">
      <p className="font-medium text-charcoal">{kor}</p>
      <p className="text-[9px] text-charcoal-soft">{eng}</p>
      <p className="text-[10px] text-charcoal-soft mt-0.5 leading-tight">
        {desc}
      </p>
    </div>
  );
}
