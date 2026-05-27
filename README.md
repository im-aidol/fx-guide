# 외환 길잡이 (FX Desk Guide)

iM뱅크 영업점 직원이 창구 외환 업무를 처리할 때 빠르게 참조하는 가이드 웹 도구.
**1차 기준**: 외국환거래규정 (재정경제부고시 제2026-69호, 시행 2026.3.30.)

🌐 **배포 사이트**: https://fx-guide-eight.vercel.app

> ⚠️ 본 저장소는 공개되어 있습니다. 외환규정 등 공개 자료 기반.
> **본부 외환부서 매뉴얼 등 회사 내부 자료는 절대 commit 금지** — 한 번 push되면 git history에 영원히 남습니다.

---

## 1. 누가 어떻게 쓰나

| 역할 | 용도 | 권한 |
|---|---|---|
| **영업점 직원** | 창구 상담 중 실시간 참조 | 가이드·공지·FAQ·용어집 조회, 익명 Q&A 등록 |
| **본점 외환사업부** | 콘텐츠 작성·관리 | 모든 페이지 작성·수정·삭제, Q&A 답변, 본부 보충 안내 작성 |

좌측 사이드바의 **🏛️ 본점 / 🏢 영업점** 토글로 두 모드를 전환합니다. 로그인·인증은 구현하지 않고 UI 권한 분기만 시뮬레이션 (실제 도입 시 내부망 인증과 결합 예정).

---

## 2. 사이드바 — 업무 중심 그룹 구조

6대 외환 업무를 1차 메뉴로 묶고, 각 업무 안에 가이드·도구를 자식 항목으로 배치.

```
🏠 홈
📤 당발송금          — 당발송금 도우미 / 사유별 가이드
📥 타발 송금         — 타발 가이드 / 타발 송금 안내서
💱 환전              — 환전 가이드 / 통화 견본
📦 외화 배송         — 외화 배송 가이드
🏦 외화 예금·적금    — 외화 예금·적금 가이드
🏭 무역금융          — 무역금융 가이드
📣 공지사항
💬 익명 Q&A
❓ FAQ
📖 외환 용어집
```

현재 경로가 속한 그룹은 자동 펼침. 신규 업무(예: 수출입대출·외환대출·FX 트레이딩) 추가 시 [components/Sidebar.tsx](components/Sidebar.tsx)의 `NAV` 배열에 group 한 줄만 더하면 됩니다.

---

## 3. 핵심 화면

### 영업점 도구
- **당발송금 도우미** ([app/simulator](app/simulator)) — 고객 답변을 따라 클릭으로 좁혀가며 거래코드·한도·서류·통보 의무·응대 멘트까지 도출하는 트리식 가이드. 입력 금액 기준 임계값(USD 1만/5만/10만)을 자동 점검.
- **타발 송금 안내서** ([app/incoming](app/incoming)) — SWIFT/BIC, 영문 은행명·주소 + 고객 정보 입력 후 인쇄해서 송금자에게 전달.
- **통화 견본** ([app/samples](app/samples)) — 환전 매입·매도 가능 여부를 권종별 사진과 함께 확인. "매입·매도 모두 가능 → 매입만 가능 → 둘 다 불가" 순으로 자동 정렬.

