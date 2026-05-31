// Frankfurter 기반 환율 fetcher (ECB 일간 고시환율, 무료, 인증 불필요)
//
//   - fetchRateHistory: 단일 통화의 시계열 (모달 그래프용, timeseries 1회 호출)
//   - fetchMajorRatesKrw: USD/JPY/CNY/EUR → KRW 최신값 (홈 환율 패널용, EUR 기준 1회 호출)
//
// 홈/그래프 모두 동일 ECB 소스를 쓰도록 통일.
// fawazahmed0 (lib/exchange-rates.ts) 는 넓은 통화 커버리지가 필요한 시나리오/환전 도구에서 계속 사용.
//
// 캐싱 전략 (history 만):
//   - (통화, 오늘 날짜) 단위로 localStorage 에 저장
//   - 같은 날 같은 통화 모달을 다시 열면 네트워크 호출 없이 캐시 사용
//
// ⚠️ ECB 고시환율 기반 참고용. 실제 거래 환율은 iM뱅크 매매기준율 (외환규정 1-2조).

export type RateHistoryPoint = {
  date: string; // YYYY-MM-DD
  rate: number; // 1 단위 외화당 KRW
};

export type MajorRatesKrw = {
  date: string;
  usd: number; // 1 USD = N KRW
  jpy: number;
  cny: number;
  eur: number;
};

const CACHE_PREFIX = "fx-guide:rate-history";

function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export async function fetchRateHistory(
  currency: string, // "USD" | "JPY" | "CNY" | "EUR"
  days = 30,
): Promise<RateHistoryPoint[]> {
  const today = new Date();
  const start = new Date();
  start.setDate(today.getDate() - days);
  const endStr = ymd(today);
  const startStr = ymd(start);

  const cacheKey = `${CACHE_PREFIX}:${currency}:${endStr}:${days}`;
  if (typeof window !== "undefined") {
    try {
      const cached = window.localStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached) as RateHistoryPoint[];
    } catch {
      // 손상된 캐시는 무시하고 새로 가져옴
    }
  }

  const url = `https://api.frankfurter.dev/v1/${startStr}..${endStr}?from=${currency}&to=KRW`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Frankfurter HTTP ${res.status}`);
  const json = (await res.json()) as {
    rates: Record<string, Record<string, number>>;
  };

  const points: RateHistoryPoint[] = Object.entries(json.rates)
    .map(([date, r]) => ({ date, rate: r.KRW }))
    .filter((p) => typeof p.rate === "number")
    .sort((a, b) => a.date.localeCompare(b.date));

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(cacheKey, JSON.stringify(points));
    } catch {
      // quota 초과·비활성 등은 무시
    }
  }

  return points;
}

// EUR 기준 1회 호출로 4개 통화 → KRW 환산.
// (KRW 기준 호출은 응답 정밀도가 소수 5자리라 USD에서 ~10원 오차 발생 → EUR 기준 사용)
export async function fetchMajorRatesKrw(): Promise<MajorRatesKrw> {
  const url =
    "https://api.frankfurter.dev/v1/latest?from=EUR&to=KRW,USD,JPY,CNY";
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Frankfurter HTTP ${res.status}`);
  const json = (await res.json()) as {
    date: string;
    rates: { KRW: number; USD: number; JPY: number; CNY: number };
  };
  const eurKrw = json.rates.KRW;
  return {
    date: json.date,
    usd: eurKrw / json.rates.USD,
    jpy: eurKrw / json.rates.JPY,
    cny: eurKrw / json.rates.CNY,
    eur: eurKrw,
  };
}
