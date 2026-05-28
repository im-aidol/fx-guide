import type { Metadata } from "next";
import "./globals.css";
import { TopNav } from "@/components/TopNav";
import { ModeProvider } from "@/components/Mode";
import { RouteTracker } from "@/components/RouteTracker";
import { RecentMenuBox } from "@/components/RecentMenuBox";

export const metadata: Metadata = {
  title: "외환 길잡이 | iM뱅크 영업점 가이드",
  description:
    "iM뱅크 영업점 직원용 외환 송금 가이드. 외국환거래규정(2026.3.30. 시행) 기준.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="min-h-full bg-offwhite text-charcoal">
        <ModeProvider>
          <RouteTracker />
          <div className="min-h-screen flex flex-col">
            <TopNav />
            <main className="flex-1 min-w-0 relative">
              {children}
              {/* 우측 상단 "최근 본 메뉴" 위젯 — xl 이상 화면에서 모든 페이지에 표시.
                  absolute로 main 안에 배치 → 스크롤 시 콘텐츠와 함께 위로 스크롤됨.
                  뷰포트가 컨텐츠 max-w(1440px)보다 넓으면 컨텐츠 우측 가장자리에 맞춤. */}
              <div
                className="hidden xl:block absolute top-6 z-30 w-[240px] print:hidden"
                style={{
                  right: "max(1rem, calc((100vw - 1440px) / 2 + 1.5rem))",
                }}
              >
                <RecentMenuBox />
              </div>
            </main>
          </div>
        </ModeProvider>
      </body>
    </html>
  );
}
