import type { Country } from "../types";

// iM뱅크 해외계좌송금에서 송금 가능한 17종 통화 (출처: iM뱅크 모바일앱 안내).
// 이 목록에 없는 통화는 USD로만 송금 가능 (예: 중국 CNY/베트남 VND/인도 INR/멕시코 MXN 등).
export const IM_BANK_SENDABLE_CURRENCIES = [
  "USD",
  "JPY",
  "EUR",
  "AUD",
  "CAD",
  "GBP",
  "CHF",
  "HKD",
  "SEK",
  "DKK",
  "NOK",
  "SAR",
  "KWD",
  "SGD",
  "NZD",
  "THB",
  "IDR",
] as const;

/**
 * 영업점 직원이 시뮬레이터에서 선택할 수 있는 통화 — [자국통화, USD].
 * 자국통화가 USD면 ["USD"] 만.
 *
 * 주의: "선택 가능" ≠ "실제 SWIFT 송금 가능".
 * iM뱅크 SWIFT 송금은 17종(IM_BANK_SENDABLE_CURRENCIES)만 가능. 그 외 통화는
 * 고객이 자국통화로 말하더라도 실제 송금은 USD로 환산 처리됨.
 * UI에서 isImBankSendable(currency) 로 판별.
 */
export function getSendableCurrencies(country: Country): string[] {
  const result: string[] = [];
  if (country.currency && country.currency !== "USD") {
    result.push(country.currency);
  }
  result.push("USD");
  return result;
}

/** iM뱅크 SWIFT 송금 가능 17종 통화인지 판별. */
export function isImBankSendable(currency: string): boolean {
  return (IM_BANK_SENDABLE_CURRENCIES as readonly string[]).includes(currency);
}

