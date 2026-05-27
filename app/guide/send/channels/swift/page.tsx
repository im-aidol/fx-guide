"use client";

import Link from "next/link";
import { AdminNote } from "@/components/admin/AdminNote";

// SWIFT 일반 외화송금 — 영업점 또는 인터넷·모바일뱅킹에서 외화송금신청서로 신청.
// 출처: 외화송금신청서 (관리번호 6001) + 외환거래 기본약관 + 외국환거래약정서

export default function SwiftSendPage() {
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
        <span className="text-charcoal">SWIFT 일반 외화송금</span>
      </nav>

      <header className="mb-4">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          💸 송금 채널
        </p>
        <h1 className="text-3xl font-bold mb-2">SWIFT 일반 외화송금</h1>
        <p className="text-sm text-charcoal-soft leading-relaxed">
          외화송금신청서(REMITTANCE APPLICATION FORM, 관리번호 6001)로 신청하는
          가장 보편적인 해외송금 채널. 영업점 또는 인터넷·모바일뱅킹에서 처리.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:send-swift" />

      {/* 한눈에 보기 */}
      <section className="bg-primary/5 border border-primary/30 rounded-xl p-4 mb-4">
        <h2 className="font-bold text-sm mb-2">🔑 한눈에 보기</h2>
        <ul className="text-xs text-charcoal-soft space-y-0.5 list-disc list-inside leading-relaxed">
          <li>
            <strong className="text-charcoal">사용 양식</strong>: 외화송금신청서
            (= 거래외국환은행 지정신청서 + 지급신청서 겸용)
          </li>
          <li>
            <strong className="text-charcoal">송금방법 옵션</strong>: 해외송금(SWIFT)
            / 송금수표(D/D) / 기타 · 국내송금(SWIFT 또는 금융결제원)
          </li>
          <li>
            <strong className="text-charcoal">거래외국환은행 지정</strong>:
            신청서로 직접 가능한 항목 — (02) 해외체재비 / (08) 외국인·비거주자의
            국내보수·소득지급. 그 외는 별도 지정 신청서 필요.
          </li>
          <li>
            <strong className="text-charcoal">동일내역송금</strong>: 과거 송금
            정보 그대로 다시 신청 가능 (과거송금번호 기재)
          </li>
        </ul>
      </section>

      {/* 신청서 작성 필드 */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-3">📝 외화송금신청서 작성 항목</h2>
        <dl className="space-y-2 text-sm">
          <Row
            label="송금방법"
            value="해외송금: SWIFT / 송금수표(D/D) / 기타 · 국내송금: SWIFT / 금융결제원"
          />
          <Row
            label="송금통화 / 금액"
            value="통화 + 금액 기재. 환산 환율은 거래시점 게시 환율 적용"
          />
          <Row
            label="해외은행 중계수수료"
            value="받으실 분(Beneficiary) 부담 / 보내시는 분(Applicant) 부담 선택"
          />
          <Row
            label="지급사유 + 지정항목"
            value="(02) 해외체재비 / (08) 외국인·비거주자 국내보수·소득지급 / 기타 — 신청서에서 직접 거래외국환은행 지정 가능"
          />
          <Row
            label="보내시는 분"
            value="성명(영문/한글)·주소·생년월일/사업자번호·연락처"
          />
          <Row
            label="받으실 분"
            value="성명(영문)·주소(건물·도로·우편번호 포함)·국가·연락처·신청인과의 관계"
          />
          <Row
            label="수취 계좌번호"
            value="유럽·중동 송금 시 IBAN CODE 기재 필수"
          />
          <Row
            label="수취 은행"
            value="은행명·주소·도시·국가 · SWIFT/BIC · 국가별 BANK CODE · 중계은행"
          />
          <Row
            label="송금 목적·적요"
            value="송금목적 필수요구 국가 송금 시 송금 목적 기재 (UAE·사우디·쿠웨이트 등). 적요란에 유학생 ID 등 추가정보"
          />
          <Row
            label="연동계좌"
            value="기 등록된 본인 명의 계좌에서 출금 동의 + 계좌번호·예금주 서명"
          />
        </dl>
      </section>

      {/* 영업점 응대 체크포인트 */}
      <section className="bg-warn/5 border border-warn/40 rounded-xl p-4 mb-4">
        <h2 className="font-bold text-sm mb-2">⚠️ 영업점 응대 체크포인트</h2>
        <ul className="text-xs text-charcoal space-y-1 list-disc list-inside leading-relaxed">
          <li>
            <strong>해외은행 중계수수료</strong>: Applicant 부담 선택해도 해외은행
            별도 기준으로 수취인 거래은행 수수료가 차감될 수 있음. 보내시는 분이
            부담하더라도 청구 금액 초과 시 추가 부담 — 고객 사전 안내.
          </li>
          <li>
            <strong>거래외국환은행 지정</strong>: 신청서에서 직접 가능한 항목은
            (02)·(08) 두 가지만. 그 외 사유는 별도 거래외국환은행 지정 신청서 작성.
          </li>
          <li>
            <strong>유럽·중동 송금 시 IBAN CODE</strong> 기재 필수 — 누락 시
            반송·지연.
          </li>
          <li>
            <strong>송금목적 필수 기재국</strong> (UAE·사우디·쿠웨이트·말레이시아·
            우즈벡·파키스탄·요르단·모로코·동티모르·카타르·미국·인도): 송금 목적
            반드시 기재.
          </li>
          <li>
            <strong>미국·멕시코·캐나다 등</strong>: PAYOUT CITY/STATE 필수 기재
            (해당 시).
          </li>
          <li>
            <strong>거주자 무증빙 해외송금</strong>: 전 업권(금융·비금융) 합산 연
            USD 100,000 한도 (매년 1.1~12.31).
          </li>
          <li>
            <strong>글로벌 경제제재(OFAC 등)</strong> 대상자·국가 연관 시 자금
            동결·송금지연·반환 가능 — 신청서 동의 문구 확인.
          </li>
          <li>
            <strong>외환통계 자료·국세청 통보</strong> 가능 — USD 10,000 초과 시
            자동 통보 (외환규정 4-8조).
          </li>
        </ul>
      </section>

      {/* 인터넷·모바일 송금 */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-3">💻 인터넷·모바일 해외송금</h2>
        <p className="text-xs text-charcoal-soft leading-relaxed mb-2">
          별도 양식: 「인터넷을 이용한 해외송금 신청서」. 사전 등록된 수취인
          정보로 영업점 방문 없이 송금 가능 (비대면).
        </p>
        <ul className="text-xs text-charcoal-soft space-y-0.5 list-disc list-inside leading-relaxed">
          <li>거래외국환은행 지정 사전 완료 필요</li>
          <li>수취인 정보 사전 등록 (영업점에서 1회)</li>
          <li>전자금융 1회·1일 한도 적용</li>
          <li>상세 절차는 본부 매뉴얼 확인</li>
        </ul>
      </section>

      {/* 관련 채널 */}
      <section className="mt-6">
        <p className="text-[10px] text-charcoal-soft uppercase tracking-wide mb-2 px-1">
          다른 송금 채널
        </p>
        <div className="grid sm:grid-cols-3 gap-2">
          <Link
            href="/guide/send/channels/baro"
            className="bg-white border border-border rounded-lg p-3 hover:border-primary transition group"
          >
            <p className="font-medium text-sm group-hover:text-primary transition">
              🚀 BARO-BARO 자동송금
            </p>
            <p className="text-xs text-charcoal-soft mt-0.5">
              정기 자동 — 환율우대 30%, 송금수수료 면제
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
              200개국 · 계좌 불필요 · USD 7,000 이하
            </p>
          </Link>
        </div>
      </section>

      <p className="text-[10px] text-charcoal-soft mt-6 pt-4 border-t border-border">
        📄 출처: 외화송금신청서 (관리번호 6001, 2026.01.) + 인터넷을 이용한
        해외송금 신청서 + 외환거래 기본약관 + 외국환거래약정서 + 외환규정
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3 py-1 border-b border-border last:border-0">
      <dt className="text-xs text-charcoal-soft sm:w-32 sm:shrink-0 uppercase tracking-wide">
        {label}
      </dt>
      <dd className="text-charcoal leading-relaxed text-sm">{value}</dd>
    </div>
  );
}
