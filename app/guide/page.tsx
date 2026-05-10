export default function GuidePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">업무별 가이드</h1>
      <p className="text-charcoal-soft mb-8">
        8개 송금 케이스 + 2개 환전·외화예금 가이드를 iM뱅크 5개 카테고리로 정리.
      </p>

      <div className="bg-white border border-border rounded-xl p-8 text-center text-charcoal-soft">
        <p className="mb-2">🚧 마이그레이션 예정</p>
        <p className="text-sm">
          <code className="bg-offwhite px-2 py-0.5 rounded">fx/data.js</code>의{" "}
          <code className="bg-offwhite px-2 py-0.5 rounded">SEND_CASES</code> /{" "}
          <code className="bg-offwhite px-2 py-0.5 rounded">OTHER_GUIDES</code>를 옮길 영역.
        </p>
      </div>
    </div>
  );
}
