"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { useCustomMenus, type CustomMenuItem } from "@/lib/custom-menus";
import { useMode } from "@/components/Mode";
import { AdminBadge } from "@/components/admin/AdminBadge";
import { AdminNote } from "@/components/admin/AdminNote";

export default function CustomGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const { mode } = useMode();
  const canEdit = mode === "hq";
  const { findBySlug, updateItem, removeItem, hydrated } = useCustomMenus();
  const [editing, setEditing] = useState(false);

  if (!hydrated) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <p className="text-sm text-charcoal-soft">불러오는 중…</p>
      </div>
    );
  }

  const match = findBySlug(slug);
  if (!match) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Link
          href="/guide"
          className="text-xs text-charcoal-soft hover:text-primary inline-flex items-center gap-1 mb-3"
        >
          ← 가이드 홈
        </Link>
        <p className="text-sm text-charcoal-soft">
          이 슬러그({slug})에 해당하는 가이드 페이지를 찾을 수 없습니다. 본점
          모드에서 사이드바에 다시 추가해 주세요.
        </p>
      </div>
    );
  }

  const { group, item } = match;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link
        href="/guide"
        className="text-xs text-charcoal-soft hover:text-primary inline-flex items-center gap-1 mb-3"
      >
        ← 가이드 홈
      </Link>
      <header className="mb-6">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          {group.icon} {group.label}
        </p>
        <h1 className="text-3xl font-bold mb-2">{item.pageTitle}</h1>
        {item.pageSubtitle && (
          <p className="text-sm text-charcoal-soft">{item.pageSubtitle}</p>
        )}
        <AdminBadge hqHint="본점 관리자 — 이 가이드 페이지 본문을 직접 수정·삭제할 수 있습니다" />
      </header>

      <AdminNote storageKey={`fx-guide:note:custom:${slug}`} />

      {canEdit && editing ? (
        <PageEditor
          initial={item}
          onSave={(patch) => {
            updateItem(group.id, slug, patch);
            setEditing(false);
            if (patch.slug && patch.slug !== slug) {
              router.replace(`/guide/custom/${patch.slug}`);
            }
          }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <article className="bg-white border border-border rounded-xl p-6">
          <RenderedBody body={item.body} />
          {item.source && (
            <p className="text-xs text-charcoal-soft mt-6 pt-4 border-t border-border">
              출처: {item.source}
            </p>
          )}
        </article>
      )}

      {canEdit && !editing && (
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => setEditing(true)}
            className="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
          >
            ✏️ 페이지 수정
          </button>
          <button
            onClick={() => {
              if (
                confirm(
                  `"${item.label}" 페이지를 삭제할까요?\n사이드바에서도 함께 제거됩니다.`,
                )
              ) {
                removeItem(group.id, slug);
                router.push("/guide");
              }
            }}
            className="text-xs text-danger hover:underline px-2"
          >
            🗑️ 페이지 삭제
          </button>
        </div>
      )}
    </div>
  );
}

function PageEditor({
  initial,
  onSave,
  onCancel,
}: {
  initial: CustomMenuItem;
  onSave: (patch: Partial<CustomMenuItem>) => void;
  onCancel: () => void;
}) {
  const [label, setLabel] = useState(initial.label);
  const [pageTitle, setPageTitle] = useState(initial.pageTitle);
  const [pageSubtitle, setPageSubtitle] = useState(initial.pageSubtitle ?? "");
  const [body, setBody] = useState(initial.body);
  const [source, setSource] = useState(initial.source ?? "");

  const submit = () => {
    if (!pageTitle.trim() || !body.trim()) return;
    onSave({
      label: label.trim() || initial.label,
      pageTitle: pageTitle.trim(),
      pageSubtitle: pageSubtitle.trim() || undefined,
      body: body.trim(),
      source: source.trim() || undefined,
    });
  };

  return (
    <div className="bg-white border-2 border-primary/50 rounded-xl p-5 space-y-3">
      <h3 className="font-bold text-sm">페이지 수정</h3>
      <Field label="사이드바 표기 (메뉴 라벨)">
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
        />
      </Field>
      <Field label="페이지 제목">
        <input
          type="text"
          value={pageTitle}
          onChange={(e) => setPageTitle(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
        />
      </Field>
      <Field label="부제목 (선택)">
        <input
          type="text"
          value={pageSubtitle}
          onChange={(e) => setPageSubtitle(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
        />
      </Field>
      <Field label="본문 (간단 마크다운: **bold**, # 헤딩, --- 구분선)">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={14}
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm resize-y font-mono"
        />
      </Field>
      <Field label="출처 (1차 자료)">
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="예: 외환규정 4-3조 ①1호, iM뱅크 안내"
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
        />
      </Field>
      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          onClick={onCancel}
          className="text-xs text-charcoal-soft hover:text-charcoal px-3 py-1.5"
        >
          취소
        </button>
        <button
          onClick={submit}
          disabled={!pageTitle.trim() || !body.trim()}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-50"
        >
          수정 저장
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-[11px] text-charcoal-soft block mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

// 매우 단순한 마크다운 렌더링 (헤딩 # / 구분선 --- / 볼드 **)
function RenderedBody({ body }: { body: string }) {
  const lines = body.split(/\r?\n/);
  const blocks: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed === "---") {
      blocks.push(<hr key={key++} className="my-4 border-border" />);
      continue;
    }
    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2];
      const cls =
        level === 1
          ? "text-xl font-bold mt-5 mb-2"
          : level === 2
            ? "text-lg font-bold mt-4 mb-2"
            : "text-base font-semibold mt-3 mb-1.5";
      blocks.push(
        <p key={key++} className={cls}>
          {renderInline(text)}
        </p>,
      );
      continue;
    }
    if (trimmed === "") {
      blocks.push(<div key={key++} className="h-2" />);
      continue;
    }
    if (trimmed.startsWith("- ")) {
      blocks.push(
        <li key={key++} className="text-sm text-charcoal pl-1 ml-4 list-disc">
          {renderInline(trimmed.slice(2))}
        </li>,
      );
      continue;
    }
    blocks.push(
      <p
        key={key++}
        className="text-sm text-charcoal leading-relaxed whitespace-pre-wrap"
      >
        {renderInline(line)}
      </p>,
    );
  }

  return <div className="space-y-0.5">{blocks}</div>;
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{p}</span>;
  });
}
