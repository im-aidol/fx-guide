"use client";

// 본점(외환사업부) / 영업점 모드 전역 상태 관리.
// 실제 로그인·인증은 구현하지 않고, UI 노출 권한만 모드로 분기.
// localStorage로 영속화 — 같은 브라우저에서 새로고침해도 유지.

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Mode = "branch" | "hq";
// branch = 영업점 직원 (창구), hq = 본점 외환사업부 직원

const STORAGE_KEY = "fx-guide:mode";

type ContextValue = {
  mode: Mode;
  setMode: (m: Mode) => void;
};

const ModeContext = createContext<ContextValue>({
  mode: "branch",
  setMode: () => {},
});

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>("branch");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "hq" || stored === "branch") setModeState(stored);
    } catch {
      // ignore
    }
  }, []);

  const setMode = (m: Mode) => {
    setModeState(m);
    try {
      localStorage.setItem(STORAGE_KEY, m);
    } catch {
      // ignore
    }
  };

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode(): ContextValue {
  return useContext(ModeContext);
}

export function ModeLabel({ mode }: { mode: Mode }) {
  return mode === "hq" ? <>본점 외환사업부</> : <>영업점</>;
}
