import { ScenarioRunner } from "@/components/scenario/ScenarioRunner";
import { REMITTANCE_SCENARIO } from "@/lib/data";
import { AdminNote } from "@/components/admin/AdminNote";

export default function SimulatorPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          당발 송금 (한국 → 해외) · 시나리오 트리 v0.1
        </p>
        <h1 className="text-3xl font-bold mb-2">당발 송금 도우미</h1>
        <p className="text-charcoal-soft">
          창구에서 고객 답변 따라 클릭해 좁혀가는 가이드.
          외국환거래규정(재정경제부고시 제2026-69호) 본문 근거.
        </p>
      </div>
      <AdminNote storageKey="fx-guide:note:simulator" />
      <ScenarioRunner scenario={REMITTANCE_SCENARIO} />
    </div>
  );
}
