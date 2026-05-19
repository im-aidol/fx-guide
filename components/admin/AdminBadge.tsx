"use client";

import { useMode } from "@/components/Mode";

// 페이지 상단에 현재 모드 안내줄을 한 줄로 출력.
// 본점이면 "관리자 — 작성·수정 가능", 영업점이면 "조회 전용".
export function AdminBadge({
  hqHint = "본점 관리자 — 항목 추가·수정·삭제가 가능합니다",
  branchHint = "영업점 조회 화면 — 본부에서 관리한 내용을 확인합니다",
}: {
  hqHint?: string;
  branchHint?: string;
}) {
  const { mode } = useMode();
  const isHq = mode === "hq";

  return (
    <div
      className={[
        "inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border mt-2",
        isHq
          ? "bg-primary/10 border-primary/30 text-primary"
          : "bg-offwhite border-border text-charcoal-soft",
      ].join(" ")}
    >
      <span>{isHq ? "🏛️" : "🏢"}</span>
      <span className="font-medium">{isHq ? hqHint : branchHint}</span>
    </div>
  );
}
