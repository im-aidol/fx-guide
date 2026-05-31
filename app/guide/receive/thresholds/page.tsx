import Link from "next/link";
import { AdminNote } from "@/components/admin/AdminNote";

// 타발 송금 수취 임계값 가이드 — 5천불·1만불·10만불 룰 + 국세청 통보.

export default function ReceiveThresholdsPage() {
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
        <span className="text-charcoal">수취 임계값</span>
      </nav>

      <header className="mb-5">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          📏 타발 송금 · 임계값
        </p>
        <h1 className="text-2xl font-bold mb-1">수취 시 임계값 가이드</h1>
        <p className="text-sm text-charcoal-soft leading-relaxed">
          금액별 거래입증서류 요건 + 국세청 자동 통보 룰. 출처: iM뱅크 공식 안내(imbank.co.kr).
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-receive-thresholds" />

      {/* 임계값 표 */}
      <section className="bg-white border border-border rounded-xl overflow-hidden mb-4">
        <table className="w-full text-sm">
          <thead className="bg-offwhite text-charcoal-soft">
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 uppercase tracking-wide text-[10px] font-medium">
                금액
              </th>
              <th className="text-left py-2 px-3 uppercase tracking-wide text-[10px] font-medium">
                요건
              </th>
              <th className="text-left py-2 px-3 uppercase tracking-wide text-[10px] font-medium">
                비고
              </th>
            </tr>
          </thead>
          <tbody>
            <Row
              amount="USD 5,000 이하"
              requirement="거래입증서류 불필요"
              note="간단 수취 처리"
              color="primary"
            />
            <Row
              amount="USD 5,000 초과 ~ 100,000 이하"
              requirement="거래입증서류 제출 권장"
              note="고객이 가지고 계시면 받아 두기"
              color="neutral"
            />
            <Row
              amount="USD 100,000 초과"
              requirement="거래 영업점에 거래입증서류 제출 필수"
              note="계약서·인보이스·증여계약서 등"
              color="warn"
            />
            <Row
              amount="USD 10,000 초과 수취"
              requirement="국세청 자동 통보"
              note="고객에게 안내만 — 별도 동의 불요"
              color="danger"
            />
          </tbody>
        </table>
      </section>

      {/* 거래입증서류 종류 */}
      <section className="bg-white border border-border rounded-xl p-4 mb-4">
        <h2 className="font-bold text-sm mb-2">📑 거래입증서류 (예시)</h2>
        <ul className="text-xs text-charcoal-soft list-disc list-inside space-y-1 leading-relaxed">
          <li>
            <strong>수출입 거래</strong> — 수출계약서, 인보이스, 선하증권(B/L) 등
          </li>
          <li>
            <strong>용역 대가</strong> — 용역계약서, 청구서
          </li>
          <li>
            <strong>증여</strong> — 증여계약서, 가족관계증명서
          </li>
          <li>
            <strong>유학·체재비</strong> — 입학허가서, 재학증명서 등
          </li>
          <li>
            <strong>이주비·재산반출</strong> — 해외이주신고확인서 등
          </li>
        </ul>
        <p className="text-[10px] text-charcoal-soft mt-2">
          📌 사유에 따라 추가 서류가 필요할 수 있어요. 외환규정 본문 또는 본부 외환부서 확인.
        </p>
      </section>

      {/* 응대 멘트 */}
      <section className="bg-primary/5 border border-primary/30 rounded-xl p-4 mb-4">
        <h2 className="font-bold text-sm mb-2">💬 영업점 응대 멘트</h2>
        <ul className="text-xs text-charcoal space-y-1.5 leading-relaxed">
          <li className="border-l-2 border-primary/40 pl-2">
            &ldquo;5천불 이하는 별도 서류 없이 수취 가능해요.&rdquo;
          </li>
          <li className="border-l-2 border-primary/40 pl-2">
            &ldquo;10만불 넘으시면 거래입증서류 제출이 필수예요. 무슨 거래로 받으세요?&rdquo;
          </li>
          <li className="border-l-2 border-primary/40 pl-2">
            &ldquo;1만불 넘는 수취는 국세청에 자동 통보됩니다 — 미리 안내드릴게요.&rdquo;
          </li>
        </ul>
      </section>

      <div className="grid sm:grid-cols-2 gap-3">
        <Link
          href="/guide/receive/swift"
          className="bg-white border border-border rounded-xl p-3 hover:border-primary transition group"
        >
          <p className="font-bold text-sm group-hover:text-primary transition">
            🏦 iM뱅크 수취 정보 (SWIFT) →
          </p>
        </Link>
        <Link
          href="/guide/receive/wu"
          className="bg-white border border-border rounded-xl p-3 hover:border-primary transition group"
        >
          <p className="font-bold text-sm group-hover:text-primary transition">
            ⚡ WU 수령 →
          </p>
        </Link>
      </div>
    </div>
  );
}

function Row({
  amount,
  requirement,
  note,
  color,
}: {
  amount: string;
  requirement: string;
  note: string;
  color: "primary" | "neutral" | "warn" | "danger";
}) {
  const bg = {
    primary: "bg-primary/5",
    neutral: "",
    warn: "bg-warn/10",
    danger: "bg-danger/5",
  }[color];
  const badge = {
    primary: "bg-primary/10 text-primary border-primary/30",
    neutral: "bg-offwhite text-charcoal-soft border-border",
    warn: "bg-warn/15 text-warn border-warn/40",
    danger: "bg-danger/10 text-danger border-danger/30",
  }[color];
  return (
    <tr className={`border-b border-border last:border-0 align-top ${bg}`}>
      <td className="py-2 px-3 font-medium whitespace-nowrap">{amount}</td>
      <td className="py-2 px-3">
        <span
          className={`text-[11px] px-2 py-0.5 rounded-full border whitespace-nowrap ${badge}`}
        >
          {requirement}
        </span>
      </td>
      <td className="py-2 px-3 text-xs text-charcoal-soft leading-relaxed">
        {note}
      </td>
    </tr>
  );
}
