"use client";

import Link from "next/link";
import { ExchangeCalculator } from "@/components/exchange/ExchangeCalculator";
import { AdminNote } from "@/components/admin/AdminNote";

export default function ExchangeCalculatorPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <nav className="text-xs text-charcoal-soft mb-3 flex items-center gap-1">
        <Link href="/guide" className="hover:text-primary">
          가이드 홈
        </Link>
        <span>›</span>
        <Link href="/guide/exchange" className="hover:text-primary">
          환전
        </Link>
        <span>›</span>
        <span className="text-charcoal">환전 계산기</span>
      </nav>

      <header className="mb-4">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          🧮 환전 도구
        </p>
        <h1 className="text-3xl font-bold mb-2">환전 계산기</h1>
        <p className="text-sm text-charcoal-soft leading-relaxed">
          고객 상담 시 활용 — 원화↔외화 금액 환산, 환율 종류 선택(매매기준율·
          전신환매도/매입·현찰매도/매입), 환율우대(%) 적용.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-exchange-calculator" />

      <ExchangeCalculator />

      {/* 사용 팁 */}
      <section className="mt-6 bg-white border border-border rounded-xl p-4 text-xs text-charcoal-soft leading-relaxed">
        <p className="font-medium text-charcoal mb-2">💡 사용 팁</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>
            <strong className="text-charcoal">매매기준율</strong>: 외환규정 1-2조
            7호 — 외국환중개회사 시장평균환율. 페이지 진입 시 참고용 환율(USD
            기준 자동 페치)이 채워지므로 영업점 게시 매매기준율로 수정해서
            쓰세요.
          </li>
          <li>
            <strong className="text-charcoal">환율 종류</strong>: 전신환은 송금·
            계좌 외화 거래, 현찰은 외화 지폐 거래. 매도(고객이 외화 살 때) /
            매입(고객이 외화 팔 때).
          </li>
          <li>
            <strong className="text-charcoal">영업점 게시 환율 직접 입력</strong>
            : 정확한 우대 계산을 위해 오늘 게시된 매도/매입 환율을 직접 입력하면
            그 값에 우대율이 적용됩니다.
          </li>
          <li>
            <strong className="text-charcoal">환율우대 %</strong>: 매매기준율과
            게시 환율의 차이(=마진)를 N%만큼 줄임. 50% 우대면 마진의 절반이
            할인됨.
          </li>
        </ul>
      </section>

      {/* 주의 — 다시 강조 */}
      <aside className="mt-4 bg-warn/10 border border-warn/40 rounded-xl p-4 text-xs text-charcoal leading-relaxed">
        <p className="font-medium mb-1">⚠️ 안내</p>
        <p>
          본 계산기는 영업점 상담 보조용입니다. 실시간 환율 변동에 따라 상담 시
          금액과 실제 거래 금액이 상이할 수 있으며, 실제 거래는 거래 시점의
          영업점 게시 환율·당행 매매기준율 기준으로 처리됩니다.
        </p>
      </aside>

      {/* 관련 화면 */}
      <section className="mt-6">
        <p className="text-[10px] text-charcoal-soft uppercase tracking-wide mb-2 px-1">
          관련 화면
        </p>
        <div className="grid sm:grid-cols-3 gap-2">
          <Link
            href="/guide/exchange/info"
            className="bg-white border border-border rounded-lg p-3 hover:border-primary transition group"
          >
            <p className="font-medium text-sm group-hover:text-primary transition">
              📐 환율 산출 안내
            </p>
            <p className="text-xs text-charcoal-soft mt-0.5">
              매매기준율·전신환·현찰 원리
            </p>
          </Link>
          <Link
            href="/samples"
            className="bg-white border border-border rounded-lg p-3 hover:border-primary transition group"
          >
            <p className="font-medium text-sm group-hover:text-primary transition">
              💴 통화 견본
            </p>
            <p className="text-xs text-charcoal-soft mt-0.5">
              권종별 매입·매도 가능 여부
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
              비대면 외화 수령 (외화 배송·기프티콘)
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