// ⚠️ 잠정 데이터 (2026-05-10 Claude 작성, 외환 일반 상식 기반)
// IBAN 자릿수·라우팅 코드·사유코드 필수국 등은 영업점 실제 처리 기준으로 검증 필요.
// 4명이 분담해서 채워나갈 영역.
//
// currency 필드: ISO 4217 통화 코드 (USD/KRW/VND/EUR 등) — 환율 환산용.
//   환율은 별도 fetcher(lib/exchange-rates.ts)로 fawazahmed0/exchange-api에서 가져옴.
//   ⚠️ 화면에 표시되는 환율은 참고용. 실제 거래는 iM뱅크 매매기준율 적용.
export const COUNTRIES: Country[] = [
  // ─────────── popular: 영업점 빈도 상위 ───────────
  {
    id: "us",
    name: "미국",
    code: "US",
    flag: "🇺🇸",
    riskLevel: "NORMAL",
    popular: true,
    currency: "USD",
    ibanRequired: false,
    routingType: "ABA",
    routingDigits: 9,
    purposeCodeRequired: true, // iM뱅크 자료: 송금사유 필수 기재국
    remarks: [
      "ABA 라우팅 번호 9자리 필수",
      "수취인 영문 이름·영문 주소·ZIP code 필수",
      "송금사유 필수 기재 (iM뱅크 안내)",
      "OFAC 제재대상자 점검 (모든 미국 송금)",
      "iM뱅크 해외송금 Lite (모바일 한정): ACH Routing 9자리 사용, ABA 입력 시 처리 불가",
    ],
  },
  {
    id: "cn",
    name: "중국",
    code: "CN",
    flag: "🇨🇳",
    riskLevel: "WATCH",
    popular: true,
    currency: "CNY",
    ibanRequired: false,
    routingType: "CNAPS",
    routingDigits: 12,
    purposeCodeRequired: true,
    remarks: [
      "CNAPS 코드 12자리 또는 SWIFT BIC",
      "SAFE 송금사유 코드 필수",
      "수취인 영문명 + 한자명 권장",
      "현지 개인 외환 한도 (수취인 기준) 사전 확인 권장",
    ],
  },
  {
    id: "jp",
    name: "일본",
    code: "JP",
    flag: "🇯🇵",
    riskLevel: "NORMAL",
    popular: true,
    currency: "JPY",
    ibanRequired: false,
    routingType: "JapaneseBank",
    purposeCodeRequired: false,
    remarks: [
      "지점명 또는 지점코드 3자리 (iM뱅크 안내)",
      "은행 코드 4자리 + 계좌번호 7자리도 필요",
      "수취인 카타카나 또는 영문명",
      "SWIFT BIC 필요",
    ],
  },
  {
    id: "vn",
    name: "베트남",
    code: "VN",
    flag: "🇻🇳",
    riskLevel: "NORMAL",
    popular: true,
    currency: "VND",
    ibanRequired: false,
    routingType: "SWIFT_only",
    purposeCodeRequired: true,
    remarks: [
      "SWIFT BIC 필수",
      "송금사유 명시 (SBV 신고 대응)",
      "수취인 영문명 + 베트남 신분증 번호 (CMND/CCCD) 권장",
      "결혼이민자·외국인근로자 본국송금 빈도 높음 — 사유 정확 기재",
    ],
  },
  {
    id: "ph",
    name: "필리핀",
    code: "PH",
    flag: "🇵🇭",
    riskLevel: "NORMAL",
    popular: true,
    currency: "PHP",
    ibanRequired: false,
    routingType: "SWIFT_only",
    purposeCodeRequired: false,
    remarks: [
      "SWIFT BIC 필수",
      "수취인 영문명 + 필리핀 주소",
      "결혼이민자·외국인근로자 본국송금 빈도 높음",
    ],
  },
  {
    id: "au",
    name: "호주",
    code: "AU",
    flag: "🇦🇺",
    riskLevel: "NORMAL",
    popular: true,
    currency: "AUD",
    ibanRequired: false,
    routingType: "BSB",
    routingDigits: 6,
    purposeCodeRequired: false,
    remarks: [
      "BSB 코드 6자리 + 계좌번호",
      "SWIFT BIC 권장",
      "수취인 영문명 + 호주 주소",
    ],
  },
  {
    id: "ca",
    name: "캐나다",
    code: "CA",
    flag: "🇨🇦",
    riskLevel: "NORMAL",
    popular: true,
    currency: "CAD",
    ibanRequired: false,
    routingType: "Transit",
    purposeCodeRequired: false,
    remarks: [
      "Institution Number 3자리 + Transit Number 5자리 + 계좌",
      "SWIFT BIC 필요",
      "수취인 영문명 + 주소 + 우편번호",
    ],
  },
  {
    id: "gb",
    name: "영국",
    code: "GB",
    flag: "🇬🇧",
    riskLevel: "NORMAL",
    popular: true,
    currency: "GBP",
    ibanRequired: true,
    ibanLength: 22,
    routingType: "SortCode",
    routingDigits: 6,
    purposeCodeRequired: false,
    remarks: [
      "IBAN 22자리 (GB 시작) 또는 Sort Code 6자리 + Account 8자리",
      "SWIFT BIC 권장",
      "수취인 영문명 + 영국 주소",
    ],
  },

  // ─────────── 기타: 유럽 IBAN 사용국 ───────────
  {
    id: "de",
    name: "독일",
    code: "DE",
    flag: "🇩🇪",
    riskLevel: "NORMAL",
    popular: false,
    currency: "EUR",
    ibanRequired: true,
    ibanLength: 22,
    routingType: "SWIFT_only",
    purposeCodeRequired: false,
    remarks: ["IBAN 22자리 (DE 시작)", "SWIFT BIC 필요"],
  },
  {
    id: "fr",
    name: "프랑스",
    code: "FR",
    flag: "🇫🇷",
    riskLevel: "NORMAL",
    popular: false,
    currency: "EUR",
    ibanRequired: true,
    ibanLength: 27,
    routingType: "SWIFT_only",
    purposeCodeRequired: false,
    remarks: ["IBAN 27자리 (FR 시작)", "SWIFT BIC 필요"],
  },
  {
    id: "it",
    name: "이탈리아",
    code: "IT",
    flag: "🇮🇹",
    riskLevel: "NORMAL",
    popular: false,
    currency: "EUR",
    ibanRequired: true,
    ibanLength: 27,
    routingType: "SWIFT_only",
    remarks: ["IBAN 27자리 (IT 시작)"],
  },
  {
    id: "es",
    name: "스페인",
    code: "ES",
    flag: "🇪🇸",
    riskLevel: "NORMAL",
    popular: false,
    currency: "EUR",
    ibanRequired: true,
    ibanLength: 24,
    routingType: "SWIFT_only",
    remarks: ["IBAN 24자리 (ES 시작)"],
  },
  {
    id: "nl",
    name: "네덜란드",
    code: "NL",
    flag: "🇳🇱",
    riskLevel: "NORMAL",
    popular: false,
    currency: "EUR",
    ibanRequired: true,
    ibanLength: 18,
    routingType: "SWIFT_only",
    remarks: ["IBAN 18자리 (NL 시작)"],
  },
  {
    id: "ch",
    name: "스위스",
    code: "CH",
    flag: "🇨🇭",
    riskLevel: "NORMAL",
    popular: false,
    currency: "CHF",
    ibanRequired: true,
    ibanLength: 21,
    routingType: "SWIFT_only",
    remarks: ["IBAN 21자리 (CH 시작)"],
  },

  // ─────────── 기타: 아시아 ───────────
  {
    id: "in",
    name: "인도",
    code: "IN",
    flag: "🇮🇳",
    riskLevel: "NORMAL",
    popular: false,
    currency: "INR",
    ibanRequired: false,
    routingType: "IFSC",
    routingDigits: 11,
    purposeCodeRequired: true,
    remarks: [
      "IFSC 코드 11자리 + 계좌번호",
      "RBI Purpose Code (예: P1234 형식) 필수",
      "수취인 PAN 번호 또는 정부발행 신분증 권장",
    ],
  },
  {
    id: "sg",
    name: "싱가포르",
    code: "SG",
    flag: "🇸🇬",
    riskLevel: "NORMAL",
    popular: false,
    currency: "SGD",
    ibanRequired: false,
    routingType: "SWIFT_only",
    remarks: ["SWIFT BIC 필수"],
  },
  {
    id: "th",
    name: "태국",
    code: "TH",
    flag: "🇹🇭",
    riskLevel: "NORMAL",
    popular: false,
    currency: "THB",
    ibanRequired: false,
    routingType: "SWIFT_only",
    purposeCodeRequired: true,
    remarks: ["SWIFT BIC 필수", "송금사유 명시 권장"],
  },
  {
    id: "id",
    name: "인도네시아",
    code: "ID",
    flag: "🇮🇩",
    riskLevel: "NORMAL",
    popular: false,
    currency: "IDR",
    ibanRequired: false,
    routingType: "SWIFT_only",
    purposeCodeRequired: true,
    remarks: ["SWIFT BIC 필수", "Bank Indonesia LLD 사유 신고 대응"],
  },
  {
    id: "hk",
    name: "홍콩",
    code: "HK",
    flag: "🇭🇰",
    riskLevel: "NORMAL",
    popular: false,
    currency: "HKD",
    ibanRequired: false,
    routingType: "SWIFT_only",
    remarks: ["SWIFT BIC 필수"],
  },

  // ─────────── 기타: 중동 (IBAN 사용 다수) ───────────
  {
    id: "sa",
    name: "사우디",
    code: "SA",
    flag: "🇸🇦",
    riskLevel: "NORMAL",
    popular: false,
    currency: "SAR",
    ibanRequired: true,
    ibanLength: 24,
    routingType: "SWIFT_only",
    purposeCodeRequired: true, // iM뱅크 자료
    remarks: ["IBAN 24자리 (SA 시작)", "송금사유 필수 기재 (iM뱅크 안내)"],
  },
  {
    id: "ae",
    name: "UAE",
    code: "AE",
    flag: "🇦🇪",
    riskLevel: "NORMAL",
    popular: false,
    currency: "AED",
    ibanRequired: true,
    ibanLength: 23,
    routingType: "SWIFT_only",
    purposeCodeRequired: true, // iM뱅크 자료
    remarks: [
      "IBAN 23자리 (AE 시작)",
      "POP CODE 3자리 필요 (iM뱅크 안내)",
      "송금사유 필수 기재 (iM뱅크 안내)",
    ],
  },
  {
    id: "tr",
    name: "터키",
    code: "TR",
    flag: "🇹🇷",
    riskLevel: "WATCH",
    popular: false,
    currency: "TRY",
    ibanRequired: true,
    ibanLength: 26,
    routingType: "SWIFT_only",
    remarks: ["IBAN 26자리 (TR 시작)"],
  },

  // ─────────── 기타: 미주 ───────────
  {
    id: "mx",
    name: "멕시코",
    code: "MX",
    flag: "🇲🇽",
    riskLevel: "NORMAL",
    popular: false,
    currency: "MXN",
    ibanRequired: false,
    routingType: "CLABE",
    routingDigits: 18,
    remarks: ["CLABE 18자리 + SWIFT BIC"],
  },

  // ─────────── 제재국 (선택 차단) ───────────
  {
    id: "kp",
    name: "북한",
    code: "KP",
    flag: "🇰🇵",
    riskLevel: "BLOCKED",
    popular: false,
    currency: "KPW",
    remarks: ["❌ 송금 불가 — UN 제재 + 한국 독자 제재"],
  },
  {
    id: "ir",
    name: "이란",
    code: "IR",
    flag: "🇮🇷",
    riskLevel: "BLOCKED",
    popular: false,
    currency: "IRR",
    remarks: ["❌ 송금 불가 — UN/미국 제재"],
  },
  {
    id: "sy",
    name: "시리아",
    code: "SY",
    flag: "🇸🇾",
    riskLevel: "BLOCKED",
    popular: false,
    currency: "SYP",
    remarks: ["❌ 송금 불가 — 제재"],
  },
  {
    id: "cu",
    name: "쿠바",
    code: "CU",
    flag: "🇨🇺",
    riskLevel: "BLOCKED",
    popular: false,
    currency: "CUP",
    remarks: ["❌ 송금 불가 — 미국 제재"],
  },

  // TODO: 말레이시아, 대만, 캄보디아, 우즈베키스탄, 카자흐스탄, 몽골,
  //       네팔, 미얀마, 라오스, 이스라엘, 이집트, 남아공, 브라질, 뉴질랜드,
  //       오스트리아, 벨기에, 폴란드, 노르웨이, 스웨덴, 덴마크, 핀란드, 룩셈부르크,
  //       러시아 (제재 점검 필요), 우크라이나 등
];
