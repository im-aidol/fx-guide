# 외환 길잡이 (FX Desk Guide)

iM뱅크 영업점 직원이 창구 외환 업무를 처리할 때 빠르게 참조하는 가이드 웹 도구.
**1차 기준**: 외국환거래규정 (재정경제부고시 제2026-69호, 시행 2026.3.30.) + UCP 600 · ISBP 745 · URC 522 · INCOTERMS 2020.

🌐 **배포 사이트**: https://fx-guide-eight.vercel.app

> ⚠️ 본 저장소는 공개되어 있습니다. 외환규정·UCP·약관 등 공개 자료 기반.
> **본부 외환부서 매뉴얼·연수교재 등 회사 내부 자료는 절대 commit 금지** — 한 번 push되면 git history에 영원히 남습니다. (회사 내부 PDF 추출본은 [.gitignore](.gitignore)로 차단)

---

## 1. 두 사용자

| 역할 | 용도 | 권한 |
|---|---|---|
| **영업점 직원** | 창구 상담 중 실시간 참조 | 모든 가이드·도구 조회, 익명 Q&A 등록 |
| **본점 외환사업부** | 콘텐츠 작성·관리 | 시나리오·FAQ·용어집·공지·통화 정책·커스텀 메뉴 등 CRUD, Q&A 답변, 본부 보충 안내 작성 |

상단 바 우측의 **🏛️ 본점 / 🏢 영업점** 토글로 두 모드를 전환합니다. 로그인·인증은 구현하지 않고 UI 권한 분기만 시뮬레이션 — 실제 도입 시 내부망 인증·중앙 저장소와 결합 예정.

---

## 2. 상단 바 메뉴 구조

홈 + 6대 외환 업무 그룹 + 자료·공지 그룹. 각 그룹에 hover 시 자식 메뉴 드롭다운.

```
🏠 홈
📤 당발송금          — 도우미 / 사유별 / SWIFT / BARO / WU
📥 타발 송금         — SWIFT 수취정보 / 임계값 / WU 수령 / 인쇄용 안내서
💱 환전              — 계산기 / 환율 산출 / 통화 견본 / E-지갑 / 외화 배송 / 기프티콘 / GLN
🏦 외화 예금·적금    — 글로벌통장 / 수시입출 / 기간예치 / 자유적립 / 자동이체 / 이자 시뮬 / 전체 검색
🏭 무역금융          — 영업점 도우미 / 상황별 가이드 / 개요 / 수입LC / 수출LC / 추심 / TT수입금융 / 조건변경 / 흐름도(LC·추심) / 19필드 / 서류 ISBP / 하자 점검
📋 자료·공지         — 공지사항 / 익명 Q&A / FAQ / 외환 용어집
```

본점 모드에서는 "➕ 새 업무" 버튼으로 사용자 정의 그룹·페이지를 추가할 수 있습니다 ([app/guide/custom/[slug]](app/guide/custom/%5Bslug%5D)).

---

## 3. 핵심 화면

### 영업점 응대 도구 (창구에서 바로 쓰는 것)
- **당발송금 도우미** ([/simulator](app/simulator)) — 고객 답변을 따라 클릭으로 좁혀가며 거래코드·한도·서류·통보 의무·응대 멘트까지 도출하는 트리식 가이드. USD 1만/5만/10만 임계 자동 점검.
- **무역금융 영업점 도우미** ([/guide/trade-finance/desk](app/guide/trade-finance/desk)) — 좌측 sticky 시나리오 + 우측 상세 레이아웃. 수입/수출 → 시나리오 → 가져왔어야 할 서류·점검·절차·응대 멘트.
- **무역금융 상황별 가이드 (표)** ([/guide/trade-finance/cases](app/guide/trade-finance/cases)) — 17개 시나리오 검색·필터·정렬. 행 클릭 시 상세 페이지.
- **타발 송금 안내서 (인쇄용)** ([/guide/receive/print-card](app/guide/receive/print-card)) — SWIFT/BIC + 고객 정보 입력 후 인쇄해서 송금자에게 전달.
- **통화 견본** ([/samples](app/samples)) — 환전 매입·매도 가능 여부를 권종별 사진과 함께 확인.
- **환전 계산기** ([/guide/exchange/calculator](app/guide/exchange/calculator)) — 원화 ↔ 외화 즉시 환산.

### 학습·점검 도구
- **신용장 거래 흐름도** ([/guide/trade-finance/flow-lc](app/guide/trade-finance/flow-lc)) — 12단계 인터랙티브, 단계 클릭 시 행위 주체·서류·응대 멘트.
- **추심 거래 흐름도** ([/guide/trade-finance/flow-collection](app/guide/trade-finance/flow-collection)) — 8단계 D/P·D/A (URC 522).
- **신용장 19개 필드 가이드** ([/guide/trade-finance/lc-fields](app/guide/trade-finance/lc-fields)) — UCP 600·ISBP 745 조항 인용.
- **서류별 ISBP 가이드** ([/guide/trade-finance/document-guide](app/guide/trade-finance/document-guide)) — 환어음·상업송장·B/L·AWB·보험증권·원산지증명서 6종 탭.
- **신용장 하자 점검 도구** ([/guide/trade-finance/lc-checker](app/guide/trade-finance/lc-checker)) — 신용장 문구 붙여넣기 → 독소조항·불명확 용어 자동 매칭.

