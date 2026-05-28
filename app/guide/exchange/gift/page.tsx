"use client";

import Link from "next/link";
import { AdminNote } from "@/components/admin/AdminNote";

// 외화 기프티콘 (외화수령증).
// PDF 자료 한계: 외화수령증 동의서(서식 4012471)와 외화 E-지갑 상품설명서에서
// "외화기프티콘"으로 언급된 부분 외에는 상품설명서 미보유.
// 발행 채널·환율우대·통화 종류 등 상세 절차는 본부 매뉴얼 확인 필요.

export default function GiftCoinPage() {
  return (
    <div className="max-w-[clamp(960px,92vw,1440px)] mx-auto px-6 py-8">
      <nav className="text-xs text-charcoal-soft mb-3 flex items-center gap-1">
        <Link href="/guide" className="hover:text-primary">
          가이드 홈
        </Link>
        <span>›</span>
        <Link href="/guide/exchange" className="hover:text-primary">
          환전
        </Link>
        <span>›</span>
        <span className="text-charcoal">외화 기프티콘</span>
      </nav>

      <header className="mb-4">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          🎁 환전 — 외화 기프티콘
        </p>
        <h1 className="text-3xl font-bold mb-2">외화 기프티콘</h1>
        <p className="text-sm text-charcoal-soft leading-relaxed">
          외화수령증(서식 4012471)으로 수령 시 본인 확인·개인(신용)정보 수집·이용
          동의가 필요합니다. 보관한도·이용한도는 외화 E-지갑·환전예약과 합산
          산정됩니다.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:exchange-gift" />

      {/* PDF 자료 한계 — 본부 확인 필요 */}
      <section className="bg-warn/10 border border-warn/40 rounded-xl p-4 mb-4">
        <p className="text-xs font-medium text-charcoal mb-1.5">
          ⚠️ 본부 매뉴얼 확인 필요 항목
        </p>
        <p className="text-xs text-charcoal-soft leading-relaxed mb-1.5">
          현재 페이지는 <strong>외화수령증 동의서(서식 4012471)</strong>와{" "}
          <strong>외화 E-지갑 상품설명서</strong>에서 "외화기프티콘"으로 언급된
          내용만 정리되어 있습니다. 다음은 본부 외환사업부 매뉴얼에서 확인하세요.
        </p>
        <ul className="text-[11px] text-charcoal-soft space-y-0.5 list-disc list-inside leading-relaxed">
          <li>발행 채널 (모바일앱 / 영업점) 및 발행 절차</li>
          <li>수령 방식 (수령인 영업점 방문 절차·필요 서류)</li>
          <li>취급 통화·최소/최대 금액·환율우대 율</li>
          <li>변경·취소·유효기간·미수령 처리</li>
          <li>수령자 지정 범위 (본인·제3자) 및 본인 확인 방식</li>
        </ul>
      </section>

      {/* PDF 명시 — 보관한도·이용한도 합산 (E-지갑 상품설명서) */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-3">
          💼 보관·이용한도 합산 (외화 E-지갑과 공통)
        </h2>
        <p className="text-xs text-charcoal-soft mb-3">
          『외화 E-지갑』 서비스 상품설명서 (준법감시인 심의필 25-1407호) 본문에
          명시된 내용입니다.
        </p>
        <dl className="space-y-2 text-sm">
          <Row
            label="외화 보관한도"
            value="USD 10,000 상당액 이하 — 외화 E-지갑 보관 잔액 + 외화기프티콘 미수령 금액 + 환전예약 미수령 금액 합산 산정"
          />
          <Row
            label="월 이용한도"
            value="USD 30,000 상당액 이하 — 외화 E-지갑·외화기프티콘·환전예약·전화 환전예약 합산"
          />
          <Row
            label="연 이용한도"
            value="USD 100,000 상당액 이하 — 외화 E-지갑·외화기프티콘·환전예약·전화 환전예약 합산"
          />
        </dl>
        <p className="text-[10px] text-charcoal-soft mt-3">
          📄 출처: 『외화 E-지갑』 서비스 상품설명서 §2 (서비스 상세내용 / 합산 산정)
        </p>
      </section>

      {/* PDF 명시 — 외화수령증 양식 (서식 4012471) */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-3">📝 외화수령증 — 개인정보 수집·이용 동의서 (서식 4012471)</h2>
        <p className="text-xs text-charcoal-soft mb-3">
          외화수령증은 개인(신용)정보 수집·이용 동의서 겸용입니다. 신용정보의
          이용 및 보호에 관한 법률·개인정보보호법에 따라 동의가 필요합니다.
        </p>
        <dl className="space-y-2 text-sm mb-3">
          <Row label="상품명" value="외화기프티콘" />
          <Row
            label="수집·이용 목적"
            value="(금융)거래관계 설정·유지·이행·관리 / 금융사고 조사·분쟁해결·민원처리"
          />
          <Row
            label="수집·이용 항목"
            value="성명, 휴대폰번호, 생년월일(주민번호 앞 6자리)"
          />
          <Row
            label="보유·이용 기간"
            value="(금융)거래 종료일로부터 5년 — 이후 법령상 의무이행 범위에서만 보유"
          />
          <Row
            label="동의 거부 권리"
            value="거부 가능. 단 거부 시 외화기프티콘 계약 체결 및 (금융)거래 설정·유지 불가"
          />
          <Row
            label="수령 시 기재"
            value="수령인 성명·서명(또는 인), 휴대폰번호, 생년월일, 수령일자"
          />
          <Row
            label="비고"
            value="동의 이전에 발생한 개인(신용)정보도 수집·이용 대상에 포함. 은행의 고의·과실 등 귀책사유로 인한 개인정보 유출 시 관계 법령에 따라 보상."
          />
        </dl>
        <div className="bg-offwhite border border-border rounded-md p-3 text-xs text-charcoal-soft">
          <p className="font-medium text-charcoal mb-0.5">📄 양식 식별</p>
          <p>서식 번호 4012471 · 외화수령증(외화기프티콘) 개인(신용)정보 수집·이용 동의서 겸용</p>
        </div>
      </section>

      {/* 영업점 응대 — PDF 근거만 */}
      <section className="bg-warn/5 border border-warn/40 rounded-xl p-4 mb-4">
        <h2 className="font-bold text-sm mb-2">⚠️ 영업점 응대 — PDF 명시 사항</h2>
        <ul className="text-xs text-charcoal space-y-1 list-disc list-inside leading-relaxed">
          <li>
            외화수령증에 수령인{" "}
            <strong>성명·서명(또는 인)·휴대폰번호·생년월일 기재</strong> 후 동의
            항목 ☑ 체크 확인.
          </li>
          <li>
            동의 거부 시 외화기프티콘 계약 체결 불가 (서식 4012471 본문 명시).
          </li>
          <li>
            보관한도(USD 10,000)는{" "}
            <strong>E-지갑·외화기프티콘·환전예약 미수령 금액 합산</strong> —
            한도 잔여 확인 후 발행/지급.
          </li>
          <li>
            월/연 이용한도(USD 30,000 / USD 100,000)도{" "}
            <strong>합산 산정</strong>되므로 다른 채널 이용 내역과 함께 확인.
          </li>
          <li>
            상세 발행·수령 절차·환율우대는{" "}
            <strong>본부 외환사업부 매뉴얼 확인</strong>.
          </li>
        </ul>
      </section>

      {/* 관련 환전 채널 */}
      <section className="mt-6">
        <p className="text-[10px] text-charcoal-soft uppercase tracking-wide mb-2 px-1">
          관련 환전 채널
        </p>
        <div className="grid sm:grid-cols-3 gap-2">
          <Link
            href="/guide/exchange/e-wallet"
            className="bg-white border border-border rounded-lg p-3 hover:border-primary transition group"
          >
            <p className="font-medium text-sm group-hover:text-primary transition">
              💼 외화 E-지갑
            </p>
            <p className="text-xs text-charcoal-soft mt-0.5">
              보관한도·이용한도 합산 산정 대상
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
              비대면 수령 — 배달·CU편의점
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
              우대율 적용 환산
            </p>
          </Link>
        </div>
      </section>

      <p className="text-[10px] text-charcoal-soft mt-6 pt-4 border-t border-border">
        📄 출처: 외화수령증(외화기프티콘) 개인(신용)정보 수집·이용 동의서 겸용
        (서식 4012471) + 『외화 E-지갑』 서비스 상품설명서 (준법감시인 심의필
        25-1407호)
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
