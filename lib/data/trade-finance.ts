// 무역금융(수출입) 도메인 데이터.
// 1차 자료: 2025년 상반기 중견신입행원 연수교재 "수출입 업무의 이해" (HR부, 2025.06)
// 보조: UCP 600, ISBP 745, URC 522, INCOTERMS 2020.
//
// ⚠️ 임의 수정 금지. 거래코드·조항 번호·만기일 산정 룰은 원문 그대로 옮겨 둘 것.

// ─── INCOTERMS 2020 (가격조건) ───
export type IncotermGroup = "E" | "F" | "C" | "D";
export type IncotermTransportMode = "any" | "sea-only";

export type Incoterm = {
  code: string; // "EXW", "FOB" 등
  name: string; // "Ex Works"
  korName: string;
  group: IncotermGroup;
  transport: IncotermTransportMode;
  costBy: "seller" | "buyer"; // 운임 부담 주체 기본값
  insuranceRequired: boolean; // 매도인 부보 의무
  riskTransferPoint: string;
  notes?: string;
};

export const INCOTERMS_2020: Incoterm[] = [
  {
    code: "EXW",
    name: "Ex Works",
    korName: "공장 인도",
    group: "E",
    transport: "any",
    costBy: "buyer",
    insuranceRequired: false,
    riskTransferPoint: "매도인 공장(작업장) 인도 시점",
    notes: "수입상 부담 최대 · 수출통관 의무도 수입상",
  },
  {
    code: "FCA",
    name: "Free Carrier",
    korName: "운송인 인도",
    group: "F",
    transport: "any",
    costBy: "buyer",
    insuranceRequired: false,
    riskTransferPoint: "지정장소에서 매수인이 지정한 운송인에게 인도 시점",
  },
  {
    code: "FAS",
    name: "Free Alongside Ship",
    korName: "선측 인도",
    group: "F",
    transport: "sea-only",
    costBy: "buyer",
    insuranceRequired: false,
    riskTransferPoint: "지정 선적항의 본선 선측 인도 시점",
  },
  {
    code: "FOB",
    name: "Free On Board",
    korName: "본선 인도",
    group: "F",
    transport: "sea-only",
    costBy: "buyer",
    insuranceRequired: false,
    riskTransferPoint: "본선 적재 시점",
    notes: "수입상이 보험 가입 (개설 당일 보험증권 징구)",
  },
  {
    code: "CPT",
    name: "Carriage Paid To",
    korName: "운송비 지급 인도",
    group: "C",
    transport: "any",
    costBy: "seller",
    insuranceRequired: false,
    riskTransferPoint: "최초 운송인 인도 시점 (운임은 도착지까지)",
  },
  {
    code: "CIP",
    name: "Carriage and Insurance Paid To",
    korName: "운송비·보험료 지급 인도",
    group: "C",
    transport: "any",
    costBy: "seller",
    insuranceRequired: true,
    riskTransferPoint: "최초 운송인 인도 시점 (보험·운임 매도인 부담)",
    notes: "신용장상 보험서류 요구 — 매도인이 ICC(A) 등 부보",
  },
  {
    code: "CFR",
    name: "Cost and Freight",
    korName: "운임 포함 인도",
    group: "C",
    transport: "sea-only",
    costBy: "seller",
    insuranceRequired: false,
    riskTransferPoint: "본선 적재 시점 (운임은 양륙항까지)",
  },
  {
    code: "CIF",
    name: "Cost, Insurance and Freight",
    korName: "운임·보험료 포함 인도",
    group: "C",
    transport: "sea-only",
    costBy: "seller",
    insuranceRequired: true,
    riskTransferPoint: "본선 적재 시점 (운임·보험 도착지까지)",
    notes: "신용장상 보험서류 요구 — 매도인 부보 (최소 ICC(C) 110%)",
  },
  {
    code: "DAP",
    name: "Delivered at Place",
    korName: "도착지 인도",
    group: "D",
    transport: "any",
    costBy: "seller",
    insuranceRequired: false,
    riskTransferPoint: "지정 도착지에서 양하 준비 상태로 인도 시점",
  },
  {
    code: "DPU",
    name: "Delivered at Place Unloaded",
    korName: "도착지 양하 인도",
    group: "D",
    transport: "any",
    costBy: "seller",
    insuranceRequired: false,
    riskTransferPoint: "지정 도착지에서 양하 후 인도 시점",
    notes: "DAT 폐지 → DPU 신설 (INCOTERMS 2020)",
  },
  {
    code: "DDP",
    name: "Delivered Duty Paid",
    korName: "관세 지급 인도",
    group: "D",
    transport: "any",
    costBy: "seller",
    insuranceRequired: false,
    riskTransferPoint: "지정 도착지 인도 시점 (수입통관·관세 매도인 부담)",
    notes: "수출상 부담 최대 · 수입통관·관세까지 매도인",
  },
];

// ─── 결제 방식 분류 ───
export type SettlementMethod =
  | "sight-lc-payment"
  | "sight-lc-nego"
  | "usance-deferred"
  | "usance-acceptance"
  | "usance-nego"
  | "dp"
  | "da"
  | "tt-advance"
  | "cod"
  | "cad"
  | "european-dp"
  | "oa";

export type SettlementMethodInfo = {
  id: SettlementMethod;
  parent: "lc" | "collection" | "remittance";
  korTitle: string;
  engTitle: string;
  description: string;
  applicableRule?: string;
};

export const SETTLEMENT_METHODS: SettlementMethodInfo[] = [
  {
    id: "sight-lc-payment",
    parent: "lc",
    korTitle: "일람 지급신용장",
    engTitle: "Sight Payment Credit",
    description:
      "신용장 조건에 일치하는 서류 제시 시 즉시(일람) 지급. 환어음 미발행.",
    applicableRule: "UCP 600",
  },
  {
    id: "sight-lc-nego",
    parent: "lc",
    korTitle: "일람 매입신용장",
    engTitle: "Sight Negotiation Credit",
    description: "수출지 매입은행이 환어음+서류 매입 후 개설은행에 상환 청구.",
    applicableRule: "UCP 600",
  },
  {
    id: "usance-deferred",
    parent: "lc",
    korTitle: "연지급신용장",
    engTitle: "Deferred Payment Credit",
    description: "환어음 없이 만기에 지급. 신용장상 연지급 확약.",
    applicableRule: "UCP 600",
  },
  {
    id: "usance-acceptance",
    parent: "lc",
    korTitle: "인수신용장",
    engTitle: "Acceptance Credit",
    description: "기한부 환어음 인수 후 만기에 지급.",
    applicableRule: "UCP 600",
  },
  {
    id: "usance-nego",
    parent: "lc",
    korTitle: "기한부 매입신용장",
    engTitle: "Usance Negotiation Credit",
    description: "기한부 환어음 매입 → 개설은행 만기 결제.",
    applicableRule: "UCP 600",
  },
  {
    id: "dp",
    parent: "collection",
    korTitle: "D/P (지급인도조건)",
    engTitle: "Documents against Payment",
    description: "일람불 · 대금 지급을 조건으로 선적서류 인도.",
    applicableRule: "URC 522",
  },
  {
    id: "da",
    parent: "collection",
    korTitle: "D/A (인수인도조건)",
    engTitle: "Documents against Acceptance",
    description: "기한부 · 환어음 인수 조건으로 선적서류 인도, 만기에 지급.",
    applicableRule: "URC 522",
  },
  {
    id: "tt-advance",
    parent: "remittance",
    korTitle: "사전 송금 (T/T in Advance)",
    engTitle: "Telegraphic Transfer in Advance",
    description: "수출 대금 전액 미리 송금 받은 후 선적.",
  },
  {
    id: "cod",
    parent: "remittance",
    korTitle: "COD (현물상환지급)",
    engTitle: "Cash on Delivery",
    description: "물품 도착 후 검사·인수와 동시 결제. 귀금속 등 고가품.",
  },
  {
    id: "cad",
    parent: "remittance",
    korTitle: "CAD (서류상환지급)",
    engTitle: "Cash against Documents",
    description: "선적 후 수출지에서 서류 제시 시 즉시 결제. 선적 전 검사 가능.",
  },
  {
    id: "european-dp",
    parent: "remittance",
    korTitle: "European D/P",
    engTitle: "European D/P",
    description: "송금 방식의 D/P. 은행 추심 절차 없이 송금.",
  },
  {
    id: "oa",
    parent: "remittance",
    korTitle: "O/A (사후 송금)",
    engTitle: "Open Account",
    description:
      "수출상 선적 + 운송서류 수입상 직접 송부 + 일정기간 후 송금. 본·지사 또는 고정거래처.",
  },
];

// ─── 수입 신용장 — 기한부(USANCE) 신용공여 주체 3종 ───
export type UsanceType = "S/U" | "B/U" | "D/U";

export type UsanceVariant = {
  id: UsanceType;
  fullName: string;
  korFullName: string;
  creditProvider: string;
  drawee: string;
  pros: string[];
  cons: string[];
};