### 본점 관리 기능
- **공지사항** ([/notices](app/notices)) — 공지/가이드/정책변경 카테고리별 게시.
- **익명 Q&A** ([/qna](app/qna)) — 영업점 익명 질문, 본점 답변. 답변 누적분은 향후 FAQ로 승격.
- **FAQ · 외환 용어집** ([/faq](app/faq), [/glossary](app/glossary)) — 본점 모드 인라인 CRUD.
- **무역금융 시나리오 편집** ([components/trade/ScenarioEditor.tsx](components/trade/ScenarioEditor.tsx)) — `/desk` `/cases` `/cases/[id]`에서 본점이 시나리오 추가·수정·삭제·초기화.
- **본부 보충 안내** ([components/admin/AdminNote.tsx](components/admin/AdminNote.tsx)) — 거의 모든 페이지에 본점 전용 자유 메모 박스. 영업점은 작성된 내용만 노란 박스로 읽음.
- **커스텀 업무 추가** — TopNav의 "➕ 새 업무" → 그룹·페이지 신설, [/guide/custom/[slug]](app/guide/custom/%5Bslug%5D)에서 본문 편집.

---

## 4. 시작하기

```bash
npm install
npm run dev
```

→ http://localhost:3000

### 기본 명령어

```bash
npm run dev        # 개발 서버
npm run build      # 프로덕션 빌드 검증
npm run lint       # ESLint
npx tsc --noEmit   # 타입 검사
```

---

## 5. 기술 스택

| | 선택 | 비고 |
|---|---|---|
| 프레임워크 | Next.js 16 (App Router) | Vercel 1급 지원 · 학습 데이터와 다를 수 있어 `node_modules/next/dist/docs/` 확인 권장 |
| 언어 | TypeScript | 외환규정 한도·거래코드 타입 안전성 |
| 스타일 | Tailwind CSS v4 | 유틸 클래스 + `@theme inline` 토큰. `html { font-size: clamp(15px, 0.85vw + 8px, 21px) }` 자동 스케일 |
| 폰트·국기 | Pretendard, flag-icons | CDN 로드 (SVG 국기, 4:3 비율 강제) |
| 환율 (홈 패널·30일 추세) | ECB (Frankfurter API) | 무료·인증 불필요. **참고용**, 실제 거래는 iM뱅크 매매기준율 |
| 환율 (시뮬레이터·환전 도구) | fawazahmed0/exchange-api | 넓은 통화 커버리지가 필요한 곳에서 사용 |
| 영속화 | localStorage (시연용) | 본점 편집 콘텐츠는 브라우저 로컬에 영속화. 실제 도입 시 백엔드 필요 |
| 배포 | Vercel | GitHub `im-aidol/fx-guide` public repo 자동 PR 프리뷰 |

> ⚠️ Next.js 16은 학습 데이터 시점과 다릅니다. 변경이 의심되면 `node_modules/next/dist/docs/`를 직접 확인하세요. [AGENTS.md](AGENTS.md) 참조.

---

## 6. 디렉터리 구조

