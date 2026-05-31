import Link from "next/link";
import { BUSINESS_AREAS } from "@/lib/data/business-areas";
import { AdminNote } from "@/components/admin/AdminNote";
import { HomeRatePanel } from "@/components/HomeRatePanel";

export default function HomePage() {
  return (
    <div className="max-w-[clamp(960px,92vw,1440px)] mx-auto px-6 py-12">
      <header className="mb-8">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          영업점 외환 가이드
        </p>
        <h1 className="text-3xl font-bold mb-2">어떤 업무를 도와드릴까요?</h1>
        <p className="text-sm text-charcoal-soft">
          가장 많이 일어나는 업무를 정리했어요! 클릭하면 상세 페이지로 들어가요.
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

      <HomeRatePanel />
    </div>
  );
}
