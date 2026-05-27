// iM뱅크 외화 예금·적금 상품군.
// 출처: 각 상품설명서·특약 + 외화예금거래기본약관 본문 정리.
// 영업 판촉 자료가 아닌 약관/상품설명서 기준 — 영업점이 본문 근거를 확인할 수 있도록 1차 자료 출처 명시.

// 카테고리는 모두 4글자 명사구로 통일.
export type DepositCategory =
  | "통합통장"
  | "수시입출"
  | "기간예치"
  | "자유적립"
  | "자동이체";

export type KeyClause = { ref: string; label: string; body: string };
export type InterestExample = {
  scenario: string;
  calculation: string;
  result: string;
};
export type CustomerScript = { situation: string; line: string };

export type DepositProduct = {
  id: string;
  title: string;
  shortTitle: string;
  category: DepositCategory;
  description: string;

  // 가입 조건
  eligibility?: string;
  period?: string;
  currencies?: string;
  channels?: string;
  initialDeposit?: string;
  additionalDeposit?: string;
  accountLimit?: string;

  // 이자
  interestPayment?: string;
  baseRate?: string;
  bonusRate?: string[];
  interestFormula?: string;

  // 해지·만기
  partialWithdraw?: string;
  earlyTermination?: string;
  postMaturity?: string;
  autoRenew?: string;

  // 부가
  cashFee?: string;
  protection?: string;
  taxBenefit?: string;
  benefits?: string[];

  // 깊은 콘텐츠 (상세 페이지)
  keyClauses?: KeyClause[];
  examples?: InterestExample[];
  customerScripts?: CustomerScript[];
  staffChecklist?: string[];

  // 시뮬레이터
  simulatable?: boolean;
  simulator?: {
    minDays?: number;
    maxDays?: number;
    minAmount?: number;
    maxAmount?: number;
    defaultRatePct?: number;
    rateNote?: string;
  };

  termsFile: string;
  source: string;
};

// ─── 공통 상수 ───
const COMMON_PROTECTION =
  "예금자보호법에 따라 원금+이자 1인당 1억원까지 (본 은행 여타 보호상품과 합산)";
const COMMON_TAX = "비과세종합저축 가입 불가";
const COMMON_CASH_FEE_9 =
  "USD/JPY/EUR/GBP/CAD/AUD/CHF/NZD 1.5%, CNY 4.0% (USD 외 현찰 입금 또는 송금 입금분을 현찰로 출금하는 경우)";
const COMMON_CASH_FEE_8 =
  "USD/JPY/EUR/GBP/CAD/AUD/CHF/NZD 1.5% (USD 외 현찰 입금 또는 송금 입금분을 현찰로 출금하는 경우)";

// 외화예금거래기본약관 핵심 조항 (모든 외화예금 공통 적용)
export const COMMON_CLAUSES: KeyClause[] = [
  {
    ref: "외화예금거래기본약관 제4조",
    label: "이자 계산 기간 (연 360일 / JPY·GBP 365일)",
    body:
      "외화예금의 이자는 연간일수를 360일로 계산합니다. 단, 일본엔화 및 영국파운드화는 365일로 계산합니다. 이자는 해당 예금통화의 보조단위까지 계산하며 보조단위 미만은 버립니다.",
  },
  {
    ref: "외화예금거래기본약관 제5조",
    label: "원화 출금 시 적용환율 (대고객 전신환매입율)",
    body:
      "외화예금의 원금 및 이자를 원화로 지급할 때 적용할 환율은 은행이 영업점에 고시한 지급시점의 대고객 전신환매입율로 합니다.",
  },
  {
    ref: "외화예금거래기본약관 제6조",
    label: "약관 적용 순위",
    body:
      "외화예금거래에는 이 기본약관이 우선적으로 적용되며, 본 약관에서 정하지 않은 사항은 예금거래기본약관 및 가입한 외화예금의 개별 약관(특약·상품설명서)을 따릅니다.",
  },
];

