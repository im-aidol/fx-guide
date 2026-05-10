import Link from "next/link";

const FEATURES = [
  {
    href: "/simulator",
    title: "송금 흐름 도우미",
    desc: "국가·금액·사유 따라 거래코드/한도/서류/안내멘트 자동 생성. 환율 자동 환산",
    badge: "메인",
  },
  {
    href: "/incoming",
    title: "타발 송금 안내",
    desc: "iM뱅크 SWIFT/BIC + 영문 은행명·주소. 수취인 정보 입력 후 인쇄해 고객에게",
  },
  {
    href: "/guide",
    title: "업무별 가이드",
    desc: "8개 송금 케이스 + 환전·외화예금 가이드를 카테고리별로",
  },
  {
    href: "/faq",
    title: "FAQ",
    desc: "자주 묻는 12개 질문",
  },
  {
    href: "/glossary",
    title: "용어 사전",
    desc: "외환 핵심 용어 17개",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <section className="mb-14">
        <p className="text-primary font-medium mb-2">
          iM뱅크 영업점 직원용 가이드
        </p>
        <h1 className="text-4xl font-bold mb-4">외환 길잡이</h1>
        <p className="text-charcoal-soft text-lg max-w-2xl">
          외국환거래규정(재정경제부고시 제2026-69호, 시행 2026.3.30.) 기준.
          창구에서 외환 송금 거래를 빠르게 분류하고 응대 기준을 잡을 수 있도록 돕습니다.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        {FEATURES.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className="group block bg-white border border-border rounded-xl p-6 hover:border-primary transition"
          >
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-semibold group-hover:text-primary transition">
                {f.title}
              </h2>
              {f.badge && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {f.badge}
                </span>
              )}
            </div>
            <p className="text-charcoal-soft text-sm">{f.desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
