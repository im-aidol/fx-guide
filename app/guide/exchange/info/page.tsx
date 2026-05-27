import Link from "next/link";
import { AdminNote } from "@/components/admin/AdminNote";

export default function ExchangeInfoPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <nav className="text-xs text-charcoal-soft mb-3 flex items-center gap-1">
        <Link href="/guide" className="hover:text-primary">
          가이드 홈
        </Link>
        <span>›</span>
        <Link href="/guide/exchange" className="hover:text-primary">
          환전
        </Link>
        <span>›</span>
        <span className="text-charcoal">환전 안내</span>
      </nav>
      <header className="mb-6">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          📐 환전 (외화 매매)
        </p>
        <h1 className="text-3xl font-bold mb-2">환율 산출·BuyAndSell 안내</h1>
        <p className="text-sm text-charcoal-soft">
          외화 매수(사기) / 매도(팔기) 기본 원칙 — 매매기준율·전신환·현찰 환율
          종류 + iM뱅크 BuyAndSell 서비스 본문 기반.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-exchange-info" />

      {/* 환율 산출 근거 */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-2">📐 환율 산출 (외환규정 1-2조 7호)</h2>
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="text-xs text-charcoal-soft uppercase tracking-wide">
              매매기준율 (USD·CNY)
            </dt>
            <dd className="mt-0.5">
              외국환중개회사를 통해 거래된 현물환매매 중 익익영업일 결제거래의
              시장평균환율 (9:00~15:30 KST 거래량 가중평균).
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

      {/* BuyAndSell — 두 방식 비교 */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-3">🛒 외화 BuyAndSell 서비스 (비대면 전용)</h2>
        <p className="text-sm text-charcoal-soft mb-4">
          본인 원화 계좌와 외화 계좌 간 이체로 외화 매입/매도. 인터넷·모바일앱뱅킹.
          가입 대상: <strong>국민인 거주자 개인</strong> (기업뱅킹 제외).
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-offwhite">
                <th className="text-left p-2.5 text-xs text-charcoal-soft uppercase tracking-wide w-32">
                  항목
                </th>
                <th className="text-left p-2.5">실시간 Buy &amp; Sell</th>
                <th className="text-left p-2.5">희망환율 Buy &amp; Sell</th>
              </tr>
            </thead>
            <tbody>
              <CompareRow
                label="이용시간"
                a="영업일 09:00 ~ 23:50"
                b="24시간 365일 신청 (체결은 익영업일부터 영업일 09:00~17:30)"
              />
              <CompareRow
                label="거래 통화"
                a="USD / JPY / EUR / CNY ↔ KRW"
                b="USD / JPY / EUR / CNY ↔ KRW"
              />
              <CompareRow
                label="1회 금액"
                a="USD 50 상당액 이상 ~ 전자금융 1회·1일 한도"
                b="USD 100 ~ USD 100,000 상당액"
              />
              <CompareRow
                label="1일 신청"
                a="이체한도 내"
                b="최대 5회"
              />
              <CompareRow
                label="유효기일"
                a="—"
                b="익영업일 ~ 10영업일 이내 지정"
              />
              <CompareRow
                label="환율우대"
                a="전신환매매율 70% 우대"
                b="전신환매매율 50% 우대"
              />
              <CompareRow
                label="체결 방식"
                a="즉시 거래 (환율 변동 시 처음부터 다시)"
                b="희망환율 도달 자동 거래 (매입: ≤ 희망 / 매도: ≥ 희망)"
              />
              <CompareRow
                label="결과통지"
                a="—"
                b="SMS (거래완료·유효기일 경과 안내)"
              />
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-offwhite border border-border rounded-md p-3 text-xs text-charcoal-soft">
          <p className="font-medium text-charcoal mb-1">⚠️ 변경·취소</p>
          <p>
            거래 완료 후 변경·취소 불가. 단, 희망환율 신청건의 <strong>유효기일 이내 미체결</strong> 건은 인터넷·모바일뱅킹에서 취소만 가능 (변경 불가).
          </p>
        </div>

        <p className="text-[10px] text-charcoal-soft mt-3">
          출처: 외화 BuyAndSell 서비스 이용약관 (개정 전후 대비표 별도)
        </p>
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

      {/* 통화 견본 진입 */}
      <section className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="font-medium text-sm">💴 통화 견본 — 매입 가능 여부 확인</p>
          <p className="text-xs text-charcoal-soft mt-0.5">
            권종별 사진·시리즈·매입 가능 여부를 한 화면에서.
          </p>
        </div>
        <Link
          href="/samples"
          className="text-sm text-primary hover:text-primary-dark font-medium whitespace-nowrap"
        >
          견양 보러가기 →
        </Link>
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
          ⚠️ 본 안내는 외환규정 + 약관 본문 기반. 영업점 환전 수수료·게시 환율은
          영업점·홈페이지 기준 확인.
        </p>
      </section>
    </div>
  );
}

function CompareRow({
  label,
  a,
  b,
}: {
  label: string;
  a: string;
  b: string;
}) {
  return (
    <tr className="border-b border-border last:border-0 align-top">
      <td className="p-2.5 text-xs text-charcoal-soft uppercase tracking-wide whitespace-nowrap">
        {label}
      </td>
      <td className="p-2.5 text-charcoal-soft leading-relaxed">{a}</td>
      <td className="p-2.5 text-charcoal-soft leading-relaxed">{b}</td>
    </tr>
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
