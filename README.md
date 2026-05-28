# 🔮 사주 - 현대적인 사주팔자 서비스

생년월일시를 기반으로 전통적인 사주팔자(만세력) 명식을 정확하게 추출하고,  
Google Gemini 2.5 Flash Lite를 통해 현대적인 감각(직장인, 연애, 재물 등)으로 재해석해 드립니다.

---

## 주요 기능

- 운세 테마 선택 (종합 사주, 올해 운세, 재물/직장운, 연애/대인관계 등)
- 양력/음력 생년월일시, 성별 입력
- KASI(한국천문연구원) 데이터 기반 만세력 정확 계산
- Google Gemini 2.5 Flash를 활용한 현대적 풀이 생성

## 서비스 흐름

```
Step 1 운세 테마 선택  →  Step 2 사주 정보 입력  →  Step 3 AI 맞춤 풀이
```

---

## 기술 스택

| 분류 | 라이브러리 |
|------|-----------|
| 프레임워크 | Next.js 16 (App Router) |
| 서버 상태 | TanStack Query v5 |
| 클라이언트 상태 | Zustand v5 |
| 스타일링 | Vanilla Extract |
| 만세력 계산 | @fullstackfamily/manseryeok |
| AI | Google Gemini 2.5 Flash Lite |

---

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 루트에 생성하고 아래 항목을 채웁니다.

```env
GEMINI_API_KEY=your_gemini_api_key
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속합니다.

---

## 명령어

```bash
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run start    # 빌드 결과 실행
npm run lint     # ESLint 검사
```

---

## 폴더 구조

```
src/
├── api/              # axios 인스턴스 및 도메인별 API 함수
├── app/              # Next.js App Router 라우트
│   ├── page.tsx      # Step 1 — 운세 테마 선택
│   ├── input/        # Step 2 — 사주 정보 입력
│   └── result/       # Step 3 — AI 풀이 결과
├── components/       # 공통 컴포넌트
├── hooks/
│   ├── queries/      # TanStack Query useQuery 훅
│   └── mutations/    # TanStack Query useMutation 훅
├── stores/           # Zustand 스토어
├── styles/           # 전역 스타일, 테마, 공용 유틸 (*.css.ts)
├── types/            # TypeScript 타입 정의
└── utils/            # 순수 유틸 함수 (만세력, 날짜 포맷 등)
```
