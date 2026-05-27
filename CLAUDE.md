# CLAUDE.md

## 🔮 Modern Saju Web Project (현대적인 사주/만세력 서비스)

생년월일시를 기반으로 전통적인 사주팔자(만세력) 명식을 정확하게 추출하고, 이를 LLM(대형 언어 모델) API와 연동하여 현대적인 감각(직장인, 개발자, 연애 등)으로 재해석해 주는 트렌디한 프론트엔드 웹 애플리케이션입니다.

## 📋 Key Features & Data Flow (사용자 여정 및 데이터 흐름)

본 서비스는 사용자의 호기심을 먼저 자극하고 입력을 유도하는 **3단계 퍼널(Funnel) 아키텍처**를 가집니다.

1. **Step 1: 운세 주제 선택 (Home Page)**
   - 앱 진입 시, 사용자가 보고 싶은 운세 테마(종합 사주, 올해 운세, 재물/직장운, 연애/대인관계 등)를 직관적인 카드나 탭 형태로 먼저 제시합니다.
2. **Step 2: 사주 정보 입력 (Input Form Page)**
   - 특정 테마를 선택한 사용자에게만 양력/음력, 생년월일시, 성별을 입력받는 폼 화면으로 이동합니다.
   - 이때 사용자가 선택한 '운세 테마' 상태는 Next.js의 URL 파라미터나 Zustand 스토어를 통해 안전하게 유지됩니다.
3. **Step 3: 맞춤형 결과 렌더링 (Result Page)**
   - 수집된 정보를 바탕으로 만세력 알고리즘을 거쳐 명식(팩트)을 계산합니다.
   - Step 1에서 선택했던 '운세 테마'에 매칭되는 특화 프롬프트를 조합하여 LLM API를 호출하고, 최종 풀이를 화면에 보여줍니다.


## ⚙️ Data Pipeline & API Flow (데이터 흐름 및 API 연동 스펙)

사용자가 입력한 정보가 최종 AI 풀이로 변환되는 과정은 다음과 같은 명확한 단계와 역할 분담을 거칩니다.

```text
[Step 2: 입력 폼] ──(생년월일시 데이터)──> [Next.js 서버 API (/api/saju)]
                                                    │
   ┌────────────────────────────────────────────────┘
   ▼
[1단계: 만세력 계산 (src/utils/saju.ts)]
   │
   ├─> 음력 입력 시 양력으로 변환 (별도 처리)
   ├─> @fullstackfamily/manseryeok 라이브러리로 4주 명식 계산
   │     - KASI(한국천문연구원) 데이터 기반, 절기 시간 정확 처리
   │     - 입춘 기준 년주 변경 자동 적용
   ├─> 라이브러리 반환값을 SajuChart 타입으로 가공 (splitPillar)
   ├─> 입력 데이터 수신 즉시 'any' 타입을 배제하고 'unknown'으로 격리
   ├─> 엄격한 타입 가드(Type Guard)를 통해 필수 명식 데이터(천간, 지지 등) 검증
   │
   ▼
[2단계: Google Gemini 2.5 Flash API 호출]
   │
   ├─> 검증이 완료된 만세력 데이터 + 테마별 시스템 프롬프트 조립
   └─> 구글 AI SDK를 통해 트렌디하고 현대적인 텍스트 풀이 생성
   │
   ▼
[Next.js 서버 API] ──(최종 정제된 데이터 반환)──> [Step 3: 결과 페이지]
```

---

## 세션 시작 시 필독

새 대화를 시작할 때마다 `.claude/memory/progress.md`를 읽어 현재 작업 맥락을 파악하고, 작업이 끝나면 완료 항목과 다음 할 일을 업데이트한다.

---

## 기술 스택

| 분류 | 라이브러리 |
|------|-----------|
| 프레임워크 | Next.js 16 (App Router) |
| 서버 상태 | TanStack Query v5 |
| 클라이언트 상태 | Zustand v5 |
| 스타일링 | Vanilla Extract (`.css.ts`) |
| HTTP 클라이언트 | axios |

---

## 명령어

```bash
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run start    # 빌드 결과 실행
npm run lint     # ESLint 검사
```

---

## 환경 변수

`.env` 파일 사용 (git 제외). 민감 정보는 절대 코드에 직접 작성하지 않는다.

---

## 폴더 구조

