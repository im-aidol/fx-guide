import Link from "next/link";

export default function ExchangeGuidePage() {
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
          💱 환전 (외화 매매)
        </p>
        <h1 className="text-3xl font-bold mb-2">환전 안내</h1>
        <p className="text-sm text-charcoal-soft">
          외화 매수(사기) / 매도(팔기). iM뱅크 BuyAndSell 서비스 + 영업점 환전 절차.
        </p>
      </header>

      {/* 환율 산출 근거 */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-2">📐 환율 산출 (외환규정 1-2조 7호)</h2>
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="text-xs text-charcoal-soft uppercase tracking-wide">
              매매기준율 (USD·CNY)
            </dt>
            <dd className="mt-0.5">
              외국환중개회사를 통해 거래된 현물환매매 중 익익영업일 결제거래의 시장평균환율 (9:00~15:30 KST 거래량 가중평균).
            </dd>
          </div>
          <div className="pt-2 border-t border-border">
            <dt className="text-xs text-charcoal-soft uppercase tracking-wide">
              재정된 매매기준율 (그 외 통화)
            </dt>
            <dd className="mt-0.5">
              미화 외 통화와 미화의 매매중간율을 미화 매매기준율로 재정한 율.
            </dd>
          </div>
          <div className="pt-2 border-t border-border">
            <dt className="text-xs text-charcoal-soft uppercase tracking-wide">
              (대고객) 전신환매도율 / 매입율
            </dt>
            <dd className="mt-0.5">
              <strong>매도율</strong>: 현찰 외 외화 살 때 또는 외화로 송금 보낼 때 적용
              <br />
              <strong>매입율</strong>: 현찰 외 외화 팔 때 또는 외화로 송금 받을 때 적용
            </dd>
          </div>
        </dl>
        <p className="text-[10px] text-charcoal-soft mt-3">
          출처: 외환규정 1-2조 7호 + 외국환거래약정서 1조 ⑪·⑫
        </p>
      </section>

      {/* BuyAndSell */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-2">🛒 외화 BuyAndSell 서비스</h2>
        <p className="text-sm text-charcoal-soft mb-3">
          비대면 외화 매매. 모바일·인터넷으로 신청 후 영업점 또는 자택에서 수령 가능.
        </p>
        <ul className="text-sm space-y-1 text-charcoal-soft list-disc list-inside">
          <li>약관: 외화 BuyAndSell 이용약관 (현행 + 개정 대비표)</li>
          <li>수령 방법: 영업점 / 외화배송 (iM외화배송서비스 약관 적용)</li>
          <li>매매 환율: iM뱅크 고시 환율 (위 매매기준율 기반)</li>
        </ul>
      </section>

      {/* 영업점 환전 임계 */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-2">📏 영업점 환전 임계값</h2>
        <ul className="space-y-2 text-sm">
          <Threshold
            value="환전 자체"
            note="자유 (외환규정상 신고 불필요한 경우 다수)"
            color="green"
          />
          <Threshold
            value="USD 10,000 초과 휴대 출국"
            note="세관 신고 의무 (외환거래법 위반 시 처벌)"
            color="danger"
          />
          <Threshold
            value="분할 환전 의심"
            note="STR 검토 (특정금융정보법) — 누설 금지"
            color="warn"
          />
        </ul>
      </section>

      {/* 관련 자료 */}
      <section className="bg-offwhite border border-border rounded-xl p-5 text-sm">
        <h3 className="font-medium mb-2">📄 관련 자료</h3>
        <ul className="space-y-1 text-charcoal-soft list-disc list-inside">
          <li>외환거래 기본약관</li>
          <li>외화 BuyAndSell 서비스 이용약관 (현행)</li>
          <li>외화 BuyAndSell 서비스 이용약관 대비표 (개정 전후)</li>
          <li>iM외화배송서비스 이용약관 (배송 수령 시)</li>
        </ul>
        <p className="text-[10px] text-charcoal-soft mt-3">
          ⚠️ 본 안내는 외환규정 + 약관 인덱스 기반. 상세 절차는 본부 외환부서 매뉴얼 확인.
        </p>
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
