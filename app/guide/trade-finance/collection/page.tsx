import Link from "next/link";
import { AdminNote } from "@/components/admin/AdminNote";
import { SETTLEMENT_METHODS } from "@/lib/data/trade-finance";

// 추심 (D/P·D/A) — URC 522 기반 무신용장 거래.

const COLLECTION_METHODS = SETTLEMENT_METHODS.filter(
  (m) => m.parent === "collection",
);

export default function CollectionPage() {
  return (
    <div className="max-w-[clamp(960px,92vw,1440px)] mx-auto px-6 py-8">
      <nav className="text-xs text-charcoal-soft mb-3 flex items-center gap-1">
        <Link href="/guide" className="hover:text-primary">
          가이드 홈
        </Link>
        <span>›</span>
        <Link href="/guide/trade-finance" className="hover:text-primary">
          무역금융
        </Link>
        <span>›</span>
        <span className="text-charcoal">추심</span>
      </nav>

      <header className="mb-5">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          🔄 무역금융 · 무신용장
        </p>
        <h1 className="text-2xl font-bold mb-1">추심 (D/P · D/A)</h1>
        <p className="text-sm text-charcoal-soft leading-relaxed">
          신용장 없이 환어음 + 선적서류를 거래은행을 통해 추심하는 방식. 은행은 지급보증 없이 중개인
          역할만.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-trade-collection" />

      {/* 정의 */}
      <section className="bg-white border border-border rounded-xl p-4 mb-5">
        <h2 className="font-bold text-sm mb-2">📖 추심이란?</h2>
        <p className="text-xs text-charcoal-soft leading-relaxed mb-2">
          수출상이 수입상에게 물품을 송부한 후, 수입상을 지급인으로 하는 환어음과 계약서에 명시된 각종
          선적서류를 갖춘 후 거래은행을 통해 추심하는 방식.
        </p>
        <ul className="text-xs text-charcoal-soft list-disc list-inside leading-relaxed space-y-0.5">
          <li>수출입 당사자간 신용을 기반</li>
          <li>은행은 지급보증 개입 없이 위임사무의 처리를 위한 중개인(보조자) 역할</li>
          <li>추심에 관한 통일규칙 (URC 522) 적용</li>
        </ul>
      </section>

      {/* D/P vs D/A */}
      <section className="mb-5">
        <h2 className="font-bold text-sm mb-2 px-1">⚖️ D/P vs D/A</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {COLLECTION_METHODS.map((m) => (
            <div
              key={m.id}
              className={[
                "border rounded-xl p-4",
                m.id === "dp"
                  ? "bg-primary/5 border-primary/30"
                  : "bg-warn/5 border-warn/30",
              ].join(" ")}
            >
              <p className="font-bold text-sm mb-1">{m.korTitle}</p>
              <p className="text-[10px] text-charcoal-soft mb-2">
                {m.engTitle}
              </p>
              <p className="text-xs text-charcoal-soft leading-relaxed bg-white border border-border rounded p-2">
                {m.description}
              </p>
              <p className="text-[10px] text-primary mt-2 font-medium">
                🔖 {m.applicableRule}
              </p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-charcoal-soft mt-3 leading-relaxed bg-offwhite border border-border rounded-lg p-3">
          💡 <strong>D/P vs D/A 차이:</strong> D/P는 일람불 — 서류 인도와 동시에 대금결제. D/A는 기한부 — 환어음
          인수만으로 서류 인도, 만기에 대금지급. D/A는 인수 후 부도 가능성 → 매입은행은 신용 점검 필수.
        </p>
      </section>

      {/* 흐름도 요약 */}
      <section className="bg-white border border-border rounded-xl p-4 mb-5">
        <h2 className="font-bold text-sm mb-3">🗺️ 추심 거래 흐름도</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div>
            <p className="font-medium mb-1 text-primary">수출 측</p>
            <ol className="text-charcoal-soft list-decimal list-inside leading-relaxed space-y-0.5">
              <li>매매 계약</li>
              <li>물품 선적</li>
              <li>
                추심의뢰은행(iM뱅크)에 수출환어음 추심 의뢰 (선적서류)
              </li>
              <li>대금 지급 (입금 통지 후)</li>
            </ol>
          </div>
          <div>
            <p className="font-medium mb-1 text-warn">수입 측</p>
            <ol className="text-charcoal-soft list-decimal list-inside leading-relaxed space-y-0.5">
              <li>추심의뢰은행 → 추심은행 선적서류 송부</li>
              <li>추심은행이 지급인(수입상)에게 서류 제시</li>
              <li>수입상이 대금 지급 또는 인수 후 선적서류 인도, 통관</li>
              <li>추심은행 → 추심의뢰은행 대금 이체</li>
            </ol>
          </div>
        </div>
        <div className="mt-3 text-center">
          <Link
            href="/guide/trade-finance/flow-collection"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
          >
            📍 8단계 인터랙티브 흐름도 보기 →
          </Link>
        </div>
      </section>

      {/* 영업점 응대 멘트 */}
      <section className="bg-primary/5 border border-primary/30 rounded-xl p-4 mb-5">
        <h2 className="font-bold text-sm mb-2">💬 영업점 응대 멘트</h2>
        <ul className="text-xs text-charcoal space-y-1.5 leading-relaxed">
          <li>
            ▶ &ldquo;추심 거래는 은행이 대금을 보증하지 않습니다. 거래처 신용을 먼저 확인하세요.&rdquo;
          </li>
          <li>
            ▶ &ldquo;D/P는 즉시 결제, D/A는 인수 후 만기 결제예요. 어떤 조건으로 계약하셨나요?&rdquo;
          </li>
          <li>
            ▶ &ldquo;D/A는 인수 후 부도 가능성이 있어, 단기수출보험 가입을 권장드립니다.&rdquo;
          </li>
          <li>
            ▶ &ldquo;추심 전 매입(NEGO)도 가능하지만, 신용등급에 따라 보증부(하자) 전결권이 적용될 수 있어요.&rdquo;
          </li>
        </ul>
      </section>

      {/* 부도 처리 */}
      <section className="bg-danger/5 border border-danger/30 rounded-xl p-4 mb-5">
        <h2 className="font-bold text-sm mb-2">❌ 부도 처리</h2>
        <p className="text-xs text-charcoal-soft leading-relaxed mb-2">
          추심 전 매입한 수출환어음 등이 부도·인수거절 통지되거나 예정입금일/예정인수일을 경과하여 입금/인수되지
          않는 경우 부도처리.
        </p>
        <p className="text-[11px] text-charcoal-soft">
          상세 룰은{" "}
          <Link
            href="/guide/trade-finance/export-lc"
            className="text-primary hover:underline"
          >
            수출 신용장 가이드 · 부도처리
          </Link>{" "}
          참조.
        </p>
      </section>

      <div className="grid sm:grid-cols-2 gap-3">
        <Link
          href="/guide/trade-finance/flow-collection"
          className="bg-primary/5 border border-primary/30 rounded-xl p-3 hover:border-primary transition group"
        >
          <p className="font-bold text-sm group-hover:text-primary transition">
            🔁 추심 거래 흐름도 →
          </p>
          <p className="text-xs text-charcoal-soft mt-0.5">8단계 인터랙티브</p>
        </Link>
        <Link
          href="/guide/trade-finance"
          className="bg-white border border-border rounded-xl p-3 hover:border-primary transition group"
        >
          <p className="font-bold text-sm group-hover:text-primary transition">
            ← 무역금융 진입판
          </p>
          <p className="text-xs text-charcoal-soft mt-0.5">전체 가이드 목록</p>
        </Link>
      </div>
    </div>
  );
}
