"use client";

// 본점(관리자)이 자유롭게 적고 영업점이 읽기만 하는 "본부 보충 안내" 박스.
// 모든 가이드 페이지에 한 줄 추가만으로 본부 메모를 노출할 수 있게 설계.
// 데이터는 페이지별로 storageKey를 분리해 localStorage에 영속화.

import { useEffect, useState } from "react";
import { useMode } from "@/components/Mode";

export function AdminNote({
  storageKey,
  title = "본부 보충 안내",
  placeholder = "본부에서 영업점에 전달하고 싶은 임시 안내·추가 정책·예외 사항을 적어두세요. 영업점 모드에서는 읽기 전용으로 표시됩니다.",
}: {
  storageKey: string;
  title?: string;
  placeholder?: string;
}) {
  const { mode } = useMode();
  const canEdit = mode === "hq";

  const [note, setNote] = useState("");
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setNote(raw);
    } catch {
      // ignore
    }
    setHydrated(true);
  }, [storageKey]);

  if (!hydrated) return null;

  const trimmed = note.trim();
  // 영업점 모드에서 작성된 내용이 없으면 박스 자체를 숨김.
  if (!canEdit && !trimmed) return null;

  const save = () => {
    const next = draft.trim();
    setNote(next);
    try {
      if (next) localStorage.setItem(storageKey, next);
      else localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
    setEditing(false);
  };

  return (
    <aside className="bg-warn/10 border border-warn/40 rounded-xl p-4 mb-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-[10px] text-charcoal-soft uppercase tracking-wide">
            📌 {title}
          </p>
          {canEdit && (
            <p className="text-[10px] text-charcoal-soft mt-0.5">
              본점 관리자 작성 — 영업점에는 읽기 전용으로 노출됩니다
            </p>
          )}
        </div>
        {canEdit && !editing && (
          <button
            onClick={() => {
              setDraft(note);
              setEditing(true);
            }}
            className="text-xs text-primary hover:text-primary-dark font-medium shrink-0"
          >
            {trimmed ? "✏️ 수정" : "+ 작성"}
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={placeholder}
            rows={5}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm resize-y bg-white"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setEditing(false)}
              className="text-xs text-charcoal-soft hover:text-charcoal px-2 py-1"
            >
              취소
            </button>
            {trimmed && (
              <button
                onClick={() => {
                  if (confirm("본부 보충 안내를 삭제할까요?")) {
                    setNote("");
                    try {
                      localStorage.removeItem(storageKey);
                    } catch {
                      // ignore
                    }
                    setEditing(false);
                  }
                }}
                className="text-xs text-danger hover:underline px-2 py-1"
              >
                삭제
              </button>
            )}
            <button
              onClick={save}
              className="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
            >
              저장
            </button>
          </div>
        </div>
      ) : trimmed ? (
        <p className="text-sm text-charcoal whitespace-pre-line leading-relaxed">
          {trimmed}
        </p>
      ) : (
        <p className="text-xs text-charcoal-soft italic">
          (작성된 본부 안내가 없습니다. 우측 “+ 작성” 버튼으로 추가하세요.)
        </p>
      )}
    </aside>
  );
}