export const USANCE_VARIANTS: UsanceVariant[] = [
  {
    id: "S/U",
    fullName: "Shipper's Usance",
    korFullName: "수출자유산스",
    creditProvider: "수출상이 수입상에게 신용 공여",
    drawee: "수입상 (만기에 환어음 결제)",
    pros: [
      "수입상이 인수비용·환가료 부담 없음",
      "수출상이 매입은행에 매입 요청 → 환가료를 수출상이 부담",
    ],
    cons: ["수출상이 매입 거절 가능", "기한부 거래 합의 필요"],
  },
  {
    id: "B/U",
    fullName: "Banker's Usance",
    korFullName: "해외인수은행 유산스",
    creditProvider: "해외인수은행(=상환은행)이 수입상에게 신용 공여",
    drawee: "해외상환은행 (Reimbursing Bank)",
    pros: [
      "상환은행이 수출상에게 일람불로 즉시 지급",
      "수입상은 정해진 기한 후에만 결제",
    ],
    cons: [
      "어음 할인 인수비용+환가료는 수입상 부담",
      "만기연장·조기상환 원칙적 불가 (해외인수은행 규정에 따름)",
      "상환은행 내부규정·현지법 제약으로 처리 지연 우려",
    ],
  },
  {
    id: "D/U",
    fullName: "Domestic Usance (Internal Banker's Usance)",
    korFullName: "내국수입유산스",
    creditProvider: "iM뱅크가 수입상에게 신용 공여",
    drawee: "iM뱅크",
    pros: [
      "B/U 대비 고객 부담 이자 저렴 (Term SOFR + 0.5~1.0%, B/U는 환가료율+0.4%)",
      "조기상환·만기연장 자유 (만기연장: 인수일로부터 360일까지)",
      "부도결제·하자인수 리스크 감소 (수입상 인수 후 결제자금 송금)",
      "당행 단독 진행으로 사후관리·업무처리 빠름",
    ],
    cons: [
      "당행 신용공여 — 외환한도 차감",
      "B/U와 마찬가지로 수입상이 인수비용+환가료 부담",
    ],
  },
];

// ─── 수입 신용장 결제 방식 (송금/상환/차기) ───
export type LcSettlementMethodInfo = {
  id: "remittance" | "reimbursement" | "debit";
  korTitle: string;
  engTitle: string;
  flow: string;
  notes?: string;
};

export const LC_SETTLEMENT_METHODS: LcSettlementMethodInfo[] = [
  {
    id: "remittance",
    korTitle: "송금방식",
    engTitle: "Remittance",
    flow:
      "선적서류 일치 제시 시, 개설은행이 매입은행의 Covering Letter상 계좌로 송금. 수입대금 결제 후 송금. 자금 흐름: iM뱅크 환거래은행 → 매입은행 환거래은행 계좌.",
    notes: "개설의뢰인 결제 후 송금 → 하자 시 자금 회수 부담 적음",
  },
  {
    id: "reimbursement",
    korTitle: "상환방식",
    engTitle: "Reimbursement",
    flow:
      "신용장 개설 시 상환은행에 RA(Reimbursement Authorization) 발신, 매입은행이 상환은행으로 자금 청구. A/S의 경우 개설의뢰인 결제 이전 자금 인출 → 매입은행 지급 → 상환은행에서 iM뱅크로 자금 청구.",
    notes:
      "하자 발생 시 지급거절 하더라도 자금반환 애로. 청구방식: 우편(mail claim) 또는 전신(T/T claim · 'By telegraphic transfer' / 'T/T reimbursement allowed').",
  },
  {
    id: "debit",
    korTitle: "차기방식",
    engTitle: "Debit",
    flow:
      "지정은행이 개설은행 해외 본·지점 또는 예치환거래은행일 경우, 개설은행 계좌에서 자금 직접 인출(차기). iM뱅크가 예금주인 매입은행 계좌에서 매입은행이 직접 debit.",
    notes: "실무상 이용이 많지 않음",
  },
];

// ─── 신용장 19개 필드 (수입신용장 발행신청서 기준) ───
export type LcField = {
  no: number;
  swift?: string; // SWIFT 태그 (있는 경우)
  korName: string;
  engName: string;
  description: string;
  ucpRef?: string; // UCP 600 조항
  isbpRef?: string; // ISBP 745 단락
  examples?: string[];
  cautions?: string[]; // 작성 주의사항·하자 가능성
};

export const LC_FIELDS: LcField[] = [
  {
    no: 1,
    swift: "20",
    korName: "신용장 번호",
    engName: "Credit Number",
    description: "개설은행이 부여하는 고유 신용장 번호.",
    ucpRef: "UCP 600 제1조",
  },
  {
    no: 2,
    swift: "57a",
    korName: "통지은행",
    engName: "Advising Bank",
    description: "수출상이 신용장을 통지 받을 은행. SWIFT 코드 기재.",
    ucpRef: "UCP 600 제9조",
    cautions: ["통지은행 RMA 미체결 시 전문 릴레이 비용 발생 가능"],
  },
  {
    no: 3,
    swift: "40E/40F",
    korName: "신용장 양도",
    engName: "Transferable",
    description:
      "TRANSFERABLE 명시 시, 수출상이 제2의 수출상에게 신용장 일부 또는 전부 양도 가능.",
    ucpRef: "UCP 600 제38조",
  },
  {
    no: 4,
    swift: "31D",
    korName: "유효기일·장소",
    engName: "Expiry Date / Place",
    description: "일치하는 제시가 이루어져야 하는 일자·장소.",
    ucpRef: "UCP 600 제6조",
    isbpRef: "ISBP 745 A19",
    cautions: ["선적기일과 일관성 확인", "유효기일 경과 서류 부도 사유"],
  },
  {
    no: 5,
    swift: "50",
    korName: "개설의뢰인 (수입상)",
    engName: "Applicant",
    description: "신용장 개설을 의뢰한 수입상의 명칭·주소.",
    ucpRef: "UCP 600 제2조",
    cautions: ["상업송장의 수하인(BUYER)과 정확히 일치"],
  },
  {
    no: 6,
    swift: "59",
    korName: "수익자 (수출상)",
    engName: "Beneficiary",
    description: "신용장상 대금을 수취할 수출상의 명칭·주소.",
    ucpRef: "UCP 600 제2조",
    cautions: ["통지은행 SWIFT를 통한 명칭 표기 일치 필수"],
  },
  {
    no: 7,
    swift: "32B / 39A",
    korName: "통화·금액 · 과부족율",
    engName: "Amount, +/- %",
    description:
      "신용장 통화 및 개설금액. 과부족율(+/- %)은 부분선적·수량 변동 허용 범위.",
    ucpRef: "UCP 600 제30조",
    cautions: ["환율 변동 고려 · 한도 확인 필수"],
  },
  {
    no: 8,
    swift: "41a",
    korName: "이용가능 은행·방식",
    engName: "Available With … By …",
    description:
      "신용장 이용가능 은행과 이용방식(지급/연지급/인수/매입). 'BY NEGOTIATION', 'BY ACCEPTANCE' 등.",
    ucpRef: "UCP 600 제6조",
  },
  {
    no: 9,
    swift: "42C",
    korName: "결제 방식 (DRAFT AT)",
    engName: "Draft At",
    description:
      "SIGHT(일람불) / USANCE(기한부 — 일람 후 또는 선적일자 기준). 기한부 신용장은 신용 공여 주체(S/U·B/U·D/U) 중 택일.",
    ucpRef: "UCP 600 제6조 b항",
    cautions: ["일람불 vs 기한부 — 수입상 신용공여 부담 다름"],
  },
  {
    no: 10,
    swift: "43P",
    korName: "분할선적",
    engName: "Partial Shipment",
    description: "ALLOWED / NOT ALLOWED.",
    ucpRef: "UCP 600 제31조",
  },
  {
    no: 11,
    swift: "43T",
    korName: "환적",
    engName: "Transhipment",
    description: "ALLOWED / NOT ALLOWED.",
    ucpRef: "UCP 600 제19~24조",
  },
  {
    no: 12,
    swift: "44A~44F",
    korName: "장소·위치 표기",
    engName: "Place / Location Identification",
    description:
      "① 수령지 ② 출발지(선적항/공항) ③ 도착지(양륙항/공항) ④ 최종배송지. 통상 ②·③만 충분. 복합운송서류 요구 시 ①·④ 추가.",
    ucpRef: "UCP 600 제19조 (복합운송)",
  },
  {
    no: 13,
    swift: "44C",
    korName: "선적기일",
    engName: "Latest Date of Shipment",
    description: "최종 선적 가능 일자.",
    ucpRef: "UCP 600 제6조 d항",
    isbpRef: "ISBP 745 A19",
    cautions: ["선적기일 경과 = 하자"],
  },
  {
    no: 14,
    swift: "45A",
    korName: "물품명세",
    engName: "Description of Goods and/or Services",
    description:
      "1) PRICE TERMS: INCOTERMS 2020 11가지 조건  2) COUNTRY OF ORIGIN: 원산지  3) HS-CODE: 세번부호 (한국 10자리, 국가별 자릿수 상이)  4) COMMODITY DESCRIPTION: 물품명·수량·단가·금액.",
    ucpRef: "UCP 600 제14조 e항",
    isbpRef: "ISBP 745 C3 (상업송장 물품명세 엄격일치)",
    cautions: [
      "과도한 물품명세 기재 금지 — 수출상 조건 이행 불가로 만들 위험",
      "상업송장은 신용장 물품명세와 엄격일치 (Strict Compliance)",
      "기타 서류는 실질일치(상당일치)",
    ],
  },
  {
    no: 15,
    swift: "46A",
    korName: "요구 서류",
    engName: "Documents Required",
    description:
      "네고 시 수출상이 은행에 제시할 서류: 상업송장 / 포장명세서 / 운송서류(선하증권 전통 / 항공운송서류 / 복합운송서류) / 보험서류(CIF·CIP·D조건 시) / 원산지증명서 / 기타.",
    ucpRef: "UCP 600 제14조",
    cautions: [
      "MADE OUT TO THE ORDER OF iM BANK → iM뱅크 지시식 (당행 배서/양도해야 효력)",
      "ENDORSED IN BLANK → 백지배서식 발행",
      "독소조항 금지: Non-negotiable documents acceptable / Copy B/L acceptable / 2/3 B/L acceptable / One original B/L direct to applicant by courier / Surrendered B/L acceptable / All discrepancies acceptable / L/C expired shall not be a discrepancy / Air Waybill consigned to ABC Co.,Ltd",
    ],
  },
  {
    no: 16,
    swift: "47A",
    korName: "부가 조건",
    engName: "Additional Conditions",
    description:
      "반드시 특정 회사 운송 / 제시 모든 서류 적용 / 신용장 번호 기재 / 기타 부가조건.",
    ucpRef: "UCP 600 제14조 h항",
    cautions: ["불명확 용어 금지: well-known, first class, qualified, independent, good, prompt, immediately, on or about"],
  },
  {
    no: 17,
    swift: "71B",
    korName: "국외 수수료 부담자",
    engName: "Charges",
    description:
      "수출상(BENEFICIARY) / 수입상(APPLICANT) 중 부담자 지정. 통지수수료·상환청구비용·릴레이 비용 등.",
    ucpRef: "UCP 600 제13조",
  },
  {
    no: 18,
    swift: "48",
    korName: "서류제시기간",
    engName: "Period for Presentation",
    description:
      "선적일 또는 기타 기준일 후 XX일 이내. STALE B/L ACCEPTABLE 시 제시기일 경과 서류 허용(단 유효기일 이내).",
    ucpRef: "UCP 600 제14조 c항 (미기재 시 선적일 후 21일)",
    cautions: ["미기재 = 기본 21일 적용"],
  },
  {
    no: 19,
    swift: "49",
    korName: "신용장 확인",
    engName: "Confirmation",
    description:
      "WITHOUT(확인 안 함) / CONFIRM(확인 추가 요청) / MAY ADD(확인 추가 가능). 확인은 일치하는 제시에 대한 확인은행의 결제·매입 확약.",
    ucpRef: "UCP 600 제8조",
    cautions: ["확인 비용 부담자(수출상/수입상) 지정 필요"],
  },
];

