// 무역금융 영업점 응대 시나리오.
// 고객이 창구에 와서 무엇을 가져왔는지·무슨 말을 했는지에 따라 빠르게 행동을 도출하는 가이드.
// 1차 자료: 수출입 업무의 이해 연수교재 (HR부, 2025.06) + UCP 600·ISBP 745·URC 522.

export type TradeScenarioCategory = "import" | "export";
export type TradeScenarioSubCategory =
  | "lc-open" // 신용장 개설
  | "lc-amend" // 조건변경
  | "lc-receive" // 서류 도착·결제·인수
  | "lc-issue" // 통지·교부
  | "nego" // 매입
  | "collection" // 추심
  | "lg-tr" // L/G·T/R
  | "tt-finance" // T/T수입금융
  | "default"; // 부도·연체·만기

export type TradeScenario = {
  id: string;
  category: TradeScenarioCategory;
  subCategory: TradeScenarioSubCategory;
  title: string; // 시나리오 제목 (영업점 입장)
  customerSays: string; // 고객이 와서 하는 말 (예시)
  summary: string; // 한 줄 요약 (목록 표시용)

  // 영업점이 해야 할 일
  whatToBring: string[]; // 고객이 가져왔어야 하는 서류
  checklist: { label: string; detail?: string }[]; // 빠른 점검 항목
  procedure: string[]; // 처리 절차
  timing?: string; // 기한·만기 룰
  fees?: string[]; // 수수료
  cautions?: string[]; // 주의사항·하자 가능성
  scripts: string[]; // 응대 멘트

  // 관련 자료
  relatedGuides?: { label: string; href: string }[];
  source: string;
};