```
src/
├── api/              # axios 인스턴스, 도메인별 API 함수 (users.ts, boards.ts 등)
├── app/              # Next.js App Router (라우트 단위 폴더)
│   ├── layout.tsx    # 루트 레이아웃
│   ├── page.tsx      # 홈 페이지 (운세 주제 선택)
│   └── providers.tsx # QueryClientProvider 래퍼 (Client Component)
├── components/       # 공통 컴포넌트
├── hooks/
│   ├── queries/      # TanStack Query useQuery 훅 (도메인별 분리)
│   └── mutations/    # TanStack Query useMutation 훅 (도메인별 분리)
├── stores/           # Zustand 스토어
├── styles/           # 전역 스타일, 테마, 공용 유틸 (*.css.ts)
│   ├── theme.css.ts  # CSS 변수 (createGlobalTheme)
│   ├── global.css.ts # 전역 리셋 및 기본 스타일
│   └── common.css.ts # 공용 믹스인 및 독립 클래스
├── types/            # TypeScript 타입 정의
│   └── api.ts        # API 응답 타입
└── utils/            # 순수 유틸 함수
```

---

## 라우팅

Next.js App Router 사용. `src/app/` 폴더 구조가 URL 경로가 된다.

- `src/app/page.tsx` → `/` (홈, 운세 주제 선택)
- `src/app/input/page.tsx` → `/input` (사주 정보 입력)
- `src/app/result/page.tsx` → `/result` (결과 페이지)

페이지 간 상태 전달은 **Zustand 스토어**를 우선 사용한다. URL 파라미터는 공유 가능해야 할 때만 활용.

---

## 스타일링

**Vanilla Extract** 사용 — 런타임 오버헤드 없이 빌드 타임에 정적 CSS 파일로 추출됨.

- 스타일 파일은 반드시 `.css.ts` 확장자 사용
- 테마는 `createGlobalTheme(':root', ...)` 으로 CSS 변수를 `:root`에 주입 (`theme.css.ts`)
  - 컴포넌트에서 `vars.colors.primary` 처럼 참조하면 빌드 시 `var(--colors-primary)`로 변환됨
  - `import { vars } from '../styles/theme.css'` 로 불러와서 사용
- 전역 스타일은 `global.css.ts`를 `src/app/layout.tsx`에서 `import '@/styles/global.css'`로 import하는 것만으로 적용됨
- 공용 스타일 유틸은 `src/styles/common.css.ts`에서 import해서 사용
  - 믹스인 객체: `flexCenter`, `flexBetween`, `ellipsis` — `style({ ...flexCenter })` 처럼 스프레드
  - 독립 클래스: `flexCenterClass`, `flexBetweenClass`, `ellipsisClass` — `className`으로 직접 적용
- 컴포넌트 스타일은 같은 폴더에 `ComponentName.css.ts` 파일로 분리
- 인라인 `style={{}}`은 임시 용도로만 — 가능하면 Vanilla Extract `.css.ts` 파일로 교체

### 공통 스타일 추출 기준

새 컴포넌트에 스타일을 추가하기 전에, 기존 `.css.ts`에 동일하거나 유사한 선언이 있는지 먼저 확인한다. 중복이 있다면 제안 없이 **즉시** `src/styles/`로 추출하고 양쪽에서 import해서 사용한다.

---

## TypeScript 규칙

- **`any` 사용 금지** — 불명확한 타입은 `unknown` 사용 후 타입 좁히기
- **타입 단언(`as`) 최소화** — 불가피한 경우 이유를 주석으로 명시
- **외부 입력(API 응답, catch 블록 등)은 타입 가드로 검증**

```ts
// catch 블록: error는 unknown으로 받기
catch (error: unknown) {
  if (error instanceof Error) {
    console.error(error.message);
  }
}

// axios 에러 구분
if (axios.isAxiosError(error)) { ... }

// 커스텀 타입 가드
function isApiError(value: unknown): value is { message: string } {
  return typeof value === 'object' && value !== null && 'message' in value;
}
```

- API 응답 타입은 반드시 `src/types/api.ts`에 정의 후 사용
- 컴포넌트 props는 파일 상단에 `interface`로 선언
- 유니온 타입 적극 활용: `status: 'todo' | 'doing' | 'done'`

---

## 코딩 컨벤션

