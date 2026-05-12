import Link from "next/link";

type Product = {
  id: string;
  title: string;
  category: "예금" | "적금" | "이체";
  description: string;
  termsFile: string;
};

const PRODUCTS: Product[] = [
  {
    id: "global",
    title: "글로벌외화종합통장",
    category: "예금",
    description: "iM뱅크 외화예금 종합 통장. 다국적 통화 입출금·송수금에 활용.",
    termsFile: "글로벌외화종합통장_약관",
  },
  {
    id: "im-free",
    title: "iM 외화자유적금",
    category: "적금",
    description: "외화 자유적립 적금. iM뱅크 자체 외화 적금 상품.",
    termsFile: "iM_외화자유적금_특약",
  },
  {
    id: "idream-free",
    title: "IDREAM 외화자유적금",
    category: "적금",
    description: "외화 자유적립 적금 (별도 상품군).",
    termsFile: "IDREAM_외화자유적금_특약",
  },
  {
    id: "foryou",
    title: "포-유(For You) 자유적립 외화예금",
    category: "적금",
    description: "자유 적립식 외화예금 상품.",
    termsFile: "ForYou_자유적립_외화예금_특약",
  },
  {
    id: "plusyou",
    title: "플러스-유(Plus-You) 자유적립 외화예금",
    category: "적금",
    description: "자유 적립식 외화예금 (Plus-You 라인업).",
    termsFile: "PlusYou_자유적립_외화예금_특약",
  },
  {
    id: "auto-transfer",
    title: "외화 자동이체",
    category: "이체",
    description: "외화예금 → 외화예금 또는 외화예금 → 송금 정기 자동이체.",
    termsFile: "외화자동이체_이용약관",
  },
];

export default function DepositGuidePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link
        href="/guide"
        className="text-xs text-charcoal-soft hover:text-primary inline-flex items-center gap-1 mb-3"
      >
        ← 가이드 홈
      </Link>
      <header className="mb-6">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          🏦 외화 통장·적금
        </p>
        <h1 className="text-3xl font-bold mb-2">외화 예금·적금 상품</h1>
        <p className="text-sm text-charcoal-soft">
          iM뱅크 외화 예금·적금 상품 6종 한눈 비교. 상품별 특약은 영업점·홈페이지에서 본문 확인.
        </p>
      </header>

      {/* 공통 안내 */}
      <section className="bg-offwhite border border-border rounded-xl p-5 mb-4 text-sm">
        <p className="font-medium mb-2">📋 모든 외화 예금·적금 공통</p>
        <ul className="space-y-1 text-charcoal-soft list-disc list-inside">
          <li><strong>기본 약관</strong>: 외환거래 기본약관 + 외화예금 거래기본약관</li>
          <li>외국인거주자도 가입 가능 (단 한도 관리 별도)</li>
          <li>1만불 초과 입금 시 외환통계 자료 → 국세청 통보 대상</li>
          <li>예금자 보호: 외화예금도 예금자보호법 적용 (한도 USD 환산)</li>
        </ul>
      </section>

      {/* 상품 카드 */}
      <section className="grid md:grid-cols-2 gap-4 mb-4">
        {PRODUCTS.map((p) => (
          <article
            key={p.id}
            className="bg-white border border-border rounded-xl p-5 flex flex-col"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold leading-tight">{p.title}</h3>
              <span className="text-[10px] text-charcoal-soft bg-offwhite border border-border px-2 py-0.5 rounded-full whitespace-nowrap">
                {p.category}
              </span>
            </div>
            <p className="text-sm text-charcoal-soft flex-1 leading-relaxed">
              {p.description}
            </p>
            <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-border">
              <Tag>{p.termsFile}</Tag>
            </div>
          </article>
        ))}
      </section>

      {/* 안내 */}
      <section className="bg-offwhite border border-border rounded-xl p-5 text-sm">
        <h3 className="font-medium mb-2">⚠️ 상품 가입 시 확인</h3>
        <ul className="space-y-1 text-charcoal-soft list-disc list-inside">
          <li>적용 금리·환율우대·만기 등 상세 조건은 본부·영업점 매뉴얼 또는 상품 안내장 참조</li>
          <li>본 가이드는 약관 인덱스만 정리 — 본문 정밀 안내는 영업점 직원 본인의 도메인 지식 기준</li>
        </ul>
      </section>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] text-charcoal-soft bg-offwhite border border-border px-2 py-0.5 rounded-full">
      📄 {children}
    </span>
  );
}
