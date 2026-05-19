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

  currency?: string; // ISO 4217 통화 코드 (USD, KRW, VND, EUR 등) — 환율 환산용

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
  type: "country" | "amountUsd" | "amount" | "residence" | "text";
  // "amount" — 현지 통화 입력 + USD 자동 환산 (countryId 필요)
  // "amountUsd" — USD 직접 입력 (legacy)
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

// ============================================================
// 외국통화 견양 (환전 매입 가능 여부 확인용)
// ============================================================

export type Denomination = {
  value: string;       // 표기: "$100", "10,000엔" 등
  series?: string;     // 발행 시리즈/연도 (예: "2024년 신권")
  imageUrl?: string;   // public/currency-samples/... 경로 (없으면 placeholder)
  acceptable: boolean; // 매입 가능 여부
  notes?: string;      // 특이 사항
};

export type CurrencySample = {
  id: string;
  code: string;          // ISO 4217 (예: USD, JPY, EUR)
  countryCode: string;   // ISO 3166-1 alpha-2 (예: us, jp, eu, gb) — flag-icons 클래스용 소문자
  countryName: string;
  flag: string;          // legacy emoji (호환용)
  primary: boolean;      // 주요 통화 (상단 노출)
  denominations: Denomination[];
  generalNotes?: string[]; // 매입 일반 유의사항
};

// ============================================================
// 본부 공지·가이드 게시판 + 익명 Q&A (시연용 데모 데이터)
// ============================================================

export type NoticeCategory = "공지" | "가이드" | "정책변경";

export type Notice = {
  id: string;
  category: NoticeCategory;
  title: string;
  content: string;
  author: string;
  createdAt: string; // ISO
};

export type QnaStatus = "대기" | "완료";

export type QnaItem = {
  id: string;
  title: string;
  question: string;
  questionerName?: string; // 익명이면 undefined
  isAnonymous: boolean;
  createdAt: string;
  answer?: string;
  answeredBy?: string;
  answeredAt?: string;
};

// ============================================================
// 업무별 가이드 (사유별 1장 카드)
// ============================================================

export type BusinessGuideCategory =
  | "경상거래"      // 해외여행경비, 의료비, 일반 증여, 수입대금 등
  | "자산이전"      // 해외이주비, 재외동포 재산반출
  | "외국인송금"    // 외국인·비거주자 국내소득 송금
  | "자본거래"      // 제7장 자본거래 (별도)
  | "기타";

export type BusinessGuideItem = {
  id: string;
  title: string;            // "해외체재비 (02)"
  subtitle?: string;        // 한 줄 설명
  category: BusinessGuideCategory;
  transactionCode?: string; // 한은 외환전산망 코드 + 명칭 (확정된 것만)
  legalRef: string;         // 외환규정 조항 1차 인용
  designationMethod:        // 거래외국환은행 지정 방법
    | "외화송금신청서로_직접"
    | "별도_신청서_필요"
    | "지정_불요";
  annualLimit?: string;     // 한도 (자유 문자열)
  requiredDocs: string[];   // 필요 서류
  cautions: string[];       // 주의사항/통보의무
  customerScripts?: string[]; // 안내 멘트 (선택)
  relatedTerms?: string[];  // 관련 약관 이름 (string)
  source: string;           // 1차 출처 명시
};

export type Faq = {
  id: string;
  category: string;
  question: string;
  answer: string;
  source?: string; // 1차 출처 (예: "외환규정 4-3조 ①1호" / "iM뱅크 모바일앱 안내")
  keywords?: string[];
};

export type GlossaryCategory =
  | "거주성"     // 거주자, 비거주자, 재외동포 등
  | "거래"       // 경상거래, 자본거래, 본지사간거래 등
  | "지급수단"   // 지급수단, 신용카드, 여행자카드 등
  | "환율"       // 매매기준율, 위안화 등
  | "신고제출"   // 신고, 신고수리, 인정된 거래 등
  | "외국환은행" // 외국환은행, 거래외국환은행, 지정거래외국환은행
  | "기관"       // 기관투자가, 외환동시결제시스템, 공공기관 등
  | "파생상품"   // 신용파생, 외환파생, 장내·장외파생, 외환증거금
  | "송금경비"   // 해외여행경비, 해외이주비, 해외여행자(체재자/유학생/일반)
  | "현지금융"   // 현지금융, 현지법인, 현지법인금융기관, LCT 직거래은행
  | "수입금융"   // 내국수입유산스, 수입인수금융
  | "기타";

export type GlossaryTerm = {
  id: string;
  term: string;
  definition: string;
  category: GlossaryCategory;
  source?: string; // 1차 출처 (예: "외환규정 1-2조 29호")
  related?: string[];
};

// ============================================================
// 임계값 (외환규정 기준)
// ============================================================

export const AMOUNT_THRESHOLDS = {
  // ─── 외환규정 본문 직접 인용 ───
  customsReport: 10_000, // 관세청 통보 — 4-8조 ②5·6호
  taxReport: 10_000, // 국세청 통보 — 4-8조 ①1호
  fssReport: 10_000, // 금감원 통보 — 4-8조 ③1호 (이전 50_000은 근거 불명, 본문 기준 정정)

  // ─── iM뱅크 모바일앱 안내 자료 (1차) ─── (영업점 기준 검증 필요)
  noProofLimit: 100_000, // 거주자 무증빙 해외송금 연간 한도 (1.1~12.31) — 외환규정 4-3조 ①1호
  foreignerNoProof: 50_000, // 외국인·비거주자 국내소득송금 연간 한도

  // ─── 출처 미명확 (검증 필요) ───
  bankDesignation: 5_000, // 거래외국환은행 지정 — ⚠️ 정확한 외환규정 출처 검증 필요
  internetLimit: 10_000, // 인터넷뱅킹 한도 — ⚠️ iM뱅크 자체 한도 검증 필요
  thirdPartyReport: 5_000, // 제3자 지급 신고 — ⚠️ 외환규정 출처 검증 필요
} as const;
