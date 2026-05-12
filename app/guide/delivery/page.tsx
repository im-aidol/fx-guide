import Link from "next/link";

export default function DeliveryGuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link
        href="/guide"
        className="text-xs text-charcoal-soft hover:text-primary inline-flex items-center gap-1 mb-3"
      >
        ← 가이드 홈
      </Link>
      <header className="mb-6">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          📦 외화 배송·기프티콘
        </p>
        <h1 className="text-3xl font-bold mb-2">외화 수령 (비대면)</h1>
        <p className="text-sm text-charcoal-soft">
          고객이 영업점 방문 없이 외화를 수령하는 두 가지 방식 — 외화배송과 외화기프티콘.
        </p>
      </header>

      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-2">📬 iM 외화배송 서비스</h2>
        <p className="text-sm text-charcoal-soft mb-3">
          외화 매수(환전) 신청 후 자택 또는 지정 장소로 배송. 영업점 직접 방문 없이 외화 수령 가능.
        </p>
        <ul className="text-sm space-y-1 text-charcoal-soft list-disc list-inside">
          <li>모바일·인터넷뱅킹에서 신청</li>
          <li>외화 BuyAndSell 또는 환전 거래와 연계</li>
          <li>수령자 본인 확인 필수 (배송 시점)</li>
          <li>적용 환율: 신청 시점 기준 iM뱅크 고시 환율</li>
        </ul>
        <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-border">
          <Tag>iM외화배송서비스_이용약관</Tag>
          <Tag>외환거래 기본약관</Tag>
        </div>
      </section>

      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-2">🎁 외화 기프티콘 (외화수령증)</h2>
        <p className="text-sm text-charcoal-soft mb-3">
          외화 수령권을 제3자에게 선물 형태로 전달. 수령자가 영업점 또는 지정 채널에서 수령.
        </p>
        <ul className="text-sm space-y-1 text-charcoal-soft list-disc list-inside">
          <li>수령증 양식 = 개인(신용)정보 수집이용 동의서 겸용</li>
          <li>수령자 본인 확인 + 동의서 서명 필요</li>
          <li>수령 가능 통화·한도는 영업점 안내 기준</li>
        </ul>
        <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-border">
          <Tag>외화수령증_기프티콘_정보수집동의서</Tag>
          <Tag>외환거래 기본약관</Tag>
        </div>
      </section>

      <section className="bg-offwhite border border-border rounded-xl p-5 text-sm">
        <h3 className="font-medium mb-2">⚠️ 영업점 직원 확인 사항</h3>
        <ul className="space-y-1 text-charcoal-soft list-disc list-inside">
          <li>두 서비스 모두 외환 거래의 일부 — 외환규정 환전 규정과 통보 의무 적용</li>
          <li>USD 10,000 초과 환전 후 휴대 출국 시 세관 신고 의무 (외환거래법 위반 시 처벌)</li>
          <li>상세 절차·한도는 영업점 매뉴얼 기준 (본부 외환부서)</li>
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
