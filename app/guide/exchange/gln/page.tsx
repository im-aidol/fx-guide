"use client";

import Link from "next/link";
import { AdminNote } from "@/components/admin/AdminNote";

// GLN 해외 간편 결제 — 해외 결제 서비스 (송금·환전과 별개).
// 모바일앱 QR/바코드로 8개국 가맹점 결제.
// 출처: 『GLN 해외 간편 결제 서비스』 상품설명서 (준법감시인 심의필 25-1193호, 2025.06.02~2027.05.31)

export default function GlnPage() {
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
        <span className="text-charcoal">GLN 해외 간편 결제</span>
      </nav>

      <header className="mb-4">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          💳 해외 결제 도구
        </p>
        <h1 className="text-3xl font-bold mb-2">GLN 해외 간편 결제</h1>
        <p className="text-sm text-charcoal-soft leading-relaxed">
          모바일앱뱅킹의 QR/바코드로 해외 8개국 GLN 가맹점에서 결제하는 서비스.
          송금·환전이 아닌 결제 — 해외 출국 고객 현지 결제용.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:exchange-gln" />

      {/* GLN은 송금 아님 안내 */}
      <section className="bg-warn/10 border border-warn/40 rounded-xl p-4 mb-4">
        <p className="text-xs font-medium text-charcoal mb-1">
          ⚠️ GLN은 송금이 아닌 결제 서비스
        </p>
        <p className="text-xs text-charcoal-soft leading-relaxed">
          GLN은 해외 가맹점에서 QR/바코드로 결제하는 서비스로, 송금(자금 이체)이
          아닌 결제 거래입니다. 해외 출국 고객이 현지 결제 도구로 사용하므로
          환전과 같은 카테고리(해외 결제 도구)에서 안내합니다.
        </p>
      </section>

      {/* 한눈에 보기 */}
      <section className="bg-primary/5 border border-primary/30 rounded-xl p-4 mb-4">
        <h2 className="font-bold text-sm mb-2">🔑 한눈에 보기</h2>
        <ul className="text-xs text-charcoal-soft space-y-0.5 list-disc list-inside leading-relaxed">
          <li>
            <strong className="text-charcoal">대상</strong>: 만 14세 이상 본인
            계좌 보유 개인 (국민인 거주자)
          </li>
          <li>
            <strong className="text-charcoal">출금계좌</strong>: 원화 또는 외화(USD)
            요구불 계좌
          </li>
          <li>
            <strong className="text-charcoal">가입</strong>: 모바일앱뱅킹 로그인 →
            QR해외결제(GLN) 메뉴
          </li>
          <li>
            <strong className="text-charcoal">결제 한도</strong>: 1일 최대 원화 200만원,
            미화 2,000불 (지역·제휴사별 상이)
          </li>
          <li>
            <strong className="text-charcoal">수수료</strong>: 결제 금액 USD 환산
            <strong className="text-primary"> 1.05%</strong> + 거래당
            <strong className="text-primary"> USD 0.13</strong>
          </li>
        </ul>
      </section>

      {/* 이용 가능 지역 8개국 */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-3">🌐 이용 가능 지역 8개국 + 환율 제공 은행</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-offwhite text-charcoal-soft">
              <tr className="border-b border-border">
                <th className="text-left p-2.5 uppercase tracking-wide">국가</th>
                <th className="text-left p-2.5 uppercase tracking-wide">제휴사</th>
                <th className="text-left p-2.5 uppercase tracking-wide">환율 제공 은행</th>
              </tr>
            </thead>
            <tbody className="text-charcoal">
              <Row c="🇹🇭 태국" partner="Siam Commercial Bank" rate="시암은행" />
              <Row c="🇯🇵 일본" partner="JCB Co., Ltd" rate="하나은행" />
              <Row c="🇹🇼 대만" partner="Taishin International Bank" rate="타이신은행" />
              <Row c="🇭🇰 홍콩" partner="EFT Payment (Asia)" rate="하나은행" />
              <Row c="🇸🇬 싱가포르" partner="Liquid Group Pte" rate="JP Morgan은행" />
              <Row c="🇺🇸 괌/사이판" partner="CITCON USA LLC" rate="—" />
              <Row c="🇱🇦 라오스" partner="BCEL" rate="BCEL은행" />
              <Row c="🇰🇭 캄보디아" partner="ACLEDA" rate="ACLEDA은행" />
            </tbody>
          </table>
        </div>
      </section>

      {/* 적용 환율 */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-3">💱 적용 환율</h2>
        <div className="space-y-3 text-sm">
          <div className="bg-offwhite border border-border rounded-md p-3">
            <p className="font-medium text-charcoal mb-1.5">원화로 결제 시</p>
            <p className="text-xs text-charcoal-soft leading-relaxed">
              현지통화 결제금액에 환율 ①·②를 적용해 KRW로 산출:
              <br />
              ① 현지통화 → USD: 실시간 GLN 해외 결제 서비스용 매입률
              <br />
              ② USD → KRW: 실시간 GLN 해외 결제 서비스용 매도율 —{" "}
              <strong className="text-charcoal">
                [아이엠뱅크 고시 매매기준율 × (1 + 0.0045)]
              </strong>
            </p>
          </div>
          <div className="bg-offwhite border border-border rounded-md p-3">
            <p className="font-medium text-charcoal mb-1.5">USD로 결제 시</p>
            <p className="text-xs text-charcoal-soft leading-relaxed">
              현지통화 결제금액에 환율 ①만 적용해 USD로 산출:
              <br />
              ① 현지통화 → USD: 실시간 GLN 해외 결제 서비스용 매입률
            </p>
          </div>
        </div>
      </section>

      {/* 결제 한도 예시 */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-3">📐 결제 한도</h2>
        <p className="text-xs text-charcoal-soft mb-3">
          표준 한도: 1일 최대 <strong className="text-charcoal">원화 200만원</strong>,
          미화 2,000불 — 서비스 지역·제휴사·가맹점 규모에 따라 상이.
        </p>
        <div className="bg-offwhite border border-border rounded-md p-3 text-xs">
          <p className="font-medium text-charcoal mb-1.5">태국 예시</p>
          <ul className="text-charcoal-soft space-y-0.5 list-disc list-inside leading-relaxed">
            <li>
              <strong>소형가맹점</strong>: 1회 최대 2,000 THB / 1일 최대 15,000 THB
              / 월 최대 500만원 상당액
            </li>
            <li>
              <strong>중대형가맹점</strong>: 1회 최대 100만원 / 1일 최대 200만원
              상당액
            </li>
          </ul>
        </div>
      </section>

      {/* 거래 제한·취소 */}
      <section className="bg-warn/5 border border-warn/40 rounded-xl p-4 mb-4">
        <h2 className="font-bold text-sm mb-2">⚠️ 거래 제한·취소 정책</h2>
        <ul className="text-xs text-charcoal space-y-1 list-disc list-inside leading-relaxed">
          <li>
            출금계좌 <strong>해지·거래중지·법적 지급제한·잔액 부족·전자금융 제한
            등록·예금잔액증명서 발급 당일</strong>은 서비스 제한·정지.
          </li>
          <li>
            결제 정보가 가맹점 전자장치에 도달해 거래가 확정되면{" "}
            <strong>철회 불가</strong>. 단 단말기 조작 오류 등은 철회 가능.
          </li>
          <li>
            반품·취소는 제휴가맹점과 합의 후 가맹점 단말기 또는 온라인 결제
            프로그램으로 처리. 일부 해외 제휴사·가맹점은 취소 제한.
          </li>
          <li>이용 매체(스마트폰) 도난·분실 시 즉시 사고신고.</li>
          <li>해지: 모바일앱뱅킹에서 즉시 해지 가능.</li>
        </ul>
      </section>

      {/* 관련 환전·결제 채널 */}
      <section className="mt-6">
        <p className="text-[10px] text-charcoal-soft uppercase tracking-wide mb-2 px-1">
          관련 환전·해외 결제 채널
        </p>
        <div className="grid sm:grid-cols-3 gap-2">
          <Link
            href="/guide/exchange/calculator"
            className="bg-white border border-border rounded-lg p-3 hover:border-primary transition group"
          >
            <p className="font-medium text-sm group-hover:text-primary transition">
              🧮 환전 계산기
            </p>
            <p className="text-xs text-charcoal-soft mt-0.5">
              원·외화 환산 + 환율우대
            </p>
          </Link>
          <Link
            href="/guide/exchange/e-wallet"
            className="bg-white border border-border rounded-lg p-3 hover:border-primary transition group"
          >
            <p className="font-medium text-sm group-hover:text-primary transition">
              💼 외화 E-지갑
            </p>
            <p className="text-xs text-charcoal-soft mt-0.5">
              외화 보관·영업점 수령
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
              비대면 수령 (배달·CU)
            </p>
          </Link>
        </div>
      </section>

      <p className="text-[10px] text-charcoal-soft mt-6 pt-4 border-t border-border">
        📄 출처: 『GLN 해외 간편 결제 서비스』 상품설명서 (준법감시인 심의필
        25-1193호, 2025.06.02~2027.05.31) + 전자금융거래기본약관 + GLN 해외 간편
        결제 서비스 이용약관
      </p>
    </div>
  );
}

function Row({
  c,
  partner,
  rate,
}: {
  c: string;
  partner: string;
  rate: string;
}) {
  return (
    <tr className="border-b border-border last:border-0">
      <td className="p-2.5 font-medium">{c}</td>
      <td className="p-2.5 text-charcoal-soft">{partner}</td>
      <td className="p-2.5 text-charcoal-soft">{rate}</td>
    </tr>
  );
}
