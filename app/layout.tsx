import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

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
      <body className="min-h-full flex flex-col bg-offwhite text-charcoal">
        <Navigation />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
