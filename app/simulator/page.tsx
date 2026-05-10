export default function SimulatorPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">송금 흐름 도우미</h1>
      <p className="text-charcoal-soft mb-8">
        국가·금액·사유·신분·수취인을 입력하면 거래코드/처리 채널/신고/서류/안내멘트를 자동 생성합니다.
      </p>

      <div className="bg-white border border-border rounded-xl p-8 text-center text-charcoal-soft">
        <p className="mb-2">🚧 마이그레이션 예정</p>
        <p className="text-sm">
          기존 <code className="bg-offwhite px-2 py-0.5 rounded">fx/index.html</code>의{" "}
          <code className="bg-offwhite px-2 py-0.5 rounded">analyzeFlow()</code> 로직을 React + TS로 옮겨야 합니다.
        </p>
      </div>
    </div>
  );
}
