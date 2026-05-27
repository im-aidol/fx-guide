// iM뱅크 외화 예금·적금 상품군.
// 출처: 각 상품설명서·특약 (docs/regulations/ + docs/extracted-deposit/) 본문 정리.
// 영업 판촉 자료가 아닌 약관/상품설명서 기준 — 영업점이 본문 근거를 확인할 수 있도록 1차 자료 출처를 명시.

export type DepositCategory =
  | "통합통장" // 글로벌외화종합통장 (브랜드 통장)
  | "수시입출" // 보통·당좌·MMDA
  | "예치형" //   통지·정기·회전복리
  | "적금" //     For You·Plus-You·iM·IDREAM
  | "이체"; //    외화 자동이체

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

  // 해지·만기
  partialWithdraw?: string;
  earlyTermination?: string;
  postMaturity?: string;
  autoRenew?: string;

  // 부가
  cashFee?: string; // 외화 현찰수수료 (대부분 USD 등 1.5% / CNY 4.0%)
  protection?: string; // 예금자보호 한도 등
  taxBenefit?: string;
  benefits?: string[];

  termsFile: string;
  source: string;
};

const COMMON_PROTECTION =
  "예금자보호법에 따라 원금+이자 1인당 1억원까지 (본 은행 여타 보호상품과 합산)";
const COMMON_TAX = "비과세종합저축 가입 불가";
const COMMON_CASH_FEE_9 =
  "USD/JPY/EUR/GBP/CAD/AUD/CHF/NZD 1.5%, CNY 4.0% (USD 외 현찰 입금 또는 송금 입금분을 현찰로 출금하는 경우)";
const COMMON_CASH_FEE_8 =
  "USD/JPY/EUR/GBP/CAD/AUD/CHF/NZD 1.5% (USD 외 현찰 입금 또는 송금 입금분을 현찰로 출금하는 경우)";

