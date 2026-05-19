import Link from "next/link";
import { AdminNote } from "@/components/admin/AdminNote";

export default function TradeFinanceGuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link
        href="/guide"
        className="text-xs text-charcoal-soft hover:text-primary inline-flex items-center gap-1 mb-3"
      >
        ← 가이드 홈
      </Link>
      <header className="mb-6">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          🏭 무역금융
        </p>
        <h1 className="text-3xl font-bold mb-2">무역금융 안내</h1>
        <p className="text-sm text-charcoal-soft">
          수출입대금·신용장(LC)·내국신용장·수출대금채권 매입 등. 외국환거래약정서로 시작.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-trade-finance" />

      {/* 시작 — 외국환거래약정서 */}
      <section className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-2">📑 영업점 첫 단계 — 외국환거래약정서</h2>
        <p className="text-sm text-charcoal mb-3">
          무역회사 고객과 처음 거래 시 받는 기본 약정서. 이 약정 하에 모든 후속 거래(신용장 개설·매입·결제)가 적용됨.
        </p>
        <p className="text-xs text-charcoal-soft">
          출처: 외국환거래약정서 (개정후, 2026-05-12)
        </p>
      </section>

      {/* 적용 거래 */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-3">📋 약정서 적용 거래 (1-2조)</h2>
        <ul className="space-y-2 text-sm">
          <Item title="① 수출거래">
            화환어음 매입·추심 / 보증신용장 무화환어음 매입 등
          </Item>
          <Item title="② 수입거래">
            신용장 개설 / 화환어음 인도·결제 / 보증신용장 인도·결제 등
          </Item>
          <Item title="③ 내국신용장 개설거래">
            수출용 원자재 국내 구매 신용장
          </Item>
          <Item title="④ 내국신용장환어음 매입(추심)거래">
            내국신용장어음 등의 매입·추심
          </Item>
          <Item title="⑤ 수출대금채권 매입거래 (Open Account)">
            선적통지부 사후송금방식 수출거래
          </Item>
        </ul>
      </section>

      {/* 주요 용어 */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-3">📖 주요 용어 (약정서 1조)</h2>
        <dl className="space-y-2 text-sm">
          <Term term="화환어음" def="선적서류 첨부 발행 환어음" />
          <Term term="무화환어음" def="환어음에 선적서류 없이 증명서·확인서 첨부 발행" />
          <Term term="내국신용장" def="수출물품·수출용 원자재 국내 구매용 신용장" />
          <Term term="선적통지부 사후송금방식 (Open Account)" def="수출상 선적 + 운송서류 수입상 직접 발송, 일정기간 후 은행계좌 입금" />
          <Term term="대도" def="대금 결제 전 은행이 소유권 유지한 채 수입화물 처분 허용" />
          <Term term="일람출급" def="서류 제시 후 즉시 대금 지급" />
          <Term term="기한부출급" def="30·60·90일 등 일정기간 후 대금 지급" />
          <Term term="수입화물선취보증서 (L/G)" def="수입물품 도착·운송서류 미도착 시, 선하증권 대신 제출하고 화물 인도받는 보증서" />
        </dl>
      </section>

      {/* 환율 적용 */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-2">💱 적용 환율 (약정서 4조)</h2>
        <p className="text-sm text-charcoal-soft">
          신청서 접수일과 무관하게 <strong>실제 지급·수령일</strong>의 은행 정한 환율 적용. (단 미수금·외화지급보증 대지급금은 처리일 환율 사용 가능)
        </p>
      </section>

      {/* 준용 규정 */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-2">📚 준용 규정 (약정서 7조)</h2>
        <ul className="text-sm space-y-1 text-charcoal-soft list-disc list-inside">
          <li>신용장통일규칙 (UCP)</li>
          <li>추심에 관한 통일규칙 (URC)</li>
          <li>은행간 신용장대금상환에 관한 통일규칙 (URR)</li>
          <li>기타 국제규약</li>
          <li>전자무역업무표준약관</li>
          <li>은행의 관련 규정</li>
        </ul>
      </section>

      {/* 관련 자료 */}
      <section className="bg-offwhite border border-border rounded-xl p-5 text-sm">
        <h3 className="font-medium mb-2">📄 관련 자료</h3>
        <ul className="space-y-1 text-charcoal-soft list-disc list-inside">
          <li>외국환거래약정서 (무역금융 거래 기본 약정)</li>
          <li>전자무역업무 기본약관 (전자무역 거래)</li>
          <li>외환거래 기본약관 (공통)</li>
          <li>외환규정 1-2조 본문 (용어 정의)</li>
        </ul>
        <p className="text-[10px] text-charcoal-soft mt-3">
          ⚠️ 무역금융 상세 시나리오 트리는 추후 추가 예정. 현 단계에서는 약정서 인덱스 + 주요 용어만 정리.
        </p>
      </section>
    </div>
  );
}

function Item({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="border-l-2 border-primary/30 pl-3">
      <p className="font-medium text-charcoal">{title}</p>
      <p className="text-charcoal-soft text-sm">{children}</p>
    </li>
  );
}

function Term({ term, def }: { term: string; def: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3 py-1 border-b border-border last:border-0">
      <dt className="font-medium sm:w-44 sm:shrink-0">{term}</dt>
      <dd className="text-sm text-charcoal-soft">{def}</dd>
    </div>
  );
}
