"use client";

import Link from "next/link";
import { InterestSimulator } from "@/components/deposit/InterestSimulator";
import { AdminNote } from "@/components/admin/AdminNote";

export default function DepositSimulatorPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-charcoal-soft mb-3 flex items-center gap-1">
        <Link href="/guide" className="hover:text-primary">
          가이드 홈
        </Link>
        <span>›</span>
        <Link href="/guide/deposit" className="hover:text-primary">
          외화 예금·적금
        </Link>
        <span>›</span>
        <span className="text-charcoal">이자 시뮬레이터</span>
      </nav>

      <header className="mb-4">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          🧮 외화 예적금 도구
        </p>
        <h1 className="text-3xl font-bold mb-2">이자 시뮬레이터</h1>
        <p className="text-sm text-charcoal-soft leading-relaxed">
          상품·통화·예치일수·금액·금리를 입력하면 만기 이자와 원리금을 미리
          계산합니다. 외화예금거래기본약관 제4조 기준 (USD 등 연 360일 / JPY·GBP는
          365일).
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:deposit-simulator" />

      <InterestSimulator />

      {/* 안내 */}
      <section className="mt-6 bg-warn/10 border border-warn/30 rounded-xl p-4 text-xs text-charcoal-soft">
        <p className="font-medium text-charcoal mb-1.5">
          ⚠️ 시뮬레이터 사용 시 유의
        </p>
        <ul className="space-y-0.5 list-disc list-inside">
          <li>
            <strong className="text-charcoal">참고용</strong>입니다. 실제 거래 금리는
            매 영업일 영업점·홈페이지 게시 통화·기간별 금리.
          </li>
          <li>
            세전 이자 — 비과세종합저축 가입 불가 (소득세·지방소득세 별도 차감).
          </li>
          <li>
            원화 환산 출금 시 환율은{" "}
            <strong className="text-charcoal">대고객 전신환매입율</strong>{" "}
            적용 (외화예금거래기본약관 제5조). 환율 변동 손익 발생 가능.
          </li>
          <li>
            중도해지·만기 후 청구·자동재예치 등 실제 시점의 적용 금리는 시뮬레이터
            결과와 다를 수 있음. 각 상품 상세 페이지의 약관 본문 인용 참조.
          </li>
        </ul>
      </section>

      {/* 다른 도구 */}
      <section className="mt-6">
        <p className="text-xs text-charcoal-soft uppercase tracking-wide mb-2">
          외화 예적금 다른 화면
        </p>
        <div className="grid sm:grid-cols-2 gap-2">
          <Link
            href="/guide/deposit"
            className="bg-white border border-border rounded-lg p-3 hover:border-primary transition group"
          >
            <p className="font-medium text-sm group-hover:text-primary transition">
              🔍 외화 예적금 메인 (검색·빠른 질문)
            </p>
            <p className="text-xs text-charcoal-soft mt-0.5">
              12개 상품 통합 검색·자주 묻는 질문·전체 비교표
            </p>
          </Link>
          <Link
            href="/guide/deposit/fc-time-deposit"
            className="bg-white border border-border rounded-lg p-3 hover:border-primary transition group"
          >
            <p className="font-medium text-sm group-hover:text-primary transition">
              📖 외화정기예금 상세 (예시 카드)
            </p>
            <p className="text-xs text-charcoal-soft mt-0.5">
              약관 본문 인용·이자 산식·중도해지·응대 멘트
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
