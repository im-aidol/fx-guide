import Link from "next/link";

const ITEMS = [
  { href: "/", label: "홈" },
  { href: "/simulator", label: "송금 흐름 도우미" },
  { href: "/incoming", label: "타발 송금 안내" },
  { href: "/guide", label: "업무별 가이드" },
  { href: "/faq", label: "FAQ" },
  { href: "/glossary", label: "용어사전" },
];

export function Navigation() {
  return (
    <header className="border-b border-border bg-white sticky top-0 z-10">
      <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-6">
        <Link href="/" className="font-bold text-primary text-lg">
          외환 길잡이
        </Link>
        <ul className="flex gap-3 sm:gap-4 text-xs sm:text-sm overflow-x-auto whitespace-nowrap">
          {ITEMS.slice(1).map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-charcoal-soft hover:text-primary transition"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
