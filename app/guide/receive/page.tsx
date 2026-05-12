import Link from "next/link";

export default function ReceiveGuidePage() {
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
          📥 송금 받기 (타발)
        </p>
        <h1 className="text-3xl font-bold mb-2">타발 송금 안내</h1>
        <p className="text-sm text-charcoal-soft">
          해외에서 한국 iM뱅크로 송금받을 때 절차. 고객에게 알려줄 정보 + 수령 시 임계.
        </p>
      </header>

      {/* iM 수취 정보 */}
      <section className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-4">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-bold">iM뱅크 수취 정보</h2>
          <Link
            href="/incoming"
            className="text-xs text-primary hover:underline font-medium"
          >
            고객 정보 입력 + 인쇄 →
          </Link>
        </div>
        <dl className="space-y-2 text-sm">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
            <dt className="text-charcoal-soft sm:w-32 text-xs uppercase tracking-wide">
              SWIFT / BIC
            </dt>
            <dd className="font-mono font-bold text-lg tracking-wider">
              DAEBKR22
            </dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
            <dt className="text-charcoal-soft sm:w-32 text-xs uppercase tracking-wide">
              Bank Name
            </dt>
            <dd className="font-mono">iM Bank (FORMERLY DAEGU BANK)</dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
            <dt className="text-charcoal-soft sm:w-32 text-xs uppercase tracking-wide">
              Address
            </dt>
            <dd className="font-mono">
              2310, DALGUBEOL-DAERO, SUSEONG-GU, DAEGU, SOUTH KOREA
            </dd>
          </div>
        </dl>
      </section>

      {/* 수령 임계 */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-3">📏 수취 시 임계값</h2>
        <ul className="space-y-2 text-sm">
          <Threshold
            value="USD 5,000 이하"
            note="거래입증서류 불필요"
            color="green"
          />
          <Threshold
            value="USD 5,000 ~ 100,000"
            note="거래입증서류 있으면 제출 권장"
            color="neutral"
          />
          <Threshold
            value="USD 100,000 초과"
            note="거래 영업점에 거래입증서류 제출 필수"
            color="warn"
          />
          <Threshold
            value="USD 10,000 초과 수취"
            note="국세청 자동 통보"
            color="danger"
          />
        </ul>
        <p className="text-[10px] text-charcoal-soft mt-3">
          출처: iM뱅크 공식 안내 (imbank.co.kr)
        </p>
      </section>

      {/* WU 수령 — 약관 본문 반영 */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-3">웨스턴유니온 (WU) 수령</h2>
        <dl className="space-y-2 text-sm mb-3">
          <Row
            label="수취 한도"
            value="건당 USD 7,000 (송금 한도도 동일 — 국가별 변경 가능)"
          />
          <Row
            label="필수 제시"
            value="신분증 + MTCN (Money Transfer Control Number)"
          />
          <Row
            label="수취 통화"
            value="KRW 또는 USD (송금인이 선택한 통화와 다를 시 추가 비용·환율 차 발생 가능)"
          />
          <Row
            label="송금 전달 시간"
            value="통상 수분 이내 (AML/OFAC/EU 제재 점검 시 지연 가능)"
          />
          <Row
            label="환급"
            value="송금일로부터 45일 이내 미지급 시 서면 요청으로 환급 — 환급 시점 환율 적용"
          />
          <Row label="연령 제한" value="18세 이하 수취 불가" />
        </dl>
        <div className="bg-offwhite border border-border rounded-md p-3 text-xs text-charcoal-soft">
          <p className="font-medium text-charcoal mb-1">⚠️ AML 점검 (WU 약관 3조)</p>
          <p>
            모든 WU 거래는 EU·OFAC 제재 리스트 자동 점검 대상. 자금세탁 개연성
            확인 시 추가 정보·신분증 요구로 거래 지연 가능.
          </p>
        </div>
        <div className="flex flex-wrap gap-1 mt-3">
          <Tag>WU 특급송금 신청서</Tag>
          <Tag>WU 특급송금 약관</Tag>
        </div>
        <p className="text-[10px] text-charcoal-soft mt-3">
          출처: 웨스턴유니온 특급송금 거래약관 (1·2·3·5·6조)
        </p>
      </section>

      {/* 관련 자료 */}
      <section className="bg-offwhite border border-border rounded-xl p-5 text-sm">
        <h3 className="font-medium mb-2">📄 관련 자료</h3>
        <ul className="space-y-1 text-charcoal-soft list-disc list-inside">
          <li>외환거래 기본약관 (모든 외환 거래 공통)</li>
          <li>웨스턴유니온 특급송금 신청서 (Receive money 체크)</li>
          <li>웨스턴유니온 특급송금 약관 (신청서 뒷면)</li>
        </ul>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3 py-1 border-b border-border last:border-0">
      <dt className="text-xs text-charcoal-soft sm:w-28 sm:shrink-0 uppercase tracking-wide">
        {label}
      </dt>
      <dd className="text-charcoal leading-relaxed">{value}</dd>
    </div>
  );
}

function Threshold({
  value,
  note,
  color,
}: {
  value: string;
  note: string;
  color: "green" | "neutral" | "warn" | "danger";
}) {
  const colors = {
    green: "border-primary/30 bg-primary/5",
    neutral: "border-border bg-offwhite",
    warn: "border-warn/40 bg-warn/10",
    danger: "border-danger/30 bg-danger/5",
  };
  return (
    <li
      className={[
        "flex items-baseline justify-between gap-3 border rounded-lg px-3 py-2",
        colors[color],
      ].join(" ")}
    >
      <span className="font-bold whitespace-nowrap">{value}</span>
      <span className="text-charcoal-soft text-right">{note}</span>
    </li>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] text-charcoal-soft bg-offwhite border border-border px-2 py-0.5 rounded-full">
      📄 {children}
    </span>
  );
}