// ─── SWIFT 전문 유형 ───
export const SWIFT_MESSAGES = [
  { type: "MT700", korName: "신용장 발행", description: "수입신용장 개설 (Issue of Documentary Credit)" },
  { type: "MT707", korName: "신용장 조건변경", description: "Amendment of Documentary Credit" },
  { type: "MT740", korName: "상환수권서", description: "Authorisation to Reimburse (RA: Reimbursement Authorization)" },
  { type: "MT747", korName: "상환수권관련", description: "Amendment to Authorisation to Reimburse (상환은행으로 발송)" },
  { type: "MT710", korName: "전송신용장 통지", description: "Advice of a Third Bank's Documentary Credit" },
  { type: "MT720", korName: "양도신용장", description: "Transfer of a Documentary Credit" },
];

// ─── 거래 흐름도 ───
export type FlowStep = {
  step: number;
  actor: string; // 행위 주체
  actorEng?: string;
  action: string;
  detail: string;
  category?: "contract" | "shipment" | "documents" | "payment" | "post";
  scriptForCustomer?: string; // 영업점 응대 멘트
};

// 신용장 거래 흐름도 (12단계 — PDF 그림 기준)
export const LC_FLOW: FlowStep[] = [
  {
    step: 1,
    actor: "수입상 ↔ 수출상",
    actorEng: "Buyer ↔ Seller",
    action: "매매 계약 체결",
    detail:
      "수출상과 수입상이 INCOTERMS 2020 가격조건·결제방식(신용장)·선적기일·물품명세를 정한 매매계약서 작성. 신용장은 매매계약과 독립적이지만 개설은 계약서를 근거로 진행.",
    category: "contract",
    scriptForCustomer:
      "이번 거래에 적용할 INCOTERMS(예: FOB/CIF/DDP) 조건을 먼저 확인해 주세요. 보험·운임 부담이 달라집니다.",
  },
  {
    step: 2,
    actor: "수입상 → 개설은행 (iM뱅크)",
    actorEng: "Applicant → Issuing Bank",
    action: "신용장 개설 의뢰",
    detail:
      "취소불능화환신용장 발행신청서 + (필요 시) 물품매도확약서·계약서 + 보험서류(수입자 부보 시) + 수입승인서(필요 시).",
    category: "documents",
    scriptForCustomer:
      "외국환거래약정서가 먼저 체결되어 있어야 하고, 외화한도 잔액과 보증금 적립 여부를 확인합니다.",
  },
  {
    step: 3,
    actor: "개설은행 → 통지은행",
    actorEng: "Issuing Bank → Advising Bank",
    action: "MT700 전문 발신",
    detail:
      "BPR Step 생성 → 외환사업부 센터전송 → 외신무역망(MT700)으로 통지은행에 발신. 상환방식인 경우 동시에 MT740으로 상환은행에 RA(Reimbursement Authorization) 발신.",
    category: "documents",
  },
  {
    step: 4,
    actor: "통지은행 → 수출상",
    actorEng: "Advising Bank → Beneficiary",
    action: "신용장 통지",
    detail:
      "통지은행이 수출상에게 신용장 도착 통지 + 「ORIGINAL」 날인·책임자 서명·간인 + 『수출 신용장 접수증』 징구.",
    category: "documents",
  },
  {
    step: 5,
    actor: "수출상",
    actorEng: "Seller",
    action: "물품 선적",
    detail:
      "선적기일(LATEST SHIPMENT DATE) 이내에 선적. 선하증권(B/L) 또는 항공운송장(AWB) 발급.",
    category: "shipment",
  },
  {
    step: 6,
    actor: "수출상 → 매입은행 (지정은행)",
    actorEng: "Seller → Nominated/Negotiating Bank",
    action: "수출환어음 매입 의뢰",
    detail:
      "환어음 + 신용장 요구서류(상업송장·운송서류·보험서류·원산지증명서 등) 제시 → 매입은행이 신용장 조건·UCP 600·ISBP에 따라 심사 후 매입(CLEAN/하자).",
    category: "documents",
  },
  {
    step: 7,
    actor: "매입은행 → 수출상",
    actorEng: "Nominated Bank → Seller",
    action: "매입 대금 지급",
    detail:
      "일람불(A/S)이면 즉시 지급. 기한부(U/S)이면 만기 또는 인수 시점에 따라 지급. 환가료 등 매입수수료 차감.",
    category: "payment",
  },
  {
    step: 8,
    actor: "매입은행 → 개설은행",
    actorEng: "Nominated Bank → Issuing Bank",
    action: "선적서류 송부",
    detail:
      "Covering Letter(=선적서류 송부장)과 함께 선적서류 일체 송부. 입금요청 계좌 명시.",
    category: "documents",
  },
  {
    step: 9,
    actor: "개설은행 → 수입상",
    actorEng: "Issuing Bank → Applicant",
    action: "서류 도착 통지·심사·도착등록",
    detail:
      "서류 접수일 익일로부터 5영업일 간 신용장조건·UCP·ISBP 근거로 일치 여부 심사. 도착등록 후 인수/결제 만기일(도착등록일 익일 + 5영업일) 통보. 하자 시 5영업일 이내 모든 하자사유 명시하여 매입은행으로 한 번에 통보.",
    category: "documents",
    scriptForCustomer:
      "선적서류 도착 통지 후 5영업일 이내에 결제 또는 인수 절차가 필요합니다.",
  },
  {
    step: 10,
    actor: "수입상 → 개설은행",
    actorEng: "Applicant → Issuing Bank",
    action: "선적서류 인수·통관",
    detail:
      "일람불 = 결제. 기한부 = 인수 후 만기에 결제. L/G 발급 시 선적서류 도착 전 화물 인도 가능.",
    category: "payment",
  },
  {
    step: 11,
    actor: "개설은행 → 상환은행",
    actorEng: "Issuing Bank → Reimbursing Bank",
    action: "대금 이체 의뢰",
    detail:
      "상환방식인 경우 RA(MT740)에 따라 상환은행이 매입은행으로 대금 지급. 차기방식·송금방식은 직접 송금.",
    category: "payment",
  },
  {
    step: 12,
    actor: "상환은행 → 매입은행",
    actorEng: "Reimbursing Bank → Nominated Bank",
    action: "대금 이체",
    detail:
      "최종적으로 매입은행에 신용장 대금 결제. 거래 종결.",
    category: "post",
  },
];

