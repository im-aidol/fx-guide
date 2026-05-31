import Link from "next/link";
import { AdminNote } from "@/components/admin/AdminNote";

// iM뱅크 타발 송금 SWIFT/BIC 상세 — 해외 송금자에게 전달할 영문 수취 은행 정보.

const BANK_INFO = {
  name: "iM Bank (FORMERLY DAEGU BANK)",
  swift: "DAEBKR22",
  address: "2310, DALGUBEOL-DAERO, SUSEONG-GU, DAEGU, SOUTH KOREA",
};

export default function ReceiveSwiftPage() {
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
        <span className="text-charcoal">iM뱅크 수취 정보 (SWIFT)</span>
      </nav>

      <header className="mb-5">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          🏦 타발 송금 · 수취 정보
        </p>
        <h1 className="text-2xl font-bold mb-1">iM뱅크 SWIFT/BIC 정보</h1>
        <p className="text-sm text-charcoal-soft leading-relaxed">
          해외 송금자가 iM뱅크 계좌로 송금할 때 필요한 영문 은행 정보. 고객에게 그대로 전달.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-receive-swift" />

      {/* 수취 정보 */}
      <section className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-3">📡 Beneficiary Bank 정보</h2>
        <dl className="space-y-3">
          <Field
            label="SWIFT / BIC"
            value={BANK_INFO.swift}
            highlight
          />
          <Field label="Bank Name" value={BANK_INFO.name} />
          <Field label="Bank Address" value={BANK_INFO.address} />
        </dl>
      </section>

      {/* 추가 필요 항목 */}
      <section className="bg-white border border-border rounded-xl p-4 mb-4">
        <h2 className="font-bold text-sm mb-2">📝 송금자에게 추가로 알려줘야 할 것</h2>
        <ul className="text-xs text-charcoal-soft list-disc list-inside space-y-1 leading-relaxed">
          <li>
            <strong>Beneficiary Name</strong> — 수취인 영문 성명 (여권/등기 성명과 일치)
          </li>
          <li>
            <strong>Beneficiary Account No.</strong> — 수취인 iM뱅크 계좌번호
          </li>
          <li>
            <strong>Beneficiary Address</strong> — 수취인 영문 주소 (필수 국가/은행 있음)
          </li>
          <li>
            <strong>송금 사유 (Purpose of Remittance)</strong> — 일부 국가는 사유 코드까지 요구
          </li>
        </ul>
        <Link
          href="/guide/receive/print-card"
          className="inline-block mt-3 text-xs text-primary hover:underline font-medium"
        >
          🖨️ 고객용 안내서 — 수취인 정보 입력 후 인쇄 →
        </Link>
      </section>

      {/* 응대 멘트 */}
      <section className="bg-primary/5 border border-primary/30 rounded-xl p-4 mb-4">
        <h2 className="font-bold text-sm mb-2">💬 영업점 응대 멘트</h2>
        <ul className="text-xs text-charcoal space-y-1.5 leading-relaxed">
          <li className="border-l-2 border-primary/40 pl-2">
            &ldquo;해외 송금자에게는 SWIFT 코드 <strong>DAEBKR22</strong> 알려주시면 돼요.&rdquo;
          </li>
          <li className="border-l-2 border-primary/40 pl-2">
            &ldquo;수취인 영문 성명·계좌번호·영문 주소까지 함께 전달해 주세요. 인쇄해 드릴 수도 있어요.&rdquo;
          </li>
        </ul>
      </section>

      <div className="grid sm:grid-cols-2 gap-3">
        <Link
          href="/guide/receive/print-card"
          className="bg-primary/5 border border-primary/30 rounded-xl p-3 hover:border-primary transition group"
        >
          <p className="font-bold text-sm group-hover:text-primary transition">
            🖨️ 인쇄용 고객 안내서 →
          </p>
          <p className="text-xs text-charcoal-soft mt-0.5">
            수취인 정보 입력 후 그대로 인쇄
          </p>
        </Link>
        <Link
          href="/guide/receive/thresholds"
          className="bg-white border border-border rounded-xl p-3 hover:border-primary transition group"
        >
          <p className="font-bold text-sm group-hover:text-primary transition">
            📏 수취 임계값 가이드 →
          </p>
          <p className="text-xs text-charcoal-soft mt-0.5">
            5천불·1만불·10만불 임계 + 국세청 통보
          </p>
        </Link>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-1.5 border-b border-border last:border-0">
      <dt className="text-xs text-charcoal-soft sm:w-32 sm:shrink-0 uppercase tracking-wide">
        {label}
      </dt>
      <dd
        className={
          highlight
            ? "font-mono font-bold text-xl tracking-wider text-primary"
            : "font-mono text-sm"
        }
      >
        {value}
      </dd>
    </div>
  );
}
