// 외환 길잡이 — 핵심 도메인 타입
// 1차 기준: 외국환거래규정 (재정경제부고시 제2026-69호, 시행 2026.3.30.)
//   포함 개정: 2025-4호 (2025.2.10.) · 2025-57호 (2025.12.29.) · 2026-69호 (2026.3.30.)
//   원문: docs/regulations/외환규정_2026-69_법령본문.txt
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

export type CountryRoutingType =
  | "ABA"           // 미국 라우팅 번호
  | "BSB"           // 호주
  | "SortCode"      // 영국 Sort Code (IBAN과 병행)
  | "Transit"       // 캐나다 Institution + Transit
  | "IFSC"          // 인도
  | "CNAPS"         // 중국
  | "CLABE"         // 멕시코
  | "JapaneseBank"  // 일본 은행/지점/계좌
  | "SWIFT_only";   // SWIFT BIC만 사용

export type Country = {
  id: string;
  name: string;
  code: string; // ISO 3166-1 alpha-2
  flag: string; // emoji
  riskLevel: RiskLevel;
  popular: boolean;

  // 송금 시 유의사항 (잠정 데이터 — 영업점 실제 기준으로 검증 필요)
  ibanRequired?: boolean;
  ibanLength?: number;             // 예: DE 22, FR 27
  routingType?: CountryRoutingType;
  routingDigits?: number;
  purposeCodeRequired?: boolean;   // 현지 송금사유 코드 필수 여부

  remarks?: string[]; // 직원 안내용 자유 메모
  notes?: string[];   // (legacy — 기존 호환)
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
// 시나리오 트리 (창구 상담 가이드 — Wizard 형태)
// ============================================================
// 외환송금/환전/신용장 등 업무 하나당 한 그루의 트리.
// 직원이 고객 답변에 따라 노드를 클릭해 좁혀가며 결과(거래코드/서류/통보/멘트)에 도달.
// 모든 분기는 외환규정 본문 근거 필수 (사용자 절대 원칙).

export type ScenarioNodeType = "input" | "select" | "result";

export type ScenarioInputField = {
  key: string; // FlowInput의 키 또는 자유 입력
  label: string;
  type: "country" | "amountUsd" | "residence" | "text";
  hint?: string;
};

export type ScenarioOption = {
  id: string;
  label: string;       // 직원이 클릭하는 라벨 (고객 일상 언어)
  detail?: string;     // 카드에 부연 표시
  next: string;        // 다음 노드 id
  legalRef?: string;   // 외환규정 근거 (선택 시 결과에 누적)
};

export type ScenarioNode = {
  id: string;
  type: ScenarioNodeType;
  title?: string;            // 단계 제목 (예: "1단계 — 송금 정보")
  question: string;          // 화면에 보일 질문/안내
  hint?: string;             // 직원 보조 멘트 ("두루뭉술하면 이렇게 다시 묻기")
  inputs?: ScenarioInputField[]; // type=input
  options?: ScenarioOption[];    // type=select
  result?: FlowResult;            // type=result
  legalRef?: string;
};

export type Scenario = {
  id: string;        // "remittance" | "exchange" | "lc" | ...
  title: string;
  rootNodeId: string;
  nodes: Record<string, ScenarioNode>;
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
  fssReport: 50_000, // 금감원 통보 — ⚠️ 4-8조③1호 본문은 미화 1만불. 50_000 근거 재확인 필요
  noProofLimit: 100_000, // 거주자 미증빙 연간 한도
  foreignerNoProof: 50_000, // 외국인 미증빙 연간 한도
} as const;
