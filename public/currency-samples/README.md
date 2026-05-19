# 외국통화 견양 사진

이 폴더에 권종별 사진을 넣고, `lib/data/currency-samples.ts` 의 각 권종 `imageUrl` 에 경로를 적으면 `/samples` 페이지에서 자동 표시됩니다.

## 시범 시연용으로 받은 사진 (출처 명시)

| 파일 | 권종 | 출처 | 라이선스 |
|---|---|---|---|
| `usd/100.jpg` | $100 (2013~ Franklin) | uscurrency.gov | 미국 정부 저작물 — Public Domain |
| `jpy/10000-new.jpg` | ¥10,000 신권 (2024 시부사와) | Wikimedia Commons — Series F obverse | (해당 파일 라이선스 페이지 확인) |
| `jpy/10000-old.jpg` | ¥10,000 구권 (2004 후쿠자와) | Wikimedia Commons | (해당 파일 라이선스 페이지 확인) |
| `eur/100.jpg` | €100 (2019 Europa series) | Wikimedia Commons | (해당 파일 라이선스 페이지 확인) |

⚠️ **실제 영업점 배포 시에는 본부 외환부서·한국은행 외환정보에서 발급한 견양 자료로 교체 권장**. 위 사진은 시연·교육 목적 시범이며, 실 처리 기준은 본부 매뉴얼.

## 권장 파일 구조

```
public/currency-samples/
├── usd/
│   ├── 100.jpg          ← 현재 시범
│   ├── 50.jpg
│   └── ...
├── jpy/
│   ├── 10000-new.jpg    ← 2024 신권
│   ├── 10000-old.jpg    ← 2004 구권
│   ├── 5000-new.jpg
│   └── ...
├── eur/
│   └── 100.jpg
└── cny/
    └── 100.jpg          ← 향후 본부 자료로 추가
```

## imageUrl 작성 예시

`lib/data/currency-samples.ts` 안에서:

```ts
{
  value: "$100",
  series: "2013~ (Franklin)",
  imageUrl: "/currency-samples/usd/100.jpg",  // ← public 기준 절대 경로
  buyable: true,
  sellable: true,
}
```

## 권장 이미지 사양

- 비율 5:3 (지폐 비율과 유사) — 카드 표시 시 contain
- 가로 500~1000px (250~600px도 OK, 너무 크면 페이지 무거움)
- 포맷: JPG (사진) 또는 PNG (투명 배경)
- 앞면(obverse) 위주 — 필요 시 뒷면(reverse)도 별도 파일
- 영업점 도구로 사용 시 **"견본(SPECIMEN)" 표기**가 있는 자료 권장 (위·변조 우려 ↓)

## 주의

- 통화 견양은 한국은행·해당국 중앙은행 공개 자료 활용 권장
- 미국 정부 저작물(uscurrency.gov)은 public domain — 자유 사용 OK
- 일본은행·ECB·PBOC 견양은 저작권 보호 — 외부 공개 시 라이선스 확인
- 위·변조 방지를 위해 실물 스캔본은 워터마크·해상도 제한 필요할 수 있음 (본부 정책 확인)
