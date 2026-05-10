# 외환 길잡이 (FX Desk Guide)

iM뱅크 영업점 직원용 외환 송금 가이드.
**1차 기준**: 외국환거래규정 (재정경제부고시 제2026-69호, 시행 2026.3.30.)

> ⚠️ 본 저장소는 공개되어 있습니다. 외환규정 등 공개 자료 기반.
> **본부 외환부서 매뉴얼 등 회사 내부 자료는 절대 commit 금지** — 한 번 push되면 git history에 영원히 남습니다.

## 시작하기

```bash
npm install
npm run dev
```

→ http://localhost:3000

## 기술 스택

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Vercel** 배포

## 프로젝트 구조

```
app/                  # 라우트 (파일명 = URL)
├── page.tsx          # /
├── simulator/        # /simulator (메인 도구)
├── guide/            # /guide
├── faq/              # /faq
└── glossary/         # /glossary

components/           # 공유 UI
lib/
├── types.ts          # 도메인 타입
└── data/             # 정적 데이터
```

## 기여 가이드

- 작업 전 [CLAUDE.md](./CLAUDE.md) 필독 (외환규정 준수사항·작업 분담)
- 원본 코드는 `../fx/` 폴더에 보존 (v6.0, 마이그레이션 참고용)
- 외환규정/거래코드/한도는 임의 변경 금지
- 핀테크 송금 업체(한패스, 센트비 등) 언급 금지

## 명령어

```bash
npm run dev     # 개발 서버
npm run build   # 프로덕션 빌드
npm run lint    # ESLint
npx tsc --noEmit  # 타입 검사
```

## 면책

본 자료는 영업점 직원 참고용. 실제 거래 처리 시 본부 외환부서 또는 외환규정 원문 확인 필수.
