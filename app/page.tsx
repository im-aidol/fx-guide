import Link from "next/link";
import { BUSINESS_AREAS } from "@/lib/data/business-areas";
import { AdminNote } from "@/components/admin/AdminNote";

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-8">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          영업점 외환 가이드
        </p>
        <h1 className="text-3xl font-bold mb-2">어떤 일로 오셨어요?</h1>
        <p className="text-sm text-charcoal-soft">
          창구에서 가장 먼저 분기되는 6개 업무. 클릭해서 해당 영역의 사유·상품·절차를 확인하세요.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:home" />

      <section className="grid md:grid-cols-2 gap-4">
        {BUSINESS_AREAS.map((area) => (
          <Link
            key={area.id}
            href={area.href}
            className="bg-white border border-border rounded-xl p-5 hover:border-primary transition group flex flex-col"
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="text-3xl leading-none">{area.icon}</span>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-lg group-hover:text-primary transition">
                  {area.title}
                </h2>
                <p className="text-xs text-charcoal-soft mt-0.5">
                  {area.subtitle}
                </p>
              </div>
            </div>
            <p className="text-sm text-charcoal-soft flex-1 leading-relaxed">
              {area.description}
            </p>
            <span className="text-sm text-primary font-medium mt-3 group-hover:translate-x-1 transition">
              들어가기 →
            </span>
          </Link>
        ))}
      </section>

      <aside className="mt-8 bg-offwhite border border-border rounded-xl p-5 text-sm">
        <p className="font-medium mb-1">💡 사유를 모르시면</p>
        <p className="text-charcoal-soft">
          고객 답변 들으면서 클릭해 좁혀가는{" "}
          <Link
            href="/simulator"
            className="text-primary font-medium hover:underline"
          >
            당발송금 도우미 (시뮬레이터)
          </Link>
          를 이용하세요. 입구 3개(명확/서류/모호)로 시작합니다.
        </p>
      </aside>
    </div>
  );
}
