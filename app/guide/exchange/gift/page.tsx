"use client";

import Link from "next/link";
import { AdminNote } from "@/components/admin/AdminNote";

// 외화 기프티콘 — 외화 수령권을 제3자(또는 본인)에게 선물 형태로 전달.
// 수령자가 영업점 방문해서 외화 현찰을 수령 (= 대면 수령).
// 비대면 수령 채널이 아님 → 외화 배송과 구분되는 별도 서비스.
// 출처: 외화수령증(외화기프티콘) 개인(신용)정보 수집·이용 동의서 겸용

export default function GiftCoinPage() {
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
        <span className="text-charcoal">외화 기프티콘</span>
      </nav>

      <header className="mb-4">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          🎁 환전 — 선물 전달
        </p>
        <h1 className="text-3xl font-bold mb-2">외화 기프티콘</h1>
        <p className="text-sm text-charcoal-soft leading-relaxed">
          모바일앱에서 외화를 환전·발행해 본인 또는 제3자에게 선물 형태로 전달.
          수령자가 영업점을 방문해 외화수령증 작성 후 외화 현찰 수령 (대면).
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:exchange-gift" />

      {/* 외화 배송과의 차이 — 가장 헷갈리는 부분 */}
      <section className="bg-warn/10 border border-warn/40 rounded-xl p-4 mb-4">
        <p className="text-xs font-medium text-charcoal mb-1.5">
          ⚠️ 외화 배송과 헷갈리지 마세요
        </p>
        <ul className="text-xs text-charcoal space-y-0.5 list-disc list-inside leading-relaxed">
          <li>
            <strong>외화 배송</strong>: 비대면 수령 — 지정 일자·장소로 배송원이
            배달 또는 CU편의점 수령
          </li>
          <li>
            <strong>외화 기프티콘</strong>: 대면 수령 — 수령자가{" "}
            <strong>영업점에 직접 방문</strong>해 외화수령증 작성 후 외화 현찰
            수령
          </li>
          <li>
            두 서비스 모두 보관한도 USD 10,000은 외화 E-지갑·환전예약과{" "}
            <strong>합산</strong> 산정
          </li>
        </ul>
      </section>

      {/* 거래 흐름 */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-3">🔄 거래 흐름</h2>
        <div className="space-y-2 text-sm">
          <FlowStep
            n={1}
            title="송금자(고객) — 모바일앱 발행"
            detail="외화 기프티콘 발행 신청 + 수령인 정보(성명·휴대폰)를 본인 또는 제3자로 지정. 송금자 원화 계좌에서 외화 환전 출금."
          />
          <FlowStep
            n={2}
            title="수령인 — 모바일 알림 수신"
            detail="지정된 수령인에게 외화 기프티콘 발행 알림(문자/앱) 전달. 보관 상태로 유지 — 별도 유효기간 없음."
          />
          <FlowStep
            n={3}
            title="수령인 — 영업점 방문 (대면 수령)"
            detail="신분증 + 모바일 수령 정보 지참하고 영업점 방문. 창구에서 외화수령증 작성·서명 + 개인(신용)정보 수집·이용 동의."
            highlight
          />
          <FlowStep
            n={4}
            title="영업점 — 외화 현찰 지급"
            detail="외화수령증 동의 항목 ☑ 확인 후 권종별 외화 현찰 지급. 보관한도에서 차감."
          />
        </div>
      </section>

      {/* 외화수령증 — 영업점 작성 양식 */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-3">📝 외화수령증 (영업점 작성 양식)</h2>
        <p className="text-xs text-charcoal-soft mb-3">
          외화 기프티콘 수령 시 영업점에서 받는 서식. 개인(신용)정보 수집·이용
          동의서 겸용 — 동의 거부 시 수령 불가.
        </p>
        <dl className="space-y-2 text-sm mb-3">
          <Row label="상품명" value="외화기프티콘" />
          <Row
            label="수집·이용 목적"
            value="(금융)거래관계 설정·유지·이행·관리 + 금융사고 조사·분쟁해결·민원처리"
          />
          <Row
            label="수집·이용 항목"
            value="성명, 휴대폰번호, 생년월일(주민번호 앞 6자리)"
          />
          <Row
            label="보유·이용기간"
            value="(금융)거래 종료일로부터 5년 — 이후 법령상 의무이행 범위만 보유"
          />
          <Row
            label="동의 거부 시"
            value="외화기프티콘 계약 체결 및 (금융)거래 설정·유지 불가"
          />
          <Row
            label="확인 사항"
            value="수령인 성명·서명(또는 인) + 휴대폰번호 + 생년월일 + 수령일자"
          />
        </dl>
        <div className="bg-offwhite border border-border rounded-md p-3 text-xs text-charcoal-soft">
          <p className="font-medium text-charcoal mb-0.5">📄 양식 식별</p>
          <p>
            서식 번호 4012471 · 외화수령증(외화기프티콘) 개인(신용)정보
            수집·이용 동의서 겸용
          </p>
        </div>
      </section>

      {/* 영업점 응대 체크포인트 */}
      <section className="bg-warn/5 border border-warn/40 rounded-xl p-4 mb-4">
        <h2 className="font-bold text-sm mb-2">⚠️ 영업점 응대 체크포인트</h2>
        <ul className="text-xs text-charcoal space-y-1 list-disc list-inside leading-relaxed">
          <li>
            <strong>수령인 본인 확인 필수</strong> — 신분증 + 모바일 수령 정보
            모두 확인. 제3자 대리 수령 가능 여부는 본부 매뉴얼 확인.
          </li>
          <li>
            외화수령증{" "}
            <strong>“☑ 동의함” 체크 + 서명/날인 누락</strong> 시 거래 진행
            불가.
          </li>
          <li>
            수령인 본인이 송금자인 케이스 자주 발생 (
            <strong>본인을 수령인으로 지정</strong>해서 발행) — 동일 절차 적용.
          </li>
          <li>
            보관 한도(USD 10,000)는{" "}
            <strong>외화 E-지갑 보관 잔액·환전예약 미수령액과 합산</strong> 산정.
          </li>
          <li>
            영업점 통화 재고 따라 권종 수령 제한 가능 — 수령 전 확인.
          </li>
          <li>
            <strong>USD 10,000 초과 환전</strong>은 국세청·관세청 자동 통보 대상
            (외환규정, 동일자·동일인 합산).
          </li>
        </ul>
      </section>

      {/* 고객 응대 멘트 */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold text-sm mb-2">💬 고객 응대 멘트</h2>
        <ul className="space-y-3">
          <li className="bg-white border-l-4 border-primary/40 pl-4 py-2 pr-3">
            <p className="text-[11px] text-charcoal-soft uppercase tracking-wide mb-1">
              기프티콘으로 선물한다고 묻는 고객
            </p>
            <p className="text-sm text-charcoal italic leading-relaxed">
              &ldquo;외화 기프티콘 발행하시면 받으실 분이 우리 영업점에 직접
              방문해서 신분증 보여주시고 외화수령증에 서명하시면 외화 현찰로
              받아가실 수 있어요. 배송이 아니라 영업점 대면 수령이라는 점만
              안내드릴게요.&rdquo;
            </p>
          </li>
          <li className="bg-white border-l-4 border-primary/40 pl-4 py-2 pr-3">
            <p className="text-[11px] text-charcoal-soft uppercase tracking-wide mb-1">
              본인이 수령인으로 등록된 케이스
            </p>
            <p className="text-sm text-charcoal italic leading-relaxed">
              &ldquo;본인을 수령인으로 지정해서 발행하신 거네요. 동일하게
              외화수령증 작성하시고 개인정보 동의 ☑ 체크하시면 현찰로
              드릴게요.&rdquo;
            </p>
          </li>
          <li className="bg-white border-l-4 border-primary/40 pl-4 py-2 pr-3">
            <p className="text-[11px] text-charcoal-soft uppercase tracking-wide mb-1">
              외화 배송과 차이 묻는 고객
            </p>
            <p className="text-sm text-charcoal italic leading-relaxed">
              &ldquo;외화 배송은 지정하신 곳으로 배달원이 가지고 가거나 편의점에서
              받으시는 비대면 서비스이고, 외화 기프티콘은 받으실 분이 영업점에
              직접 오셔서 받는 방식이라 차이가 있어요. 선물 보내실 분 편한 쪽으로
              안내드릴 수 있어요.&rdquo;
            </p>
          </li>
        </ul>
      </section>

      {/* 다른 환전 채널 비교 */}
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
              본인 보관·영업점 수령·재환전. 외화 계좌 불필요
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
              비대면 수령 — 배달·CU편의점. USD 90% 우대 최고
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
        (서식 4012471)
      </p>
    </div>
  );
}

function FlowStep({
  n,
  title,
  detail,
  highlight,
}: {
  n: number;
  title: string;
  detail: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-start gap-3 rounded-lg border p-3",
        highlight
          ? "bg-primary/5 border-primary/30"
          : "bg-offwhite border-border",
      ].join(" ")}
    >
      <span
        className={[
          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
          highlight
            ? "bg-primary text-white"
            : "bg-white text-charcoal-soft border border-border",
        ].join(" ")}
      >
        {n}
      </span>
      <div className="min-w-0">
        <p className="font-semibold text-charcoal text-sm">{title}</p>
        <p className="text-xs text-charcoal-soft mt-0.5 leading-relaxed">
          {detail}
        </p>
      </div>
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