// 추심 거래 흐름도 (D/P, D/A — URC 522)
export const COLLECTION_FLOW: FlowStep[] = [
  {
    step: 1,
    actor: "수출상 ↔ 수입상",
    actorEng: "Principal ↔ Drawee",
    action: "매매 계약 (D/P 또는 D/A)",
    detail:
      "신용장 없이 매매 계약 체결. 결제방식 D/P(지급인도) 또는 D/A(인수인도) 명시.",
    category: "contract",
    scriptForCustomer:
      "추심은 은행 지급보증이 없습니다. 거래처 신용을 확실히 한 경우에만 사용하세요.",
  },
  {
    step: 2,
    actor: "수출상",
    actorEng: "Principal",
    action: "물품 선적",
    detail: "계약 조건에 따라 선적 후 환어음 + 선적서류 준비.",
    category: "shipment",
  },
  {
    step: 3,
    actor: "수출상 → 추심의뢰은행 (iM뱅크)",
    actorEng: "Principal → Remitting Bank",
    action: "수출환어음 추심 의뢰",
    detail:
      "수출상이 iM뱅크에 환어음 + 선적서류 제출, 추심의뢰. 추심전 매입(NEGO) 신청도 가능 (단, 신용 7등급 이하·자산건전성 요주의 이하는 보증부(하자) 전결권 적용).",
    category: "documents",
  },
  {
    step: 4,
    actor: "추심의뢰은행 → 추심은행",
    actorEng: "Remitting Bank → Collecting Bank",
    action: "선적서류 송부",
    detail:
      "추심은행(수입지 은행)에 환어음·선적서류 송부. URC 522에 따라 추심 지시.",
    category: "documents",
  },
  {
    step: 5,
    actor: "추심은행 → 수입상",
    actorEng: "Collecting Bank → Drawee",
    action: "서류 제시",
    detail:
      "수입상에게 환어음·선적서류 제시. D/P이면 지급, D/A이면 환어음 인수 요청.",
    category: "documents",
  },
  {
    step: 6,
    actor: "수입상 → 추심은행",
    actorEng: "Drawee → Collecting Bank",
    action: "대금 지급(D/P) 또는 인수(D/A) + 선적서류 수령",
    detail:
      "D/P: 즉시 지급 후 서류 수령 / D/A: 환어음 인수 후 서류 수령, 만기에 지급. 통관.",
    category: "payment",
  },
  {
    step: 7,
    actor: "추심은행 → 추심의뢰은행",
    actorEng: "Collecting Bank → Remitting Bank",
    action: "대금 이체",
    detail: "추심된 대금을 추심의뢰은행 환거래계좌로 이체.",
    category: "payment",
  },
  {
    step: 8,
    actor: "추심의뢰은행 → 수출상",
    actorEng: "Remitting Bank → Principal",
    action: "수출환어음 대금 지급",
    detail:
      "수출상 외화계좌로 입금. 부도(D/P 지급거절·D/A 인수거절·만기 미지급) 시 부도처리.",
    category: "post",
  },
];

// ─── 수출환어음 서류 7종 ───
export type ShippingDocument = {
  korName: string;
  engName: string;
  description: string;
  ucpRef?: string;
  isbpRef?: string;
};

export const SHIPPING_DOCUMENTS: ShippingDocument[] = [
  {
    korName: "환어음",
    engName: "Draft (Bill of Exchange)",
    description:
      "채권자인 어음의 발행인이 채무자인 지급인에게 어음상의 기재된 금액을 일정기일(만기)에 일정한 장소에서 무조건으로 지급하여 줄 것을 위탁하는 요식유가증권.",
    ucpRef: "UCP 600 제6조 b항",
    isbpRef: "ISBP 745 B (Drafts and Calculation of Maturity Date)",
  },
  {
    korName: "상업송장",
    engName: "Commercial Invoice",
    description:
      "수출상이 수입상 앞으로 작성. 선적화물의 내용명세서이자 매매계산서 및 대금청구서 역할.",
    ucpRef: "UCP 600 제18조",
    isbpRef: "ISBP 745 C (Invoices)",
  },
  {
    korName: "선하증권",
    engName: "Bill of Lading (B/L)",
    description:
      "화주와 선박회사간의 해상운송계약에 의거 선박회사가 발행. 운송물품 수취·선적 증명 + 정당한 소지인에 운송물품 인도 약속 유가증권.",
    ucpRef: "UCP 600 제20조 (Bill of Lading)",
    isbpRef: "ISBP 745 E (Bill of Lading)",
  },
  {
    korName: "항공화물운송장",
    engName: "Air Waybill (AWB)",
    description:
      "운송인이 항공기로 물품 운송 시 발행. 화물 수탁 증명 화물운송증서.",
    ucpRef: "UCP 600 제23조 (Air Transport Document)",
    isbpRef: "ISBP 745 H (Air Transport Document)",
  },
  {
    korName: "보험증권",
    engName: "Insurance Policy",
    description:
      "개개의 확정 보험사실에 대한 개별보험계약 체결 증거. 당해 선적 분 권면 기재 내용대로 부보 이루어졌음을 증명하는 증권.",
    ucpRef: "UCP 600 제28조 (Insurance Document)",
    isbpRef: "ISBP 745 K (Insurance Document)",
  },
  {
    korName: "포장명세서",
    engName: "Packing List",
    description:
      "수입상·세관 등이 화물 확인 시 상업송장만으로는 포장단위 내용·중량·용적 정확히 파악 불가. 상업송장 보조 서류.",
    isbpRef: "ISBP 745 N (Packing List, Weight List)",
  },
  {
    korName: "원산지증명서",
    engName: "Certificate of Origin (C/O)",
    description:
      "물품 제조·생산 원산지 국가 증명 문서. 관세 감면·수입국 무역관리·소비자보호 목적.",
    ucpRef: "UCP 600 제3조 (Documents)",
    isbpRef: "ISBP 745 L (Certificate of Origin)",
  },
];

// ─── 하자 점검 룰 ───
export type DiscrepancyRule = {
  id: string;
  category: "general" | "invoice" | "bl" | "awb" | "insurance" | "draft" | "co";
  korTitle: string;
  description: string;
  ucpRef?: string;
  isbpRef?: string;
  // 룰: 텍스트 매칭 (LC 신청서 또는 제시서류에서 발견 시 경고)
  triggers: { in: string; matchAny: string[] }[];
  severity: "warning" | "error";
};

