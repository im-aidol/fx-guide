import Link from "next/link";
import { AdminNote } from "@/components/admin/AdminNote";
import { FlowChart } from "@/components/trade/FlowChart";
import { COLLECTION_FLOW } from "@/lib/data/trade-finance";

// 추심 거래 흐름도 — 8단계 인터랙티브.

export default function FlowCollectionPage() {
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
        <span className="text-charcoal">추심 거래 흐름도</span>
      </nav>

      <header className="mb-5">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          🔁 무역금융 · 도구
        </p>
        <h1 className="text-2xl font-bold mb-1">
          추심 거래 흐름도 (8단계 · D/P · D/A)
        </h1>
        <p className="text-sm text-charcoal-soft leading-relaxed">
          신용장 없는 무역거래. 은행은 지급보증 없이 중개인 역할만. URC 522 적용. 각 단계 클릭 → 행위
          주체·고객 응대 멘트 확인.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-trade-flow-collection" />

      {/* 참여 주체 */}
      <section className="bg-white border border-border rounded-xl p-3 mb-4">
        <p className="text-[10px] font-medium text-charcoal-soft uppercase tracking-wide mb-2">
          📍 참여 주체
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <Party
            kor="추심의뢰인 (수출상)"
            eng="Principal / Seller"
            desc="환어음 발행인"
          />
          <Party
            kor="추심의뢰은행 (iM뱅크)"
            eng="Remitting Bank"
            desc="수출지 은행"
          />
          <Party
            kor="추심은행"
            eng="Collecting Bank"
            desc="수입지 은행 · 서류 제시"
          />
          <Party
            kor="지급인 (수입상)"
            eng="Drawee / Buyer"
            desc="환어음 지급인"
          />
        </div>
      </section>

      <FlowChart steps={COLLECTION_FLOW} />

      {/* D/P vs D/A 비교 */}
      <section className="grid sm:grid-cols-2 gap-3 mt-5">
        <div className="bg-primary/5 border border-primary/30 rounded-xl p-4">
          <p className="font-bold text-sm mb-1">D/P (Documents against Payment)</p>
          <p className="text-[10px] text-charcoal-soft mb-2">일람불 거래</p>
          <p className="text-xs text-charcoal-soft leading-relaxed">
            대금의 지급을 조건으로 선적서류를 인도하는 형태. 서류의 인도와 동시에 대금결제.
          </p>
        </div>
        <div className="bg-warn/5 border border-warn/30 rounded-xl p-4">
          <p className="font-bold text-sm mb-1">
            D/A (Documents against Acceptance)
          </p>
          <p className="text-[10px] text-charcoal-soft mb-2">기한부 거래</p>
          <p className="text-xs text-charcoal-soft leading-relaxed">
            환어음의 인수를 조건으로 선적서류 인도하고 만기에 대금지급.
          </p>
        </div>
      </section>

      <section className="bg-offwhite border border-border rounded-xl p-4 text-xs mt-4">
        <p className="text-charcoal-soft">
          📚 <strong>URC 522</strong> (Uniform Rules for Collections) — 추심에
          관한 통일규칙 · ICC.
        </p>
        <p className="text-[10px] text-charcoal-soft mt-2">
          출처: 수출입 업무의 이해 연수교재 (HR부, 2025.06) Section 1 무신용장방식 거래흐름도.
        </p>
      </section>

      <div className="grid sm:grid-cols-2 gap-3 mt-4">
        <Link
          href="/guide/trade-finance/collection"
          className="bg-white border border-border rounded-xl p-3 hover:border-primary transition group"
        >
          <p className="font-bold text-sm group-hover:text-primary transition">
            ← 추심 가이드
          </p>
        </Link>
        <Link
          href="/guide/trade-finance/flow-lc"
          className="bg-white border border-border rounded-xl p-3 hover:border-primary transition group"
        >
          <p className="font-bold text-sm group-hover:text-primary transition">
            🗺️ 신용장 거래 흐름도 →
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
