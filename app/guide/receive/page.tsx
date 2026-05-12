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

      {/* 가장 자주 묻는 정보 */}
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

      {/* WU 수령 */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-3">웨스턴유니온 (WU) 수령</h2>
        <ul className="space-y-2 text-sm text-charcoal">
          <li>
            <strong>MTCN</strong> (Money Transfer Control Number) — 송금자가
            알려주는 추적번호 필수
          </li>
          <li>수취 시 신분증 + 여권/주민번호 등 본인 확인 필수</li>
          <li>수취통화: KRW 또는 USD 선택</li>
          <li>송금인 이름·성·송금국가 사전 확인</li>
          <li>18세 이하는 수취 불가 (WU 정책)</li>
        </ul>
        <div className="flex flex-wrap gap-1 mt-3">
          <Tag>WU 특급송금 신청서</Tag>
          <Tag>WU 특급송금 약관</Tag>
        </div>
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