export const DISCREPANCY_RULES: DiscrepancyRule[] = [
  // 신용장 작성 단계 — 독소조항
  {
    id: "tox-clause-non-negotiable",
    category: "general",
    korTitle: "독소조항: Non-negotiable documents acceptable",
    description:
      "비유통서류(사본/Copy) 수리 허용 조항. 개설은행 담보권 저해 → 사용 금지.",
    triggers: [
      {
        in: "lcText",
        matchAny: ["non-negotiable documents are acceptable", "non negotiable documents acceptable"],
      },
    ],
    severity: "error",
  },
  {
    id: "tox-clause-copy-bl",
    category: "general",
    korTitle: "독소조항: Copy B/L acceptable",
    description: "선하증권 사본 수리 — 화물 담보권 상실 위험.",
    triggers: [{ in: "lcText", matchAny: ["copy b/l acceptable", "copy bl acceptable"] }],
    severity: "error",
  },
  {
    id: "tox-clause-23-bl",
    category: "general",
    korTitle: "독소조항: 2/3 B/L acceptable",
    description:
      "선하증권 전통(Full Set) 중 일부만 수리 허용 — 1장이 수입상 직송됨을 의미.",
    triggers: [{ in: "lcText", matchAny: ["2/3 b/l acceptable"] }],
    severity: "error",
  },
  {
    id: "tox-clause-one-bl-courier",
    category: "general",
    korTitle: "독소조항: 1 original B/L direct to applicant by courier",
    description: "원본 1장이 수입상에게 직송 — 개설은행이 화물 담보권 상실.",
    triggers: [
      {
        in: "lcText",
        matchAny: ["one original b/l shall be dispatched directly to applicant by courier"],
      },
    ],
    severity: "error",
  },
  {
    id: "tox-clause-surrendered-bl",
    category: "general",
    korTitle: "독소조항: Surrendered B/L acceptable",
    description: "양도된 선하증권 수리 — 이미 화물 인도된 상태로 담보 의미 없음.",
    triggers: [{ in: "lcText", matchAny: ["surrendered b/l acceptable"] }],
    severity: "error",
  },
  {
    id: "tox-clause-all-discrepancies",
    category: "general",
    korTitle: "독소조항: All discrepancies are acceptable",
    description: "모든 하자 수리 허용 — 신용장 본질 부정.",
    triggers: [{ in: "lcText", matchAny: ["all discrepancies are acceptable"] }],
    severity: "error",
  },
  {
    id: "tox-clause-lc-expired",
    category: "general",
    korTitle: "독소조항: L/C expired shall not be considered as a discrepancy",
    description: "유효기일 경과 = 하자 아님 → 신용장 유효기일 무력화.",
    triggers: [
      { in: "lcText", matchAny: ["l/c expired shall not be considered as a discrepancy"] },
    ],
    severity: "error",
  },
  {
    id: "tox-clause-awb-consigned",
    category: "general",
    korTitle: "독소조항: AWB consigned to 수입상",
    description:
      "항공운송장이 수입상 기명식 → 개설은행 담보권 없음. 'consigned to ABC Co.,Ltd' 패턴.",
    triggers: [
      { in: "lcText", matchAny: ["air waybill consigned to applicant", "awb consigned to applicant"] },
    ],
    severity: "error",
  },
  // 불명확 용어
  {
    id: "vague-terms",
    category: "general",
    korTitle: "불명확 용어 사용",
    description:
      "주관에 따라 해석 달라지는 용어. UCP 600 명시 금지 — well-known, first class, qualified, independent, good, prompt, immediately, on or about.",
    triggers: [
      {
        in: "lcText",
        matchAny: [
          "well-known",
          "first class",
          "qualified",
          "independent",
          "good ",
          "prompt",
          "immediately",
          "on or about",
        ],
      },
    ],
    severity: "warning",
  },
  // 서류 단계 — 상업송장
  {
    id: "invoice-applicant-mismatch",
    category: "invoice",
    korTitle: "상업송장 수하인 = APPLICANT 일치 여부",
    description:
      "ISBP 745 C2: 상업송장은 수익자가 개설의뢰인 앞으로 발행해야 함. 양도신용장이면 제1수익자 앞으로 가능.",
    ucpRef: "UCP 600 제18조 a항 ii",
    isbpRef: "ISBP 745 C2",
    triggers: [], // 수동 점검 항목
    severity: "warning",
  },
  {
    id: "invoice-strict-compliance",
    category: "invoice",
    korTitle: "상업송장 물품명세 엄격일치",
    description:
      "상업송장의 물품명세는 신용장 물품명세와 엄격일치(Strict Compliance). 단순 오타·재배열도 하자 가능.",
    ucpRef: "UCP 600 제18조 c항",
    isbpRef: "ISBP 745 C3",
    triggers: [],
    severity: "warning",
  },
  // 선하증권
  {
    id: "bl-consignee-mismatch",
    category: "bl",
    korTitle: "선하증권 수하인 (CONSIGNEE) 표기",
    description:
      "단순 지시식 (TO ORDER (SHIPPER)) → 배서 필요. 기명식 (TO ABC COMPANY) → 배서 불요. 신용장 조건과 반드시 일치.",
    ucpRef: "UCP 600 제20조",
    isbpRef: "ISBP 745 E4",
    triggers: [],
    severity: "warning",
  },
  {
    id: "bl-on-board-notation",
    category: "bl",
    korTitle: "본선적재부기 (On Board Notation) 필수",
    description:
      "Received B/L의 경우 'LADEN ON BOARD' 표기와 실제선적일자가 기재되어야 함. 선적일자가 곧 신용장 선적기일 충족 근거.",
    ucpRef: "UCP 600 제20조 a항 ii",
    isbpRef: "ISBP 745 E6",
    triggers: [],
    severity: "warning",
  },
  {
    id: "bl-full-set",
    category: "bl",
    korTitle: "선하증권 전통(Full Set) 제시",
    description:
      "신용장상 FULL SET 요구 시 발행된 원본 전통이 제시되어야 함. 원본 부수가 반드시 B/L에 기재.",
    ucpRef: "UCP 600 제20조 a항 iv",
    isbpRef: "ISBP 745 E13",
    triggers: [],
    severity: "warning",
  },
  // 항공운송장
  {
    id: "awb-consignee-named",
    category: "awb",
    korTitle: "AWB 수하인 기명식 발행",
    description:
      "항공운송서류의 수하인은 기명식으로 발행. 신용장상 'CONSIGNED TO iM BANK' 등 명시 권장.",
    ucpRef: "UCP 600 제23조",
    isbpRef: "ISBP 745 H8",
    triggers: [],
    severity: "warning",
  },
  // 보험서류
  {
    id: "insurance-amount-110",
    category: "insurance",
    korTitle: "보험금액 최저 110%",
    description:
      "보험금액은 상업송장 금액의 최저 110% 이상으로, 신용장과 동일 통화로 발행되어야 함.",
    ucpRef: "UCP 600 제28조 f항 ii",
    isbpRef: "ISBP 745 K10",
    triggers: [],
    severity: "warning",
  },
  {
    id: "insurance-date-before-shipment",
    category: "insurance",
    korTitle: "보험가입일·증권발행일 ≤ 선적일",
    description:
      "보험가입일/보험증권발행일은 선적일과 같거나 그 이전. 이후 가입 시 선적일부터 소급적용 가능 문구 명시 필요.",
    ucpRef: "UCP 600 제28조 e항",
    isbpRef: "ISBP 745 K11",
    triggers: [],
    severity: "warning",
  },
  // 환어음
  {
    id: "draft-required-when-sight",
    category: "draft",
    korTitle: "환어음 (Draft) 발행인·만기 표기",
    description:
      "환어음에 통화·금액·발행지·발행일·만기(TENOR — 예: 90 DAYS AFTER SIGHT)·수취인(매입은행)·지급인(drawee, 신용장상 'drawn on' 다음 은행)·신용장번호·신용장 개설일·발행인 서명 필수.",
    ucpRef: "UCP 600 제6조 b항",
    isbpRef: "ISBP 745 B",
    triggers: [],
    severity: "warning",
  },
];

// ─── 신용장 개설 시 필수 서류 ───
export const LC_OPENING_REQUIRED_DOCS = [
  {
    title: "취소불능화환신용장 발행신청서",
    required: true,
    note: "기본 신청서. 영업점 또는 인터넷뱅킹·EDI로 신청 가능.",
  },
  {
    title: "물품매도확약서(OFFER SHEET) 또는 계약서(CONTRACT)",
    required: false,
    note: "필요 시 — 신용장 물품명세 근거.",
  },
  {
    title: "보험서류",
    required: false,
    note:
      "수입자가 부보해야 하는 가격조건(FOB/FAS/CFR/EXW/FCA 등)인 경우 개설 당일 가입 원칙. 다음의 경우 생략 가능: (1) 전액 수입보증금 적립 (2) 전액 예·적금 담보 (3) 국가·지자체 수입 (4) 보세창고도거래(B.W.T.) (5) 중계무역 최종 수입기업 부보책임 (6) 당행 신용 4등급 또는 외부 신용평가등급 회사채 A·기업어음 A2 이상 (7) 당행 신용 6+등급 이상 + 심사역협의회 승인.",
  },
  {
    title: "수입승인서 또는 특정거래인정서",
    required: false,
    note: "대외무역법상 수입승인·특정거래 인정 없이 수입 불가한 경우에만 징구.",
  },
  {
    title: "외국환거래약정서",
    required: true,
    note: "최초 거래 시 체결. 신용장 개설·매입·결제 등 후속 거래 기본 약정.",
  },
];

// ─── L/G·T/R (수입화물선취보증서·수입물품대도) ───
export const LG_INFO = {
  fullName: "Letter of Guarantee (수입물품선취보증서)",
  purpose:
    "운송서류 도착 전 수입물품이 도착한 경우, 수입상이 수입물품을 조속히 인도받을 수 있도록 하기 위한 제도. B/L 원본 제시 없이 수입화물 인도 요청 + (추후 B/L 원본 운송회사 제출 + 운송회사 손해 발생 시 배상) 확약.",
  requiredDocs: [
    "수입물품선취보증신청서",
    "선하증권 사본 (ORIGINAL에 대한 사본)",
    "상업송장 사본",
    "기타 필요한 서류",
  ],
  fee: {
    rate: "연 3% (최저 10,000원)",
    base: "적립면제액 (= L/G 발급액)",
    period:
      "A/S: L/G 발급일부터 / U/S: 예정만기일부터 — 보증금 적립일 전일 또는 수입대금 결제일 전일까지",
    purpose:
      "L/G 발급에 따른 은행의 신용위험부담(수입화물 담보권 상실 + 선박회사 보증채무 발생) 커버 목적. 보증금 면제와 별개로 보증료는 면제 불가.",
  },
  depositExemption: [
    "대출 또는 해외차입에 의하여 수입대금 결제 예정인 경우",
    "국가·정부기관·지방자치단체·정부투자기관 및 이들 지배기업이 직접 수입하는 경우",
    "해당 여신한도의 담보비율이 100% 이상인 경우",
    "신용장 개설금액 전액을 수입보증금으로 적립한 경우",
    "금감원 선정 주채무계열 및 소속 기업체의 신용장 방식 수입 (취급 부점장이 채권회수 문제없다고 인정)",
    "심사역협의회의 승인을 득한 경우",
  ],
};

