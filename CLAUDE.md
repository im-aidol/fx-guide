@AGENTS.md

# 외환 길잡이 (FX Desk Guide) — Next.js 마이그레이션

## 1. 이 프로젝트가 뭔가

iM뱅크 영업점 직원이 외환 송금 거래를 처리할 때 빠르게 참조하는 가이드 웹사이트.
**1차 기준**: 외국환거래규정 (재정경제부고시 제2026-69호, 시행 2026.3.30. — 2025-4호·2025-57호 개정 사항 모두 포함)

규정 원문(PDF·추출 텍스트): [docs/regulations/](docs/regulations/) 에 보관 — Claude는 작업 시 항상 본문 직접 대조

## 2. 지금 어디까지 와 있나 (2026-05-10 기준)

- ✅ Next.js 스캐폴드 완료 (TypeScript + Tailwind v4 + App Router + ESLint)
- ✅ 5개 라우트 placeholder (`/`, `/simulator`, `/guide`, `/faq`, `/glossary`)
- ✅ 브랜드 색상 + Pretendard 폰트 적용 (globals.css)
- ✅ `lib/types.ts` 도메인 타입 정의
- ✅ `lib/data/` 빈 껍데기 (countries.ts, purposes.ts, index.ts)
- ⏳ **GitHub organization 생성 대기** (사용자가 직접 진행)
- ⏳ **데이터 마이그레이션** (fx/data.js → lib/data/*.ts)
- ⏳ **로직 마이그레이션** (fx/index.html의 `analyzeFlow()` → React 컴포넌트)

## 3. 팀 구성과 작업 방식 (중요)

- **4명 모두 기획자**, 코드 작성 경험 없음
- **모두 Claude Code로 작업** — 사람이 직접 코드 짜지 않음
- 따라서 Claude가 작업할 때:
  - **표준적이고 예측 가능한 패턴 선호** (Next.js의 컨벤션 따르기)
  - **타입 안정성으로 실수 방지** (특히 외환규정 한도/거래코드)
  - **컴포넌트는 작게 쪼개기** — 4명이 동시에 다른 파일 작업 가능하도록
  - **변경 사항은 commit 메시지 + PR description에서 충분히 설명**

## 4. 마이그레이션 원본 (`../fx/` 폴더)

이전 버전은 `c:/Users/iyoun/Documents/fx/` 에 있음 (v6.0). 단일 HTML + data.js 구조.
이 새 프로젝트로 옮기는 중. 원본은 **삭제하지 말 것** — 데이터/로직 참고용으로 보관.

핵심 파일:
- `../fx/index.html` (94KB) — HTML/CSS/JS 인라인. `analyzeFlow()`가 핵심 로직 (12개 섹션)
- `../fx/data.js` (54KB) — 모든 정적 데이터 (8 SEND_CASES, 13 PURPOSES, 22 COUNTRIES, 12 FAQS, 17 GLOSSARY 등)
- `../fx/CLAUDE.md` — 원본 프로젝트 컨텍스트 (외환규정 주의사항 포함, 반드시 읽을 것)
- `../fx/scenario_research_v2.md`, `../fx/fx_remittance_research.md` — 자료조사

## 5. 외환규정 준수 (절대 변경 금지)

원본 [../fx/CLAUDE.md](../fx/CLAUDE.md)의 규칙 그대로 적용:

### 임의 변경 금지
- 모든 거래코드/한도/신고요건은 외환규정 원문 기준
- 임의로 코드/한도 변경 금지 — 변경 시 반드시 원문 확인
- iM뱅크 홈페이지와 외환규정 차이 시 **외환규정 우선**

### 2025-4호·2025-57호 개정 자동 반영 (`analyzeFlow()` 마이그레이션 시)

⚠️ **2026-05-10 본문(2026-69호) 직접 검증 결과 반영**:
- 제4-6조(해외이주비 지급절차) ①~⑤항 **전부 삭제** (2025-4호) → 4-3조①9호로 흡수 (2025-57호 재구성, 거래외국환은행 지정 필수)
- 제4-7조(재외동포 국내재산 반출절차) ①~④항 **전부 삭제** (2025-4호) → 거주자 재외동포는 일반 거주자로 4-3조 처리, 비거주자 재외동포는 4-4조①8호 신설로 별도 처리
- 기존 CLAUDE.md에 있던 "해외이주비 + 영주권 신청 중" 분기는 **외환규정 본문 근거 없어 제거** — 영주권 신청 중인 자는 일반 거주자로 4-3조①1호 (연간 미화 10만불 미증빙) 적용

```ts
// 거주자 재외동포 + 재산반출 (4-7조 전부 삭제로 일반 거주자 처리)
if (purpose.id === 'overseas_korean' && sender.id === 'overseas_korean_resident') {
  result.transactionCode = '거주자 지급증빙서류 미제출 지급'; // ⚠️ 거래코드 명칭은 한은 외환전산망 자료로 재확인 필요
  result.legalBasis = '외환규정 제4-3조 (제4-7조는 2025-4호로 ①~④항 전부 삭제)';
}
```

상세 검증 노트: 메모리의 `project_branch_logic_verification.md` 참조.

### 핀테크 관련 내용 제외
iM뱅크 창구 직원 전용이므로:
- ❌ 한패스, 센트비, 유트랜스퍼, 트래블월렛, Wise 등 핀테크 송금 업체 언급 금지
- ❌ 소액해외송금업 일반 설명 금지
- ✅ 우리은행 바로바로해외송금 같은 **참고용 빠른 채널**은 언급 가능

### 안전 응대 멘트 원칙 (`generateScripts()` 마이그레이션 시)
- 따뜻하고 친근한 어조 ("~하세요", "~돼요")
- 협박조나 강압적 톤 금지
- 위반 가능성 안내 시 객관적 설명
- **의심거래보고(STR) 사실은 절대 고객에게 누설 금지** (특정금융정보법 제4조 제6항)

## 6. 기술 스택 결정

| | 선택 | 이유 |
|---|---|---|
| 프레임워크 | Next.js 16 App Router | Vercel 1급 지원, Claude 가장 익숙, 정적→동적 확장 가능 |
| 언어 | TypeScript | 외환규정 한도/거래코드 타입 안전성 |
| 스타일 | Tailwind CSS v4 | Claude가 utility class로 빠르게 조립 |
| 배포 | Vercel | PR 프리뷰 자동, Next 1급 지원 |
| 패키지 매니저 | npm | 기본값, 외부 의존성 최소화 |

⚠️ **Next.js 16은 학습 데이터 시점과 다름** — `node_modules/next/dist/docs/` 또는 공식 문서 확인 후 작성. AGENTS.md 참고.

## 7. 디렉터리 구조

```
fx-next/
├── app/                      # 라우트 (파일 = URL)
│   ├── layout.tsx            # 공통 레이아웃 + Navigation
│   ├── page.tsx              # / (홈)
│   ├── simulator/page.tsx    # /simulator (메인 도구)
│   ├── guide/page.tsx        # /guide
│   ├── faq/page.tsx          # /faq
│   ├── glossary/page.tsx     # /glossary
│   └── globals.css           # Tailwind + 브랜드 토큰
├── components/
│   └── Navigation.tsx        # 상단 네비
├── lib/
│   ├── types.ts              # 도메인 타입 (Country, Purpose, FlowInput, FlowResult 등)
│   └── data/                 # 정적 데이터 (4명이 분담 마이그레이션)
│       ├── countries.ts
│       ├── purposes.ts
│       └── index.ts
├── public/
├── CLAUDE.md                 # 이 파일
├── AGENTS.md                 # Next 16 주의사항 (자동 생성)
└── README.md                 # (TODO) 프로젝트 README 작성
```

## 8. 브랜드 디자인 토큰 (globals.css의 `@theme inline`)

```css
--color-primary: #3eb286;        /* 민트그린 */
--color-primary-dark: #2f8a68;
--color-offwhite: #fafaf7;       /* 배경 */
--color-charcoal: #1f2421;       /* 본문 */
--color-charcoal-soft: #4a524d;  /* 보조 텍스트 */
--color-border: #e5e7e0;
--color-danger: #d94c4c;
--color-warn: #e89c3a;
```

Tailwind에서 `bg-primary`, `text-charcoal`, `border-border` 등으로 사용.

## 9. 4명 작업 분담 가이드 (제안)

각자 영역을 잡으면 머지 충돌이 적음:

| 담당자 | 영역 | 핵심 파일 |
|---|---|---|
| A | 송금 흐름 도우미 (메인) | `app/simulator/`, `lib/analyze-flow.ts` (신규) |
| B | 데이터 마이그레이션 + 업무별 가이드 | `lib/data/*.ts`, `app/guide/` |
| C | FAQ + 용어사전 | `app/faq/`, `app/glossary/`, `lib/data/faqs.ts`, `lib/data/glossary.ts` |
| D | 공통 컴포넌트 + 디자인 시스템 | `components/`, `app/layout.tsx`, `app/globals.css` |

`CODEOWNERS` 파일로 GitHub 자동 리뷰 요청 설정 권장.

## 10. 다음 단계 (우선순위 순)

1. **GitHub organization + private repo 생성** (사용자 진행)
   - Public 금지 — iM뱅크 내부 도구
   - 4명 멤버 초대
2. 로컬 git remote 추가 → 첫 푸시
3. Vercel 프로젝트 연결 → 자동 PR 프리뷰
4. `lib/data/*.ts` 마이그레이션 (fx/data.js에서 단순 복사 + 타입 적용)
5. `lib/analyze-flow.ts` 작성 (fx/index.html의 `analyzeFlow()` 옮기기 + 단위 테스트 추가 권장)
6. 각 페이지 UI 마이그레이션
7. README, CODEOWNERS, PR 템플릿 정비

## 11. 개발 워크플로우

```bash
npm run dev      # http://localhost:3000
npm run build    # 프로덕션 빌드 검증
npm run lint     # ESLint
```

데이터 변경 시 타입 검사:
```bash
npx tsc --noEmit
```

## 12. 면책

본 자료는 영업점 직원 참고용. 실제 거래 처리 시 본부 외환부서 또는 외환규정 원문 확인 필수.
