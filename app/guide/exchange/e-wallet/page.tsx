"use client";

import Link from "next/link";
import { AdminNote } from "@/components/admin/AdminNote";

// 외화 E-지갑 서비스 — 모바일앱뱅킹 전용. 외화 계좌 없이 환전한 외화를 보관·수령·재환전.
// 출처: 『외화 E-지갑』 서비스 상품설명서 (준법감시인 심의필 25-1407호, 2025.07.01~2027.06.30)

export default function EWalletPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <nav className="text-xs text-charcoal-soft mb-3 flex items-center gap-1">
        <Link href="/guide" className="hover:text-primary">
          가이드 홈
        </Link>
        <span>›</span>
        <Link href="/guide/exchange" className="hover:text-primary">
          환전
        </Link>
        <span>›</span>
        <span className="text-charcoal">외화 E-지갑</span>
      </nav>

      <header className="mb-4">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          💼 환전 비대면 채널
        </p>
        <h1 className="text-3xl font-bold mb-2">외화 E-지갑 서비스</h1>
        <p className="text-sm text-charcoal-soft leading-relaxed">
          외화 계좌 없이 환전한 외화를 보관하고, 필요할 때 영업점에서 수령하거나
          원화로 재환전하는 모바일앱 전용 서비스. 실시간 환전 + 희망환율 환전
          두 방식.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:exchange-e-wallet" />

      {/* 한눈에 보기 */}
      <section className="bg-primary/5 border border-primary/30 rounded-xl p-4 mb-4">
        <h2 className="font-bold text-sm mb-2">🔑 한눈에 보기</h2>
        <ul className="text-xs text-charcoal-soft space-y-0.5 list-disc list-inside leading-relaxed">
          <li>
            <strong className="text-charcoal">대상</strong>: 국민인 거주자, 모바일앱뱅킹 이용 개인 — <strong>외화 계좌 불필요</strong>
          </li>
          <li>
            <strong className="text-charcoal">통화 10종</strong>: USD/JPY/EUR/CNY/HKD/SGD/AUD/CAD/GBP/THB
          </li>
          <li>
            <strong className="text-charcoal">환전 방식 2가지</strong>: 실시간 환전(보관/영업점 수령) · 희망환율 환전
          </li>
          <li>
            <strong className="text-charcoal">한도</strong>: 1회 USD 10↑ / 1일 USD 3,000 / <strong>보관한도 USD 10,000</strong> / 월 USD 30,000 / 연 USD 100,000
          </li>
          <li>
            <strong className="text-charcoal">환율우대</strong>: USD 50% / JPY·EUR·CNY 30% / 그 외 우대없음
          </li>
        </ul>
      </section>

      {/* 거래 방식 2가지 비교 */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-3">⚙️ 거래 방식 비교</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-offwhite text-charcoal-soft">
              <tr className="border-b border-border">
                <th className="text-left p-2.5 uppercase tracking-wide w-32">
                  항목
                </th>
                <th className="text-left p-2.5">실시간 환전 (보관·영업점 수령)</th>
                <th className="text-left p-2.5">희망환율 환전</th>
              </tr>
            </thead>
            <tbody>
              <Row
                label="거래방식"
                a="현재 고시 환율로 즉시 환전"
                b="희망환율 도달 시 자동 환전"
              />
              <Row
                label="1회 한도"
                a="미화 10불 이상 ~ 3,000불 이하"
                b="미화 10불 이상 ~ 3,000불 상당액 이하"
              />
              <Row
                label="이용시간"
                a="24시간, 365일"
                b="신청 24시간 365일 / 체결 영업일 09:00~18:00"
              />
              <Row
                label="유효기일"
                a="—"
                b="신청일 익영업일부터 10영업일 이내. 미도달 시 자동 취소"
              />
              <Row
                label="변경·취소"
                a="거래 완료 후 변경·취소 불가 (수령점 변경 가능)"
                b="유효기일 내 취소 가능 (변경 불가) / 체결 후 변경·취소 불가"
              />
              <Row
                label="재신청"
                a="자유"
                b="해당 신청건 체결 완료 또는 취소되어야 재신청 가능"
              />
            </tbody>
          </table>
        </div>
      </section>

      {/* 거래 유형 3종 */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-3">📌 거래 유형 3종</h2>
        <dl className="space-y-3 text-sm">
          <Detail
            title="환전하기"
            body="본인 원화 요구불계좌 → (거래 체결) → 외화 E-지갑 보관 / 영업점에서 외화 현찰 수령"
            rate="은행이 고시하는 현찰매도율 (고객이 현찰을 살 때)"
          />
          <Detail
            title="수령하기"
            body="외화 E-지갑 → 수령 영업점 선택 → 본인 방문 수령 (신분증 지참, 수령예약일 포함 7영업일 이내)"
            rate="환전 시 적용된 환율 그대로 (보관 시 별도 환율 변동 없음)"
          />
          <Detail
            title="재환전"
            body="외화 E-지갑 → 본인 원화 요구불계좌 선택 → 원화로 입금 (24시간 365일)"
            rate="은행이 고시하는 현찰매입율 (고객이 현찰을 팔 때) — 영업시간 외(18:00~익일 09:00·주말·공휴일) 우대 미적용"
          />
        </dl>
      </section>

      {/* 환율우대 표 */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-3">💱 통화별 환율우대</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-offwhite text-charcoal-soft">
              <tr className="border-b border-border">
                <th className="text-left p-2.5 uppercase tracking-wide">통화</th>
                <th className="text-left p-2.5 uppercase tracking-wide">
                  우대율
                </th>
                <th className="text-left p-2.5 uppercase tracking-wide">
                  비고
                </th>
              </tr>
            </thead>
            <tbody>
              <RateRow currency="USD" rate="50%" note="현찰매도율 기준 우대" />
              <RateRow
                currency="JPY · EUR · CNY"
                rate="30%"
                note="현찰매도율 기준 우대"
              />
              <RateRow
                currency="HKD · SGD · AUD · CAD · GBP · THB · MYR · TWD · PHP · VND"
                rate="우대 없음"
                note="외화배송 등 다른 채널과 비교"
              />
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-charcoal-soft mt-2">
          ⚠️ 재환전 시에는 영업시간 외(평일 18:00~익일 09:00, 주말·공휴일)에 별도
          환율우대 미적용.
        </p>
      </section>

      {/* 영업점 자주 실수 체크 */}
      <section className="bg-warn/5 border border-warn/40 rounded-xl p-4 mb-4">
        <h2 className="font-bold text-sm mb-2">⚠️ 영업점 응대 체크포인트</h2>
        <ul className="text-xs text-charcoal space-y-1 list-disc list-inside leading-relaxed">
          <li>
            <strong>외화 계좌 없어도 가입 가능</strong>. 원화 요구불계좌만 있으면 됨.
          </li>
          <li>
            <strong>보관한도 USD 10,000</strong> — 외화 기프티콘 미수령 금액·환전예약
            미수령 금액 <strong>합산</strong>해서 산정.
          </li>
          <li>
            <strong>월 USD 30,000 / 연 USD 100,000</strong> — 외화 E-지갑·외화기프티콘·
            환전예약·전화 환전예약 <strong>합산</strong> 한도.
          </li>
          <li>
            보관 시 <strong>유효기간 없음</strong>. 별도 이자 미지급.
          </li>
          <li>
            영업점 통화 재고에 따라 권종 수령 제한 가능 — 수령 전 확인.
          </li>
          <li>
            <strong>미화 1만불 상당액 초과</strong> 환전은 국세청·관세청 자동 통보 (외환규정,
            동일자·동일인 합산).
          </li>
          <li>
            희망환율 환전: 신청 후 체결 시간은 별도 (익영업일 09:00~18:00).
            거래량 폭주·환율 급변 시 처리 지연 가능.
          </li>
        </ul>
      </section>

      {/* 고객 응대 멘트 */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold text-sm mb-2">💬 고객 응대 멘트</h2>
        <ul className="space-y-3">
          <li className="bg-white border-l-4 border-primary/40 pl-4 py-2 pr-3">
            <p className="text-[11px] text-charcoal-soft uppercase tracking-wide mb-1">
              외화 계좌 없이 환전 묻는 고객
            </p>
            <p className="text-sm text-charcoal italic leading-relaxed">
              &ldquo;외화 계좌 없으셔도 모바일앱에서 외화 E-지갑으로 바로 환전하실 수
              있어요. 환전한 외화는 지갑에 보관하셨다가 필요하실 때 영업점에서
              수령하시거나 원화로 재환전하시면 됩니다.&rdquo;
            </p>
          </li>
          <li className="bg-white border-l-4 border-primary/40 pl-4 py-2 pr-3">
            <p className="text-[11px] text-charcoal-soft uppercase tracking-wide mb-1">
              환율우대 안내
            </p>
            <p className="text-sm text-charcoal italic leading-relaxed">
              &ldquo;USD는 현찰매도율의 50%, 엔화·유로·위안은 30% 우대받으세요. 다른
              통화는 우대가 없으니까 외화배송 채널과 비교해 보시면 좋아요.&rdquo;
            </p>
          </li>
          <li className="bg-white border-l-4 border-primary/40 pl-4 py-2 pr-3">
            <p className="text-[11px] text-charcoal-soft uppercase tracking-wide mb-1">
              보관한도 안내
            </p>
            <p className="text-sm text-charcoal italic leading-relaxed">
              &ldquo;외화 E-지갑에는 미화 1만불 상당액까지 보관 가능해요. 외화기프티콘이나
              환전예약 미수령 금액이랑 합산되니까 이미 보관 중인 외화가 있으면
              그만큼 차감해서 한도가 계산됩니다.&rdquo;
            </p>
          </li>
        </ul>
      </section>

      {/* 다른 환전 채널 비교 */}
      <section className="mt-6">
        <p className="text-[10px] text-charcoal-soft uppercase tracking-wide mb-2 px-1">
          비대면 환전 채널 비교
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <Link
            href="/guide/exchange/gift"
            className="bg-white border border-border rounded-lg p-3 hover:border-primary transition group"
          >
            <p className="font-medium text-sm group-hover:text-primary transition">
              🎁 외화 기프티콘
            </p>
            <p className="text-xs text-charcoal-soft mt-0.5">
              같은 패턴이지만 본인/제3자 선물 발행
            </p>
          </Link>
          <Link
            href="/guide/delivery"
            className="bg-white border border-border rounded-lg p-3 hover:border-primary transition group"
          >
            <p className="font-medium text-sm group-hover:text-primary transition">
              📦 외화 배송
            </p>
            <p className="text-xs text-charcoal-soft mt-0.5">
              비대면 수령 — 배달·CU (USD 90% 우대)
            </p>
          </Link>
          <Link
            href="/guide/exchange/info"
            className="bg-white border border-border rounded-lg p-3 hover:border-primary transition group"
          >
            <p className="font-medium text-sm group-hover:text-primary transition">
              💱 외화 Buy &amp; Sell
            </p>
            <p className="text-xs text-charcoal-soft mt-0.5">
              원·외화 계좌 간 이체 (전신환 70%/50%)
            </p>
          </Link>
          <Link
            href="/guide/exchange/calculator"
            className="bg-white border border-border rounded-lg p-3 hover:border-primary transition group"
          >
            <p className="font-medium text-sm group-hover:text-primary transition">
              🧮 환전 계산기
            </p>
            <p className="text-xs text-charcoal-soft mt-0.5">
              우대율 적용 환산 계산
            </p>
          </Link>
        </div>
      </section>

      {/* 출처 */}
      <p className="text-[10px] text-charcoal-soft mt-6 pt-4 border-t border-border">
        📄 출처: 『외화 E-지갑』 서비스 상품설명서 (준법감시인 심의필 25-1407호,
        2025.07.01~2027.06.30) + 외화 E-지갑 서비스 이용약관
      </p>
    </div>
  );
}

function Row({ label, a, b }: { label: string; a: string; b: string }) {
  return (
    <tr className="border-b border-border last:border-0 align-top">
      <td className="p-2.5 text-charcoal-soft uppercase tracking-wide text-[10px] whitespace-nowrap">
        {label}
      </td>
      <td className="p-2.5 text-charcoal leading-relaxed">{a}</td>
      <td className="p-2.5 text-charcoal leading-relaxed">{b}</td>
    </tr>
  );
}

function Detail({
  title,
  body,
  rate,
}: {
  title: string;
  body: string;
  rate: string;
}) {
  return (
    <div className="bg-offwhite border border-border rounded-lg p-3">
      <p className="font-semibold text-charcoal mb-1">{title}</p>
      <p className="text-charcoal-soft leading-relaxed text-xs">{body}</p>
      <p className="text-[10px] text-primary mt-1.5">
        <strong>적용 환율</strong>: {rate}
      </p>
    </div>
  );
}

function RateRow({
  currency,
  rate,
  note,
}: {
  currency: string;
  rate: string;
  note: string;
}) {
  return (
    <tr className="border-b border-border last:border-0">
      <td className="p-2.5 font-medium text-charcoal">{currency}</td>
      <td className="p-2.5 text-primary font-bold">{rate}</td>
      <td className="p-2.5 text-charcoal-soft text-[11px]">{note}</td>
    </tr>
  );
}
