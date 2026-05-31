"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

// 홈 화면 우측 "최근 본 메뉴" 박스용. localStorage에 마지막 N개 경로 저장.
// 라벨/아이콘은 알려진 경로에 한해 매핑 — 모르는 경로(동적 상세 페이지 등)는 기록 안 함.
// TopNav의 NAV와 의도적으로 분리: 상단바와 무관하게 가벼운 등록만.

const STORAGE_KEY = "fx-guide:recent-menu";
const MAX = 5;

export type RecentItem = {
  path: string;
  label: string;
  icon: string;
};

const PATH_LABELS: Record<string, { label: string; icon: string }> = {
  // 도구
  "/simulator": { label: "당발송금 도우미", icon: "🎯" },
  "/samples": { label: "통화 견본", icon: "💴" },

  // 당발송금
  "/guide/send": { label: "당발송금 가이드", icon: "📤" },
  "/guide/send/cases": { label: "사유별 가이드", icon: "📋" },
  "/guide/send/channels/swift": { label: "SWIFT 일반 외화송금", icon: "💸" },
  "/guide/send/channels/baro": { label: "BARO-BARO 자동송금", icon: "🚀" },
  "/guide/send/channels/wu": { label: "WU 송금 3종", icon: "⚡" },

  // 타발
  "/guide/receive": { label: "타발 송금 진입판", icon: "📥" },
  "/guide/receive/swift": { label: "iM뱅크 수취 정보 (SWIFT)", icon: "🏦" },
  "/guide/receive/thresholds": { label: "수취 임계값", icon: "📏" },
  "/guide/receive/wu": { label: "WU 수령", icon: "⚡" },
  "/guide/receive/print-card": { label: "인쇄용 고객 안내서", icon: "🖨️" },

  // 환전
  "/guide/exchange": { label: "환전 가이드", icon: "💱" },
  "/guide/exchange/calculator": { label: "환전 계산기", icon: "🧮" },
  "/guide/exchange/info": { label: "환율 산출 안내", icon: "📐" },
  "/guide/exchange/e-wallet": { label: "외화 E-지갑", icon: "💼" },
  "/guide/exchange/gift": { label: "외화 기프티콘", icon: "🎁" },
  "/guide/exchange/gln": { label: "GLN 해외 결제", icon: "💳" },
  "/guide/delivery": { label: "외화 배송", icon: "📦" },

  // 외화 예적금
  "/guide/deposit": { label: "외화 예금·적금", icon: "🏦" },
  "/guide/deposit/global-comprehensive": {
    label: "글로벌외화종합통장",
    icon: "🌐",
  },
  "/guide/deposit/auto-transfer": { label: "자동이체", icon: "🔁" },
  "/guide/deposit/simulator": { label: "이자 시뮬레이터", icon: "🧮" },
  "/guide/deposit/all": { label: "전체 검색·표", icon: "🔍" },

  // 무역금융
  "/guide/trade-finance": { label: "무역금융 가이드", icon: "🏭" },

  // 자료·공지
  "/notices": { label: "공지사항", icon: "📣" },
  "/qna": { label: "익명 Q&A", icon: "💬" },
  "/faq": { label: "FAQ", icon: "❓" },
  "/glossary": { label: "외환 용어집", icon: "📖" },
};

function resolve(path: string): { label: string; icon: string } | null {
  return PATH_LABELS[path] ?? null;
}

function readList(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

const UPDATE_EVENT = "fx-recent-menu-updated";

function writeList(list: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    // 같은 탭의 구독자에게 변경 알림 (storage 이벤트는 다른 탭에서만 발생)
    window.dispatchEvent(new Event(UPDATE_EVENT));
  } catch {
    // ignore quota / private mode
  }
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(UPDATE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(UPDATE_EVENT, callback);
  };
}

function getSnapshot(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(STORAGE_KEY) ?? "";
}

function getServerSnapshot(): string {
  return "";
}

function record(path: string) {
  // 홈은 의미 없음 — 박스가 홈에 있으므로 자기 자신 안 넣음
  if (path === "/") return;
  if (!resolve(path)) return; // 알려진 경로만 기록

  const list = readList();
  const filtered = list.filter((p) => p !== path);
  const next = [path, ...filtered].slice(0, MAX);
  writeList(next);
}

/**
 * 경로 변화를 감지해 자동 기록. 최상위 client component에 한 번만 마운트.
 */
export function useRecordRecentVisit() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname) record(pathname);
  }, [pathname]);
}

/**
 * 저장된 최근 메뉴 목록 반환. localStorage를 외부 store로 구독.
 * 같은 탭 내 변경(navigate)과 다른 탭 변경(storage 이벤트) 모두 반영.
 */
export function useRecentMenu(): RecentItem[] {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return useMemo(() => {
    if (!raw) return [];
    try {
      const list = JSON.parse(raw) as string[];
      const resolved: RecentItem[] = [];
      for (const p of list) {
        const meta = resolve(p);
        if (meta)
          resolved.push({ path: p, label: meta.label, icon: meta.icon });
      }
      return resolved;
    } catch {
      return [];
    }
  }, [raw]);
}
