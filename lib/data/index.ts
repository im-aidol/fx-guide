// fx/data.js → TypeScript 마이그레이션 진입점
// 4명이 영역 나눠 옮길 수 있도록 파일 분리

export { COUNTRIES } from "./countries";
export { PURPOSES } from "./purposes";

// 시나리오 트리 (창구 가이드)
export { REMITTANCE_SCENARIO } from "./scenarios/remittance";

// TODO: 추가 마이그레이션 영역
// export { SEND_CASES } from "./send-cases";
// export { OTHER_GUIDES } from "./other-guides";
// export { SENDER_TYPES } from "./sender-types";
// export { RECIPIENT_RELATIONS } from "./recipient-relations";
// export { FAQS } from "./faqs";
// export { GLOSSARY } from "./glossary";
// TODO: 시나리오 트리 추가 (환전, 신용장, 외화예금 등)