### 본점 관리 기능
- **공지사항** ([app/notices](app/notices)) — 공지/가이드/정책변경 카테고리별 게시. 본점 모드에서만 작성 버튼 노출.
- **익명 Q&A** ([app/qna](app/qna)) — 영업점이 익명으로 질문, 본점이 답변. 답변 누적분은 향후 FAQ로 승격.
- **FAQ · 외환 용어집** ([app/faq](app/faq), [app/glossary](app/glossary)) — 본점 모드에서 항목 추가·수정·삭제·초기화.
- **본부 보충 안내** ([components/admin/AdminNote.tsx](components/admin/AdminNote.tsx)) — 홈·시뮬레이터·incoming·6대 가이드 등 거의 모든 페이지에 본점 전용 자유 메모 박스. 영업점에는 작성된 내용만 노란 박스로 노출.

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
npm run build      # 프로덕션 빌드
npm run lint       # ESLint
npx tsc --noEmit   # 타입 검사
```

---

## 5. 기술 스택

| | 선택 | 비고 |
|---|---|---|
| 프레임워크 | Next.js 16 (App Router) | Vercel 1급 지원 · 학습 데이터와 다를 수 있어 `node_modules/next/dist/docs/` 확인 권장 |
| 언어 | TypeScript | 외환규정 한도·거래코드 타입 안전성 |
| 스타일 | Tailwind CSS v4 | 유틸 클래스 + `@theme inline` 토큰 |
| 폰트·국기 | Pretendard, flag-icons | CDN 로드 (SVG 국기, 4:3 비율 강제) |
| 환율 | fawazahmed0/exchange-api | USD 기준 무료 API · **참고용**, 실제 거래는 iM뱅크 매매기준율 |
| 영속화 | localStorage (데모) | 본점이 편집한 콘텐츠는 브라우저 로컬에 영속화. 실제 도입 시 중앙 저장소 연동 필요 |
| 배포 | Vercel | GitHub `im-aidol/fx-guide` public repo 자동 PR 프리뷰 |

> ⚠️ Next.js 16은 학습 데이터 시점과 다릅니다. 변경이 의심되면 `node_modules/next/dist/docs/`를 직접 확인하세요. [AGENTS.md](AGENTS.md) 참조.

---

## 6. 디렉터리 구조

```
fx-next/
├── app/                       # App Router 라우트
│   ├── page.tsx               # / 홈 대시보드 (환율·SWIFT·한도·사유 필수국)
│   ├── simulator/             # 당발송금 도우미 (시나리오 트리)
│   ├── incoming/              # 타발 송금 안내서 (인쇄 가능)
│   ├── samples/               # 통화 견본 (권종별 매입/매도)
│   ├── guide/                 # 6대 업무 가이드
│   │   ├── send/ receive/ exchange/ delivery/ deposit/ trade-finance/
│   ├── notices/               # 공지사항 (본점 작성)
│   ├── qna/                   # 익명 Q&A
│   ├── faq/                   # FAQ (본점 CRUD)
│   └── glossary/              # 외환 용어집 (본점 CRUD)
├── components/
│   ├── Sidebar.tsx            # 업무 그룹 사이드바 + ModeToggle
│   ├── Mode.tsx               # 본점/영업점 모드 Context
│   ├── Flag.tsx               # 공통 SVG 국기
│   ├── admin/
│   │   ├── AdminBadge.tsx     # 페이지 상단 현재 권한 칩
│   │   └── AdminNote.tsx      # 본부 보충 안내 박스
│   └── scenario/              # 시뮬레이터 트리 엔진
├── lib/
│   ├── types.ts               # 도메인 타입 (Country·Purpose·Faq·...)
│   ├── data/                  # 1차 자료 기반 정적 데이터
│   │   ├── countries.ts purposes.ts faqs.ts glossary.ts
│   │   ├── business-guide.ts business-areas.ts deposit-products.ts
│   │   ├── currency-samples.ts notices-seed.ts qna-seed.ts
│   │   └── scenarios/remittance.ts
│   ├── hooks/
│   │   └── useEditableList.ts # localStorage CRUD 제네릭 hook
│   └── exchange-rates.ts      # fawazahmed0 환율 페치
├── public/
│   └── currency-samples/      # 통화 견본 사진 (USD/JPY/EUR 19장)
├── CLAUDE.md                  # Claude Code 작업 컨텍스트
├── AGENTS.md                  # Next.js 16 주의사항
└── README.md                  # (이 파일)
```

---

## 7. 콘텐츠 추가 가이드 (본점 외환사업부)

- **공지·가이드 글** → `/notices` 본점 모드에서 작성
- **익명 Q&A 답변** → `/qna` 본점 모드에서 답변 작성
- **FAQ·용어 추가** → `/faq`, `/glossary` 본점 모드에서 인라인 폼
- **통화 견본 매입/매도 정책** → `/samples` 통화 선택 → "✏️ 이 통화 편집"
- **임시 안내 한 줄** → 어느 페이지든 본점 모드일 때 노란 "본부 보충 안내" 박스 "+ 작성"

> 모든 편집은 브라우저 로컬(localStorage)에 영속화됩니다. 실제 도입 시 내부망 인증·중앙 저장소·이력 관리 별도 수립 필요.

---

## 8. 외환규정 준수 원칙 (절대 변경 금지)

- 모든 거래코드·한도·신고요건은 **외환규정 원문** 기준 (2026-69호, 2025-4호·2025-57호 개정 반영)
- iM뱅크 홈페이지와 외환규정이 다르면 **외환규정 우선**
- 임의로 코드·한도 변경 금지 — 변경 시 본문 직접 대조
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
