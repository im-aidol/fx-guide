"use client";

import Link from "next/link";
import { AdminNote } from "@/components/admin/AdminNote";

// BARO-BARO 해외 자동송금 서비스 (정기 자동송금).
// 출처: 『BARO-BARO 해외 자동송금』 서비스설명서 (준법감시인 심의필 25-2741호, 2025.11.24~2027.09.30)

export default function BaroBaroPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <nav className="text-xs text-charcoal-soft mb-3 flex items-center gap-1">
        <Link href="/guide" className="hover:text-primary">
          가이드 홈
        </Link>
        <span>›</span>
        <Link href="/guide/send" className="hover:text-primary">
          당발송금
        </Link>
        <span>›</span>
        <span className="text-charcoal">BARO-BARO 자동송금</span>
      </nav>

      <header className="mb-4">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          🚀 송금 채널 — 정기 자동
        </p>
        <h1 className="text-3xl font-bold mb-2">BARO-BARO 해외 자동송금</h1>
        <p className="text-sm text-charcoal-soft leading-relaxed">
          사전에 신청한 송금방법에 따라 송금전용계좌의 잔액을 자동으로 출금해
          해외로 송금하는 서비스. 3가지 송금방식 (계좌잔액·예약금액·예약환율).
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:send-baro" />

      {/* 한눈에 보기 */}
      <section className="bg-primary/5 border border-primary/30 rounded-xl p-4 mb-4">
        <h2 className="font-bold text-sm mb-2">🔑 한눈에 보기</h2>
        <ul className="text-xs text-charcoal-soft space-y-0.5 list-disc list-inside leading-relaxed">
          <li>
            <strong className="text-charcoal">대상</strong>: 순수 개인 (외국인 포함)
          </li>
          <li>
            <strong className="text-charcoal">통화</strong>: 17종 (계좌잔액·예약금액
            방식) / USD·EUR·JPY (예약환율 방식)
          </li>
          <li>
            <strong className="text-charcoal">송금사유 2종</strong>: 해외체재비
            지급(02) / 외국인 또는 비거주자 국내보수·소득지급(08) — 두 가지만 지원
          </li>
          <li>
            <strong className="text-charcoal">수수료</strong>: 전신료 8,000원 ·
            <strong className="text-primary"> 송금수수료 면제</strong>
          </li>
          <li>
            <strong className="text-charcoal">환율우대</strong>:{" "}
            <strong className="text-primary">30% 우대</strong> (전신환매도율 기준)
          </li>
          <li>
            <strong className="text-charcoal">신청</strong>: 영업점 (변경·해지는
            영업점·모바일앱뱅킹)
          </li>
        </ul>
      </section>

      {/* 통화 17종 */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-3">💱 거래 통화</h2>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-xs font-medium text-charcoal-soft uppercase tracking-wide mb-1.5">
              계좌잔액 송금방식 + 예약금액 송금방식 (17종)
            </p>
            <div className="bg-offwhite border border-border rounded-md p-2.5 text-xs text-charcoal font-mono">
              USD · JPY · EUR · AUD · CAD · GBP · CHF · HKD · SEK · DKK · NOK ·
              SAR · KWD · AED · SGD · NZD · THB
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-charcoal-soft uppercase tracking-wide mb-1.5">
              예약환율 송금방식 (3종)
            </p>
            <div className="bg-offwhite border border-border rounded-md p-2.5 text-xs text-charcoal font-mono">
              USD · EUR · JPY
            </div>
          </div>
        </div>
      </section>

      {/* 송금사유 + 한도 */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-3">📐 송금사유 + 연간 한도</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-offwhite text-charcoal-soft">
              <tr className="border-b border-border">
                <th className="text-left p-2.5 uppercase tracking-wide">송금사유</th>
                <th className="text-left p-2.5 uppercase tracking-wide">송금기간</th>
                <th className="text-left p-2.5 uppercase tracking-wide">연간한도</th>
              </tr>
            </thead>
            <tbody className="text-charcoal">
              <tr className="border-b border-border">
                <td className="p-2.5 font-medium">
                  (02) 해외체재비 지급
                </td>
                <td className="p-2.5 text-charcoal-soft">제한 없음</td>
                <td className="p-2.5 text-primary font-bold">USD 100,000</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium">
                  (08) 외국인·비거주자 국내보수·소득지급
                </td>
                <td className="p-2.5 text-charcoal-soft">
                  서비스 신청일 익영업일 ~ 외국인등록증 체류기간 만료일 (최대 3년)
                </td>
                <td className="p-2.5 text-primary font-bold">USD 50,000</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-charcoal-soft mt-2 leading-relaxed">
          ※ 거래사유 별 연간한도는 본 서비스 외 영업점·인터넷뱅킹·모바일앱뱅킹의
          동일사유 송금액과 <strong>합산 관리</strong>됩니다.
        </p>
      </section>

      {/* 3가지 송금방식 비교 */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-3">⚙️ 3가지 송금방식 비교</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-offwhite text-charcoal-soft">
              <tr className="border-b border-border">
                <th className="text-left p-2.5 uppercase tracking-wide w-24">항목</th>
                <th className="text-left p-2.5">계좌잔액 송금</th>
                <th className="text-left p-2.5">예약금액 송금</th>
                <th className="text-left p-2.5">예약환율 송금</th>
              </tr>
            </thead>
            <tbody className="text-charcoal">
              <tr className="border-b border-border align-top">
                <td className="p-2.5 text-charcoal-soft uppercase tracking-wide text-[10px]">
                  처리기준
                </td>
                <td className="p-2.5">예약금액(원화) 이상 입금 시 계좌잔액 전체 송금 (일 1회)</td>
                <td className="p-2.5">예약일자 영업시간 중, 예약금액 이상 잔액 시 송금 (월 1회)</td>
                <td className="p-2.5">예약일자 영업시간 중, 예약환율 매칭 시 송금 (월 1회)</td>
              </tr>
              <tr className="border-b border-border align-top">
                <td className="p-2.5 text-charcoal-soft uppercase tracking-wide text-[10px]">
                  최저금액
                </td>
                <td className="p-2.5">원화 10만원 또는 USD 100 상당액</td>
                <td className="p-2.5">동일</td>
                <td className="p-2.5">
                  USD 100~10,000 / EUR 100~10,000 / JPY 10,000~1,000,000 (원화 상당액)
                </td>
              </tr>
              <tr className="border-b border-border align-top">
                <td className="p-2.5 text-charcoal-soft uppercase tracking-wide text-[10px]">
                  송금시간
                </td>
                <td className="p-2.5">
                  영업일 입금 시점별:
                  <br />• 0~10시: 당일 10시 이후
                  <br />• 10~16시: 입금 즉시
                  <br />• 16~24시·토일·공휴일: 익영업일 10시 이후
                </td>
                <td className="p-2.5">영업일 09:00~16:00 (예약일자 휴일이면 익영업일)</td>
                <td className="p-2.5">영업일 09:00~16:00</td>
              </tr>
              <tr>
                <td className="p-2.5 text-charcoal-soft uppercase tracking-wide text-[10px]">
                  적용환율
                </td>
                <td className="p-2.5">송금시점 고시 전신환매도율</td>
                <td className="p-2.5">송금시점 고시 전신환매도율</td>
                <td className="p-2.5">
                  당일 고시환율(전신환매도율)이 예약환율과 같거나 낮을 때 최초 매칭된 고시환율 적용
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 영업점 응대 체크포인트 */}
      <section className="bg-warn/5 border border-warn/40 rounded-xl p-4 mb-4">
        <h2 className="font-bold text-sm mb-2">⚠️ 영업점 응대 체크포인트</h2>
        <ul className="text-xs text-charcoal space-y-1 list-disc list-inside leading-relaxed">
          <li>
            <strong>iM뱅크를 거래외국환은행으로 지정 필수</strong> — 서비스 이용 전 지정.
          </li>
          <li>
            <strong>송금전용계좌는 신자유저축예금(MMDA 제외)만</strong> 등록 가능.
            본 서비스 외 자동이체 지급 등록 불가.
          </li>
          <li>
            외국인·비거주자 국내보수 사유는 <strong>2023.12.08 이후 신청·변경 시</strong>{" "}
            송금기간 제한 적용.
          </li>
          <li>
            수취국가·수취은행 제한, 거래외국환은행 미지정·미갱신, 송금한도·기간
            초과, 유학생·해외체재자 입증서류 미제출, 송금전용계좌 지급정지 등{" "}
            <strong>요건 미비 시 자동송금 제외</strong>. 사유 해소 시 정상 처리.
          </li>
          <li>
            <strong>휴대폰번호 변경 시 영업점·인터넷·모바일앱에서 변경 신청</strong>{" "}
            필요 — SMS 통지 정상화.
          </li>
          <li>
            예약환율 송금: 예약환율보다 고시환율이 같거나 낮을 때 최초 매칭된
            환율 적용. 더 낮은 환율 나와도 첫 매칭값만 사용.
          </li>
        </ul>
      </section>

      {/* 관련 채널 */}
      <section className="mt-6">
        <p className="text-[10px] text-charcoal-soft uppercase tracking-wide mb-2 px-1">
          다른 송금 채널
        </p>
        <div className="grid sm:grid-cols-3 gap-2">
          <Link
            href="/guide/send/channels/swift"
            className="bg-white border border-border rounded-lg p-3 hover:border-primary transition group"
          >
            <p className="font-medium text-sm group-hover:text-primary transition">
              💸 SWIFT 일반 외화송금
            </p>
            <p className="text-xs text-charcoal-soft mt-0.5">
              외화송금신청서 (모든 사유)
            </p>
          </Link>
          <Link
            href="/guide/send/channels/wu"
            className="bg-white border border-border rounded-lg p-3 hover:border-primary transition group"
          >
            <p className="font-medium text-sm group-hover:text-primary transition">
              ⚡ WU 송금 3종
            </p>
            <p className="text-xs text-charcoal-soft mt-0.5">
              200개국·수취인 계좌 불필요
            </p>
          </Link>
        </div>
      </section>

      <p className="text-[10px] text-charcoal-soft mt-6 pt-4 border-t border-border">
        📄 출처: 『BARO-BARO 해외 자동송금』 서비스설명서 (준법감시인 심의필
        25-2741호, 2025.11.24~2027.09.30) + 약관 + 신청서
      </p>
    </div>
  );
}
