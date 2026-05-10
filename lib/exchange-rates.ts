// 환율 fetcher (USD 기준 → 각국 통화)
//
// 출처: fawazahmed0/exchange-api (https://github.com/fawazahmed0/exchange-api)
//   - 무료, 인증 불필요, CDN 배포 (jsDelivr + Cloudflare Pages)
//   - 거의 모든 통화 지원 (VND/PHP/IDR 등 동남아 통화 포함)
//   - 매일 갱신
//
// ⚠️ 화면에 표시되는 환율은 직원 가이드용 참고치.
//    실제 거래 환율은 iM뱅크 매매기준율 (외환규정 1-2조)에 따름.

export type UsdRates = {
  date: string; // 환율 갱신일 (YYYY-MM-DD)
  rates: Record<string, number>; // 1 USD = N (소문자 통화코드 기준)
};

const PRIMARY =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json";
const FALLBACK =
  "https://latest.currency-api.pages.dev/v1/currencies/usd.json";

export async function fetchUsdRates(): Promise<UsdRates> {
  let res: Response;
  try {
    res = await fetch(PRIMARY);
    if (!res.ok) throw new Error(`primary HTTP ${res.status}`);
  } catch {
    res = await fetch(FALLBACK);
    if (!res.ok) throw new Error(`fallback HTTP ${res.status}`);
  }
  const json = (await res.json()) as { date: string; usd: Record<string, number> };
  return { date: json.date, rates: json.usd };
}

/**
 * 현지 통화 → USD 환산.
 * @returns USD 금액 (rate 없으면 null)
 */
export function localToUsd(
  amountLocal: number,
  currency: string,
  rates: UsdRates,
): number | null {
  if (!currency) return null;
  const code = currency.toLowerCase();
  if (code === "usd") return amountLocal;
  const rate = rates.rates[code];
  if (!rate || rate <= 0) return null;
  return amountLocal / rate;
}
