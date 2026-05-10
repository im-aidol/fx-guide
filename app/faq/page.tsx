export default function FaqPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">FAQ</h1>
      <p className="text-charcoal-soft mb-8">자주 묻는 12개 질문.</p>

      <div className="bg-white border border-border rounded-xl p-8 text-center text-charcoal-soft">
        <p className="mb-2">🚧 마이그레이션 예정</p>
        <p className="text-sm">
          <code className="bg-offwhite px-2 py-0.5 rounded">fx/data.js</code>의{" "}
          <code className="bg-offwhite px-2 py-0.5 rounded">FAQS</code>를 옮길 영역.
        </p>
      </div>
    </div>
  );
}
