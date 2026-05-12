// 6대 업무 진입판 — 영업점 직원이 창구에서 첫 분기하는 큰 업무 카테고리.
// "어떤 일로 오셨어요?" 의 답이 곧 이 6개 중 하나.

export type BusinessArea =
  | "send"
  | "receive"
  | "exchange"
  | "deposit"
  | "delivery"
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
    title: "송금 보내기",
    subtitle: "당발 송금 (한국 → 해외)",
    icon: "📤",
    description:
      "고객 사유 따라 거래코드·서류·한도 빠른 참조. 사유 모를 땐 시뮬레이터.",
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
    subtitle: "사기 / 팔기",
    icon: "💱",
    description: "외화 매매(BuyAndSell) 서비스 안내. 매매기준율 적용.",
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
    id: "delivery",
    title: "외화 배송·기프티콘",
    subtitle: "비대면 외화 수령",
    icon: "📦",
    description: "iM외화배송 서비스 + 외화 기프티콘 (외화수령증).",
    href: "/guide/delivery",
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
