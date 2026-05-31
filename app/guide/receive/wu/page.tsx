import Link from "next/link";
import { AdminNote } from "@/components/admin/AdminNote";

// 웨스턴유니온 (WU) 타발 수령 — 약관 본문 인용.

export default function ReceiveWuPage() {
  return (
    <div className="max-w-[clamp(840px,92vw,1280px)] mx-auto px-6 py-8">
      <nav className="text-xs text-charcoal-soft mb-3 flex items-center gap-1">
        <Link href="/guide" className="hover:text-primary">
          가이드 홈
        </Link>
        <span>›</span>
        <Link href="/guide/receive" className="hover:text-primary">
          타발 송금
        </Link>
        <span>›</span>
        <span className="text-charcoal">WU 수령</span>
      </nav>

      <header className="mb-5">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          ⚡ 타발 송금 · WU
        </p>
        <h1 className="text-2xl font-bold mb-1">
          웨스턴유니온 (WU) 수령
        </h1>
        <p className="text-sm text-charcoal-soft leading-relaxed">
          해외 송금자가 WU로 보낸 금액을 영업점에서 수령하는 절차. 신분증 + MTCN 필수.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-receive-wu" />

      {/* 수령 핵심 정보 */}
      <section className="bg-white border border-border rounded-xl p-4 mb-4">
        <h2 className="font-bold text-sm mb-3">📋 수령 핵심 정보</h2>
        <dl className="space-y-2 text-sm">
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
      </section>

      {/* AML 점검 */}
      <section className="bg-danger/5 border border-danger/30 rounded-xl p-4 mb-4">
        <h2 className="font-bold text-sm mb-2">⚠️ AML 점검 (WU 약관 3조)</h2>
        <p className="text-xs text-charcoal-soft leading-relaxed">
          모든 WU 거래는 EU·OFAC 제재 리스트 자동 점검 대상. 자금세탁 개연성 확인 시 추가 정보·신분증
          요구로 거래 지연 가능.
        </p>
      </section>

      {/* 응대 멘트 */}
      <section className="bg-primary/5 border border-primary/30 rounded-xl p-4 mb-4">
        <h2 className="font-bold text-sm mb-2">💬 영업점 응대 멘트</h2>
        <ul className="text-xs text-charcoal space-y-1.5 leading-relaxed">
          <li className="border-l-2 border-primary/40 pl-2">
            &ldquo;신분증과 MTCN(송금 추적번호) 가져오셨어요? 두 가지 다 있어야 수령 가능해요.&rdquo;
          </li>
          <li className="border-l-2 border-primary/40 pl-2">
            &ldquo;수취 통화는 원화로 받으시겠어요, 달러로 받으시겠어요?&rdquo;
          </li>
          <li className="border-l-2 border-primary/40 pl-2">
            &ldquo;AML 점검에서 추가 확인이 필요하실 수도 있어요. 지연되더라도 양해 부탁드려요.&rdquo;
          </li>
          <li className="border-l-2 border-primary/40 pl-2">
            &ldquo;18세 이하 분은 직접 수령 불가하니, 보호자분과 함께 오셔야 해요.&rdquo;
          </li>
        </ul>
      </section>

      {/* 관련 자료 */}
      <section className="bg-offwhite border border-border rounded-xl p-4 text-xs">
        <h3 className="font-medium mb-2">📄 관련 약관·서식</h3>
        <ul className="space-y-1 text-charcoal-soft list-disc list-inside">
          <li>WU 특급송금 신청서 (Receive money 체크)</li>
          <li>WU 특급송금 약관 (신청서 뒷면)</li>
        </ul>
        <p className="text-[10px] text-charcoal-soft mt-3">
          출처: 웨스턴유니온 특급송금 거래약관 (1·2·3·5·6조)
        </p>
      </section>

      <div className="grid sm:grid-cols-2 gap-3 mt-4">
        <Link
          href="/guide/receive/swift"
          className="bg-white border border-border rounded-xl p-3 hover:border-primary transition group"
        >
          <p className="font-bold text-sm group-hover:text-primary transition">
            🏦 iM뱅크 수취 정보 (SWIFT) →
          </p>
        </Link>
        <Link
          href="/guide/receive/thresholds"
          className="bg-white border border-border rounded-xl p-3 hover:border-primary transition group"
        >
          <p className="font-bold text-sm group-hover:text-primary transition">
            📏 수취 임계값 가이드 →
          </p>
        </Link>
      </div>
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