export const TR_INFO = {
  fullName: "Trust Receipt (수입물품대도)",
  purpose:
    "개설은행이 수입물품에 대한 소유권·담보권을 유지하면서 수입자가 대금 결제 전에 수입물품을 통관하여 제조·가공·판매할 수 있도록 하는 제도.",
  trigger: [
    "수입어음 결제 전 L/G 발급 시",
    "기한부 서류 인수 시",
    "당행대출대전으로 수입어음 결제하는 조건의 L/G 발급 시",
  ],
  exemption: "수입대금 전액이 수입보증금으로 적립된 경우 면제",
};

// ─── 수수료 (수입) ───
export const IMPORT_FEES = [
  {
    name: "수입어음결제지연이자 (Grace Day Charge)",
    description:
      "상환방식 일람출급조건에서 상환은행 결제시점과 개설의뢰인 결제시점 차이로 발생하는 자금부담 보전.",
    target: "수입환어음 전액",
    period:
      "수입환어음 운송서류 또는 차기통지서 접수일 포함 4영업일째 되는 날부터 결제일 전일까지",
    rate:
      "자기자금 결제: 징수당시 환가율 / 무역금융·외화대출 결제: 해당 대출이율",
  },
  {
    name: "수입어음결제수수료 (Corres Charge)",
    description:
      "신용장 개설·조건변경·결제 관련 지정은행·통지은행·확인은행·상환은행이 청구하는 일체의 수수료 (통지·인수·할인·확인·전신·상환수수료 등).",
    target: "개설의뢰인 부담 조건일 때",
    rate: "징수 당시 대고객전신환매도율",
    note:
      "원칙은 선취 — 부득이한 경우 후취 가능 (해외환거래은행 통지 시점 등록 또는 선취 곤란 시).",
  },
  {
    name: "개설수수료",
    description: "기간성 수수료. NEXPIA-5102에서 개별 선취 가능. A/S·U/S 추가 징수 룰 존재.",
  },
  {
    name: "인수수수료",
    description: "기한부 인수 시점 ~ 만기일 기간 수수료.",
  },
  {
    name: "수입물품선취보증료",
    description: "L/G 보증금 적립 면제 시 — 연 3% (최저 10,000원).",
  },
];

// ─── 수출환어음 매입 vs 추심 ───
export const EXPORT_NEGO_VS_COLLECTION = {
  nego: {
    title: "매입 (Negotiation)",
    description:
      "수출상이 신용장방식 또는 무신용장 방식(D/A, D/P) 계약에 따라 선적 후 발행한 환어음 및 신용장에서 요구한 운송서류를 할인하여 매입. 개설은행에 상환 청구 또는 환거래은행을 통해 수입상에 추심 — 수출상에 대한 금융을 원활히 하는 일종의 여신행위.",
  },
  clean: {
    title: "CLEAN 매입",
    description: "신용장 조건과 일치하게 발행된 서류를 매입.",
  },
  discrepancy: {
    title: "하자 매입",
    description: "신용장 조건과 일치하지 않게 발행된 서류를 매입. 처리방법 4가지:",
    handling: [
      "수출대금 추심 후 지급",
      "하자내용 명시하여 신용장 발행은행 앞 매입가부 전신조회 후 회답에 따라 처리",
      "신용장 조건을 변경하도록 하여 하자 해소 후 매입",
      "하자로 매입",
    ],
  },
  collectionLimitCountries: {
    title: "매입제한 국가",
    description:
      "NEXPIA 7052 국가정보 조회로 확인. 매입제한 국가임에도 다음의 경우 전결권자 승인 시 추심 전 매입 가능:",
    exceptions: [
      "건당 10만불 이하인 경우",
      "매입신청인 신용등급이 6등급 이상인 경우",
      "채권보전 조치 대상 아닌 국가 은행이 확인(Confirmation)한 신용장",
      "한국무역보험공사 단기수출보험에 부보 (당행 앞 보험금 청구권 양도분에 한함)",
    ],
  },
};

// ─── 부도 처리 (수출) ───
export const EXPORT_DEFAULT_HANDLING = {
  title: "부도 처리 (수출환어음)",
  trigger:
    "추심 전 매입한 수출환어음 등이 부도·인수거절 통지되거나 예정입금일/예정인수일을 경과하여 입금/인수되지 않는 경우.",
  cases: [
    {
      type: "일람불 / 기한부",
      timing: "예정입금일(기한부: 만기일)로부터 1개월까지 입금통지가 없는 경우 그 익영업일",
    },
    {
      type: "기한부 — 서류반송",
      timing: "인수예정일로부터 1개월까지 인수통보가 없는 경우 그 익영업일",
    },
    {
      type: "조기상환 / 일부 입금",
      timing:
        "운송서류 접수한 날 (서류접수일로부터 2영업일 이내에 보완 발송으로 하자 해소 가능 시 제외). 일부만 입금 시 미입금액/DISCOUNT 금액에 대하여 부도처리 — 미입금액이 매입금액의 10% 이내이고 미화 1만불 상당액 이하이거나 미화 500불 상당액 이하인 경우 제외 가능.",
    },
  ],
  grace: [
    "영업점장이 채권보전에 문제 없다고 인정: 부도처리 예정일로부터 1개월 이내",
    "금융기관 공동협약에 의한 경우: 협약기간까지 (예: 기업회생)",
    "수출신용보증 또는 단기수출보험 부보된 경우: 보험대금 수령일까지",
  ],
};

// ─── T/T 수입금융 (송금방식 수입거래 신용공여 상품) ───
// 출처: 「T/T수입금융」 상품설명서 (준법감시인 심의필 제 25-1587호, 2025.07.01~2027.06.30)
export const TT_IMPORT_FINANCE = {
  productName: "T/T수입금융",
  description:
    "수입기업이 수출기업과 송금방식(T/T) 수입계약을 체결하고, 해당 계약에 기반하여 은행에 신용공여를 신청. 수입기업은 약정만기일에 원금 및 이자 등을 상환하는 방식.",
  contractRef:
    "외국환거래 추가약정서[T/T수입금융 거래용] 적용. 외환규정·전자금융거래법·금융실명법·외환거래기본약관·은행여신거래기본약관(기업용)·외국환 거래약정서 및 여신거래약정서(기업용) 등.",
  eligibility: {
    customers: "법인 및 개인사업자",
    currencies: ["USD", "JPY", "EUR"],
    targets: [
      "사전송금방식: 신청일로부터 2개월 이내 선적이 예정된 수입거래",
      "사후송금방식: 선적일로부터 3개월 이내 물품대금 지급예정인 수입거래",
    ],
  },
  schedule: {
    sendDate: "신청일 다음 영업일로부터 3~7영업일 이내 (송금희망일 최소 3영업일 전 신청)",
    creditPeriod: "송금희망일로부터 1년 범위 내 신청 가능",
    extension: "원칙적으로 신청일 이후 연장은 불가. 조기상환은 1회에 한하여 가능.",
  },
  fees: [
    { name: "신청수수료", amount: "20,000원", when: "신청 시" },
    {
      name: "인수수수료",
      amount: "최저 20,000원",
      when: "인수 시",
      formula:
        "인수금액 × 인수수수료율(연) × 인수기간 / 360 × 매매기준율 (USD·EUR) / 365 (JPY). 인수수수료율: 최저 1.5% ~ 최고 2.3% (신용등급별 상이)",
    },
    { name: "조건변경수수료", amount: "30,000원", when: "조건변경 시" },
    { name: "전신료", amount: "발신 1건당 8,000원", when: "신청·조건변경 등" },
    {
      name: "A/D Charge (인수이자)",
      amount: "해외인수은행의 정책에 따름",
      when: "인수 시",
    },
    {
      name: "송금수수료",
      amount: "해외인수은행별 상이",
      when: "송금 시",
      formula:
        "송금인 USD 30 내외 / 수취인 USD 20 내외 (수취인 부담 수수료는 송금액에서 차감). OUR 선택 시 만기일에 송금인이 수취인 부담 수수료 포함하여 결제.",
    },
  ],
  default: {
    title: "대지급 및 대지급금 이자",
    rules: [
      "만기상환액을 만기일까지 상환하지 않은 경우, 은행이 만기일 다음 영업일에 대지급 실행 (대지급금 = 만기상환액 × 대지급 실행 당시 전신환매도율)",
      "대지급금 이자 = 대지급금 × 외화연체금리 × 대지급 기간 / 365",
      "외화연체금리(연) = 인수수수료율 + 3%p와 15% 중 낮은 금리 적용",
      "대지급 기간 = 대지급금 발생일로부터 상환일 전일까지의 일수",
      "대지급 당일 상환하는 경우, 1일치에 대한 대지급금 이자 납부",
    ],
  },
  cautions: [
    "인수하는 해외인수은행에 따라 이용가능기간·인수이자·송금수수료가 달리 적용",
    "해외인수은행 소재 국가의 영업일 규정에 따라 송금일·만기일이 다음 영업일 또는 이전 영업일로 조정될 수 있음",
    "만기일에 해외인수은행이 청구한 A/D Charge 및 송금수수료 등과 함께 원금(만기상환액) 상환",
    "거래 신청 취소는 해외은행 앞 인수 신청 전문의 발송 이전까지만 가능. 해외은행 심사 과정에서 인수거절될 수 있음",
    "개별 신청건의 증빙서류와 관련된 송금지급이 이미 지급된 건의 중복지급인 경우 이용 불가",
    "운송서류상 선적항·선적일자·선박 정박기록 등과 상이한 정보가 존재할 경우 이용 불가",
    "사전송금방식의 경우, 송금 후 2개월 이내 선적 사실 확인이 가능한 운송서류를 은행에 제출해야 함",
    "거래상대방·수취은행·수취국가 등 관련인이 국제 제재(UN·미국·EU·영국 등) 대상에 해당하는 경우 이용 불가",
    "은행은 만기상환액에 대한 지급보증 책임만 부담. 수출기업의 신용상태·무역거래 자체 등에 대한 책임 없음",
    "본 거래에서 인정되는 운송서류: 해상운송서류(선하증권, 해상운송장) / 항공운송서류(항공운송장) / 복합운송서류 / 특송배달영수증",
  ],
  source:
    "「T/T수입금융」 상품설명서 (준법감시인 심의필 제 25-1587호, 2025.07.01~2027.06.30)",
};

