// 외환송금 트리 골격 v0.1 (2026-05-10)
// 외국환거래규정 (재정경제부고시 제2026-69호, 시행 2026.3.30.) 본문 근거
// 사용자 절대 원칙: 본문 근거 없는 분기는 만들지 않음.
//
// 진입 흐름:
//   1단계: 국가 + 금액 (고객 첫 발화)
//   2단계: 사유 분류 가이드 — 입구 3개 (A 명확 / B 서류 / C 모호)
//   3단계: 사유별 추가 질문 (서류·자격·거래외국환은행 지정 등)
//   4단계: 결과 — 거래코드/근거/서류/지정/통보/멘트
//
// ⚠️ 거래코드 명칭(transactionCode)은 한은 외환전산망 코드 체계 자료 미확보로
//    잠정 표기. 본부 외환부서/한은 자료 확보 후 정식 명칭으로 교체 필요.

import type { Scenario } from "../../types";

export const REMITTANCE_SCENARIO: Scenario = {
  id: "remittance",
  title: "외환송금 (해외로 보내기)",
  rootNodeId: "enter",
  nodes: {
    // ──────────────────────────────────────────────
    // 1단계 — 국가 + 금액 입력
    // ──────────────────────────────────────────────
    enter: {
      id: "enter",
      type: "input",
      title: "1단계 — 송금 정보",
      question: "어디에 얼마 보내시나요?",
      hint: "고객의 첫 마디에서 자연스럽게 받아 적기. 거주성·국적은 KYC에서 자동 확인됨.",
      inputs: [
        { key: "countryId", label: "받는 나라", type: "country" },
        { key: "amountLocal", label: "금액", type: "amount" },
      ],
      options: [{ id: "next", label: "다음", next: "purpose-entry" }],
    },

    // ──────────────────────────────────────────────
    // 2단계 — 사유 분류 가이드 (입구 3개)
    // ──────────────────────────────────────────────
    "purpose-entry": {
      id: "purpose-entry",
      type: "select",
      title: "2단계 — 사유 분류",
      question: "어떤 사유로 보내시나요?",
      hint: "고객 답변이 명확하면 A, 서류 들고 오면 B, 모호하면 C.",
      options: [
        {
          id: "clear",
          label: "A. 명확하게 사유를 말함",
          detail: '"딸 학비요", "수입대금이요"',
          next: "purpose-clear",
        },
        {
          id: "by-doc",
          label: "B. 서류를 들고 옴",
          detail: '"이거 송금해주세요" + 인보이스/청구서/필증',
          next: "purpose-by-document",
        },
        {
          id: "narrow",
          label: "C. 모호하게 답함 / 잘 모름",
          detail: '"그냥요", "이전부터 하던 거", "친척한테"',
          next: "narrow-q1-recipient",
        },
      ],
    },

    // ──────────────────────────────────────────────
    // 입구 A — 사유 카드 직접 선택
    // ──────────────────────────────────────────────
    "purpose-clear": {
      id: "purpose-clear",
      type: "select",
      question: "사유를 골라주세요",
      options: [
        {
          id: "study",
          label: "유학·연수·체재경비",
          detail: "학비·생활비, 어학연수, 단기 체재",
          next: "q-study",
          legalRef: "외환규정 4-5조 ②",
        },
        {
          id: "emigration",
          label: "해외이주비",
          detail: "이미 해외이주신고 필증 받은 자",
          next: "q-emigration-docs",
          legalRef: "외환규정 4-3조 ①9호",
        },
        {
          id: "medical",
          label: "의료비 (해외 치료)",
          next: "r-medical",
          legalRef: "외환규정 4-5조 ①3호",
        },
        {
          id: "import-prepay",
          label: "수입대금 사전지급",
          detail: "Proforma Invoice, 선적 전 송금",
          next: "r-import-prepay",
          legalRef: "외환규정 4-3조 ①5호",
        },
        {
          id: "gift-family",
          label: "가족 생활비·증여",
          detail: "학비/치료비/이주 외 일반 송금",
          next: "r-gift",
          legalRef: "외환규정 4-3조 ①1호",
        },
        // TODO: 자본거래(해외직접투자/해외부동산), 외국인투자, 정부/지자체,
        //       외국인거주자 본국송금, 일반해외여행자 등
      ],
    },

    // ──────────────────────────────────────────────
    // 입구 B — 서류 카드 → 사유 자동 매핑
    // ──────────────────────────────────────────────
    "purpose-by-document": {
      id: "purpose-by-document",
      type: "select",
      question: "어떤 서류를 가져오셨어요?",
      hint: "서류 종류만으로 사유가 거의 결정됩니다.",
      options: [
        {
          id: "proforma",
          label: "Proforma Invoice (선적 전 청구서)",
          detail: "사전지급 대상",
          next: "r-import-prepay",
          legalRef: "외환규정 4-3조 ①5호",
        },
        {
          id: "commercial-invoice",
          label: "Commercial Invoice (선적·제공 후)",
          next: "r-import-postpay",
          legalRef: "외환규정 4-3조 ①1호",
        },
        {
          id: "school-bill",
          label: "학교 청구서 / 입학허가서",
          next: "q-study",
          legalRef: "외환규정 4-5조 ②",
        },
        {
          id: "enrollment",
          label: "재학증명서",
          next: "q-study",
          legalRef: "외환규정 4-5조 ②",
        },
        {
          id: "medical-bill",
          label: "입원·진료 청구서",
          next: "r-medical",
          legalRef: "외환규정 4-5조 ①3호",
        },
        {
          id: "emigration-cert",
          label: "해외이주신고 필증 + 자금출처확인서",
          next: "r-emigration",
          legalRef: "외환규정 4-3조 ①9호",
        },
        {
          id: "realestate-cert",
          label: "부동산매각자금확인서 (비거주자 재외동포)",
          next: "r-overseas-korean",
          legalRef: "외환규정 4-4조 ①8호",
        },
        // TODO: 자본거래 신고서, 한은 인가서, 해외직접투자 신고필증 등
      ],
    },

    // ──────────────────────────────────────────────
    // 입구 C — 모호 발화 좁혀가기
    // ──────────────────────────────────────────────
    "narrow-q1-recipient": {
      id: "narrow-q1-recipient",
      type: "select",
      question: "받는 분이 누구세요?",
      hint: "받는 사람이 누구냐가 다음 분기를 가장 많이 결정합니다.",
      options: [
        {
          id: "self",
          label: "본인 (해외 본인 계좌 등)",
          next: "r-self-transfer",
        },
        {
          id: "family",
          label: "가족·친지",
          next: "narrow-q2-family-purpose",
        },
        {
          id: "business",
          label: "회사·거래처 (사업 관계)",
          next: "narrow-q2-business",
        },
        {
          id: "institution",
          label: "기관 (학교·병원·정부 등)",
          detail: "보통 청구서가 있음",
          next: "purpose-by-document",
        },
        {
          id: "unknown",
          label: "잘 모르겠음",
          next: "r-need-info",
        },
      ],
    },

    "narrow-q2-family-purpose": {
      id: "narrow-q2-family-purpose",
      type: "select",
      question: "용도가 어떤 쪽이에요?",
      hint: '⚠️ "빌려주는 거예요, 그냥 도와주는 거예요?" — 자본거래 vs 증여 갈림길은 반드시 한 번 묻기.',
      options: [
        {
          id: "tuition",
          label: "학비·체재비",
          next: "q-study",
          legalRef: "외환규정 4-5조",
        },
        {
          id: "medical",
          label: "의료비·치료비",
          next: "r-medical",
          legalRef: "외환규정 4-5조 ①3호",
        },
        {
          id: "living",
          label: "생활비·용돈 (단순 지원, 돌려받지 않음)",
          next: "r-gift",
          legalRef: "외환규정 4-3조 ①1호",
        },
        {
          id: "emigration",
          label: "이주·결혼 자금",
          next: "narrow-q3-emigration-check",
          legalRef: "외환규정 4-3조 ①9호 가능성",
        },
        {
          id: "lending",
          label: "빌려주는 돈 (돌려받음)",
          detail: "⚠️ 자본거래로 분류 — 별도 트리",
          next: "r-capital-tx",
        },
        {
          id: "unknown-purpose",
          label: "본인도 잘 모름",
          next: "r-gift",
          legalRef: "외환규정 4-3조 ①1호",
        },
      ],
    },

    "narrow-q2-business": {
      id: "narrow-q2-business",
      type: "select",
      question: "물건이나 서비스 값인가요?",
      options: [
        {
          id: "with-doc",
          label: "예 + 서류 있음",
          next: "purpose-by-document",
        },
        {
          id: "no-doc",
          label: "예 + 서류 없음",
          detail: "인보이스 가져오시도록 안내 후 재방문",
          next: "r-need-doc",
        },
        {
          id: "lending",
          label: "빌려준 돈 회수 / 대여",
          detail: "⚠️ 자본거래",
          next: "r-capital-tx",
        },
        {
          id: "investment",
          label: "투자·지분 출자",
          detail: "⚠️ 자본거래 (제7장)",
          next: "r-capital-tx",
        },
      ],
    },

    "narrow-q3-emigration-check": {
      id: "narrow-q3-emigration-check",
      type: "select",
      question: "해외이주신고는 이미 하셨어요?",
      options: [
        {
          id: "yes",
          label: "예, 필증 있음",
          next: "q-emigration-docs",
        },
        {
          id: "no",
          label: "아니오 (이주 진행 전)",
          detail: "일반 거주자로 4-3조 ①1호 (10만불 한도) 적용",
          next: "r-gift",
        },
      ],
    },

    // ──────────────────────────────────────────────
    // 3단계 — 사유별 추가 질문 (예시 2개)
    // ──────────────────────────────────────────────
    "q-study": {
      id: "q-study",
      type: "select",
      question: "거래외국환은행 지정하셨어요?",
      hint: "유학생·체재자는 거래외국환은행 지정 필수 (4-5조 ②).",
      legalRef: "외환규정 4-5조 ②",
      options: [
        { id: "yes", label: "예 (지정 완료)", next: "r-study" },
        {
          id: "no",
          label: "아니오 (이번이 처음)",
          detail: "지금 지정 절차 안내",
          next: "r-study",
        },
      ],
    },

    "q-emigration-docs": {
      id: "q-emigration-docs",
      type: "select",
      question: "해외이주신고 필증과 자금출처확인서 가져오셨어요?",
      legalRef: "외환규정 4-3조 ①9호 (거래외국환은행 지정 필수)",
      options: [
        { id: "both", label: "둘 다 가져옴", next: "r-emigration" },
        {
          id: "partial",
          label: "한 쪽만 / 둘 다 없음",
          detail: "관할세무서 신고 후 재방문 안내",
          next: "r-need-doc",
        },
      ],
    },

    // ──────────────────────────────────────────────
    // 4단계 — 결과 노드
    // ──────────────────────────────────────────────
    "r-study": {
      id: "r-study",
      type: "result",
      question: "해외유학생·체재자 송금",
      result: {
        transactionCode: "해외유학생경비 송금",
        legalBasis: "외환규정 4-5조 ② (해외유학생·해외체재자 — 거래외국환은행 지정 필수)",
        channel: "branch_only",
        needsBankDesignation: true,
        reportRequirement: "none",
        documents: ["재학증명서 또는 해외체재 입증 서류 (매년 갱신)"],
        cautions: [
          "연간 10만불 초과 시 국세청 통보 (4-8조 ①3호)",
          "거래외국환은행 지정 필수",
        ],
        suspiciousSignals: [],
        needsHQReview: false,
        customerScripts: [
          "유학 끝날 때까지 매년 재학증명서 갱신해주셔야 해요.",
        ],
      },
    },

    "r-medical": {
      id: "r-medical",
      type: "result",
      question: "의료비 송금",
      result: {
        transactionCode: "해외 의료비 송금",
        legalBasis: "외환규정 4-5조 ①3호 (외국에서의 치료비)",
        channel: "branch_only",
        needsBankDesignation: false,
        reportRequirement: "none",
        documents: [
          "해외 병원 진료·입원 청구서",
          "진단서·소견서 (필요 시)",
        ],
        cautions: ["선지급 후 잔액 정산 의무 (지급금액의 10% 이내 면제 가능)"],
        suspiciousSignals: [],
        needsHQReview: false,
        customerScripts: [
          "치료 마치고 잔액 남으면 정산 자료 가져오셔야 해요.",
        ],
      },
    },

    "r-import-prepay": {
      id: "r-import-prepay",
      type: "result",
      question: "수입대금 사전지급",
      result: {
        transactionCode: "수입대금 사전지급",
        legalBasis: "외환규정 4-3조 ①5호 (거래·행위 발생 전 지급, 정산의무)",
        channel: "branch_only",
        needsBankDesignation: false,
        reportRequirement: "none",
        documents: [
          "Proforma Invoice",
          "계약서 (있는 경우)",
          "정산 후 Commercial Invoice·선적서류",
        ],
        cautions: [
          "선적/제공 후 일정 기간 안에 정산 자료 제출 의무",
          "지급금액의 10% 이내는 정산 면제",
          "1만불 초과 시 관세청 통보 (4-8조 ②1호)",
        ],
        suspiciousSignals: ["선적 일정·계약 상세에 답변 회피"],
        needsHQReview: false,
        customerScripts: [
          "선적 끝나면 Commercial Invoice 가져다 주셔야 정산 처리돼요.",
          "정산 자료 안 들어오면 외환법상 사후관리 대상이에요.",
        ],
      },
    },

    "r-import-postpay": {
      id: "r-import-postpay",
      type: "result",
      question: "수입대금 후불",
      result: {
        transactionCode: "수입대금 후불 송금",
        legalBasis: "외환규정 4-3조 ①1호 (신고불필요 거래)",
        channel: "branch_only",
        needsBankDesignation: false,
        reportRequirement: "none",
        documents: ["Commercial Invoice", "선적서류 또는 인수증명"],
        cautions: [
          "1만불 초과 시 관세청 통보 (4-8조 ②1호)",
          "연간 누계 10만불 초과 시 외국환은행장 확인 필요",
        ],
        suspiciousSignals: [],
        needsHQReview: false,
        customerScripts: [],
      },
    },

    "r-emigration": {
      id: "r-emigration",
      type: "result",
      question: "해외이주비 송금",
      result: {
        transactionCode: "해외이주비 송금",
        legalBasis:
          "외환규정 4-3조 ①9호 — 자금출처확인서 범위 내, 거래외국환은행 지정 필수 (제4-6조는 2025-4호로 ①~⑤항 전부 삭제 → 4-3조 ①9호로 흡수)",
        channel: "branch_only",
        needsBankDesignation: true,
        reportRequirement: "none",
        documents: ["해외이주신고 필증", "자금출처확인서"],
        cautions: [
          "자금출처확인서 범위 내에서만 지급 가능",
          "건당 1만불 초과 해외이주비는 관세청 통보 (4-8조 ②5호)",
        ],
        suspiciousSignals: [],
        needsHQReview: false,
        customerScripts: ["자금출처확인서 범위 안에서만 송금 가능해요."],
      },
    },

    "r-overseas-korean": {
      id: "r-overseas-korean",
      type: "result",
      question: "비거주자 재외동포 재산반출",
      result: {
        transactionCode: "비거주자 재외동포 국내재산 반출",
        legalBasis:
          "외환규정 4-4조 ①8호 (2025-4호 신설). 제4-7조는 ①~④항 전부 삭제됨",
        channel: "branch_only",
        needsBankDesignation: true,
        reportRequirement: "none",
        documents: ["부동산매각자금확인서 또는 자금출처확인서"],
        cautions: [
          "지정거래외국환은행을 통해서만 지급 가능",
          "거주자 재외동포(한국 국적 보유)는 일반 거주자로 4-3조 적용",
        ],
        suspiciousSignals: [],
        needsHQReview: false,
        customerScripts: [],
      },
    },

    "r-gift": {
      id: "r-gift",
      type: "result",
      question: "거주자 미증빙 송금 (가족 생활비/일반 증여)",
      result: {
        transactionCode: "거주자 지급증빙서류 미제출 지급",
        legalBasis:
          "외환규정 4-3조 ①1호 (연간 누계 미화 10만불 이내, 신고불필요)",
        channel: "branch_only",
        needsBankDesignation: false,
        reportRequirement: "none",
        documents: [],
        cautions: [
          "연간 누계 10만불 초과 시 4-3조 ②에 따라 외국환은행장 확인 필요",
          "건당 1만불 초과 시 국세청 통보 (4-8조 ①1호)",
        ],
        suspiciousSignals: [
          "동일인에게 잦은 분할 송금",
          '"돌려받는 돈"이라 답한 후 다음 방문 시 다시 송금하려는 경우',
        ],
        needsHQReview: false,
        customerScripts: [
          "올해 누계 10만불 안 넘게 관리해주세요.",
          "만약 빌려주신 거면 자본거래로 분류되니 다음에 알려주셔야 해요.",
        ],
      },
    },

    "r-self-transfer": {
      id: "r-self-transfer",
      type: "result",
      question: "자기송금 (본인 해외 계좌)",
      result: {
        transactionCode: "거주자 본인계좌 송금",
        legalBasis: "외환규정 4-3조 ①1호 (신고불필요 거래, 연간 10만불 한도)",
        channel: "branch_only",
        needsBankDesignation: false,
        reportRequirement: "none",
        documents: ["본인 해외 계좌 정보"],
        cautions: ["연간 누계 10만불 초과 시 외국환은행장 확인 필요"],
        suspiciousSignals: [
          "해외↔해외 자금 이동의 중간 경유 의심 (자금세탁)",
        ],
        needsHQReview: false,
        customerScripts: [],
      },
    },

    // ──────────────────────────────────────────────
    // 보조/우회 결과
    // ──────────────────────────────────────────────
    "r-capital-tx": {
      id: "r-capital-tx",
      type: "result",
      question: "자본거래 — 별도 트리 (제7장)",
      result: {
        transactionCode: "자본거래 (대여·투자) — 별도 분류",
        legalBasis:
          "외환규정 제7장 자본거래 (예: 7-13조 금전대차, 7-31조~ 해외직접투자 등)",
        channel: "branch_only",
        needsBankDesignation: true,
        reportRequirement: "bank",
        documents: ["자본거래 신고서", "계약서", "거래 종류별 추가 서류"],
        cautions: [
          "⚠️ 일반 송금으로 처리하면 외환법 위반",
          "본부 외환부서 협의 권장",
        ],
        suspiciousSignals: [],
        needsHQReview: true,
        customerScripts: [
          "이건 자본거래로 분류돼서 신고 절차가 따로 있어요. 잠시 확인해드릴게요.",
        ],
      },
    },

    "r-need-doc": {
      id: "r-need-doc",
      type: "result",
      question: "서류 보완 후 재방문",
      result: {
        transactionCode: "— (송금 진행 불가)",
        legalBasis: "서류 미비",
        channel: "branch_only",
        needsBankDesignation: false,
        reportRequirement: "none",
        documents: [
          "해당 사유에 맞는 증빙서류 (인보이스 / 필증 / 확인서 등)",
        ],
        cautions: ["서류 갖추신 후 다시 방문 부탁드린다고 안내"],
        suspiciousSignals: [],
        needsHQReview: false,
        customerScripts: [],
      },
    },

    "r-need-info": {
      id: "r-need-info",
      type: "result",
      question: "추가 확인 필요",
      result: {
        transactionCode: "— (분류 불가)",
        legalBasis: "사유 분류 불가 — 본부 외환부서 문의 권장",
        channel: "branch_only",
        needsBankDesignation: false,
        reportRequirement: "none",
        documents: [],
        cautions: [
          "⚠️ 사유가 분류되지 않으면 송금 처리하지 말고 본부 외환부서에 문의",
        ],
        suspiciousSignals: [],
        needsHQReview: true,
        customerScripts: [
          "죄송한데 한 번만 더 확인하고 처리해드릴게요.",
        ],
      },
    },
  },
};
