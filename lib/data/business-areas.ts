// 6대 업무 진입판 — 영업점 직원이 창구에서 첫 분기하는 큰 카테고리.
// "어떤 일로 오셨어요?" 의 답이 곧 이 6개 중 하나.
// (외화 배송은 환전 안의 비대면 수령 채널로 통합되어 6대에서 제외 — 자리에 FAQ 진입.)

export type BusinessArea =
  | "send"
  | "receive"
  | "exchange"
  | "deposit"
  | "faq"
  | "trade-finance";

export type BusinessAreaInfo = {
  id: BusinessArea;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  href: string;
};

export const BUSINESS_AREAS: BusinessAreaInfo[] = [
  {
    id: "send",
    title: "당발송금",
    subtitle: "한국 → 해외",
    icon: "📤",
    description:
      "당발송금 도우미(시뮬레이터)·사유별 가이드·거래코드·신청서 안내까지 한 곳에서.",
    href: "/guide/send",
  },
  {
    id: "receive",
    title: "송금 받기",
    subtitle: "타발 송금 (해외 → 한국)",
    icon: "📥",
    description:
      "iM SWIFT(DAEBKR22) 안내, 5천불·10만불·1만불 임계, WU 수령.",
    href: "/guide/receive",
  },
  {
    id: "exchange",
    title: "환전 (외화 매매)",
    subtitle: "사기 / 팔기 · 통화 견본 · 외화 배송 · 환전 계산기",
    icon: "💱",
    description:
      "환전 계산기·환율 산출 안내·통화 견본·외화 배송까지 환전 안에서 한 번에.",
    href: "/guide/exchange",
  },
  {
    id: "deposit",
    title: "외화 통장·적금",
    subtitle: "예금·적금·자동이체",
    icon: "🏦",
    description:
      "글로벌외화종합통장 + 외화 적금 4종 (iM·IDREAM·ForYou·PlusYou).",
    href: "/guide/deposit",
  },
  {
    id: "faq",
    title: "FAQ · 외환 용어집",
    subtitle: "빠른 답변 · 용어 확인",
    icon: "❓",
    description:
      "자주 묻는 질문 + 외환규정 1-2조 본문 인용 용어집. 키워드 검색으로 즉답.",
    href: "/faq",
  },
  {
    id: "trade-finance",
    title: "무역금융",
    subtitle: "신용장·수출입대금",
    icon: "🏭",
    description:
      "외국환거래약정서·전자무역업무 약관 기반. 신용장(LC) 및 수출입.",
    href: "/guide/trade-finance",
  },
];