// ─── 신용장 조건변경 (Amendment, MT707) ───
export const LC_AMENDMENT = {
  definition:
    "이미 개설된 신용장의 조건 중 일부를 관계 당사자간의 합의에 따라 수정하는 것.",
  swiftMessage: "MT707 (Amendment of Documentary Credit) — MT747은 상환수권 관련 (상환은행으로 발송)",
  parties: {
    required: [
      "개설은행 (Issuing Bank)",
      "확인은행 (Confirming Bank) — 확인은행이 있는 경우",
      "수익자 (Beneficiary)",
    ],
    notParty: [
      "개설의뢰인(Applicant) = 수입상은 신용장 거래의 당사자 아님",
      "통지은행과 BENEFICIARY는 조건변경을 통해 수정 불가",
    ],
  },
  effectiveTiming: [
    {
      situation: "개설은행이 조건변경 통지 시",
      effective: false,
      note: "통지만으로는 효력 없음",
    },
    {
      situation: "수익자의 조건변경 수락 통지가 도착한 경우",
      effective: true,
      note: "정상 수락 → 효력 발생",
    },
    {
      situation:
        "수락의 통지 없이 신용장의 변경된 조건에 일치하는 서류를 제시한 경우",
      effective: true,
      note: "묵시적 수락으로 간주 (UCP 600)",
    },
  ],
  partialAcceptance:
    "조건변경 통지에 대한 부분적인 수락은 허용되지 않으며 어떠한 효력도 가지지 못함 (UCP 600 제10조 f항).",
  fields: [
    {
      group: "원 신용장 정보",
      items: [
        { name: "CREDIT NUMBER", desc: "신용장번호" },
        { name: "DATE OF ISSUE", desc: "발행일" },
        {
          name: "ADVISING BANK / SWIFT CODE",
          desc: "원신용장 통지은행 정보",
        },
      ],
    },
    {
      group: "신용장 취소 요청",
      items: [
        {
          name: "취소",
          desc: "수출상의 동의여부 전문 수신 후 전체 취소 가능. 기교부한 신용장 원본 회수 + 개설은행에 동사실 통보.",
        },
      ],
    },
    {
      group: "INCREASE / DECREASE OF L/C AMOUNT (증액·감액)",
      items: [
        {
          name: "감액",
          desc:
            "수출상의 동의 여부 필요. ALIOS-대외전문송신의뢰서(수입) 작성하여 통지은행으로 전문발신 → 거래 당사자의 동의전문 수신 후 조건변경(감액) 거래 가능.",
        },
        {
          name: "증액",
          desc:
            "① 한도잔액 확인 후 부족 시 보증금 추가 적립. ② 수입상 부보조건인 경우: 증액부분에 대한 추가 보험가입, 보험증권 원본 징구 (스텝 스캔 및 물류배송).",
        },
      ],
    },
    {
      group: "기일·장소·기타 변경",
      items: [
        { name: "NEW DATE OF EXPIRY", desc: "변경 후 신용장 유효기일" },
        { name: "NEW LATEST DATE OF SHIPMENT", desc: "변경 후 선적기일" },
        {
          name: "CHANGED APPLICANT / BENEFICIARY DETAILS",
          desc:
            "수입·수출상 정보. ⚠️ 수출상 정보 변경 시 외환사업부 사후관리 담당자 통화 요망.",
        },
        { name: "TRANSFER", desc: "양도 허용 여부" },
        { name: "MORE / LESS", desc: "과부족 조건" },
        {
          name: "가격조건",
          desc:
            "운임·보험서류·가격조건 장소 변경 확인. 예: FOB → CIF 변경 시 FREIGHT: COLLECT → PREPAID, 보험서류: 불요 → 요구, FOB+출발지 → CIF+도착지.",
        },
        { name: "PARTIAL SHIPMENT", desc: "분할선적" },
        { name: "TRANSHIPMENT", desc: "환적" },
        {
          name: "NEW PLACE ~ OF DELIVERY",
          desc: "가격조건 출발/도착지 변경 확인 요망",
        },
        { name: "PERIOD FOR PRESENTATION", desc: "서류제시기간" },
        {
          name: "국외 수수료 부담자",
          desc: "수출상(BENEFICIARY) / 수입상(APPLICANT)",
        },
        { name: "CONFIRMATION", desc: "신용장 확인" },
      ],
    },
    {
      group: "DESCRIPTION OF GOODS · DOCUMENT REQUIRED · ADDITIONAL CONDITIONS",
      items: [
        { name: "ADD", desc: "원신용장에 추가할 내용 기재" },
        { name: "DELETE", desc: "원신용장에 삭제할 내용 기재" },
        {
          name: "REPLACE ALL",
          desc: "원신용장 해당 필드 전체를 입력 내용으로 대체",
        },
      ],
    },
  ],
};

// ─── 서류별 ISBP 작성 가이드 ───
// 출처: 수출입 업무의 이해 연수교재 (HR부, 2025.06) Section 3 + ISBP 745 본문 인용.
export type DocumentPrepGuide = {
  korName: string;
  engName: string;
  ucpRef?: string;
  isbpRef?: string;
  fields: {
    no: number;
    name: string;
    description: string;
    caution?: string;
  }[];
};