```
fx-next/
├── app/                                  # App Router 라우트 (47개)
│   ├── page.tsx                          # / 홈 (환율·SWIFT·한도·사유 필수국·최근 메뉴)
│   ├── simulator/                        # 당발송금 도우미
│   ├── samples/                          # 통화 견본
│   ├── notices/  qna/  faq/  glossary/   # 자료·공지 4종
│   └── guide/
│       ├── send/                         # 당발송금 — 진입판 + cases + channels/{swift,baro,wu}
│       ├── receive/                      # 타발송금 — 진입판 + swift/thresholds/wu/print-card
│       ├── exchange/                     # 환전 — 진입판 + calculator/info/e-wallet/gift/gln
│       ├── delivery/                     # 외화 배송
│       ├── deposit/                      # 외화 예금·적금 — 12개 상품 + 카테고리·시뮬·검색
│       ├── trade-finance/                # 무역금융 — 진입판 + 13개 자식 (도우미·상황별·LC·추심 등)
│       └── custom/[slug]/                # 본점이 만든 커스텀 페이지
├── components/
│   ├── TopNav.tsx                        # 상단 바 + hover 드롭다운 + 모드 토글
│   ├── Mode.tsx                          # 본점/영업점 Context
│   ├── HomeRatePanel.tsx                 # 홈 환율 카드 + 30일 추세 모달 트리거
│   ├── RateHistoryModal.tsx              # 30일 환율 그래프 모달
│   ├── RecentMenuBox.tsx                 # 홈 최근 방문 메뉴
│   ├── RouteTracker.tsx                  # 라우트 추적 (최근 메뉴용)
│   ├── Flag.tsx                          # 공통 SVG 국기
│   ├── admin/
│   │   ├── AdminBadge.tsx                # 페이지 상단 권한 칩
│   │   └── AdminNote.tsx                 # 본부 보충 안내 박스
│   ├── scenario/                         # 당발송금 시뮬레이터 트리 엔진
│   ├── trade/
│   │   ├── FlowChart.tsx                 # 신용장·추심 거래 흐름도 (12단계·8단계)
│   │   └── ScenarioEditor.tsx            # 본점 시나리오 편집 모달
│   ├── deposit/                          # 이자 시뮬레이터
│   └── exchange/                         # 환전 계산기
├── lib/
│   ├── types.ts                          # 도메인 타입 (Country·Purpose·Faq·Scenario·...)
│   ├── data/                             # 1차 자료 기반 정적 데이터
│   │   ├── countries.ts purposes.ts faqs.ts glossary.ts
│   │   ├── business-guide.ts business-areas.ts
│   │   ├── deposit-products.ts currency-samples.ts
│   │   ├── trade-finance.ts              # 무역금융 데이터 (INCOTERMS·LC 필드·흐름도·룰)
│   │   ├── trade-scenarios.ts            # 무역금융 영업점 응대 시나리오 17개
│   │   ├── notices-seed.ts qna-seed.ts
│   │   └── scenarios/remittance.ts       # 당발송금 시나리오 트리
│   ├── hooks/
│   │   ├── useEditableList.ts            # localStorage CRUD 제네릭 hook
│   │   ├── useEditableScenarios.ts       # 무역금융 시나리오 편집 hook
│   │   └── useRecentMenu.ts              # 최근 방문 메뉴
│   ├── exchange-rates.ts                 # fawazahmed0 환율 페치 (광범위 통화)
│   ├── exchange-rate-history.ts          # ECB (Frankfurter) — 홈 패널 + 30일 추세
│   └── custom-menus.ts                   # 본점 사용자 정의 메뉴
├── public/
│   └── currency-samples/                 # 통화 견본 사진 (USD/JPY/EUR 19장)
├── docs/
│   └── regulations/                      # 외환규정 본문 + 약관·신청서 (공개 자료)
├── CLAUDE.md                             # Claude Code 작업 컨텍스트
├── AGENTS.md                             # Next.js 16 주의사항
├── .gitignore                            # 회사 내부 PDF 추출본 차단
└── README.md                             # (이 파일)
```

라우트 인벤토리는 `npm run build` 결과로 자동 확인 가능.

---

## 7. 콘텐츠 추가 가이드 (본점 외환사업부)

| 무엇을 | 어디서 |
|---|---|
| **무역금융 시나리오 추가·수정·삭제** | `/guide/trade-finance/desk` `/cases` `/cases/[id]` — ➕ ✏️ 🗑️ ↺ 버튼 |
| **공지·정책변경 게시** | `/notices` 본점 모드에서 작성 |
| **익명 Q&A 답변** | `/qna` 본점 모드에서 답변 |
| **FAQ·용어 추가** | `/faq` `/glossary` 본점 모드 인라인 폼 |
| **통화 견본 매입/매도 정책** | `/samples` 통화 선택 → "✏️ 이 통화 편집" |
| **외화 예금·적금 상품 정보** | `/guide/deposit/*` 본점 모드 편집 |
| **새 업무 그룹·페이지** | TopNav "➕ 새 업무" → 자동으로 `/guide/custom/[slug]` 생성 |
| **임시 안내 한 줄** | 어느 페이지든 노란 "본부 보충 안내" 박스 "+ 작성" |

> **현재 영속화 한계**: 모든 본점 편집은 브라우저 localStorage에 저장됩니다 (시연용). 실제 본점→영업점 공유는 백엔드 도입 시 마이그레이션 필요.

---

## 8. 외환규정 준수 원칙 (절대 변경 금지)

- 모든 거래코드·한도·신고요건은 **외환규정 원문** 기준 (2026-69호, 2025-4호·2025-57호 개정 반영)
- 무역금융은 **UCP 600 · ISBP 745 · URC 522 · INCOTERMS 2020** 본문 기준
- iM뱅크 홈페이지와 외환규정이 다르면 **외환규정 우선**
- 임의로 코드·한도·조항 변경 금지 — 변경 시 본문 직접 대조
- **핀테크 송금 업체 언급 금지** (한패스·센트비·유트랜스퍼·Wise 등 — iM뱅크 창구 직원 전용)
- **의심거래보고(STR) 사실 누설 절대 금지** (특정금융정보법 제4조 제6항)
- 응대 멘트는 따뜻한 어조, 협박조·강압적 톤 금지

상세 작업 원칙은 [CLAUDE.md](CLAUDE.md) 참조.

---

## 9. 팀

**iM AI돌** (AI-DOL: AI-driven Digital Optimization Leaders) — iM뱅크 외환사업부 4인 기획자.
모두 Claude Code로 협업하며, 표준적이고 예측 가능한 패턴·타입 안정성·작은 컴포넌트 분리를 우선합니다.

---

## 10. 면책

본 자료는 영업점 직원 참고용입니다. 실제 거래 처리 시에는 본점 외환사업부 또는 외환규정 원문 확인이 필수입니다.