export const DEPOSIT_PRODUCTS: DepositProduct[] = [
  // ─────────── 통합통장 ───────────
  {
    id: "global-comprehensive",
    title: "글로벌외화종합통장",
    shortTitle: "글로벌",
    category: "통합통장",
    description:
      "외화보통예금이 기본계좌, 외화통지·정기·회전복리예금을 연결계좌로 한 외화 브랜드 통장. 한 통장에서 종합적으로 관리하면서 거래실적에 따라 수수료 우대까지 제공.",
    eligibility: "제한 없음 (공동명의 가입 불가)",
    period: "예금 종류별 (보통은 제한없음 / 통지 7일~ / 정기 7일~12개월 / 회전복리 1~3년)",
    currencies: "보통·정기 9종 (USD/JPY/EUR/GBP/CAD/AUD/CHF/NZD/CNY) · 통지·회전복리 8종 (CNY 제외)",
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
    cashFee: COMMON_CASH_FEE_9,
    protection: COMMON_PROTECTION,
    taxBenefit: COMMON_TAX,
    termsFile: "글로벌외화종합통장 상품설명서",
    source:
      "글로벌외화종합통장 상품설명서 (준법감시인 심의필 26-850호, 2026.03.24~2028.02.28)",
  },

  // ─────────── 수시입출 ───────────
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
    interestPayment: "매일 잔액 결산식 (영업점 게시 외화보통예금 금리)",
    baseRate:
      "매 영업일 게시 외화보통예금 금리 적용 (2026.03.16 예시: USD/JPY/EUR/CNY 0.01% · GBP/CAD/AUD/CHF/NZD 0.00~0.01%)",
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
    eligibility: "제한 없음 (공동명의 가입 불가)",
    period: "제한 없음",
    currencies: "8개 통화 (USD/JPY/EUR/GBP/CAD/AUD/CHF/NZD)",
    channels: "신규 영업점 / 해지 영업점·인터넷뱅킹·모바일앱뱅킹",
    interestPayment:
      "매 6월·12월 넷째주 토요일 결산 → 결산일 직후 영업일에 원가 (단리, 세금납부전)",
    baseRate:
      "잔액·대상별 차등: 법인 USD 50만↑ / 개인 USD 10만↑ → 7일 미만 외화정기예금 금리와 외화보통예금 금리 중 높은 금리. 법인 USD 10만~50만 / 개인 USD 5만~10만 → 7일 미만 정기예금 금리의 70%와 보통예금 금리 중 높은 것. 법인 USD 5만 미만 / 개인 USD 1만 미만 → 무이자",
    cashFee: COMMON_CASH_FEE_8,
    protection: COMMON_PROTECTION,
    taxBenefit: COMMON_TAX,
    benefits: ["잔액이 많을수록 자동으로 더 높은 금리 적용 (별도 신청 불필요)"],
    termsFile: "외화MMDA 상품설명서",
    source:
      "외화MMDA 상품설명서 (준법감시인 심의필 26-851호, 2026.03.24~2028.02.28)",
  },

  // ─────────── 예치형 ───────────
  {
    id: "fc-notice",
    title: "외화통지예금",
    shortTitle: "통지",
    category: "예치형",
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
    earlyTermination: "가입일로부터 7일 이전 해지 시 무이자",
    partialWithdraw: "일부해지 불가",
    autoRenew: "재예치 불가",
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
    category: "예치형",
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
      "가입(재예치)일 게시 통화·기간별 외화정기예금 금리 (단리, 세금납부전, 360일 기준)",
    earlyTermination:
      "7일 미만 무이자 / 7~15일 기본금리 1/10 / 15일~1개월 2/10 / 1~3개월 3/10 / 3~6개월 4/10 / 6~12개월 5/10",
    postMaturity: "만기 후 1년까지 기본금리×3/10 / 1년 초과 기본금리×1/10",
    autoRenew: "가능 (직전 계약기간과 동일하게 자동재예치 신청)",
    partialWithdraw: "일부해지 불가",
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
    category: "예치형",
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
      "가입일 게시 통화별 '금리회전주기'에 해당하는 외화정기예금 금리 (회전주기는 예치기간 중 변경 불가)",
    earlyTermination:
      "[1회전기간 경과 전] 7일 미만 무이자 / 7일~1개월 가입시 기본금리 1/10 / 1~3개월 3/10 / 3~6개월 5/10  · [1회전기간 경과 후] 직전 회전기간 기본금리에 동일 비율 적용",
    autoRenew: "재예치 불가",
    partialWithdraw: "일부해지 불가",
    cashFee: COMMON_CASH_FEE_8,
    protection: COMMON_PROTECTION,
    taxBenefit: COMMON_TAX,
    benefits: ["회전주기마다 복리 적용", "회전주기 충족분은 중도해지 시에도 정상이자"],
    termsFile: "외화회전복리예금 상품설명서",
    source:
      "외화회전복리예금 상품설명서 (준법감시인 심의필 25-2855호, 2025.11.01~2027.10.30)",
  },

  // ─────────── 적금 4종 (기존 유지) ───────────
  {
    id: "foryou",
    title: "For You 자유적립 외화예금",
    shortTitle: "For You",
    category: "적금",
    description: "기본형 외화 자유적립 예금. 1~12개월 단기.",
    period: "1개월 이상 12개월 이내",
    initialDeposit: "USD 100 상당액 이상",
    additionalDeposit:
      "건당 USD 100 상당액 또는 원화 100,000원 이상 / 건당 최고 USD 100만 이하 / 만기일 전날까지 자유 입금",
    interestPayment: "만기 일시지급식",
    baseRate: "입금일 영업점 게시 예금 이율 (입금건별 계산)",
    partialWithdraw: "만기일 전 3회까지 / 일부해지 최소 USD 100 상당액 이상",
    earlyTermination:
      "신규 시 고시된 기간별 약정금리 적용 (3회차 초과 시 중도해지이율). 상속(사망)은 약정이율 (단 7일 미만은 무이자)",
    postMaturity: "만기 후 영업점 고시 만기 후 이자 지급",
    autoRenew: "특약에 명시 X — 본부 매뉴얼 확인",
    benefits: ["부가서비스는 은행 기준에 따름"],
    protection: COMMON_PROTECTION,
    taxBenefit: COMMON_TAX,
    termsFile: "For You 자유적립 외화예금 특약",
    source: "For You 자유적립 외화예금 특약 (시행 2021.07.15.)",
  },
  {
    id: "plusyou",
    title: "Plus-You 자유적립 외화예금",
    shortTitle: "Plus-You",
    category: "적금",
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
    partialWithdraw:
      "만기일 전 3회까지 입금건별 / 최소 USD 100 상당액 / 선입선출 (지정 가능)",
    earlyTermination:
      "입금일 영업점·홈페이지 게시 중도해지이율. 상속(사망)은 약정이율 (단 7일 미만 무이자)",
    postMaturity: "원금 최종잔액에 입금일 게시 만기 후 이율 적용",
    autoRenew:
      "신청 시 만기일에 동일 기간(또는 지정 기간) 자동 재예치 / 원금 = 입금금액 + 지급이자",
    benefits: [
      "신규·자동이체적립·만기해지: 환율우대 50%",
      "자동이체 외 추가적립: 환율우대 30%",
      "6개월 경과 후 해외송금수수료 3회 전액 면제",
      "6개월 경과 후 외화현찰수수료 전액 면제 (일부·계좌 해지 시)",
      "6개월 경과 후 여행자수표 매도수수료 50% 우대",
    ],
    protection: COMMON_PROTECTION,
    taxBenefit: COMMON_TAX,
    termsFile: "Plus-You 자유적립 외화예금 특약",
    source: "Plus-You 자유적립 외화예금 특약 (시행 2021.07.15.)",
  },
  {
    id: "im-free",
    title: "iM 외화자유적금",
    shortTitle: "iM",
    category: "적금",
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
    partialWithdraw:
      "만기일 전 10회까지 / 일부해지 최소 USD 100 / 계좌 최소 유지잔액 USD 100",
    earlyTermination:
      "7일 미만 무이자 / 7~15일 약정금리 1/10 / 15일~1개월 2/10 / 1~3개월 3/10 / 3~6개월 4/10 / 6~12개월 5/10. 상속(사망)은 약정이율 (단 7일 미만 무이자)",
    postMaturity: "만기 후 1년까지 약정금리 3/10 / 1년 초과 1/10 (기본금리만)",
    autoRenew: "신청 시 만기 자동재예치 (동일 기간) / 원금 = 입금금액 + 지급이자",
    protection: COMMON_PROTECTION,
    taxBenefit: COMMON_TAX,
    termsFile: "iM 외화자유적금 특약",
    source: "iM 외화자유적금 특약",
  },
  {
    id: "idream-free",
    title: "IDREAM 외화자유적금",
    shortTitle: "IDREAM",
    category: "적금",
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
    partialWithdraw:
      "만기일 전 3회까지 / 최소 USD 10 / 최소 유지잔액 USD 10 / 신규당일 불가",
    earlyTermination:
      "7일 미만 무이자 / 7~15일 기본금리 1/10 / 15일~1개월 2/10 / 1~3개월 3/10 / 3~6개월 4/10 / 6~12개월 5/10. 상속(사망)은 약정이율 (단 7일 미만 무이자)",
    postMaturity: "만기 후 1년까지 기본금리 3/10 / 1년 초과 1/10",
    autoRenew: "신청 시 자동재예치 (동일 기간) + 우대이자율 유지",
    protection: COMMON_PROTECTION,
    taxBenefit: COMMON_TAX,
    termsFile: "IDREAM 외화자유적금 특약",
    source: "IDREAM 외화자유적금 특약",
  },

  // ─────────── 이체 ───────────
  {
    id: "auto-transfer",
    title: "외화 자동이체",
    shortTitle: "자동이체",
    category: "이체",
    description:
      "외화 예금·적금 적립용 자동이체. 원화→외화 또는 외화→외화 정기 이체.",
    period: "1개월 단위 자동이체 지정 (For You·Plus-You·iM·IDREAM 등 연계)",
    benefits: [
      "Plus-You 가입 시 자동이체 입금 50% 환율우대",
      "iM 자동이체 8회 이상: +0.30%p 우대",
      "IDREAM 자동이체 6회 이상: 우대조건",
      "상한환율 지정 가능 (For You) — 지정 초과 시 이체 중지",
    ],
    termsFile: "외화자동이체 서비스 이용약관",
    source: "외화자동이체 서비스 이용약관 + 각 상품 특약",
  },
];

// 카테고리별 그룹 헬퍼
export function depositsByCategory(category: DepositCategory): DepositProduct[] {
  return DEPOSIT_PRODUCTS.filter((p) => p.category === category);
}