export const DOCUMENT_PREP_GUIDES: DocumentPrepGuide[] = [
  {
    korName: "환어음",
    engName: "Draft / Bill of Exchange",
    ucpRef: "UCP 600 제6조 b항",
    isbpRef: "ISBP 745 B (Drafts and Calculation of Maturity Date)",
    fields: [
      {
        no: 1,
        name: "통화 및 숫자 금액",
        description: "예: USD 100,000",
        caution: "신용장 통화·금액과 일치",
      },
      {
        no: 2,
        name: "어음 발행지",
        description: "예: DAEGU",
      },
      {
        no: 3,
        name: "어음 발행일",
        description: "예: 19. Dec-2023",
      },
      {
        no: 4,
        name: "TENOR (만기)",
        description:
          "AT SIGHT (일람불) / XX DAYS AFTER SIGHT (일람 후 기한부) / XX DAYS AFTER B/L DATE (선적일자 후)",
        caution: "신용장 42C 필드와 정확히 일치",
      },
      {
        no: 5,
        name: "수취인 (Payee)",
        description: "매입은행 명칭",
      },
      {
        no: 6,
        name: "통화 및 문자 금액",
        description: "예: US DOLLARS ONE HUNDRED THOUSAND ONLY",
        caution: "숫자 금액과 일치 — 차이 시 문자 금액 우선",
      },
      {
        no: 7,
        name: "개설의뢰인의 명칭 및 주소",
        description: "신용장 50 필드와 일치",
      },
      {
        no: 8,
        name: "개설은행의 명칭 및 주소",
        description: "신용장 헤더와 일치",
      },
      {
        no: 9,
        name: "신용장 번호 / 신용장 개설일",
        description: "신용장 20·31C 필드 인용",
      },
      {
        no: 10,
        name: "지급인 (Drawee)",
        description:
          "신용장상 'drawee' 또는 'drawn on' 다음에 기재된 은행의 명칭과 주소. D/P·D/A 방식의 경우에는 수입상의 명칭과 주소.",
        caution: "신용장 42a 필드와 일치",
      },
      {
        no: 11,
        name: "발행인 서명",
        description: "수익자 서명 (수기 또는 회사 명판)",
      },
    ],
  },
  {
    korName: "상업송장",
    engName: "Commercial Invoice",
    ucpRef: "UCP 600 제18조",
    isbpRef: "ISBP 745 C (Invoices)",
    fields: [
      {
        no: 1,
        name: "송장의 종류",
        description:
          "추가설명 없이 송장 제시 요구 시 — 상업(Commercial) / 세관(Customs) / 세금(Tax) / 최종(Final) 송장 등의 제시로 충족.",
        caution:
          "임시(PROVISIONAL) · 견적서(PROFORMA) 송장 또는 유사한 것은 불가",
      },
      {
        no: 2,
        name: "발행인 → 수신인",
        description:
          "수익자가 개설의뢰인(APPLICANT) 앞으로 발행. 양도신용장인 경우 제2수익자가 제1수익자 앞으로 발행해도 허용.",
        caution: "ISBP 745 C2 — 수익자명·APPLICANT명 정확히 일치",
      },
      {
        no: 3,
        name: "물품명세 (엄격일치 원칙)",
        description:
          "실제 선적된 대로, 신용장 물품명세 정보를 정확하게 기재. 물품명 + 신용장통화·금액 + 단가·할인·공제 + 가격조건(INCOTERMS).",
        caution:
          "엄격일치 원칙 적용 — 단순 오타·재배열도 하자 가능 (UCP 600 제18조 c항, ISBP 745 C3)",
      },
      {
        no: 4,
        name: "SIGNED vs MANUALLY SIGNED",
        description:
          "SIGNED 요구 시: 수기 서명 또는 업체의 영문명판 날인으로 충족. MANUALLY SIGNED 요구 시: 수기 서명만 허용.",
      },
    ],
  },
  {
    korName: "선하증권",
    engName: "Bill of Lading (B/L)",
    ucpRef: "UCP 600 제20조",
    isbpRef: "ISBP 745 E (Bill of Lading)",
    fields: [
      {
        no: 1,
        name: "수하인 (CONSIGNEE)",
        description:
          "신용장조건과 반드시 일치. 단순 지시식 'TO ORDER (SHIPPER)' = 배서 필요. 기명식 'TO ABC COMPANY' = 배서 불요.",
        caution: "iM뱅크 지시식 'TO THE ORDER OF iM BANK' = 당행 배서/양도 필요",
      },
      {
        no: 2,
        name: "통지처 (NOTIFY PARTY)",
        description:
          "신용장 명시 통지처와 반드시 일치. 주소·연락처 기재요건 없는 경우 명칭만 기재 가능. 주소·연락처 표시되었다면 신용장과 저촉되지 않아야 함.",
      },
      {
        no: 3,
        name: "운송 구간",
        description:
          "PRE-CARRIAGE: 사전운송수단 / PORT OF RECEIPT: 물품수령지 / PORT OF LOADING: 선적항 / PORT OF DISCHARGE: 하역항 / PORT OF DELIVERY: 물품인도장소 / FINAL DESTINATION: 최종목적지.",
        caution:
          "사전운송수단·물품수령지·최종목적지 등이 함께 기재되어 서로 다른 운송수단으로 운송될 경우 → 복합운송서류 제시 필요",
      },
      {
        no: 4,
        name: "본선적재부기 (ON BOARD NOTATION)",
        description:
          "실제선적일자를 기재 (= LADEN ON BOARD). Received B/L의 경우 필수.",
        caution: "선적일자 = 신용장 선적기일 충족 근거",
      },
      {
        no: 5,
        name: "원본 발행 부수",
        description:
          "원본 발행 부수가 반드시 기재. 신용장상 FULL SET 요구 시 기재된 원본 전통이 제시되어야 함.",
      },
      {
        no: 6,
        name: "운송인명 표시 및 서명권자",
        description:
          "○ 운송인 명칭 표시: (1) 운송인 또는 기명대리인 'CARRIER // AS AGENT FOR THE CARRIER' / (2) 선장 또는 기명대리인 'MASTER OR CAPTAIN // AS AGENT FOR THE MASTER OR CAPTAIN'. ○ 서명권자: 운송인·선장·대리인의 서명으로 특정. 대리인 서명은 운송인을 위하여 또는 대리하여 또는 선장을 위하여 또는 대리하여 서명한 것인지 표시해야 함.",
      },
    ],
  },
  {
    korName: "항공운송장",
    engName: "Air Waybill (AWB)",
    ucpRef: "UCP 600 제23조",
    isbpRef: "ISBP 745 H (Air Transport Document)",
    fields: [
      {
        no: 1,
        name: "AIR WAY BILL NO.",
        description: "예: KOREA-12345 — 운송장 고유번호",
      },
      {
        no: 2,
        name: "CONSIGNEE",
        description: "항공운송서류의 수하인은 기명식으로 발행.",
        caution: "iM뱅크 'CONSIGNED TO iM BANK' 등 명시 권장",
      },
      {
        no: 3,
        name: "NOTIFY",
        description:
          "통상 NOTIFY PARTY란이 없으므로 NOTIFY(통지처)를 기재 후 신용장상 명시된 통지업체 기재.",
      },
      {
        no: 4,
        name: "출발/도착 공항",
        description:
          "신용장 기재된 출발공항·도착공항 기재. 공항코드 IATA 사용 가능 (예: INCHEON // ICN).",
      },
      {
        no: 5,
        name: "발행일 (선적일)",
        description:
          "발행일이 원칙적으로 선적일로 간주. 단, 실제선적일을 나타내는 명확한 부기가 있다면 그 부기의 일자를 선적일로 봄.",
        caution: "신용장 선적기일과 비교 시 부기일자 우선 확인",
      },
      {
        no: 6,
        name: "운송인 명칭·서명권자",
        description: "선하증권과 동일 — 운송인 또는 기명대리인.",
      },
    ],
  },
  {
    korName: "보험증권",
    engName: "Insurance Policy",
    ucpRef: "UCP 600 제28조",
    isbpRef: "ISBP 745 K (Insurance Document)",
    fields: [
      {
        no: 1,
        name: "ASSURED (피보험자)",
        description:
          "신용장에 명시된 대로 기재 + 피보험자에 의해 배서. (1) 특정인 지시식 'TO ORDER OF ABC COMPANY' 로 발행 요구 시 — 특정인을 피보험자로 지정한 보험서류 'ASSURED: ABC COMPANY' 도 허용. (2) 피보험자 미지정 'TO ORDER, IN FAVOUR OF' 경우 — 당사자 백지배서(수출상 배서), 개설은행 또는 개설의뢰인이 보험금을 지급 받을 수 있도록 배서된 서류 허용.",
      },
      {
        no: 2,
        name: "보험 금액",
        description:
          "상업송장 금액의 최저 110% 이상으로 신용장과 동일한 통화로 발행.",
        caution: "ISBP 745 K10 — 110% 미달 시 하자",
      },
      {
        no: 3,
        name: "보험 조건",
        description:
          "신용장에서 요구하는 조건대로 보험가입. 신용장 조건을 그대로 명시하여도 허용. 예: ICC(A) / ICC(B) / ICC(C).",
      },
      {
        no: 4,
        name: "AGENT 정보",
        description: "보험금 청구 가능한 AGENT명 및 상세주소",
      },
      {
        no: 5,
        name: "보험가입일 / 보험증권발행일",
        description:
          "선적일과 같거나 그 이전. 선적일 이후 가입된 경우, 선적일부터의 보험소급적용이 가능하다는 문구 기재 시 신용장 조건 충족 가능.",
        caution: "ISBP 745 K11 — 소급 문구 없으면 하자",
      },
      {
        no: 6,
        name: "원본 부수",
        description:
          "원본 부수는 기재되지 않아도 되나, 기재되어 있는 경우에는 전통이 제시되어야 함.",
      },
    ],
  },
  {
    korName: "원산지증명서",
    engName: "Certificate of Origin (C/O)",
    ucpRef: "UCP 600 제3조",
    isbpRef: "ISBP 745 L (Certificate of Origin)",
    fields: [
      {
        no: 1,
        name: "발행인",
        description:
          "① 신용장 명시 자. 명시하지 않은 경우 수익자를 포함하여 누구든지 발행 가능. ② 수익자·수출자·제조업자 발행 요구 시 — 본인 또는 상업회의소 등 유사한 성격을 가진 단체. ③ 상업회의소의 발행 요구 시 — 상업회의소 또는 유사한 성격을 가진 단체.",
      },
      {
        no: 2,
        name: "형식",
        description:
          "신용장상 특정 형식의 원산지증명서를 요구하는 경우 오직 그 형식의 증명서만 수리 가능.",
        caution: "예: GSP Form A, FTA 협정별 양식 등",
      },
      {
        no: 3,
        name: "원산지 표시",
        description: "원산지가 확인되어야 함.",
      },
      {
        no: 4,
        name: "물품 일치",
        description: "송장에 기재된 물품과 관련된 물품이 나타나야 함.",
      },
      {
        no: 5,
        name: "서명",
        description: "서명되어야 함.",
      },
    ],
  },
];
