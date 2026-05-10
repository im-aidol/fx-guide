// 외환 길잡이 — 핵심 도메인 타입
// 1차 기준: 외국환거래규정 (기획재정부고시 제2025-4호, 시행 2025.2.10.)
// fx/data.js의 구조를 TypeScript로 옮길 때 참고

// ============================================================
// 공통
// ============================================================

export type RiskLevel = "NORMAL" | "WATCH" | "HIGH_RISK" | "BLOCKED";

export type LegalReference = {
  article: string; // 예: "외국환거래규정 제4-3조 제1항"
  summary: string;
};

// ============================================================
// 송금 케이스 (업무별 가이드)
// ============================================================

export type SendCaseCategory =
  | "경상거래"
  | "자본거래"
  | "외국인"
  | "자산이전"
  | "의심거래";

export type SendCase = {
  id: string;
  title: string;
  subtitle: string;
  category: SendCaseCategory;
  icon: string;
  imbankCategory: string;
  purposeCode: string;
  summary: string;
  when: string[];
  requirements: Record<string, string>;
  limits: Record<string, string>;
  documents: string[];
  afterCare: string[];
  cautions: string[];
  legalBasis: LegalReference[];
  commonMistakes: string[];
};

// ============================================================
// 송금 흐름 도우미 (시뮬레이터)
// ============================================================

export type Country = {
  id: string;
  name: string;
  code: string; // ISO
  flag: string; // emoji
  riskLevel: RiskLevel;
  popular: boolean;
  notes?: string[];
};

export type Purpose = {
  id: string;
  label: string;
  category: SendCaseCategory;
  transactionCode: string;
  needsBankDesignation: boolean;
  annualLimit?: number; // USD
  perTransactionLimit?: number; // USD
  requiredDocs: string[];
  legalBasis: LegalReference[];
};

export type SenderType = {
  id: string;
  label: string;
  description: string;
};

export type RecipientRelation = {
  id: string;
  label: string;
};

// 시뮬레이터 입력
export type FlowInput = {
  countryId: string;
  purposeId: string;
  amountUsd: number;
  senderId: string;
  recipientId: string;
  extras: Record<string, string | boolean | number>;
};

// 시뮬레이터 출력
export type FlowResult = {
  transactionCode: string;
  legalBasis: string;
  channel: "internet" | "branch_only";
  needsBankDesignation: boolean;
  reportRequirement: "none" | "bank" | "bok" | "bok_approval";
  documents: string[];
  cautions: string[];
  suspiciousSignals: string[];
  needsHQReview: boolean;
  customerScripts: string[];
};

// ============================================================
// FAQ / Glossary
// ============================================================

export type Faq = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

export type GlossaryTerm = {
  id: string;
  term: string;
  definition: string;
  related?: string[];
};

// ============================================================
// 임계값 (외환규정 기준)
// ============================================================

export const AMOUNT_THRESHOLDS = {
  bankDesignation: 5_000, // 거래외국환은행 지정
  internetLimit: 10_000, // 인터넷뱅킹 한도
  thirdPartyReport: 5_000, // 제3자 지급 신고
  customsReport: 10_000, // 관세청 통보
  taxReport: 10_000, // 국세청 통보
  fssReport: 50_000, // 금감원 통보
  noProofLimit: 100_000, // 거주자 미증빙 연간 한도
  foreignerNoProof: 50_000, // 외국인 미증빙 연간 한도
} as const;