- 컴포넌트: **PascalCase** (`StatusPage.tsx`)
- 훅: **camelCase** + `use` 접두사 (`useAdminQueries.ts`)
- 폴더명: **소문자** (`pages/admin/status/`)
- 파일명은 역할 명확히 표현 (`Page`, `Panel`, `Layout` 접미사 활용)
- API 호출은 직접 하지 않고 `hooks/queries`, `hooks/mutations`를 통해 사용
- 컴포넌트 내 비즈니스 로직은 커스텀 훅으로 분리
- API 관련 파일(`api/`, `hooks/queries/`, `hooks/mutations/`, `types/`)은 처음부터 도메인별로 분리해서 생성
  - 예: `users.ts`, `boards.ts` — 하나의 파일에 모두 모으지 않는다

---

## 커밋 메시지

```
feat: 대상자 목록 필터 기능 추가
fix: 로그인 토큰 저장 오류 수정
refactor: StatusPage 상태 관리 개선
style: 사이드바 레이아웃 정렬 수정
chore: 패키지 추가 및 환경 설정
```

---

## Claude에게 — 협업 방식

이 프로젝트 개발자는 주니어이므로 아래 방식으로 협업한다.

### 더 나은 방향이 있을 때

요청을 그대로 이행하기 전에, 더 나은 접근법이 있다고 판단되면 **먼저 제안하고 확인 후 진행**한다.

예시 상황:
- 라우트를 추가해달라고 했지만 state 토글이 더 적합한 경우
- 컴포넌트 안에 로직을 직접 넣으려 하는데 커스텀 훅 분리가 나은 경우
- 반복 코드를 작성하려는데 공통 컴포넌트로 추출할 수 있는 경우
- 보안상 문제가 있는 방식을 요청하는 경우 (XSS, 토큰 노출 등)

제안 방식:
> "요청하신 방향으로도 구현 가능하지만, [이유] 때문에 [대안]이 더 적합할 것 같아요. 어떻게 할까요?"

### 올바르지 않은 명령일 때

잘못된 방향이라고 판단되면 그냥 따르지 말고 이유와 함께 바로잡아준다.

예시:
- TypeScript `any`를 쓰려 할 때 → 올바른 타입 선언 방법 안내
- 인라인 스타일을 계속 쓰려 할 때 → Vanilla Extract `.css.ts` 파일로 전환 제안
- API를 컴포넌트에서 직접 호출하려 할 때 → 훅 분리 안내
- 보안에 취약한 코드 (토큰을 URL에 넣는 등) → 위험성 설명 후 올바른 방법 제시

### 코드 분리 제안

작업 중 아래 상황이 보이면, 요청한 작업을 완료한 후 **짧게 분리 제안**한다. 먼저 묻지 않고 바로 제안해도 된다.

**커스텀 훅으로 분리 제안 기준:**
- 동일한 로직(예: useEffect + useState 조합)이 2개 이상의 파일에 등장할 때
- 컴포넌트 파일이 약 150줄을 넘고, 상태/이펙트 로직이 UI와 섞여 있을 때

**유틸 함수로 분리 제안 기준:**
- 날짜 포매팅, 숫자 포매팅 등 순수 변환 함수가 2곳 이상에서 쓰일 때
- 컴포넌트 안에 비즈니스 계산 로직이 길어질 때

**공통 컴포넌트로 분리 제안 기준:**
- 거의 동일한 JSX 구조가 2개 이상의 파일에 반복될 때

제안 방식 (간결하게):
> "`formatDate` 함수가 여러 곳에 쓰일 것 같아요. `src/utils/format.ts`로 분리할까요?"

### 설명 방식

- 코드만 던지지 않고 **왜 이렇게 했는지** 간단히 설명한다
- 생소한 개념은 짧게 부연한다 (예: "이건 타입 가드라고 해서, 런타임에 타입을 좁혀주는 함수예요")
- 선택지가 있을 때는 장단점을 간단히 비교

## 👨‍💻 Developer Context & AI Assistant Guidelines (AI 코딩 어시스턴트 지침)

이 문서를 읽고 코드를 생성하는 AI(Claude Code 등)는 아래의 개발자 상황을 반드시 숙지하고 코드를 작성해야 합니다.

- **Background:** React와 TypeScript 프론트엔드 생태계는 익숙하지만, **Next.js는 이 프로젝트로 처음 입문**하는 상태입니다.
- **Backend Knowledge:** 백엔드 개발 경험이 없으며, Next.js의 서버 기능(API Routes, Server Components 등)이 어떻게 작동하는지 전혀 모릅니다.

