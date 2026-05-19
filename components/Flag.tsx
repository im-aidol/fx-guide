// 공통 SVG 국기 컴포넌트. flag-icons (CSS background-image 방식) 기반.
// 사용처: /samples, /simulator(CountryPicker, SummarySidebar) 등.
//
// 사용법:
//   <Flag code="us" className="w-10" />        ← w-만 지정, height는 aspect-[4/3] 자동
//   <Flag code="JP" className="w-6 shrink-0" /> ← 대소문자 무관

type Props = {
  code: string;
  className?: string;
};

export function Flag({ code, className }: Props) {
  return (
    <span
      className={[
        "fi",
        `fi-${code.toLowerCase()}`,
        "block aspect-[4/3] rounded-sm border border-border",
        "!bg-cover", // flag-icons 기본 contain 오버라이드
        className ?? "",
      ].join(" ")}
      aria-label={`${code} flag`}
    />
  );
}