export const TRADE_SCENARIOS: TradeScenario[] = [
  // ─── 수입 ───────────────────────────────────────────────────────────────
  {
    id: "import-lc-open",
    category: "import",
    subCategory: "lc-open",
    title: "수입 신용장 개설 의뢰",
    customerSays: "수입 신용장(L/C) 개설하러 왔습니다.",
    summary: "외국환거래약정·외화한도 확인 후 발행신청서·계약서·보험서류 수령 → MT700 발신.",
    whatToBring: [
      "취소불능화환신용장 발행신청서",
      "물품매도확약서(OFFER SHEET) 또는 계약서(CONTRACT) — 필요 시",
      "보험서류 (수입자 부보 조건일 때 — 개설 당일 가입 원칙)",
      "수입승인서 또는 특정거래인정서 (대외무역법상 필요한 경우)",
    ],
    checklist: [
      {
        label: "외국환거래약정서 체결 여부 확인",
        detail: "최초 거래 시 약정서 먼저 받아야 함",
      },
      {
        label: "외화한도 잔액 확인",
        detail: "부족 시 보증금 추가 적립",
      },
      {
        label: "보험서류 — 부보 의무 가격조건 여부",
        detail: "FOB·FAS·CFR·EXW·FCA = 수입자 부보. CIF·CIP·D조건 = 매도인 부보(서류로 확인)",
      },
      {
        label: "결제 방식 — A/S vs U/S 선택",
        detail: "기한부면 S/U·B/U·D/U 중 신용공여 주체 결정 (수입상 부담 차이)",
      },
      {
        label: "독소조항·불명확 용어 없는지 확인",
        detail:
          "Non-negotiable docs acceptable, Copy B/L acceptable, 2/3 B/L acceptable, well-known, first class 등 금지",
      },
    ],
    procedure: [
      "외국환거래약정·외화한도 등록 확인 (영업점)",
      "수입신용장 발행신청서 접수 + 필요 서류 징구",
      "BPR Step 생성 → 외환사업부 센터전송",
      "외환사업부에서 커버페이지·MT700 전문 작성 → 외신무역망으로 통지은행 발신",
      "상환방식이면 MT740(상환수권서) 동시 발신",
    ],
    timing: "신청 당일 ~ 1영업일 내 발신",
    fees: [
      "개설수수료 (기간성 수수료, NEXPIA-5102 개별 선취 가능)",
      "전신료",
      "수입자 부보 시 보험료 (보험사 별도)",
    ],
    cautions: [
      "보험서류 징구 면제 대상 6가지 확인: 수입보증금 전액 적립 / 예·적금 담보 / 국가·지자체 / 보세창고도거래(B.W.T.) / 중계무역 최종 부보책임 / 신용 4등급 또는 외부 신용평가 A 이상 또는 6+등급+심사역협의회 승인",
      "신용장과 매매계약은 독립 — 매매계약 내용과 일치 여부는 심사대상 아님",
      "MADE OUT TO THE ORDER OF iM BANK = 당행 배서/양도해야 효력",
    ],
    scripts: [
      "「개설 의뢰서 외에 보험서류·수입계약서 가져오셨어요?」",
      "「가격조건이 FOB·CIF 중 어떤 거예요? 보험은 누가 가입하시나요?」",
      "「결제 방식은 일람불이세요? 기한부면 며칠짜리예요?」",
      "「신용장 문구에 'Non-negotiable docs acceptable' 같은 조항 들어가면 저희가 화물 담보를 못 잡습니다.」",
    ],
    relatedGuides: [
      { label: "수입 신용장 상세 가이드", href: "/guide/trade-finance/import-lc" },
      { label: "신용장 19개 필드 가이드", href: "/guide/trade-finance/lc-fields" },
      { label: "신용장 하자 점검 도구", href: "/guide/trade-finance/lc-checker" },
    ],
    source: "연수교재 Section 2 수입신용장 개설 FLOW + 필수 서류",
  },

  {
    id: "import-lc-amend",
    category: "import",
    subCategory: "lc-amend",
    title: "수입 신용장 조건변경 의뢰",
    customerSays: "이미 개설한 신용장 조건을 바꿔야 합니다.",
    summary: "MT707 전문. 당사자 전원 합의 필요. 증액·감액·기일·필드별 ADD/DELETE/REPLACE ALL.",
    whatToBring: [
      "조건변경 신청서",
      "원 신용장 번호·발행일·통지은행 정보",
      "증액 시: 보증금 추가적립 자금, 추가 보험증권(부보 조건)",
      "수출상 동의 전문 (감액·취소·핵심 변경 시)",
    ],
    checklist: [
      {
        label: "변경 항목 식별",
        detail: "유효기일 / 선적기일 / 금액 / 가격조건 / 분할선적 / 환적 / 서류 등",
      },
      {
        label: "증액 — 외화한도 잔액 확인",
        detail: "부족 시 보증금 추가 적립",
      },
      {
        label: "증액 + 수입자 부보 — 보험증권 추가 징구",
        detail: "증액분에 대한 추가 보험가입, 원본 징구·스캔·물류배송",
      },
      {
        label: "감액 — 수출상 동의 전문 수신 확인",
        detail: "ALIOS-대외전문송신의뢰서(수입) 작성 → 통지은행 발신 → 동의 수신 후 변경",
      },
      {
        label: "가격조건 변경 시 연쇄 항목 점검",
        detail:
          "FOB → CIF: 운임 COLLECT → PREPAID / 보험서류 불요 → 요구 / 출발지 → 도착지",
      },
    ],
    procedure: [
      "조건변경 항목 정리 + 영향 받는 다른 필드 점검",
      "ADD / DELETE / REPLACE ALL 중 결정 (DESCRIPTION OF GOODS · DOCUMENT REQUIRED · ADDITIONAL CONDITIONS)",
      "BPR Step 생성 → 외환사업부 → MT707 전문 발신",
      "상환방식이면 MT747(상환수권 관련) 상환은행에 동시 발신",
      "수익자 수락 통지 확인 → 효력 발생",
    ],
    timing: "수익자 수락 통지 도착 시 효력 발생 (UCP 600 제10조)",
    fees: ["조건변경수수료", "전신료", "증액 시 추가 개설수수료·보험료"],
    cautions: [
      "개설의뢰인(수입상)은 신용장 당사자 아님 — 수출상 동의 없이 변경 불가",
      "조건변경 통지에 대한 부분적 수락 불가 — 전체 승낙·거절 중 택일",
      "수익자 동의 유보 시 조건변경 불성립. 단, 변경된 내용에 일치하는 서류 제시 시 동의로 간주",
    ],
    scripts: [
      "「수출상이 변경에 동의하셨나요? 동의 전문이나 메일 받으셨어요?」",
      "「감액은 수출상 동의 받은 다음에야 처리됩니다.」",
      "「증액하시면 한도 잔액 확인하고 부족분만큼 보증금 더 받아야 해요.」",
      "「가격조건을 FOB에서 CIF로 바꾸시면 운임·보험서류·도착지까지 같이 변경해야 해요.」",
    ],
    relatedGuides: [
      { label: "신용장 조건변경 상세", href: "/guide/trade-finance/lc-amendment" },
      { label: "수입 신용장 가이드", href: "/guide/trade-finance/import-lc" },
    ],
    source: "연수교재 Section 2 신용장 조건변경 + UCP 600 제10조",
  },

  {
    id: "import-docs-arrived-as",
    category: "import",
    subCategory: "lc-receive",
    title: "수입 선적서류 도착 — 일람불(A/S) 결제",
    customerSays: "수입 서류가 도착해서 결제하러 왔습니다.",
    summary: "도착등록 익일~5영업일 내 결제. 일치 = 결제 / 하자 = 5영업일 내 매입은행 통보.",
    whatToBring: [
      "결제 자금 (또는 외환한도 사용 여신 신청)",
      "(L/G 발급 시) 수입물품선취보증신청서",
    ],
    checklist: [
      {
        label: "서류 심사 결과 — CLEAN vs 하자",
        detail: "도착등록 시 외환사업부가 신용장조건·UCP·ISBP 근거로 심사",
      },
      { label: "접수금액 = 환어음금액 = INVOICE 금액 일치 확인" },
      {
        label: "도착등록 익일로부터 5영업일 내 결제 일정",
        detail: "초과 시 수입어음결제지연이자(Grace Day Charge) 발생",
      },
      {
        label: "결제자금 방식 — 자기자금 / 무역금융 / 외화대출",
        detail: "이자율·환율 적용 다름",
      },
    ],
    procedure: [
      "외환사업부 서류 심사 결과 확인 (CLEAN / 하자)",
      "결제자금 확보 — 자기자금 입금 또는 여신 신청",
      "결제 처리 → 매입은행 송금 (상환방식이면 자동, 송금방식이면 직접)",
      "선적서류 인도 → 수입상 통관",
      "결제 시 대외 청구 수수료(Corres Charge) 함께 정산",
    ],
    timing:
      "도착등록 익일로부터 5영업일 이내. 4영업일 초과 시 결제지연이자 징수 대상기간 시작.",
    fees: [
      "수입어음결제지연이자 — 4영업일째부터 결제일 전일까지 (자기자금: 환가율 / 여신: 해당 대출이율)",
      "수입어음결제수수료 (Corres Charge) — 통지·인수·할인·확인·전신·상환수수료 등",
      "개설수수료 환출 또는 추가징수",
    ],
    cautions: [
      "결제만기일까지 결제 못하면 → 운송서류 도착 익일로부터 6영업일째 대지급 처리, 연체대출금에 준해 관리",
      "하자 있는데 인수하시면 → 하자인수 후 결제로 진행 (부도결제와 구분 — 거절 시 부도등록)",
    ],
    scripts: [
      "「서류 심사 결과 일치하게 들어왔어요. 도착등록일 익일로부터 5영업일 안에 결제 부탁드려요.」",
      "「결제자금은 자기자금이세요, 외화대출 받으세요?」",
      "「만기일 넘기면 자동으로 대지급 들어가고, 외환한도계좌가 연체계좌로 전환됩니다.」",
    ],
    relatedGuides: [
      { label: "수입 신용장 가이드", href: "/guide/trade-finance/import-lc" },
      { label: "신용장 거래 흐름도", href: "/guide/trade-finance/flow-lc" },
    ],
    source: "연수교재 Section 2 일람불 도착·결제 + 수수료",
  },

  {
    id: "import-docs-arrived-us",
    category: "import",
    subCategory: "lc-receive",
    title: "수입 선적서류 도착 — 기한부(U/S) 인수",
    customerSays: "기한부 신용장 서류가 도착해서 인수하러 왔습니다.",
    summary: "도착등록 익일~5영업일 내 인수. 만기일에 결제. S/U·B/U·D/U 어느 방식인지 확인.",
    whatToBring: [
      "서류 인수 의사 확인 (서류상 도장 등)",
      "T/R(수입물품대도) 신청서 — L/G 미발급 건의 서류 인도 시",
    ],
    checklist: [
      { label: "USANCE 종류 확인 — S/U / B/U / D/U" },
      {
        label: "만기일 산정 — 일람 후 XX일 또는 선적일 후 XX일",
        detail: "환어음 TENOR 필드 확인",
      },
      {
        label: "T/R 대상 여부",
        detail:
          "L/G 발급 시 / 기한부 서류 인수 시 / 당행대출대전으로 결제 조건 L/G 시. 수입보증금 전액 적립 시 T/R 면제",
      },
      {
        label: "인수수수료 발생 시점·종료 시점",
        detail: "인수 시점 ~ 만기일까지",
      },
    ],
    procedure: [
      "외환사업부 서류 심사 결과 확인",
      "T/R 신청서 받음 (대상이면)",
      "인수 처리 → 만기일 등록",
      "인수수수료 징수 (기간성 수수료)",
      "만기일 익영업일까지 결제 못하면 대지급",
    ],
    timing:
      "도착등록 익일로부터 5영업일 이내 인수. 만기일 미결제 시 만기 익영업일에 대지급.",
    fees: [
      "인수수수료 — 인수 시점 ~ 만기일",
      "B/U·D/U: 환가료·인수비용은 수입상 부담",
      "S/U: 수출상이 매입은행 매입 요청 → 환가료 수출상 부담",
    ],
    cautions: [
      "만기연장은 원칙적 불가 — 영업점장이 채권보전 OK + 이해당사자 사전동의 시 인수일로부터 최장 360일 예외 가능",
      "B/U는 만기연장·조기상환 원칙적 불가 (해외인수은행 규정에 따름)",
      "D/U는 조기상환·만기연장 자유 — D/U는 당행 단독 진행으로 사후관리 빠름",
    ],
    scripts: [
      "「이 신용장은 어떤 USANCE 방식이에요? S/U(수출상 신용공여), B/U(해외은행 신용공여), D/U(저희 iM뱅크 신용공여) 중 어느 거죠?」",
      "「만기일이 어디예요? 그 날짜에 결제 자금 준비해 두셔야 해요.」",
      "「L/G 발급해서 화물 먼저 인도받으셨으면 T/R 함께 받아야 해요.」",
    ],
    relatedGuides: [
      { label: "수입 신용장 가이드 — USANCE 3종", href: "/guide/trade-finance/import-lc" },
    ],
    source: "연수교재 Section 2 기한부 도착·인수·만기 + USANCE 3종 비교",
  },

  {
    id: "import-discrepancy-accept",
    category: "import",
    subCategory: "lc-receive",
    title: "하자 인수 동의",
    customerSays: "선적서류에 하자가 있는데 그냥 받겠습니다.",
    summary: "수입상이 하자 내용에 인수 동의 → 하자인수 후 결제로 진행.",
    whatToBring: ["하자 인수 동의서 (서류상 의사 확인)"],
    checklist: [
      {
        label: "하자 사유 명세 확인",
        detail: "외환사업부가 5영업일 내 모든 하자사유 명시하여 매입은행 통보한 내용",
      },
      {
        label: "고객이 하자 내용 충분히 이해했는지",
        detail: "서류 위조·물품 불량 가능성도 있음을 안내",
      },
      {
        label: "하자 인수 후 결제 일정",
        detail: "만기일까지 결제 못하면 대지급",
      },
    ],
    procedure: [
      "하자 사유 명세 안내 + 인수 동의서 받기",
      "하자인수 후 결제 처리",
      "결제만기일까지 결제 못하면 대지급 (수입상 거절이면 부도결제 등록)",
    ],
    cautions: [
      "신용장은 서류 거래 — 하자 인수 시에도 실제 물품과는 별개 (위조·저질 물품도 결제 의무 발생)",
      "부도결제(=거절)과 구분 — 거절은 별도 부도등록 절차",
    ],
    scripts: [
      "「하자가 ~한 부분이 있어요. 그래도 받으시겠어요?」",
      "「하자 받으시면 그 다음 부도결제로 돌릴 수 없어요. 거절하시려면 지금 결정하셔야 해요.」",
      "「신용장은 서류로만 보는 거라, 받으신 다음에 물품에 문제가 있어도 저희가 책임지지는 못합니다.」",
    ],
    relatedGuides: [
      { label: "수입 신용장 가이드 — 대지급·부도결제", href: "/guide/trade-finance/import-lc" },
    ],
    source: "연수교재 Section 2 대지급·부도결제 구분",
  },

  {
    id: "import-lg",
    category: "import",
    subCategory: "lg-tr",
    title: "수입물품선취보증서 (L/G) 발급",
    customerSays: "물건은 도착했는데 서류가 안 와서 통관을 못합니다.",
    summary:
      "B/L 원본 없이 화물 인도받기 위한 보증. 보증금 적립 또는 면제 + T/R 선행. 연 3% 보증료.",
    whatToBring: [
      "수입물품선취보증신청서",
      "선하증권 사본 (ORIGINAL에 대한 사본)",
      "상업송장 사본",
      "기타 필요 서류",
    ],
    checklist: [
      {
        label: "보증금 적립 / 면제 결정",
        detail:
          "면제 6가지: 대출·해외차입 결제 예정 / 국가·정부기관·지자체 / 담보비율 100% 이상 / 신용장 전액 보증금 / 주채무계열 / 심사역협의회 승인",
      },
      { label: "면제 시 T/R 선행 의무 — T/R 신청서 함께 받기" },
      {
        label: "보증료 산정",
        detail: "연 3% (최저 10,000원), 적립면제액 기준",
      },
      {
        label: "선박/항공 구분",
        detail: "선박 = LETTER OF GUARANTEE / 항공 = 항공화물운송장에 의한 수입화물인도승낙서",
      },
    ],
    procedure: [
      "L/G 신청서 + 사본 서류 접수",
      "보증금 적립 또는 면제 (면제 시 T/R 선행)",
      "L/G 발행 → 「CHECKED ON」 인 모든 서류 압날 → 발급은행·전화·FAX·담당자 고무인 날인",
      "거래처 1부 + 당행보관 1부 + 업체교부 1부",
      "보증료 징수 (수입대금 결제 시)",
    ],
    timing:
      "보증료 징수기간: A/S = L/G발급일 ~ 보증금 적립일 전일 또는 결제일 전일까지 / U/S = 예정만기일부터",
    fees: [
      "수입물품선취보증료 연 3% (최저 10,000원) — 보증금 면제 시에만",
      "L/G 발행 수수료 (별도)",
    ],
    cautions: [
      "보증료는 보증금 면제와 별도 — 면제해도 보증료는 면제 불가 (은행 신용위험부담 커버 목적)",
      "T/R은 화물에 대한 은행 소유권·담보권 유지 도구 — 수입자가 결제 전 통관·제조·판매 가능",
      "수입대금 전액이 수입보증금으로 적립된 경우 T/R 면제",
    ],
    scripts: [
      "「선하증권 사본이랑 상업송장 사본 가져오셨어요? 신청서랑 같이 받아야 발급할 수 있어요.」",
      "「보증금 면제 받으시면 T/R(대도)도 같이 작성하셔야 해요. 화물에 대한 저희 담보권 유지를 위해서요.」",
      "「보증료는 면제 안 되고, 연 3% 발생합니다.」",
    ],
    relatedGuides: [
      { label: "수입 신용장 가이드 — L/G·T/R", href: "/guide/trade-finance/import-lc" },
    ],
    source: "연수교재 Section 2 L/G·T/R·보증료",
  },

  {
    id: "import-tt-finance",
    category: "import",
    subCategory: "tt-finance",
    title: "T/T수입금융 신용공여 신청",
    customerSays: "송금방식으로 수입하는데 만기에 결제하는 방식 있나요?",
    summary:
      "송금방식(T/T) 수입거래 신용공여 상품. 사전·사후송금 / USD·JPY·EUR / 인수료 1.5~2.3%.",
    whatToBring: [
      "T/T수입금융 신청서",
      "수출자·수입자간 매매계약서 (상품명·단가·가격 확인 가능)",
      "운송서류 (사후송금 또는 사전송금 후 선적 확인 시) — 선하증권·해상운송장·항공운송장·복합운송서류·특송배달영수증",
    ],
    checklist: [
      { label: "대상 거래 확인 — 사전송금(신청일 후 2개월 이내 선적) / 사후송금(선적일 후 3개월 이내 지급)" },
      { label: "거래가능통화 USD·JPY·EUR 확인" },
      { label: "신용공여기간 — 송금희망일로부터 1년 이내" },
      {
        label: "신청 시점",
        detail: "송금희망일 최소 3영업일 전. 신청일 다음 영업일로부터 3~7영업일 내 송금",
      },
      {
        label: "국제 제재 대상 여부 점검",
        detail: "거래상대방·수취은행·수취국가 등 UN·미국·EU·영국 등 제재 대상이면 이용 불가",
      },
      {
        label: "중복지급 여부",
        detail: "이미 지급된 건이면 이용 불가",
      },
    ],
    procedure: [
      "신청서 접수 + 매매계약서·증빙서류 확인",
      "신용등급별 인수수수료율 결정 (1.5~2.3%)",
      "해외인수은행에 인수 신청 전문 발송 → 인수 결정 대기 (취소는 발송 이전까지만)",
      "송금 처리 + 인수수수료·신청수수료·전신료 징수",
      "만기일에 원금 + A/D Charge + 송금수수료 상환",
    ],
    timing:
      "송금가능일자: 신청일 다음 영업일로부터 3~7영업일 이내. 신용공여기간: 송금희망일로부터 1년 이내. 연장 원칙적 불가, 조기상환 1회만 가능.",
    fees: [
      "신청수수료 20,000원",
      "인수수수료 최저 20,000원 (연 1.5~2.3%, 신용등급별)",
      "조건변경수수료 30,000원",
      "전신료 발신 1건당 8,000원",
      "A/D Charge — 해외인수은행 정책",
      "송금수수료 — 송금인 USD 30 내외 / 수취인 USD 20 내외",
    ],
    cautions: [
      "만기 미상환 시 대지급 → 대지급금 이자 = 외화연체금리(인수료율 + 3%p와 15% 중 낮은 금리) × 대지급기간/365",
      "운송서류상 선적항·선적일자·선박 정박기록 등과 상이한 정보 존재 시 이용 불가",
      "은행은 만기상환액에 대한 지급보증 책임만 부담 — 수출기업 신용·무역거래 책임 없음",
    ],
    scripts: [
      "「사전송금이세요, 사후송금이세요? 사전이면 2개월 안에 선적, 사후면 선적일로부터 3개월 안에 결제 예정이어야 해요.」",
      "「송금 희망일 최소 3영업일 전에 신청해 주세요. 통화는 USD·JPY·EUR만 가능합니다.」",
      "「해외인수은행이 인수 거절할 수도 있어요. 전문 발송 전까지는 신청 취소도 가능합니다.」",
    ],
    relatedGuides: [
      { label: "T/T수입금융 상품 가이드", href: "/guide/trade-finance/tt-import" },
    ],
    source:
      "「T/T수입금융」 상품설명서 (준법감시인 심의필 제 25-1587호, 2025.07.01~2027.06.30)",
  },

  {
    id: "import-dp-da",
    category: "import",
    subCategory: "collection",
    title: "추심 D/P·D/A 수입대금 결제·인수",
    customerSays: "추심 방식으로 들어온 서류 결제하러 왔습니다.",
    summary: "은행은 중개인. D/P = 즉시 지급, D/A = 환어음 인수 후 만기 결제. URC 522 적용.",
    whatToBring: [
      "결제 자금 (D/P) 또는 인수 의사 표시 (D/A)",
    ],
    checklist: [
      { label: "D/P인지 D/A인지 확인" },
      { label: "D/A의 경우 만기일 산정 (환어음 TENOR)" },
      {
        label: "은행 지급보증 없음 안내",
        detail: "신용장과 다름 — 거래처 신용 기반",
      },
    ],
    procedure: [
      "D/P: 결제자금 받음 → 선적서류 인도 → 추심은행 → 추심의뢰은행으로 대금 이체",
      "D/A: 환어음 인수 받음 → 선적서류 인도 → 만기일에 결제",
    ],
    cautions: [
      "신용장과 달리 은행 지급보증 없음 — 수입상 거절 가능성·D/A 만기 미지급 위험 안내",
      "수입상 거절 시 부도처리 (수출상에게는 부도통보)",
    ],
    scripts: [
      "「이건 추심 방식이라 저희가 지급을 보증하지는 않아요. 거절하시면 부도로 잡혀요.」",
      "「D/A시면 인수해 두고 만기에 결제하시는 방식이에요. 만기 미결제 시 부도 처리됩니다.」",
    ],
    relatedGuides: [
      { label: "추심 가이드 (D/P·D/A)", href: "/guide/trade-finance/collection" },
      { label: "추심 거래 흐름도", href: "/guide/trade-finance/flow-collection" },
    ],
    source: "연수교재 Section 1 무신용장방식 거래 + URC 522",
  },

  {
    id: "import-overdue",
    category: "import",
    subCategory: "default",
    title: "수입 결제 만기 미상환 — 대지급",
    customerSays: "(만기일 지나서 미결제 상태) — 대지급 발생.",
    summary: "A/S = 도착 익일+6영업일 / U/S = 만기 익영업일에 자동 대지급. 외환한도계좌 → 연체계좌 전환.",
    whatToBring: ["연체 상환 자금 확보 계획"],
    checklist: [
      {
        label: "대지급 처리 시기 확인",
        detail: "A/S: 운송서류 도착 익일로부터 6영업일째 / U/S: 만기일 익영업일",
      },
      {
        label: "외환한도계좌 → 연체계좌 전환 안내",
        detail: "연체대출금에 준하여 관리",
      },
    ],
    procedure: [
      "만기일 미결제 확인",
      "대지급 실행 (당행이 매입은행에 대신 결제)",
      "수입상 외환한도계좌를 연체계좌로 전환",
      "연체대출금에 준한 관리",
    ],
    cautions: [
      "부도결제(등록)과 구분 — 부도결제는 수입상이 조건불일치 서류 인수·결제 거절한 경우",
      "기한부 수입환어음 만기연장은 원칙적 불가. 영업점장 채권보전 OK + 이해당사자 사전동의 시 인수일로부터 최장 360일 예외",
    ],
    scripts: [
      "「만기일 넘기시면 저희가 대신 결제하고, 외환한도계좌가 연체계좌로 전환돼요. 빨리 자금 마련해 주세요.」",
    ],
    relatedGuides: [
      { label: "수입 신용장 가이드 — 대지급·만기연장", href: "/guide/trade-finance/import-lc" },
    ],
    source: "연수교재 Section 2 대지급·만기연장·조기상환",
  },

  // ─── 수출 ───────────────────────────────────────────────────────────────
  {
    id: "export-lc-advise",
    category: "export",
    subCategory: "lc-issue",
    title: "수출 신용장 통지 (개설은행 → 수익자)",
    customerSays: "해외에서 우리 앞으로 신용장이 들어왔다고 하는데 받으러 왔어요.",
    summary: "통지은행 입장의 신용장 교부. ORIGINAL 날인·서명·간인 + 수출 신용장 접수증 징구.",
    whatToBring: [
      "사업자등록증·인감증명 등 본인 확인 서류",
      "수출 신용장 접수증 (당행에서 양식 제공)",
    ],
    checklist: [
      {
        label: "통지 종류 — 우편 / 전신",
      },
      {
        label: "ORIGINAL 각 장 날인 + 책임자 서명·직인 + 신용장 각 장간 직인 간인",
      },
      { label: "수출 신용장 접수증 징구 → 영업점 보관" },
    ],
    procedure: [
      "신속히 수익자에게 신용장 도착 통지",
      "수익자 본인 확인",
      "「ORIGINAL」 날인·서명·간인 절차",
      "『수출 신용장 접수증』 받음",
      "수익자에게 원본 교부",
    ],
    cautions: [
      "조건변경·취소는 별도 절차 — 부분적 동의 불가",
      "수익자 분실 시 분실신고 → 주무부서를 통해 국내 각 외국환은행에 통보",
    ],
    scripts: [
      "「수출 신용장이 도착했습니다. 본인 확인하시고 접수증 작성 부탁드려요.」",
      "「원본은 각 장마다 도장 찍고 간인까지 한 다음에 드릴 거예요.」",
      "「분실하시면 즉시 신고 주셔야 해요. 분실재발급은 '원본대조필' 도장 찍은 사본으로 드립니다.」",
    ],
    relatedGuides: [
      { label: "수출 신용장 가이드", href: "/guide/trade-finance/export-lc" },
    ],
    source: "연수교재 Section 3 신용장 통지·조건변경·분실",
  },

  {
    id: "export-nego-clean",
    category: "export",
    subCategory: "nego",
    title: "수출환어음 매입 (NEGO) — CLEAN",
    customerSays: "선적 끝났고 서류 들어왔어요. 매입(네고)해 주세요.",
    summary: "신용장 조건 일치 서류 매입. 즉시 자금 지급 + 환가료 차감. 영업점장 전결.",
    whatToBring: [
      "환어음 (DRAFT)",
      "상업송장 (Commercial Invoice)",
      "선하증권 또는 항공운송장 (B/L · AWB)",
      "보험증권 (CIF·CIP·D조건 시)",
      "포장명세서·원산지증명서·기타 신용장 요구 서류",
    ],
    checklist: [
      {
        label: "서류 종합 점검 — UCP 600·ISBP 745 기준",
        detail: "엄격일치(상업송장) + 실질일치(나머지)",
      },
      {
        label: "환어음 — 통화·금액·발행지·발행일·TENOR·수취인·지급인·신용장번호·발행인 서명",
      },
      {
        label: "B/L — CONSIGNEE·NOTIFY·본선적재부기·전통·운송인 서명",
      },
      {
        label: "보험증권 — 피보험자·금액 110%·통화·ICC(A/B/C)·발행일 ≤ 선적일",
      },
      {
        label: "신용장 유효기일 + 서류제시기간 (선적일 후 21일 또는 명시) 이내 제시",
      },
      {
        label: "매입제한국 여부 — NEXPIA 7052 국가정보 조회",
      },
    ],
    procedure: [
      "서류 접수 + 종합 점검 (CLEAN 판단)",
      "환어음 매입 → 즉시 수출상에 자금 지급",
      "환가료 차감",
      "선적서류 + Covering Letter 작성 → 개설은행 발송",
      "상환 청구 (상환방식 / 송금방식 / 차기방식)",
    ],
    fees: [
      "환가료",
      "전신료",
      "대외 수수료 (개설은행으로부터 차감되어 환출)",
    ],
    cautions: [
      "CLEAN 매입 전결: 영업점장 100",
      "매입제한국 + CLEAN 전결: 영업점장 100 / 부서장 1,000 / 본부장 전결",
    ],
    scripts: [
      "「서류 다 가져오셨는지 확인할게요. 환어음·상업송장·선하증권·보험증권·...」",
      "「신용장 유효기일과 서류제시기간 안에 들어왔어요. 매입 처리해 드릴게요.」",
      "「환가료 차감하고 외화계좌로 입금됩니다.」",
    ],
    relatedGuides: [
      { label: "수출 신용장 가이드", href: "/guide/trade-finance/export-lc" },
      { label: "서류별 ISBP 작성 가이드", href: "/guide/trade-finance/document-guide" },
      { label: "신용장 하자 점검 도구", href: "/guide/trade-finance/lc-checker" },
    ],
    source: "연수교재 Section 3 수출환어음 매입 + 서류별 작성 가이드",
  },

  {
    id: "export-nego-discrepancy",
    category: "export",
    subCategory: "nego",
    title: "수출환어음 매입 — 하자 발견",
    customerSays: "(서류 점검 중 하자 발견 — 영업점 처리 분기).",
    summary:
      "4가지 처리 방법 중 선택: 추심 후 지급 / 전신조회 / 신용장 조건변경 / 하자로 매입.",
    whatToBring: ["하자 매입 동의서 (하자로 매입 선택 시)"],
    checklist: [
      { label: "하자 사유 정확히 명세화" },
      { label: "수출상 신용등급 확인 (전결권 영향)" },
      {
        label: "매입제한국 여부",
        detail: "매입제한국 + 하자: 영업점장 100 / 부서장 400 / 본부장 전결",
      },
      {
        label: "하자 매입 잔액 한도 확인",
        detail: "상장법인·1천만미불 이상 실적 업체: 신용 5+ 이상 = 2,000천미불 이하 / 5등급 이하 = 1,000천미불 이하",
      },
    ],
    procedure: [
      "1️⃣ 수출대금 추심 후 지급 — 자금 후지급",
      "2️⃣ 하자내용 명시 → 신용장 발행은행 전신조회 → 회답에 따라 처리",
      "3️⃣ 신용장 조건변경하여 하자 해소 후 매입",
      "4️⃣ 하자로 매입 — 보증부(하자) 전결권 적용",
    ],
    cautions: [
      "당행 신용 7등급 이하·자산건전성 요주의 이하·워크아웃·화의·법정관리 업체 = 하자여부 상관없이 보증부(하자) 전결권",
      "무하자로 매입 후 하자로 전환 시 매입금액이 영업점장 전결 초과 → 하자등록일 익영업일까지 주무부서로 '수출환어음 사후관리 계획서' 제출",
    ],
    scripts: [
      "「~~ 부분이 신용장 조건과 다르네요. 4가지 방법이 있어요: 추심 후 받기 / 발행은행에 물어보기 / 신용장 조건 변경 / 하자로 매입.」",
      "「하자로 매입하시면 부도 시 저희가 환수해야 해요. 보증부 매입 전결권 적용됩니다.」",
      "「발행은행에 문의(케이블 네고) 해서 결정하시는 게 가장 안전해요.」",
    ],
    relatedGuides: [
      { label: "수출 신용장 가이드 — 하자 매입", href: "/guide/trade-finance/export-lc" },
      { label: "신용장 하자 점검 도구", href: "/guide/trade-finance/lc-checker" },
    ],
    source: "연수교재 Section 3 하자 매입 처리 + 전결권",
  },

  {
    id: "export-collection",
    category: "export",
    subCategory: "collection",
    title: "수출 추심 의뢰 (D/P·D/A)",
    customerSays: "신용장 없이 D/P(또는 D/A)로 수출했어요. 추심 부탁합니다.",
    summary: "URC 522 적용. 환어음·선적서류 받아서 수입지 추심은행에 송부.",
    whatToBring: [
      "환어음 (D/P·D/A 방식 — 지급인 = 수입상)",
      "선적서류 (상업송장·B/L·AWB·보험증권 등)",
      "추심 의뢰서",
    ],
    checklist: [
      { label: "D/P인지 D/A인지 명확히" },
      {
        label: "추심 전 매입(NEGO) 신청 여부",
        detail:
          "당행 신용 7등급 이하·요주의 이하·워크아웃 등 = 하자여부 상관없이 보증부(하자) 전결권",
      },
      { label: "수입지 추심은행 지정 확인" },
    ],
    procedure: [
      "환어음·선적서류 + 추심 의뢰서 접수",
      "추심 지시서 작성 → 수입지 추심은행으로 송부",
      "추심은행이 수입상에 서류 제시 → D/P 지급 / D/A 인수",
      "대금 회수 후 수출상 외화계좌 입금",
    ],
    cautions: [
      "은행 지급보증 없음 — 수출상에게 사전 안내",
      "D/A는 인수 후 만기 미지급 가능성 — 단기수출보험 가입 권장",
    ],
    scripts: [
      "「추심은 저희가 보증을 안 해드려요. 수입상이 거절하시면 부도 처리됩니다.」",
      "「D/A로 가시면 인수 후 만기까지 자금 회수 못 할 수 있어요. 한국무역보험공사 단기수출보험 가입 검토해보세요.」",
    ],
    relatedGuides: [
      { label: "추심 가이드 (D/P·D/A)", href: "/guide/trade-finance/collection" },
      { label: "추심 거래 흐름도", href: "/guide/trade-finance/flow-collection" },
    ],
    source: "연수교재 Section 1 무신용장방식 거래 + Section 3 매입 vs 추심",
  },

  {
    id: "export-default",
    category: "export",
    subCategory: "default",
    title: "수출환어음 부도 처리",
    customerSays: "(부도 통지 받음 / 만기 경과 입금 안 됨).",
    summary:
      "추심전 매입한 수출환어음의 부도·인수거절·만기 경과. 1개월 룰 적용.",
    whatToBring: ["부도 통보서 (해외 매입은행)"],
    checklist: [
      {
        label: "부도 사유 확인",
        detail: "일람불/기한부 = 1개월까지 미입금 / 기한부 서류반송 = 인수예정일 1개월까지 미인수 / 조기상환·일부입금 = 별도 룰",
      },
      {
        label: "부도처리 유예 사유 점검",
        detail:
          "영업점장 채권보전 OK(1개월 이내) / 금융기관 공동협약(협약기간) / 수출신용보증·단기수출보험(보험대금 수령일)",
      },
      {
        label: "일부 입금된 경우",
        detail:
          "미입금액이 매입금액의 10% 이내 + 미화 1만불 이하, 또는 미화 500불 이하면 부도처리 제외 가능",
      },
    ],
    procedure: [
      "부도 사유·금액 확인",
      "유예 사유 점검 → 해당 시 유예 처리",
      "해당 안 되면 부도처리 등록",
      "수출상 외환한도계좌 → 연체계좌 전환 (필요 시)",
      "사후관리 — 무역보험공사·보증보험 등 청구",
    ],
    cautions: [
      "수출신용보증 또는 대금청구권이 당행 앞 양도된 단기수출보험에 부보된 경우 = 보험대금 수령일까지 유예",
      "조기상환은 운송서류 접수일에 부도처리. 단, 서류접수일로부터 2영업일 이내 보완 발송으로 하자 해소 가능 시 제외",
    ],
    scripts: [
      "「부도 통보가 들어왔어요. 단기수출보험에 부보돼 있으면 보험대금 청구로 처리 가능합니다.」",
      "「영업점장님이 채권보전에 문제없다고 판단하시면 1개월 유예 가능해요.」",
    ],
    relatedGuides: [
      { label: "수출 신용장 가이드 — 부도처리", href: "/guide/trade-finance/export-lc" },
    ],
    source: "연수교재 Section 3 부도처리 대상·시기·유예",
  },

  {
    id: "export-lc-lost",
    category: "export",
    subCategory: "lc-issue",
    title: "수출 신용장 분실·훼손 재발급",
    customerSays: "받은 신용장 원본을 잃어버렸어요 / 훼손됐어요.",
    summary: "분실신고 → 주무부서 통해 국내 각 외국환은행에 통보 → '원본대조필' 사본 교부.",
    whatToBring: [
      "분실신고서 (분실인 경우)",
      "훼손된 원본 (훼손인 경우)",
    ],
    checklist: [
      { label: "분실 사유 확인" },
      { label: "주무부서를 통한 국내 각 외국환은행 통보 절차" },
    ],
    procedure: [
      "분실신고서 또는 훼손된 원본 접수",
      "주무부서를 통해 국내 각 외국환은행에 동 사실 통보",
      "분실재발급 / 훼손재발급: '원본대조필' 날인된 사본 교부",
    ],
    cautions: [
      "분실재발급은 사본이라 원본 자체는 더 이상 효력 없음 — 매입은행은 사본 기준으로 진행",
    ],
    scripts: [
      "「분실신고서 먼저 받을게요. 국내 다른 외국환은행에 통보가 들어가야 해서 시간이 좀 걸려요.」",
      "「재발급은 '원본대조필' 도장 찍은 사본으로 드립니다.」",
    ],
    relatedGuides: [
      { label: "수출 신용장 가이드 — 분실·훼손", href: "/guide/trade-finance/export-lc" },
    ],
    source: "연수교재 Section 3 신용장 분실·훼손",
  },

  {
    id: "export-lc-amendment",
    category: "export",
    subCategory: "lc-amend",
    title: "수출 신용장 조건변경 통지 받음",
    customerSays: "신용장 조건변경 통지가 들어왔어요.",
    summary:
      "수익자(수출상)에게 변경 내용 교부. 부분 동의 불가, 전체 승낙 또는 거절 중 택일.",
    whatToBring: ["수익자 동의 의사 표시"],
    checklist: [
      {
        label: "변경 내용 전체 통지",
      },
      {
        label: "수익자 동의 의사 — 전체 승낙 / 거절 중 택일",
      },
      {
        label: "취소 시 「수출신용장 취소 동의(의뢰)서」 추가 징구 + 신용장 원본 회수",
      },
    ],
    procedure: [
      "조건변경 통지 도착 → 수익자에게 신용장 교부 절차에 따라 통지",
      "수익자 동의 의사 확인 (부분 동의 불가)",
      "동의 시 효력 발생 / 유보 시 불성립 (단, 변경 내용 일치 서류 제시 시 동의로 간주)",
      "취소 시 추가 동의서 + 원본 회수 + 개설은행 통보",
    ],
    cautions: [
      "부분적 수락 불가 — 어떠한 효력도 가지지 못함 (UCP 600 제10조 f항)",
      "수익자 동의 유보 + 변경 내용 일치 서류 제시 = 묵시적 동의로 간주",
    ],
    scripts: [
      "「조건변경 통지가 왔어요. 전체 받아들이시거나, 전체 거절하시거나 둘 중 하나만 가능합니다.」",
      "「동의 안 하셔도 변경된 조건에 맞는 서류 제시하시면 동의한 걸로 간주돼요.」",
      "「취소 시 동의서 추가로 받고 원본도 회수해야 해요.」",
    ],
    relatedGuides: [
      { label: "수출 신용장 가이드", href: "/guide/trade-finance/export-lc" },
      { label: "신용장 조건변경 가이드", href: "/guide/trade-finance/lc-amendment" },
    ],
    source: "연수교재 Section 3 조건변경 통지 + UCP 600 제10조",
  },
];
