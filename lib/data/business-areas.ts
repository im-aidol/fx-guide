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
      "해외송금 시뮬레이션과 사유별 가이드, 송금 방식 안내를 도와드릴게요",
    href: "/guide/send",
  },
  {
    id: "receive",
    title: "타발송금",
    subtitle: "해외 → 한국",
    icon: "📥",
    description:
      "iM뱅크 SWIFT CODE 안내와 웨스턴유니온 수령 도와드릴게요",
    href: "/guide/receive",
  },
  {
    id: "exchange",
    title: "환전",
    subtitle: "외화 매입 / 매도",
    icon: "💱",
    description:
      "환율 계산기, 통화 견본, 외화 환전 서비스 안내해드려요",
    href: "/guide/exchange",
  },
  {
    id: "deposit",
    title: "외화 예적금",
    subtitle: "예금·적금·자동이체",
    icon: "🏦",
    description:
      "당행 외화 예적금 상품 안내해드려요 (For You, Plus You 등)",
    href: "/guide/deposit",
  },
  {
    id: "trade-finance",
    title: "무역금융",
    subtitle: "신용장·수출입대금",
    icon: "🏭",
    description:
      "외국환거래약정서, 전자무역업무 약관 기반해서 신용장 및 수출입에 대해 알려드려요",
    href: "/guide/trade-finance",
  },
  {
    id: "faq",
    title: "FAQ · 외환 용어집",
    subtitle: "빠른 답변 · 용어 확인",
    icon: "❓",
    description:
      "외환 업무에서 궁금한 용어집과 자주 묻는 질문에 대해 답해드려요",
    href: "/faq",
  },
];
