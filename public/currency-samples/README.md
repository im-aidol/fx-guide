# 외국통화 견양 사진

이 폴더에 권종별 사진을 넣고, `lib/data/currency-samples.ts` 의 각 권종 `imageUrl` 에 경로를 적으면 `/samples` 페이지에서 자동 표시됩니다.

## 권장 파일 구조

```
public/currency-samples/
├── usd/
│   ├── 100.jpg
│   ├── 50.jpg
│   └── ...
├── jpy/
│   ├── 10000-new.jpg     ← 2024 신권
│   ├── 10000-old.jpg     ← 2004 구권
│   └── ...
├── eur/
│   └── ...
└── cny/
    └── ...
```

## imageUrl 작성 예시

`lib/data/currency-samples.ts` 안에서:

```ts
{
  value: "$100",
  series: "신권 (2013~)",
  imageUrl: "/currency-samples/usd/100.jpg",  // ← public 기준 절대 경로
  acceptable: true,
}
```

## 권장 이미지 사양

- 비율 5:3 (지폐 비율과 유사)
- 가로 600~1000px (너무 크면 페이지 무거움)
- 포맷: JPG (사진) 또는 PNG (투명 배경)
- 앞면 위주 — 필요 시 뒷면도 별도 파일

## 주의

- 통화 견양은 한국은행·해당국 중앙은행 공개 자료 활용 권장
- 위·변조 방지를 위해 실물 스캔본은 워터마크·해상도 제한 필요할 수 있음 (본부 정책 확인)
