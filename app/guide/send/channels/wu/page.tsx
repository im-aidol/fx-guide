"use client";

import Link from "next/link";
import { AdminNote } from "@/components/admin/AdminNote";

// 웨스턴유니온(WU) 송금 3종 — 특급송금·iM더빠른송금·AUTOSEND.
// 출처:
//   - 웨스턴유니온 특급송금 서비스설명서 (준법감시인 심의필 25-3445호)
//   - iM더빠른송금(WU) 서비스설명서 (준법감시인 심의필 25-3443호)
//   - 웨스턴유니온 AUTOSEND(자동송금) 서비스설명서 (준법감시인 심의필 25-3444호)

export default function WuPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <nav className="text-xs text-charcoal-soft mb-3 flex items-center gap-1">
        <Link href="/guide" className="hover:text-primary">
          가이드 홈
        </Link>
        <span>›</span>
        <Link href="/guide/send" className="hover:text-primary">
          당발송금
        </Link>
        <span>›</span>
        <span className="text-charcoal">WU 송금 3종</span>
      </nav>

      <header className="mb-4">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          ⚡ 송금 채널 — 웨스턴유니온 전용망
        </p>
        <h1 className="text-3xl font-bold mb-2">WU 송금 3종</h1>
        <p className="text-sm text-charcoal-soft leading-relaxed">
          웨스턴유니온 전용망을 통한 해외 송금. 수취인 계좌 없이 영문이름과
          수취국가만으로 거래 가능. 200여 개국 가맹점 수령. 특급송금(영업점)·
          iM더빠른송금(모바일앱)·AUTOSEND(자동) 3종.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:send-wu" />

      {/* 한눈에 보기 */}
      <section className="bg-primary/5 border border-primary/30 rounded-xl p-4 mb-4">
        <h2 className="font-bold text-sm mb-2">🔑 WU 송금 공통</h2>
        <ul className="text-xs text-charcoal-soft space-y-0.5 list-disc list-inside leading-relaxed">
          <li>
            <strong className="text-charcoal">대상국가</strong>: 200여 개국 (북한·이란 등 일부 제외)
          </li>
          <li>
            <strong className="text-charcoal">거래통화</strong>: USD 단일
          </li>
          <li>
            <strong className="text-charcoal">건별 한도</strong>: USD 7,000 이하 (건별·동일자)
          </li>
          <li>
            <strong className="text-charcoal">송금사유</strong>: 거주자 무증빙·해외유학생·해외체재자·외국인 국내소득
          </li>
          <li>
            <strong className="text-charcoal">환율</strong>: 보낼 때 전신환매도율 ·
            받을 때 전신환매입율 — <strong className="text-warn">환율우대 없음</strong>
          </li>
          <li>
            <strong className="text-charcoal">취소·정정</strong>: 송금 후 원칙 불가.
            45일 이내 미지급 시 신청인 서면 요청으로 환급 (수수료는 환급 안 됨)
          </li>
          <li>
            <strong className="text-charcoal">거래외국환은행 지정</strong>: 거주자
            무증빙 송금 제외하고 모두 iM뱅크 지정 필수
          </li>
        </ul>
      </section>

      {/* 3종 비교표 */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-3">📊 3종 비교</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-offwhite text-charcoal-soft">
              <tr className="border-b border-border">
                <th className="text-left p-2.5 uppercase tracking-wide w-28">항목</th>
                <th className="text-left p-2.5">
                  ⚡ iM더빠른송금 (WU)
                </th>
                <th className="text-left p-2.5">🏢 특급송금</th>
                <th className="text-left p-2.5">🔁 AUTOSEND (자동)</th>
              </tr>
            </thead>
            <tbody className="text-charcoal align-top">
              <tr className="border-b border-border">
                <td className="p-2.5 text-charcoal-soft uppercase tracking-wide text-[10px]">
                  채널
                </td>
                <td className="p-2.5">모바일앱뱅킹 (비대면)</td>
                <td className="p-2.5">영업점 (대면)</td>
                <td className="p-2.5">영업점 신청 → 자동 처리</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-2.5 text-charcoal-soft uppercase tracking-wide text-[10px]">
                  이용시간
                </td>
                <td className="p-2.5">24시간 365일</td>
                <td className="p-2.5">은행 영업시간</td>
                <td className="p-2.5">영업일 10:00~18:00 (입금 후 15분 이내)</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-2.5 text-charcoal-soft uppercase tracking-wide text-[10px]">
                  대상
                </td>
                <td className="p-2.5">
                  보내기: 국민 거주자·외국인 거주자<br />받기: 국민 거주자만
                </td>
                <td className="p-2.5">순수 개인 (외국인 포함)</td>
                <td className="p-2.5">순수 개인 (외국인 포함)</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-2.5 text-charcoal-soft uppercase tracking-wide text-[10px]">
                  수수료
                </td>
                <td className="p-2.5">
                  <strong className="text-primary">USD 5</strong> (금액 무관)
                </td>
                <td className="p-2.5">
                  ~500: USD 10<br />
                  ~2,000: USD 14<br />
                  ~3,000: USD 18<br />
                  ~7,000: USD 20
                </td>
                <td className="p-2.5">
                  ~3,000: USD 6<br />
                  ~5,000: USD 12
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-2.5 text-charcoal-soft uppercase tracking-wide text-[10px]">
                  처리방식
                </td>
                <td className="p-2.5">즉시 송금</td>
                <td className="p-2.5">영업점 직접 신청</td>
                <td className="p-2.5">
                  지정일 송금 (월 1회 · USD 100~5,000) /<br />
                  잔액 송금 (일 1회 · 원화 10만~500만)
                </td>
              </tr>
              <tr>
                <td className="p-2.5 text-charcoal-soft uppercase tracking-wide text-[10px]">
                  AUTOSEND 한도
                </td>
                <td className="p-2.5">—</td>
                <td className="p-2.5">—</td>
                <td className="p-2.5">
                  건별/월별 USD 5,000 이하 · 연 USD 100,000 (외국인 국내소득은 연 USD 50,000)
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
            <strong>외국인 국내소득 송금 사유</strong>: 서비스 이용 전 영업점
            방문해 거래외국환은행 지정 + 여권 정보 제출. 제출서류 — 외국인등록증
            (체류기간 미기재 시 체류지확인서) 또는 외국국적동포 국내신고증 +
            여권.
          </li>
          <li>
            <strong>거주자 무증빙 해외송금</strong>: 전 업권(금융·비금융) 합산 연
            USD 100,000 한도. 거래외국환은행 지정 불요.
          </li>
          <li>
            <strong>iM더빠른송금(WU)</strong>: 환율 실시간 변동 — 신청 화면과 실제
            송금 환율 차이 가능.
          </li>
          <li>
            <strong>WU AUTOSEND</strong>: 1년간 거래 없거나 여권 유효기간 만료 시
            서비스 자동 정지 → 영업점 재신청 필요. 휴대전화번호 변경 시 영업점
            방문 변경 필수.
          </li>
          <li>
            <strong>송금전용계좌</strong>: 본 서비스 외 자동이체 지급등록 불가
            (AUTOSEND).
          </li>
          <li>
            <strong>미국·멕시코·캐나다 등</strong> 특정국가 송금 시 PAYOUT
            CITY/STATE(지급도시·주) <strong>필수 기재</strong>.
          </li>
          <li>
            <strong>MTCN</strong>: 송금 시 WU 시스템이 부여하는 고유번호. 수취인
            정보와 일치 시 송금대금 수령 가능 — 송금자가 수취인에게 전달.
          </li>
          <li>
            <strong>TEST QUESTION</strong>: 본 항목을 요구하는 국가로만 사용.
            질문·답 일치 시 수령 가능.
          </li>
          <li>
            <strong>송금사유별 연간 한도는 다른 채널(영업점·인터넷·모바일)과
            합산 관리</strong>.
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
            href="/guide/send/channels/baro"
            className="bg-white border border-border rounded-lg p-3 hover:border-primary transition group"
          >
            <p className="font-medium text-sm group-hover:text-primary transition">
              🚀 BARO-BARO 자동송금
            </p>
            <p className="text-xs text-charcoal-soft mt-0.5">
              17통화·환율우대 30%·수수료 면제
            </p>
          </Link>
        </div>
      </section>

      <p className="text-[10px] text-charcoal-soft mt-6 pt-4 border-t border-border">
        📄 출처: 웨스턴유니온 특급송금 서비스설명서 (25-3445호) + iM더빠른송금(WU)
        서비스설명서 (25-3443호) + 웨스턴유니온 AUTOSEND 서비스설명서 (25-3444호)
        + 각 거래약관 (시행 2026.01.01~2027.12.31)
      </p>
    </div>
  );
}