// ─── 상품 데이터 ───
export const DEPOSIT_PRODUCTS: DepositProduct[] = [
  // ════════════ 통합통장 ════════════
  {
    id: "global-comprehensive",
    title: "글로벌외화종합통장",
    shortTitle: "글로벌",
    category: "통합통장",
    description:
      "외화보통예금이 기본계좌, 외화통지·정기·회전복리예금을 연결계좌로 한 외화 브랜드 통장. 한 통장에서 종합적으로 관리하면서 거래실적에 따라 수수료 우대까지 제공.",
    eligibility: "제한 없음 (공동명의 가입 불가)",
    period:
      "예금 종류별 (보통은 제한없음 / 통지 7일~ / 정기 7일~12개월 / 회전복리 1~3년)",
    currencies:
      "보통·정기 9종 (USD/JPY/EUR/GBP/CAD/AUD/CHF/NZD/CNY) · 통지·회전복리 8종 (CNY 제외)",
    channels: "신규 영업점·모바일앱뱅킹 / 해지 영업점·인터넷뱅킹·모바일앱뱅킹",
    initialDeposit: "보통 제한없음 · 통지·정기·회전복리 USD 100 상당액 이상",
    interestPayment: "각 연결예금별 약관 적용",
    benefits: [
      "📌 수수료 우대 (대상예금 보유 시): 당·타발 해외송금수수료 50%, 외화현찰수수료 50%, 여행자수표 매도수수료 30%",
      "└ 대상예금: 외화통지예금 또는 외화정기예금",
      "└ 대상고객: 개인·개인사업자 USD 5만불 상당 이상 신규 / 법인 USD 10만불 상당 이상 신규",
      "└ 대상예금 해지 시 우대 서비스 종료",
      "한 통장으로 외화 보통·정기·통지·회전복리 모두 관리",
    ],
    keyClauses: [
      {
        ref: "글로벌외화종합통장 상품설명서 §2",
        label: "예금의 구성",
        body:
          "기본계좌(외화보통예금) + 연결계좌(외화통지예금/외화정기예금/외화회전복리예금)로 구성. 모계좌·연결계좌 명의·인감 동일.",
      },
      {
        ref: "글로벌외화종합통장 상품설명서 §2",
        label: "수수료 우대 요건",
        body:
          "외화보통예금(글로벌외화종합통장) 보유 고객이 외화통지예금 또는 외화정기예금을 일정금액 이상 신규 가입 시 수수료 우대 제공. 개인·개인사업자 USD 5만불 상당액 이상 / 법인 USD 10만불 상당액 이상. 대상예금 해지 시 우대 종료.",
      },
    ],
    customerScripts: [
      {
        situation: "외화 첫 가입 안내",
        line:
          "외화를 처음 시작하신다면 글로벌외화종합통장 한 통장으로 보통·정기·통지·회전복리까지 같이 관리하실 수 있어요. 통화 9종(USD·JPY·EUR·GBP·CAD·AUD·CHF·NZD·CNY)을 한 화면에서 보실 수 있고요.",
      },
      {
        situation: "수수료 우대 요건 안내 (개인)",
        line:
          "외화통지예금 또는 외화정기예금을 미화 5만불 상당액 이상으로 새로 가입하시면 해외송금수수료 50%, 현찰수수료 50%, 여행자수표 매도수수료 30% 우대 서비스가 자동 적용돼요. 대상 예금을 해지하시면 우대도 종료되는 점 같이 안내드릴게요.",
      },
    ],
    staffChecklist: [
      "기본계좌(외화보통예금) 개설 시 통화 선택 — 9개 통화 중 어떤 통화를 기본으로 둘지 고객 확인",
      "연결계좌(통지·정기·회전복리)는 가입 시점에 새로 만들면 됨 — 기존 계좌 묶기 불가 (본부 확인)",
      "수수료 우대는 자동 적용이지만, 대상예금 해지 시 우대 종료. 고객 응대 시 함께 안내",
      "공동명의 가입 불가",
    ],
    cashFee: COMMON_CASH_FEE_9,
    protection: COMMON_PROTECTION,
    taxBenefit: COMMON_TAX,
    termsFile: "글로벌외화종합통장 상품설명서",
    source:
      "글로벌외화종합통장 상품설명서 (준법감시인 심의필 26-850호, 2026.03.24~2028.02.28)",
  },

  // ════════════ 수시입출 ════════════
  {
    id: "fc-ordinary",
    title: "외화보통예금",
    shortTitle: "보통",
    category: "수시입출",
    description: "하나의 계좌로 여러 외국통화를 거래할 수 있는 외화 입출금 통장.",
    eligibility: "제한 없음 (공동명의 가입 불가)",
    period: "제한 없음 (수시입출)",
    currencies: "9개 통화 (USD/JPY/EUR/GBP/CAD/AUD/CHF/NZD/CNY)",
    channels: "영업점·인터넷뱅킹·모바일앱뱅킹",
    initialDeposit: "제한 없음",
    interestPayment:
      "매 6·12월 넷째주 토요일 결산 → 결산일 직후 영업일에 원금에 가산 (단리, 세금납부전)",
    baseRate:
      "매 영업일 게시 외화보통예금 금리 적용 (2026.03.16 예시: USD/JPY/EUR/CNY 0.01% · GBP/CAD/AUD/CHF/NZD 0.00~0.01%)",
    interestFormula:
      "매일의 최종잔액을 평균하여 매 영업일 게시된 외화보통예금 이율로 셈함. 연 360일(JPY·GBP는 365일) 기준.",
    keyClauses: [
      {
        ref: "외화예금거래기본약관 제8조 ①",
        label: "이자 결산일",
        body:
          "이 예금의 이자는 매년 6월과 12월의 제4토요일(기준일)에 기준일에 이은 최종공휴일까지 셈하며, 기준일에 이은 첫 영업일(원가일)에 원금에 더합니다.",
      },
      {
        ref: "외화예금거래기본약관 제8조 ②",
        label: "이자 계산기간",
        body:
          "처음 예금일 또는 지난 원가일로부터 원가일 전날까지를 이자계산기간으로 하고, 매일의 최종잔액을 평균하여 매 영업일 영업점에 게시한 외화보통예금 이율로 셈합니다.",
      },
    ],
    customerScripts: [
      {
        situation: "이자 결산 안내",
        line:
          "외화보통예금 이자는 매년 6월과 12월의 넷째주 토요일에 결산되고, 다음 영업일에 원금에 자동으로 합쳐집니다.",
      },
      {
        situation: "원화 환산 출금 안내",
        line:
          "원화로 출금하실 땐 그 시점 영업점 고시 대고객 전신환매입율이 적용돼서, 환율 변동에 따라 받으시는 금액이 달라질 수 있어요.",
      },
    ],
    staffChecklist: [
      "공동명의 가입 불가",
      "USD 외 통화 현찰 입금/송금 입금분의 현찰 출금 시 1.5% (CNY 4%) 수수료 부과",
      "원화 환산 출금 = 대고객 전신환매입율 적용 (환율 변동 손익 발생 가능)",
    ],
    cashFee: COMMON_CASH_FEE_9,
    protection: COMMON_PROTECTION,
    taxBenefit: COMMON_TAX,
    termsFile: "외화보통예금 상품설명서",
    source:
      "외화보통예금 상품설명서 (준법감시인 심의필 26-852호, 2026.03.24~2028.02.28)",
  },
  {
    id: "fc-checking",
    title: "외화당좌예금",
    shortTitle: "당좌",
    category: "수시입출",
    description: "당좌 약정을 맺고 개설하는 입출금이 자유로운 외화예금. 무이자.",
    eligibility: "제한 없음 (공동명의 가입 불가)",
    period: "제한 없음",
    currencies: "9개 통화 (USD/JPY/EUR/GBP/CAD/AUD/CHF/NZD/CNY)",
    channels: "신규·해지 모두 영업점",
    baseRate: "무이자",
    interestPayment: "—",
    keyClauses: [
      {
        ref: "외화예금거래기본약관 제9조",
        label: "이자 없음",
        body: "이 예금에 대하여는 이자를 지급하지 아니합니다.",
      },
      {
        ref: "외화예금거래기본약관 제10조",
        label: "준용 조항",
        body:
          "수표용지교부, 수표금지급과 지급위탁취소, 수표초과지급과 일부지급거절, 수표금지급과 면책 등, 잔액·거래명세 정리, 해지, 해지 후 처리는 「입출금이 자유로운 예금약관」 제5·7·9·10·12·13·14조를 준용합니다.",
      },
    ],
    customerScripts: [
      {
        situation: "당좌 약정 안내",
        line:
          "외화당좌예금은 당좌 약정을 따로 맺으셔야 개설되는 무이자 통장이에요. 일반 외화 입출금만 원하시면 외화보통예금이 더 적합합니다.",
      },
    ],
    staffChecklist: [
      "이 상품은 무이자",
      "신규·해지 모두 영업점에서만 처리",
      "당좌 약정 별도 체결 필요",
    ],
    cashFee: COMMON_CASH_FEE_9,
    protection: COMMON_PROTECTION,
    taxBenefit: COMMON_TAX,
    termsFile: "외화당좌예금 상품설명서",
    source:
      "외화당좌예금 상품설명서 (준법감시인 심의필 25-2539호, 2025.09.17~2027.08.31)",
  },
  {
    id: "fc-mmda",
    title: "외화MMDA",
    shortTitle: "MMDA",
    category: "수시입출",
    description:
      "매일 최종 예금잔액과 가입대상(개인·개인사업자·법인)에 따라 차등 금리를 지급하는 외화 입출금 통장.",
    eligibility: "제한 없음 (공동명의 가입 불가) · 개인·개인사업자·법인 가입 가능",
    period: "제한 없음",
    currencies: "8개 통화 (USD/JPY/EUR/GBP/CAD/AUD/CHF/NZD)",
    channels: "신규 영업점 / 해지 영업점·인터넷뱅킹·모바일앱뱅킹",
    interestPayment:
      "매 6·12월 넷째주 토요일 결산 → 결산일 직후 영업일에 원금에 가산 (단리, 세금납부전)",
    baseRate:
      "잔액·대상별 차등 금리 적용 (개인 USD 1만~5만~10만, 법인 USD 5만~10만~50만 구간별)",
    interestFormula:
      "매일의 최종잔액에 대해 매 영업일 게시된 차등 금리로 계산. 연 360일(JPY·GBP는 365일) 기준.",
    keyClauses: [
      {
        ref: "외화MMDA 상품설명서 §2",
        label: "차등 금리 구간",
        body:
          "법인 USD 50만↑ / 개인 USD 10만↑ → 7일 미만 외화정기예금 금리와 외화보통예금 금리 중 높은 금리. 법인 USD 10만~50만 / 개인 USD 5만~10만 → 7일 미만 정기예금 금리의 70%와 보통예금 금리 중 높은 것. 법인 USD 5만~10만 / 개인 USD 1만~5만 → 외화보통예금 금리. 법인 USD 5만 미만 / 개인 USD 1만 미만 → 무이자.",
      },
      {
        ref: "외화MMDA 상품설명서 §2",
        label: "이자 결산",
        body:
          "매일의 최종잔액에 대하여 매년 6월·12월의 넷째주 토요일에 결산하며, 이자 지급은 결산일에 이은 최종 공휴일까지 계산하여 결산일에 이은 최초 영업일에 원금에 가산.",
      },
    ],
    examples: [
      {
        scenario: "개인 고객이 USD 50,000을 1년간 예치 (개인 1만~5만 구간 → 보통예금 금리 적용 가정)",
        calculation:
          "50,000 × (외화보통예금 게시 금리, 예: 연 0.01%) × 365 / 360",
        result: "약 USD 5.07 (실제 적용 금리는 매 영업일 게시 기준)",
      },
      {
        scenario: "법인 고객이 USD 600,000 잔액 유지 (법인 50만↑ 구간 → 7일 미만 정기예금 금리 또는 보통예금 금리 중 높은 것)",
        calculation: "600,000 × (적용 금리) × 일수 / 360",
        result: "잔액 구간에 따라 단리 적용. 정확 금리는 본부 매뉴얼 확인",
      },
    ],
    customerScripts: [
      {
        situation: "법인 자금 운용 안내",
        line:
          "MMDA는 잔액이 미화 5만불·10만불·50만불을 넘으실 때마다 자동으로 더 높은 금리가 적용되는 구조라 입출금이 자유로우면서도 큰 자금을 운용하실 때 유리합니다.",
      },
      {
        situation: "최소 잔액 안내",
        line:
          "법인 5만불 미만(개인 1만불 미만)일 땐 무이자입니다. 그 이상이 되시면 자동으로 이자가 붙기 시작해요.",
      },
    ],
    staffChecklist: [
      "잔액 구간 차등 — 가입대상(개인/개인사업자/법인)별 기준 다름",
      "공동명의 가입 불가",
      "결산일: 6·12월 넷째주 토요일 (보통예금과 동일)",
      "CNY 통화는 가입 불가 (8종 통화만)",
    ],
    benefits: ["잔액이 많을수록 자동으로 더 높은 금리 적용 (별도 신청 불필요)"],
    cashFee: COMMON_CASH_FEE_8,
    protection: COMMON_PROTECTION,
    taxBenefit: COMMON_TAX,
    termsFile: "외화MMDA 상품설명서",
    source:
      "외화MMDA 상품설명서 (준법감시인 심의필 26-851호, 2026.03.24~2028.02.28)",
  },

  // ════════════ 예치형 ════════════
  {
    id: "fc-notice",
    title: "외화통지예금",
    shortTitle: "통지",
    category: "기간예치",
    description:
      "가입일로부터 매 7일 단위로 금리가 재적용되는 단기 외화예금. 단기 자금 운용에 적합.",
    eligibility: "제한 없음 (공동명의 가입 불가)",
    period: "7일 이상 (제한없음)",
    currencies: "8개 통화 (USD/JPY/EUR/GBP/CAD/AUD/CHF/NZD)",
    channels: "신규·해지 영업점·인터넷뱅킹·모바일앱뱅킹",
    initialDeposit:
      "USD 100 상당액 이상 (비대면 가입 시 계좌당 USD 30만 상당액 미만)",
    additionalDeposit: "추가입금 불가",
    interestPayment: "만기일시지급식",
    baseRate:
      "가입일~6일 가입일 고시 금리 → 7일째부터 매 7일마다 당시 게시 금리로 갱신 적용",
    interestFormula:
      "원금 × 적용금리 × 예치일수 / 360일 (JPY·GBP는 365일). 매 7일 갱신 금리 합산.",
    earlyTermination: "가입일로부터 7일 이전 해지 시 무이자",
    partialWithdraw: "일부해지 불가",
    autoRenew: "재예치 불가",
    keyClauses: [
      {
        ref: "외화예금거래기본약관 제13조",
        label: "거치기간·통지 의무",
        body:
          "이 예금은 예금일로부터 7일 이상의 거치기간을 정해야 합니다. 거래처는 이 예금을 청구할 때 2일 전까지 미리 그 뜻을 통지해야 합니다.",
      },
      {
        ref: "외화예금거래기본약관 제14조",
        label: "이자 갱신",
        body:
          "이 예금의 이자는 은행이 매 영업일 영업점에 게시한 외화통지예금 이율로 입금일부터 계산하여 거치기간 경과 후 원금과 함께 지급합니다. 최초 신규일 이후 매 7일째 외화통지예금 고시이율이 적용되며, 7일째가 공휴일인 경우 전영업일 해당 예금 고시 이율을 적용합니다. 최초 신규일로부터 7일 이전에 해지할 경우 이자를 지급하지 않습니다.",
      },
    ],
    examples: [
      {
        scenario: "USD 10,000을 30일간 예치 (게시 통지예금 금리 연 1% 가정)",
        calculation: "10,000 × 1% × 30 / 360",
        result: "약 USD 8.33 (단, 7일 단위 갱신 금리에 따라 변동)",
      },
    ],
    customerScripts: [
      {
        situation: "출금 시점 안내",
        line:
          "외화통지예금은 출금 2일 전에 미리 영업점에 알려주셔야 해요. 가입 7일 이내 해지하시면 이자가 지급되지 않으니 거치기간 7일은 꼭 채우시기를 권해드립니다.",
      },
    ],
    staffChecklist: [
      "최초 가입 7일 이내 해지 = 무이자 (반드시 안내)",
      "출금 시 2일 전 사전 통지 의무",
      "추가입금 불가 — 추가 금액은 별도 통지예금으로 신규",
      "비대면 가입 시 계좌당 USD 30만 미만 한도",
    ],
    simulatable: true,
    simulator: {
      minDays: 7,
      maxDays: 365,
      minAmount: 100,
      maxAmount: 1_000_000,
      defaultRatePct: 1.0,
      rateNote:
        "참고용 금리. 실제 적용 금리는 매 영업일 영업점 고시 통지예금 이율 (7일 단위 갱신)",
    },
    cashFee: COMMON_CASH_FEE_8,
    protection: COMMON_PROTECTION,
    taxBenefit: COMMON_TAX,
    termsFile: "외화통지예금 상품설명서",
    source:
      "외화통지예금 상품설명서 (준법감시인 심의필 25-2854호, 2025.11.01~2027.10.30)",
  },
  {
    id: "fc-time-deposit",
    title: "외화정기예금",
    shortTitle: "정기",
    category: "기간예치",
    description:
      "일정 기간을 정해 외화 여유자금을 예치하고 만기에 원금+이자를 받는 외화예금.",
    eligibility: "제한 없음 (공동명의 가입 불가)",
    period: "7일 이상 ~ 12개월 이내 (일·월 단위)",
    currencies: "9개 통화 (USD/JPY/EUR/GBP/CAD/AUD/CHF/NZD/CNY)",
    channels: "신규·해지 영업점·인터넷뱅킹·모바일앱뱅킹",
    initialDeposit:
      "USD 100 상당액 이상 (비대면 가입 시 계좌당 USD 30만 상당액 미만)",
    additionalDeposit: "추가입금 불가",
    interestPayment: "만기일시지급식 (만기 후 또는 중도해지 요청 시 지급)",
    baseRate:
      "가입(재예치)일 게시 통화·기간별 외화정기예금 금리 (단리, 세금납부전)",
    interestFormula:
      "신규금액 × 약정금리 × 예치일수[신규일~만기일 전일] / 360일 (JPY·GBP는 365일)",
    earlyTermination:
      "7일 미만 무이자 / 7~15일 기본금리 1/10 / 15일~1개월 2/10 / 1~3개월 3/10 / 3~6개월 4/10 / 6~12개월 5/10",
    postMaturity: "만기 후 1년까지 기본금리×3/10 / 1년 초과 기본금리×1/10",
    autoRenew: "가능 (직전 계약기간과 동일하게 자동재예치 신청)",
    partialWithdraw: "일부해지 불가",
    keyClauses: [
      {
        ref: "외화예금거래기본약관 제11조 ①",
        label: "만기 이자 지급",
        body:
          "이 예금이자는 약정한 예치기간에 따라 입금일 당시 약정이율로 셈하여 만기일 이후 원금과 함께 지급합니다. 거래처 요청 시 월별 지급 가능.",
      },
      {
        ref: "외화예금거래기본약관 제11조 ②",
        label: "만기 후 이율",
        body:
          "만기일 후 청구할 때는 만기일부터 지급일 전날까지의 기간에 대해 만기 후 1년까지는 기본금리의 3/10, 만기 후 1년 초과분은 기본금리의 1/10을 적용하여 셈한 이자를 지급.",
      },
      {
        ref: "외화예금거래기본약관 제11조 ③",
        label: "중도해지 이율",
        body:
          "예치기간 7일 미만 무이자 / 7~15일 미만 1/10 / 15일~1개월 미만 2/10 / 1개월 이상 3/10 / 3개월 이상 4/10 / 6개월 이상 5/10. (단, 상속(사망)으로 인한 중도해지는 당초 약정이율 — 7일 미만은 무이자)",
      },
      {
        ref: "외화예금거래기본약관 제12조",
        label: "자동갱신",
        body:
          "거래처 요청 시 자동갱신 이전 예금과 동일한 기간으로 갱신 가능. 자동갱신은 원금과 이자를 합하여 갱신처리하며 이율은 자동갱신 당일 해당 상품 고시이율 적용.",
      },
    ],
    examples: [
      {
        scenario: "USD 10,000 · 6개월(180일) 예치 (약정금리 연 4.0% 가정)",
        calculation: "10,000 × 4.0% × 180 / 360",
        result: "만기이자 USD 200 (세금 납부 전)",
      },
      {
        scenario: "USD 10,000 · 90일 만에 중도해지 (3개월 이상 → 기본금리의 4/10)",
        calculation: "10,000 × 4.0% × 4/10 × 90 / 360",
        result: "중도해지 이자 USD 40",
      },
    ],
    customerScripts: [
      {
        situation: "중도해지 시 이율 안내",
        line:
          "가입하시고 일주일 안에 해지하시면 이자가 지급되지 않습니다. 그 이후에도 중도해지 시에는 약정이율의 일부만 적용되니, 가능하시면 만기까지 유지하시기를 권해드려요.",
      },
      {
        situation: "만기 후 이자 안내",
        line:
          "만기 지나신 후 찾으시면 만기 후 1년까지는 약정이율의 30%, 1년 넘으면 10%만 붙는 점 같이 안내드릴게요.",
      },
      {
        situation: "자동재예치 안내",
        line:
          "자동재예치를 신청하시면 만기일에 원금에 이자를 합쳐서 같은 기간으로 다시 예치돼요. 이율은 그날 게시되는 금리가 적용됩니다.",
      },
    ],
    staffChecklist: [
      "중도해지 이율 단계 — 7일/15일/1·3·6·12개월 경계 정확히 안내",
      "상속(사망) 중도해지는 약정이율 (단 7일 미만 무이자)",
      "추가입금 불가 — 추가 금액은 별도 정기예금으로 신규",
      "비대면 가입 시 계좌당 USD 30만 미만 한도",
      "JPY·GBP는 연 365일 기준 (그 외 통화는 360일)",
    ],
    simulatable: true,
    simulator: {
      minDays: 7,
      maxDays: 365,
      minAmount: 100,
      maxAmount: 10_000_000,
      defaultRatePct: 4.0,
      rateNote:
        "참고용 약정금리. 실제 적용 금리는 가입 당시 영업점·홈페이지 게시 통화·기간별 정기예금 금리",
    },
    cashFee: COMMON_CASH_FEE_9,
    protection: COMMON_PROTECTION,
    taxBenefit: COMMON_TAX,
    termsFile: "외화정기예금 상품설명서",
    source:
      "외화정기예금 상품설명서 (준법감시인 심의필 25-2853호, 2025.11.01~2027.10.30)",
  },
  {
    id: "fc-rolling-compound",
    title: "외화회전복리예금",
    shortTitle: "회전복리",
    category: "기간예치",
    description:
      "회전주기(1·3·6개월)마다 금리가 복리로 계산되며, 1회전기간 경과 후 중도해지 시에도 회전기간 충족분에 대해 기본금리를 받을 수 있는 외화정기예금.",
    eligibility: "제한 없음 (공동명의 가입 불가)",
    period: "1년 ~ 3년 (연단위)",
    currencies: "8개 통화 (USD/JPY/EUR/GBP/CAD/AUD/CHF/NZD)",
    channels: "신규·해지 영업점·인터넷뱅킹·모바일앱뱅킹",
    initialDeposit:
      "USD 100 상당액 이상 (비대면 가입 시 계좌당 USD 30만 상당액 미만)",
    additionalDeposit: "추가입금 불가",
    interestPayment: "만기일시지급식 (회전주기 충족분은 정상이자 지급)",
    baseRate:
      "가입일 게시 통화별 '금리회전주기(1/3/6개월)'에 해당하는 외화정기예금 금리 (회전주기는 예치기간 중 변경 불가)",
    interestFormula:
      "회전주기마다 원금+직전 회전 이자 → 복리로 누적. 360일(JPY·GBP는 365일) 기준",
    earlyTermination:
      "[1회전기간 경과 전] 7일 미만 무이자 / 7일~1개월 가입시 기본금리 1/10 / 1~3개월 3/10 / 3~6개월 5/10 · [1회전기간 경과 후] 직전 회전기간 기본금리에 동일 비율 적용",
    autoRenew: "재예치 불가",
    partialWithdraw: "일부해지 불가",
    keyClauses: [
      {
        ref: "외화회전복리예금 상품설명서 §2",
        label: "회전주기 선택",
        body:
          "금리회전주기(1개월/3개월/6개월) 중 가입 시 선택. 예치기간 중에는 변경 불가.",
      },
      {
        ref: "외화회전복리예금 상품설명서 §2",
        label: "복리 적용·중도해지",
        body:
          "회전주기마다 금리가 복리로 적용. 1회전기간 경과 후 중도해지 시 회전기간 충족분에 대해 정상이자 지급. 회전주기 미충족 부분은 단계별 비율 적용.",
      },
    ],
    examples: [
      {
        scenario: "USD 10,000 · 1년 · 회전주기 6개월 · 약정금리 연 4.0% 가정",
        calculation:
          "1회전(6개월): 10,000 × 4.0% × 180/360 = +200 → 2회전 원금 10,200 / 2회전(6개월): 10,200 × 4.0% × 180/360 = +204",
        result: "만기 시 원리금 USD 10,404 (단순 단리 USD 10,400보다 USD 4 더)",
      },
    ],
    customerScripts: [
      {
        situation: "장기 운용 안내",
        line:
          "외화회전복리예금은 1·3·6개월마다 복리로 이자가 누적되는 1~3년 장기 상품이에요. 일반 정기예금보다 같은 금리에서도 만기 수령액이 더 많아져요.",
      },
      {
        situation: "중도해지 안내",
        line:
          "1회전기간(예: 6개월)을 채우신 다음 해지하시면 그동안의 정상이자는 그대로 받으실 수 있어요. 그 전에 해지하시면 무이자 또는 일부만 적용됩니다.",
      },
    ],
    staffChecklist: [
      "회전주기(1/3/6개월) 가입 시 결정 → 예치기간 중 변경 불가",
      "추가입금·일부해지 불가",
      "복리 효과는 회전주기·예치기간에 따라 차이 — 장기 예치일수록 유리",
    ],
    benefits: [
      "회전주기마다 복리 적용",
      "회전주기 충족분은 중도해지 시에도 정상이자",
    ],
    simulatable: true,
    simulator: {
      minDays: 365,
      maxDays: 365 * 3,
      minAmount: 100,
      maxAmount: 10_000_000,
      defaultRatePct: 4.0,
      rateNote:
        "참고용 약정금리. 실제 적용 금리는 가입일 게시 통화별 정기예금 금리 (회전주기에 해당하는 기간 금리)",
    },
    cashFee: COMMON_CASH_FEE_8,
    protection: COMMON_PROTECTION,
    taxBenefit: COMMON_TAX,
    termsFile: "외화회전복리예금 상품설명서",
    source:
      "외화회전복리예금 상품설명서 (준법감시인 심의필 25-2855호, 2025.11.01~2027.10.30)",
  },

  // ════════════ 적금 ════════════
  {
    id: "foryou",
    title: "For You 자유적립 외화예금",
    shortTitle: "For You",
    category: "자유적립",
    description: "기본형 외화 자유적립 예금. 1~12개월 단기.",
    period: "1개월 이상 12개월 이내",
    initialDeposit: "USD 100 상당액 이상",
    additionalDeposit:
      "건당 USD 100 상당액 또는 원화 100,000원 이상 / 건당 최고 USD 100만 이하 / 만기일 전날까지 자유 입금",
    interestPayment: "만기 일시지급식",
    baseRate: "입금일 영업점 게시 예금 이율 (입금건별 계산)",
    interestFormula:
      "각 적립금별: 적립금액 × 약정금리 × 예치일수[입금일~만기일 전일] / 360일 (JPY·GBP는 365일). 적립건마다 별도 계산 후 합산.",
    partialWithdraw: "만기일 전 3회까지 / 일부해지 최소 USD 100 상당액 이상",
    earlyTermination:
      "신규 시 고시된 기간별 약정금리 적용 (3회차 초과 시 중도해지이율 적용). 상속(사망)은 약정이율 (단 7일 미만은 무이자)",
    postMaturity: "만기 후 영업점 고시 만기 후 이자 지급",
    autoRenew: "특약에 명시 X — 본부 매뉴얼 확인",
    keyClauses: [
      {
        ref: "외화예금거래기본약관 제15조 ①",
        label: "적립금별 이자 계산",
        body:
          "이 예금의 이자는 적립금별로 약정한 예치기간에 따라 입금일 당시 약정이율로 셈하여 만기일 이후 원금과 함께 지급합니다.",
      },
      {
        ref: "외화예금거래기본약관 제16조",
        label: "일부해지 기준",
        body:
          "만기일 전 적립금 중 일부 지급청구 시 가입한 외화예금의 개별 약관(특약)에서 정한 기준 적용.",
      },
    ],
    customerScripts: [
      {
        situation: "추가입금 안내",
        line:
          "For You는 만기일 전날까지 건당 100불 이상씩 자유롭게 추가 적립하실 수 있어요. 적립 일자가 다르면 이자도 입금일 기준으로 따로 계산됩니다.",
      },
    ],
    staffChecklist: [
      "적립건마다 입금일 기준으로 별도 약정금리 적용 — 만기에 합산 지급",
      "일부해지는 최대 3회 / 최소 USD 100",
      "신규 시 약정금리는 그대로, 3회차 초과 일부해지는 중도해지이율",
    ],
    benefits: ["부가서비스는 은행 기준에 따름"],
    simulatable: true,
    simulator: {
      minDays: 30,
      maxDays: 365,
      minAmount: 100,
      maxAmount: 1_000_000,
      defaultRatePct: 3.5,
      rateNote: "참고용 약정금리. 실제 적용은 영업점 게시 자유적립외화예금 이율",
    },
    protection: COMMON_PROTECTION,
    taxBenefit: COMMON_TAX,
    termsFile: "For You 자유적립 외화예금 특약",
    source: "For You 자유적립 외화예금 특약 (시행 2021.07.15.)",
  },
  {
    id: "plusyou",
    title: "Plus-You 자유적립 외화예금",
    shortTitle: "Plus-You",
    category: "자유적립",
    description:
      "장기·고우대 외화 적립 예금. 36개월까지 + 추가금리 + 환율우대·수수료 면제.",
    eligibility: "제한 없음",
    period: "1개월 ~ 36개월 (월·일 단위)",
    currencies: "8종 (USD/JPY/EUR/CAD/GBP/AUD/CHF/NZD)",
    initialDeposit: "USD 100 ~ USD 100만 상당액",
    additionalDeposit: "건당 USD 10 ~ USD 100만 상당액 / 신규 후 추가 입금 가능",
    interestPayment: "만기 일시지급식",
    baseRate:
      "For You 자유적립 외화예금 금리 적용 (입금건별, 12개월 초과 시 12개월 금리)",
    bonusRate: [
      "12개월 초과 24개월 이하: +0.1%p",
      "24개월 초과 36개월 미만: +0.2%p",
      "36개월 예치: +0.3%p",
      "(중도해지 시 추가금리 미적용)",
    ],
    interestFormula:
      "적립금액 × (기본금리 + 우대금리) × 예치일수 / 360일 (JPY·GBP는 365일). 입금건별 계산.",
    partialWithdraw:
      "만기일 전 3회까지 입금건별 / 최소 USD 100 상당액 / 선입선출 (지정 가능)",
    earlyTermination:
      "입금일 영업점·홈페이지 게시 중도해지이율. 상속(사망)은 약정이율 (단 7일 미만 무이자)",
    postMaturity: "원금 최종잔액에 입금일 게시 만기 후 이율 적용",
    autoRenew:
      "신청 시 만기일에 동일 기간(또는 지정 기간) 자동 재예치 / 원금 = 입금금액 + 지급이자",
    keyClauses: [
      {
        ref: "Plus-You 자유적립 외화예금 특약",
        label: "장기 예치 추가금리",
        body:
          "12개월 초과 24개월 이하 +0.1%p, 24~36개월 미만 +0.2%p, 36개월 예치 +0.3%p. 중도해지 시 추가금리 미적용.",
      },
      {
        ref: "Plus-You 자유적립 외화예금 특약",
        label: "수수료·환율 우대",
        body:
          "신규·자동이체 적립·만기 해지에 대해 환율우대 50%, 그 외 추가 적립은 30%. 6개월 경과 후 해외송금수수료 3회 전액 면제, 외화현찰수수료 전액 면제(일부·계좌 해지 시), 여행자수표 매도수수료 50% 우대.",
      },
    ],
    examples: [
      {
        scenario: "USD 10,000 적립 · 36개월 예치 (For You 금리 4.0% + 우대 0.3%p = 4.3% 가정)",
        calculation: "10,000 × 4.3% × 1080 / 360",
        result: "만기이자 USD 1,290 (세금 납부 전)",
      },
    ],
    customerScripts: [
      {
        situation: "장기 가입 추천 멘트",
        line:
          "장기 외화 자금 운용을 생각하시면 Plus-You가 좋아요. 24개월 넘으시면 +0.2%p, 36개월 채우시면 +0.3%p가 기본금리에 더해지고, 환율우대·수수료 면제 혜택도 6개월 이후 함께 들어옵니다.",
      },
      {
        situation: "수수료 면제 안내",
        line:
          "6개월 가입 유지하시면 해외송금수수료 3회 전액 면제·외화현찰수수료 면제·여행자수표 매도수수료 50% 우대까지 자동 적용됩니다.",
      },
    ],
    staffChecklist: [
      "통화 8종 (CNY 가입 불가)",
      "장기 우대금리는 가입기간에 자동 적용 — 중도해지 시 우대 미적용",
      "수수료·환율 우대는 6개월 경과 시점부터",
      "일부해지 시 선입선출 (고객이 지정 가능)",
    ],
    benefits: [
      "신규·자동이체적립·만기해지: 환율우대 50%",
      "자동이체 외 추가적립: 환율우대 30%",
      "6개월 경과 후 해외송금수수료 3회 전액 면제",
      "6개월 경과 후 외화현찰수수료 전액 면제 (일부·계좌 해지 시)",
      "6개월 경과 후 여행자수표 매도수수료 50% 우대",
    ],
    simulatable: true,
    simulator: {
      minDays: 30,
      maxDays: 365 * 3,
      minAmount: 100,
      maxAmount: 1_000_000,
      defaultRatePct: 4.0,
      rateNote:
        "참고용 약정금리 (For You 기본금리 가정). 가입기간에 따라 +0.1~+0.3%p 자동 가산.",
    },
    protection: COMMON_PROTECTION,
    taxBenefit: COMMON_TAX,
    termsFile: "Plus-You 자유적립 외화예금 특약",
    source: "Plus-You 자유적립 외화예금 특약 (시행 2021.07.15.)",
  },
  {
    id: "im-free",
    title: "iM 외화자유적금",
    shortTitle: "iM",
    category: "자유적립",
    description: "비대면(모바일) 전용 외화 자유 적립 적금. 12개월 고정.",
    eligibility: "실명의 개인(국민인 거주자), 1인당 최대 3개 계좌",
    period: "12개월 고정",
    currencies: "USD / JPY / EUR (가입 시 1개 통화 선택)",
    channels: "비대면 채널 전용 (모바일앱뱅킹)",
    initialDeposit: "USD 100 ~ USD 1,000 상당액",
    additionalDeposit: "USD 10 ~ USD 1,000 상당액 (적립 횟수 제한 없음)",
    accountLimit: "1일 최대 USD 1,000 / 계좌당 최대 USD 20,000 상당액",
    interestPayment: "만기 일시지급식",
    baseRate: "For You 자유적립 외화예금 금리 적용 (입금건별)",
    bonusRate: [
      "최근 1년 내 외화저축성 예금 미가입자: +0.10%p (최초 1회)",
      "마케팅 활용 [개인(신용)정보 수집·이용동의] 전체 동의: +0.10%p",
      "매회 신규가입액 이상 금액을 8회 이상 자동이체 입금: +0.30%p",
      "(최대 0.50%p 우대 / 0% 금리·중도/일부해지 시 미적용)",
    ],
    interestFormula:
      "적립건별: 적립금액 × (기본금리 + 우대금리) × 예치일수 / 360일 (JPY·GBP는 365일)",
    partialWithdraw:
      "만기일 전 10회까지 / 일부해지 최소 USD 100 / 계좌 최소 유지잔액 USD 100",
    earlyTermination:
      "7일 미만 무이자 / 7~15일 약정금리 1/10 / 15일~1개월 2/10 / 1~3개월 3/10 / 3~6개월 4/10 / 6~12개월 5/10. 상속(사망)은 약정이율 (단 7일 미만 무이자)",
    postMaturity: "만기 후 1년까지 약정금리 3/10 / 1년 초과 1/10 (기본금리만)",
    autoRenew: "신청 시 만기 자동재예치 (동일 기간) / 원금 = 입금금액 + 지급이자",
    keyClauses: [
      {
        ref: "iM 외화자유적금 특약",
        label: "우대금리 4종 (최대 +0.50%p)",
        body:
          "① 최근 1년 외화저축성 예금 미가입자 최초 1회 +0.10%p, ② 마케팅 활용 동의 전체 +0.10%p, ③ 매회 신규가입액 이상으로 8회 이상 자동이체 입금 +0.30%p. 0% 금리·중도/일부해지 시 미적용.",
      },
    ],
    examples: [
      {
        scenario: "USD 1,000 신규 + 매월 USD 1,000 자동이체 12회 · 12개월 만기 (기본 4% + 자동이체 우대 0.30% = 4.30%)",
        calculation:
          "단순 평균 예치일수 약 180일 가정 시 총 적립금 13,000 × 4.30% × 180 / 360",
        result: "약 USD 280 (실제 이자는 입금일별 정확히 계산)",
      },
    ],
    customerScripts: [
      {
        situation: "비대면 가입 안내",
        line:
          "iM 외화자유적금은 모바일앱뱅킹 전용 상품이에요. 영업점 가입은 안 되시고, 매월 자동이체로 8회 이상 입금하시면 0.30%p 추가금리가 붙어 우대금리 최대 0.50%p까지 받으실 수 있어요.",
      },
    ],
    staffChecklist: [
      "비대면 채널 전용 — 영업점 신규 불가 (본부 정책 확인)",
      "1인당 최대 3개 계좌",
      "통화 3종 (USD/JPY/EUR)만 — 가입 시 1개 선택",
      "1일 최대 USD 1,000 / 계좌당 USD 20,000 한도",
    ],
    simulatable: true,
    simulator: {
      minDays: 365,
      maxDays: 365,
      minAmount: 100,
      maxAmount: 20_000,
      defaultRatePct: 4.0,
      rateNote:
        "참고용 약정금리 (For You 기본금리 가정). 우대 조건 충족 시 최대 +0.50%p 가산.",
    },
    protection: COMMON_PROTECTION,
    taxBenefit: COMMON_TAX,
    termsFile: "iM 외화자유적금 특약",
    source: "iM 외화자유적금 특약",
  },
  {
    id: "idream-free",
    title: "IDREAM 외화자유적금",
    shortTitle: "IDREAM",
    category: "자유적립",
    description:
      "외화 자유 적립 적금. 12개월 고정 + 미성년자 우대 + 외화 첫 신규 우대.",
    eligibility: "실명의 개인(국민인 거주자), 1인당 최대 3개 계좌",
    period: "12개월 고정",
    currencies: "USD / JPY / EUR (가입 시 1개 통화 선택)",
    channels: "비대면 가능 (스마트뱅킹 가입 시 계좌당 USD 30만 미만)",
    initialDeposit: "USD 10 상당액 이상",
    additionalDeposit: "USD 10 상당액 이상 (적립 횟수 제한 없음)",
    accountLimit: "비대면 가입 계좌당 USD 30만 상당액 미만",
    interestPayment: "만기 일시지급식",
    baseRate: "For-You 자유적립 외화예금 금리 적용 (입금건별)",
    bonusRate: [
      "미성년자(만19세 미만) 가입자: +0.20%p",
      "외화예금 최초신규 (당행 외화 예·적금 미가입): +0.10%p",
      "(최대 0.30%p / 모든 우대는 6회 이상 자동이체 조건 + 출금계좌 원화 한정)",
    ],
    interestFormula:
      "적립건별: 적립금액 × (기본금리 + 우대금리) × 예치일수 / 360일 (JPY·GBP는 365일)",
    partialWithdraw:
      "만기일 전 3회까지 / 최소 USD 10 / 최소 유지잔액 USD 10 / 신규당일 불가",
    earlyTermination:
      "7일 미만 무이자 / 7~15일 기본금리 1/10 / 15일~1개월 2/10 / 1~3개월 3/10 / 3~6개월 4/10 / 6~12개월 5/10. 상속(사망)은 약정이율 (단 7일 미만 무이자)",
    postMaturity: "만기 후 1년까지 기본금리 3/10 / 1년 초과 1/10",
    autoRenew: "신청 시 자동재예치 (동일 기간) + 우대이자율 유지",
    keyClauses: [
      {
        ref: "IDREAM 외화자유적금 특약",
        label: "우대 조건",
        body:
          "미성년자(만19세 미만) +0.20%p, 외화예금 최초신규 +0.10%p (최대 +0.30%p). 모든 우대는 6회 이상 자동이체 + 출금계좌 원화 조건 충족 시 적용.",
      },
    ],
    examples: [
      {
        scenario: "미성년 자녀 명의 USD 1,000 신규 + 매월 USD 100 자동이체 12회 (기본 4% + 미성년 0.20% + 최초신규 0.10% = 4.30%)",
        calculation: "총 적립 USD 2,200 평균 예치 180일 가정 × 4.30% × 180 / 360",
        result: "약 USD 47 (실제는 입금건별 정확 계산)",
      },
    ],
    customerScripts: [
      {
        situation: "미성년 자녀 추천",
        line:
          "자녀(만 19세 미만) 명의로 가입하시면 미성년자 우대 +0.20%p, 외화 첫 가입이면 +0.10%p 추가로 받으실 수 있어요. 단, 자동이체 6회 이상 + 출금계좌 원화 조건 충족 시 적용됩니다.",
      },
    ],
    staffChecklist: [
      "미성년자 가입 시 법정대리인 동의 별도 (본부 매뉴얼)",
      "우대금리는 자동이체 6회 + 원화 출금계좌 조건 (현금 직접 입금 시 일부 우대 미적용)",
      "1인당 최대 3개 계좌",
      "통화 3종 (USD/JPY/EUR)만",
    ],
    simulatable: true,
    simulator: {
      minDays: 365,
      maxDays: 365,
      minAmount: 10,
      maxAmount: 300_000,
      defaultRatePct: 4.0,
      rateNote:
        "참고용 약정금리. 우대 조건(미성년/최초신규) 충족 시 최대 +0.30%p 가산.",
    },
    protection: COMMON_PROTECTION,
    taxBenefit: COMMON_TAX,
    termsFile: "IDREAM 외화자유적금 특약",
    source: "IDREAM 외화자유적금 특약",
  },

  // ════════════ 이체 ════════════
  {
    id: "auto-transfer",
    title: "외화 자동이체",
    shortTitle: "자동이체",
    category: "자동이체",
    description:
      "외화 예금·적금 적립용 자동이체. 원화→외화 또는 외화→외화 정기 이체.",
    period: "1개월 단위 자동이체 지정 (For You·Plus-You·iM·IDREAM 등 연계)",
    benefits: [
      "Plus-You 가입 시 자동이체 입금 50% 환율우대",
      "iM 자동이체 8회 이상: +0.30%p 우대",
      "IDREAM 자동이체 6회 이상: 우대조건",
      "상한환율 지정 가능 (For You) — 지정 초과 시 이체 중지",
    ],
    customerScripts: [
      {
        situation: "환율우대 안내",
        line:
          "자동이체로 매월 정기 입금하시면 Plus-You·iM·IDREAM 모두 우대조건이 자동으로 충족되니까 외화 적립 상품 가입하실 때 함께 신청하시는 걸 권해드려요.",
      },
    ],
    staffChecklist: [
      "외화 적금 상품 가입 시 자동이체 동시 신청 권장 — 우대금리 조건 충족",
      "For You의 '상한환율 지정' 기능 안내 (환율이 지정값 초과 시 자동이체 중지)",
    ],
    termsFile: "외화자동이체 서비스 이용약관",
    source: "외화자동이체 서비스 이용약관 + 각 상품 특약",
  },
];

// ─── 헬퍼 ───
export function depositsByCategory(category: DepositCategory): DepositProduct[] {
  return DEPOSIT_PRODUCTS.filter((p) => p.category === category);
}

export function depositById(id: string): DepositProduct | undefined {
  return DEPOSIT_PRODUCTS.find((p) => p.id === id);
}

export function simulatableProducts(): DepositProduct[] {
  return DEPOSIT_PRODUCTS.filter((p) => p.simulatable && p.simulator);
}
