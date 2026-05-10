import type { GlossaryTerm } from "../types";

// 외환규정 (재정경제부고시 제2026-69호) 제1-2조 "용어의 정의"를 영업점 친화 표현으로 풀어 정리.
// 본문 의미는 보존하되 "~라 함은", "~을 말한다", "~을 영위하는 자" 같은 법률 문체는 다듬음.
// 정확한 원문이 필요하면 source(예: "외환규정 1-2조 29호")로 PDF 본문 확인.

export const GLOSSARY: GlossaryTerm[] = [
  // ─────────── 거주성 ───────────
  {
    id: "overseas-korean",
    term: "재외동포",
    category: "거주성",
    source: "외환규정 1-2조 29호",
    definition:
      "다음 셋 중 하나에 해당. (가) 해외이주자로서 외국 국적 취득자, (나) 한국 국민으로서 외국 영주권 또는 이에 준하는 자격 취득자, (다) 한국 국적 보유했던 자(정부 수립 전 국외 이주자 포함) 또는 그 직계비속(현재 한국 국적 X).",
  },
  {
    id: "emigrant-expense",
    term: "해외이주비",
    category: "송금경비",
    source: "외환규정 1-2조 41호",
    definition:
      "해외이주자(해외이주법 등으로 해외이주가 인정된 자)가 지급할 수 있는 경비.",
  },
  {
    id: "overseas-traveler",
    term: "해외여행자",
    category: "송금경비",
    source: "외환규정 1-2조 40호",
    definition:
      "거주자인 외국 체재자로 셋으로 구분.\n• **해외체재자**: 30일 초과 외국 체재 (상용·문화·공무·기술훈련, 6월 미만 국외연수, 또는 국내기업 근무 중인 5년 미만 외국인거주자)\n• **해외유학생**: 외국 교육·연구·연수기관에서 6월 이상 수학 (국민 또는 국내거주 5년 이상 외국인 / 유학경비를 부담하는 부·모가 국민인 거주자)\n• **일반해외여행자**: 위 둘 외 거주자",
    related: ["overseas-travel-expense"],
  },
  {
    id: "overseas-travel-expense",
    term: "해외여행경비",
    category: "송금경비",
    source: "외환규정 1-2조 39호",
    definition: "해외여행자가 지급할 수 있는 외국 여행 관련 경비.",
    related: ["overseas-traveler"],
  },

  // ─────────── 외국환은행 ───────────
  {
    id: "fx-bank",
    term: "외국환은행",
    category: "외국환은행",
    source: "외환규정 1-2조 16호",
    definition:
      "외국환업무를 하는 국내 금융회사 영업소 (외환거래법 시행령 14조 1호 규정).",
  },
  {
    id: "fx-bank-payment",
    term: "외국환은행을 통한 지급등",
    category: "외국환은행",
    source: "외환규정 1-2조 17호",
    definition:
      "외국환은행을 통해 지급·추심·수령하거나, 외국환은행 내 계정 간 이체로 지급등을 처리하는 것.",
  },
  {
    id: "designated-fx-bank",
    term: "지정거래외국환은행",
    category: "외국환은행",
    source: "외환규정 1-2조 35호",
    definition:
      "거래 당사자가 사후관리·한도관리를 위해 지정한 외국환은행.",
  },

  // ─────────── 환율 ───────────
  {
    id: "matching-rate",
    term: "매매기준율",
    category: "환율",
    source: "외환규정 1-2조 7호",
    definition:
      "통화별로 산출 방식이 다름.\n• **미화·위안화**: 외국환중개회사를 통해 거래된 현물환매매 중 익익영업일 결제거래의 시장평균환율 (9:00~15:30 KST 거래량 가중평균)\n• **그 외 통화**(재정된 매매기준율): 미화 외 통화와 미화의 매매중간율을 미화 매매기준율로 재정한 율",
  },
  {
    id: "usd",
    term: "미화",
    category: "환율",
    source: "외환규정 1-2조 8호",
    definition:
      "미합중국 통화. 따로 정한 경우 외엔 미화 표시금액은 그 상당액의 다른 통화 표시금액도 포함.",
  },
  {
    id: "cny",
    term: "위안화",
    category: "환율",
    source: "외환규정 1-2조 24의2호",
    definition: "중화인민공화국 통화.",
  },

  // ─────────── 거래 ───────────
  {
    id: "head-branch-tx",
    term: "본지사간 거래",
    category: "거래",
    source: "외환규정 1-2조 9호",
    definition:
      "국내 본점 둔 한국 기업과 그 해외지사·현지법인 간 거래.",
  },
  {
    id: "forward-fx",
    term: "선물환거래",
    category: "거래",
    source: "외환규정 1-2조 11호",
    definition:
      "매매계약일 3영업일 이후 미리 약정한 환율로 외화를 매매·결제. (자본시장법상 파생상품시장·해외파생상품시장 거래는 제외)",
  },
  {
    id: "trade",
    term: "무역·수입·수입실적·수출·수출실적",
    category: "거래",
    source: "외환규정 1-2조 12호",
    definition: "대외무역법에서 정한 정의를 그대로 따름.",
  },
  {
    id: "permitted-tx",
    term: "인정된 거래",
    category: "신고제출",
    source: "외환규정 1-2조 25호",
    definition:
      "법·시행령·이 규정에 따라 신고등 또는 보고를 했거나, 신고가 면제된 거래.",
  },
  {
    id: "notification-etc",
    term: "신고등",
    category: "신고제출",
    source: "외환규정 1-2조 13호",
    definition:
      "허가·신고수리·신고·확인·인정 절차의 통칭.",
  },

  // ─────────── 지급수단 ───────────
  {
    id: "payment-means",
    term: "지급수단",
    category: "지급수단",
    source: "외환규정 1-2조 34호",
    definition:
      "정부지폐·은행권·주화·수표·우편환·신용장·환어음·약속어음·상품권·우편/전신 지급지시 + 전자화폐·선불전자지급수단. (액면 초과 매매 금화는 주화에서 제외)",
  },
  {
    id: "payment",
    term: "지급등",
    category: "신고제출",
    source: "외환규정 1-2조 33-1호",
    definition: "외환거래법상 지급 또는 수령.",
  },
  {
    id: "credit-card-etc",
    term: "신용카드등",
    category: "지급수단",
    source: "외환규정 1-2조 13-3호",
    definition:
      "여신전문금융업법상 신용·직불·선불·여행자카드, 또는 외국환은행이 발급한 현금인출 기능 카드.",
  },
  {
    id: "traveler-card",
    term: "여행자카드",
    category: "지급수단",
    source: "외환규정 1-2조 14호",
    definition:
      "외국환은행이 미리 받은 대금에 상당하는 외화금액을 기록(전자·자기적 방식)·발행한 증표. 매입자가 그 한도 안에서 현금 인출이나 물품·용역 결제 가능.",
  },

  // ─────────── 기관 ───────────
  {
    id: "fx-broker",
    term: "외국환중개회사",
    category: "기관",
    definition:
      "외국환중개업 인가를 받은 회사. 매매기준율 산출의 거래 처리 주체. (1-2조 7호 매매기준율 정의에서 인용)",
  },
  {
    id: "institutional-investor",
    term: "기관투자가",
    category: "기관",
    source: "외환규정 1-2조 4호",
    definition:
      "자본시장법 시행령 10조 ②의 금융기관(외국 금융기관 제외) + 집합투자기구 + 일부 자본시장법상 자 + 체신관서.",
  },
  {
    id: "public-institution",
    term: "공공기관",
    category: "기관",
    source: "외환규정 1-2조 28호",
    definition: "공공기관운영법에 의해 지정된 공공기관.",
  },
  {
    id: "cls-bank",
    term: "외환동시결제시스템 (CLS)",
    category: "기관",
    source: "외환규정 1-2조 20호",
    definition:
      "매도통화·매입통화 동시결제로 외환결제리스크를 줄이는 결제시스템. CLS Bank International이 운영.",
  },

  // ─────────── 파생상품 ───────────
  {
    id: "credit-linked-note",
    term: "신용파생결합증권",
    category: "파생상품",
    source: "외환규정 1-2조 13-1호",
    definition:
      "신용사건 발생 시 신용위험을 거래상대방에 전가하는 증권. Credit Linked Note, Synthetic CDO/CLO 등.",
  },
  {
    id: "credit-derivative",
    term: "신용파생상품",
    category: "파생상품",
    source: "외환규정 1-2조 13-2호",
    definition:
      "신용위험을 기초자산으로 하는 자본시장법상 파생상품.",
  },
  {
    id: "fx-derivative",
    term: "외환파생상품",
    category: "파생상품",
    source: "외환규정 1-2조 20-2호",
    definition: "외국통화를 기초자산으로 하는 자본시장법상 파생상품.",
  },
  {
    id: "fx-margin-tx",
    term: "외환증거금거래",
    category: "파생상품",
    source: "외환규정 1-2조 20-1호",
    definition:
      "통화 실제 인수도 없이 거래증거금만 예치하고, 환율변동·통화 간 이자율 격차로 손익을 정산하는 거래.",
  },
  {
    id: "exchange-derivative",
    term: "장내파생상품",
    category: "파생상품",
    source: "외환규정 1-2조 27-1호",
    definition:
      "자본시장법상 파생상품시장 또는 해외파생상품시장에서 거래되는 파생상품.",
  },
  {
    id: "otc-derivative",
    term: "장외파생상품",
    category: "파생상품",
    source: "외환규정 1-2조 27-2호",
    definition: "장내파생상품이 아닌 자본시장법상 파생상품.",
  },
  {
    id: "non-cleared-otc-margin",
    term: "비청산 장외파생상품거래 증거금 교환등",
    category: "파생상품",
    source: "외환규정 1-2조 27-3호 (2026-69호 신설)",
    definition:
      "금융회사가 비청산 장외파생상품거래 증거금을 거래상대방과 교환하기 위해 제3 보관기관 방식(담보 신탁 포함)으로 제공·반환하는 거래. 담보권 실행 시 보관기관을 통한 이전도 포함.",
  },

  // ─────────── 현지금융 ───────────
  {
    id: "local-finance",
    term: "현지금융",
    category: "현지금융",
    source: "외환규정 1-2조 42호",
    definition:
      "거주자(개인 거주자, 금융기관, 현지법인금융기관 등은 제외)가 외국에서 사용 목적으로 외국에서 자금을 차입(증권발행 포함)하거나 지급보증을 받는 것.",
  },
  {
    id: "local-corp",
    term: "현지법인",
    category: "현지금융",
    source: "외환규정 1-2조 43호",
    definition: "이 규정에 따라 신고등 후 외국에 설립한 법인.",
  },
  {
    id: "local-fin-corp",
    term: "현지법인금융기관",
    category: "현지금융",
    source: "외환규정 1-2조 44호",
    definition:
      "금융위원회의 해외진출 규정에 따라 신고등 후 설립한 외국 법인 (금융·보험업 영위).",
  },
  {
    id: "lct",
    term: "현지통화 직거래(LCT) 체제",
    category: "현지금융",
    source: "외환규정 1-2조 47호",
    definition:
      "한국과 특정국 합의로 무역거래 등에 원화·상대국 통화를 사용할 수 있는 시스템.",
  },
  {
    id: "lct-bank-kr",
    term: "한국 현지통화 직거래은행",
    category: "현지금융",
    source: "외환규정 1-2조 47-1호",
    definition:
      "한국은행총재가 지정하고 상대국 중앙은행이 확인한 국내 외국환은행. 합의된 범위에서 원화·상대국 통화 거래 수행.",
  },
  {
    id: "lct-bank-foreign",
    term: "상대국 현지통화 직거래은행",
    category: "현지금융",
    source: "외환규정 1-2조 47-2호",
    definition:
      "상대국 중앙은행이 지정하고 한국은행총재가 확인한 상대국 외국 금융기관. 합의된 범위에서 원화·상대국 통화 거래 수행.",
  },

  // ─────────── 수입금융 ───────────
  {
    id: "inland-import-usance",
    term: "내국수입유산스",
    category: "수입금융",
    source: "외환규정 1-2조 45호",
    definition:
      "외국환은행이 기한부수입신용장 개설 후, 외국 수출업자 발행 수출환어음을 인수·매입하거나 수입인수금융을 통해 어음기간 동안 국내 수입업자에게 공여하는 신용.",
  },
  {
    id: "import-acceptance-finance",
    term: "수입인수금융",
    category: "수입금융",
    source: "외환규정 1-2조 45-1호 (2025-4호 신설)",
    definition:
      "외국환은행이 국내·외 금융기관에 차입을 통해 수입대금 결제대행을 위탁함으로써 국내 수입업자에게 신용을 제공하는 것.",
  },

  // ─────────── 기타 ───────────
  {
    id: "gap-eulkijeum",
    term: "갑기금·을기금",
    category: "기타",
    source: "외환규정 1-2조 1호",
    definition: "은행업감독규정에서 정하는 갑기금·을기금.",
  },
  {
    id: "kabkap-account",
    term: "갑갑계정",
    category: "기타",
    source: "외환규정 1-2조 46호",
    definition:
      "은행업감독업무시행세칙 별표4-1의 국외본지점 갑계정 중 만기 1년을 초과하는 자금.",
  },
  {
    id: "affiliate",
    term: "계열회사",
    category: "기타",
    source: "외환규정 1-2조 2호",
    definition: "독점규제·공정거래법 2조에서 정한 계열회사.",
  },
  {
    id: "lending-to-koreans-abroad",
    term: "교포등에 대한 여신",
    category: "기타",
    source: "외환규정 1-2조 3호",
    definition:
      "국내 본점 외국환은행의 해외지점·현지법인금융기관이 다음에 제공하는 여신. ① 외국 거주자(일반해외여행자 제외) ② 국민인비거주자 ③ 국민인비거주자가 100% 출자해 외국에 설립한 법인.",
  },
  {
    id: "fin-insurance",
    term: "금융·보험업",
    category: "기타",
    source: "외환규정 1-2조 3-1호",
    definition: "한국표준산업분류표상 금융·보험업 (국가데이터처 고시).",
  },
  {
    id: "short-term-fx",
    term: "단기외화자금",
    category: "기타",
    source: "외환규정 1-2조 5호",
    definition:
      "두 가지 중 하나.\n(가) 자금인출일로부터 1년 이내 상환 외화자금 (증권발행은 1년 미만, 주식예탁증서 제외)\n(나) 1년 초과 차입 중 자금인출일로부터 1년 이내 분할·중도·조기상환 권리가 있는 외화자금 (단 평균차입기간이 1년 초과이고 1년 이내 상환금액이 총차입금액의 20% 이하면 제외)",
  },
  {
    id: "goods",
    term: "물품",
    category: "기타",
    source: "외환규정 1-2조 6호",
    definition: "지급수단·증권·채권 표시 서류 외의 동산.",
  },
  {
    id: "real-estate-related",
    term: "부동산 관련업",
    category: "기타",
    source: "외환규정 1-2조 10호",
    definition: "부동산 임대업·분양공급업·골프장 운영업.",
  },
  {
    id: "general-commodity",
    term: "일반상품",
    category: "기타",
    source: "외환규정 1-2조 13-4호",
    definition: "자본시장법 4조 ⑩3호에 따른 기초자산.",
  },
  {
    id: "offshore-fin-co",
    term: "역외금융회사",
    category: "기타",
    source: "외환규정 1-2조 15호",
    definition:
      "직접 또는 자회사 등을 통해 증권·채권·파생상품에 투자해 수익을 얻는 외국법 설립 회사. 설립지에 실질 영업소를 두지 않은 회사.",
  },
  {
    id: "ocean-shipping",
    term: "외항운송업자",
    category: "기타",
    source: "외환규정 1-2조 18호",
    definition:
      "해운법·항공법·화물유통촉진법상 허가·면허·신고·등록한 자 중 다음 어느 하나.\n• 외국항로 취항 국내 항공·선박회사\n• 외국 선박·항공회사 대리업무 (해운대리점·항공화물운송대리점·항공운송총대리점·국내지사 포함)\n• 복합운송주선업자\n• 선박관리업자",
  },
  {
    id: "fx-acquisition",
    term: "외화획득실적",
    category: "기타",
    source: "외환규정 1-2조 19호",
    definition:
      "다음에 의한 외화획득실적.\n(가) 대외무역법상 인정 수출실적\n(나) 주한 UN군·외국군기관에 물품매각·공사수급·용역제공\n(다) 관광진흥법상 관광사업\n(라) 해외건설·용역사업\n(마) 외항운송사업\n(바) 그 외 인정된 거래",
  },
  {
    id: "service",
    term: "용역",
    category: "기타",
    source: "외환규정 1-2조 21호",
    definition:
      "기술원조, 뉴스/정보 제공, 흥행(필름상영권 제공 포함), 항만작업·시설 제공, 선박·항공기 수리, 대리·은행·보험·보관·운수, 그 외 타인을 위한 노무·편의·오락 제공.",
  },
  {
    id: "deep-sea-fishing",
    term: "원양어업자",
    category: "기타",
    source: "외환규정 1-2조 22호",
    definition:
      "외국 항구를 어업 근거지로 삼거나 모선식어업·국내항구 근거 독항식어업 영위자 중 수산업법상 해양수산부장관이 인정하는 자.",
  },
  {
    id: "krw-linked-fx-securities",
    term: "원화연계외화증권",
    category: "기타",
    source: "외환규정 1-2조 23호",
    definition:
      "표시통화 또는 결정통화·결제통화 중 어느 하나가 원화인 외화증권.",
  },
  {
    id: "krw-securities",
    term: "원화증권",
    category: "기타",
    source: "외환규정 1-2조 24호",
    definition: "표시통화·결정통화·결제통화 모두 원화인 증권.",
  },
  {
    id: "bid-bond-etc",
    term: "입찰보증등",
    category: "기타",
    source: "외환규정 1-2조 26호",
    definition:
      "입찰보증·계약이행보증·하자보증·착수금/선수금 환급보증 등 보증금 지급에 갈음하는 보증.",
  },
  {
    id: "cash-pooling",
    term: "자금통합관리",
    category: "기타",
    source: "외환규정 1-2조 27호",
    definition:
      "국내기업 또는 외국인투자기업이 현지법인·외국본사(계열회사 포함)와 자금공유계약을 맺고, 외화예금·차입·담보·대차거래로 참여기업 간 잉여·부족자금을 통합관리.",
  },
  {
    id: "main-creditor-bank",
    term: "주채권은행·주채무계열 소속 기업체",
    category: "기타",
    source: "외환규정 1-2조 31호",
    definition:
      "은행업감독규정에서 정하는 주채권은행·주채무계열 소속 기업체.",
  },
  {
    id: "sme",
    term: "중소기업",
    category: "기타",
    source: "외환규정 1-2조 32호",
    definition: "중소기업기본법상 중소기업.",
  },
  {
    id: "securities-acquisition",
    term: "증권의 취득",
    category: "기타",
    source: "외환규정 1-2조 33호",
    definition:
      "증권 또는 증권에 부여된 전환권·신주인수권·교환권 등 권리 취득. (담보권은 제외)",
  },
  {
    id: "claim-occurrence",
    term: "채권의 발생등",
    category: "기타",
    source: "외환규정 1-2조 36호",
    definition:
      "채권·채무의 발생·변경·변제·소멸, 그리고 직접·간접 이전 등 처분 행위.",
  },
  {
    id: "specific-insurer",
    term: "특정보험사업자",
    category: "기타",
    source: "외환규정 1-2조 37호",
    definition:
      "무역보험법·산업재해보상보험법상 보험업을 영위하는 자.",
  },
  {
    id: "overseas-construction",
    term: "해외건설 및 용역사업",
    category: "기타",
    source: "외환규정 1-2조 38호",
    definition:
      "외국 건설공사·건설용역·항만용역·운송 등 직접 관련 용역 (현지 경비지출이 필요한 사업, 하도급 포함) + 대외무역법상 일괄수주방식 수출.",
  },
];
