import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { calculateSajuChart } from '@/utils/saju';
import type { FortuneTheme, SajuChart, SajuInput, SajuReading, SajuReadingExtras, SajuReadingRequest } from '@/types/api';

// ─── 타입 가드 ────────────────────────────────────────────────────────────────

function isSajuInput(value: unknown): value is SajuInput {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    (v.calendarType === 'solar' || v.calendarType === 'lunar') &&
    typeof v.birthYear === 'number' &&
    typeof v.birthMonth === 'number' &&
    typeof v.birthDay === 'number' &&
    (v.birthHour === null || typeof v.birthHour === 'number') &&
    (v.gender === 'male' || v.gender === 'female')
  );
}

function isSajuReadingRequest(value: unknown): value is SajuReadingRequest {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    ['general', 'yearly', 'wealth', 'love'].includes(v.theme as string) &&
    isSajuInput(v.input)
  );
}

// ─── 음력 → 양력 변환 ─────────────────────────────────────────────────────────

async function toSolarDate(
  year: number,
  month: number,
  day: number
): Promise<{ year: number; month: number; day: number }> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const KoreanLunarCalendar = require('korean-lunar-calendar') as new () => {
    setLunarDate(y: number, m: number, d: number, intercalation: boolean): boolean;
    getSolarCalendar(): { year: number; month: number; day: number };
  };
  const cal = new KoreanLunarCalendar();
  cal.setLunarDate(year, month, day, false);
  return cal.getSolarCalendar();
}

// ─── Gemini 프롬프트 빌더 ─────────────────────────────────────────────────────

const THEME_LABELS: Record<FortuneTheme, string> = {
  general: '평생 종합 사주 분석',
  yearly: `${new Date().getFullYear()}년 올해 신수 분석`,
  wealth: '재물운 및 학업/취업운 분석',
  love: '연애운 및 대인관계 분석',
};

const THEME_SECTION_TITLES: Record<FortuneTheme, string[]> = {
  general: [
    '⚡ 일간이 말하는 나의 본질과 숨겨진 기질',
    '📅 과거 · 현재 · 미래 — 내 인생의 3막',
    '💼 사주가 가리키는 천직 분야와 그 이유',
    '🧩 나를 빛내는 인연 vs 에너지를 갉아먹는 인연',
  ],
  yearly: [
    '🌊 올해 에너지 총평 — 상반기 vs 하반기 대비',
    '⏳ 이미 지나온 달들, 당신이 느꼈을 흐름',
    '🎯 남은 기간, 반드시 잡아야 할 기회와 타이밍',
    '🚨 경계해야 할 시기와 그때 써야 할 처세술',
  ],
  wealth: [
    '💰 내 재물 그릇 — 타고난 돈과의 관계',
    '🏆 사주가 권하는 최적의 직업 · 부업 유형',
    '💸 나도 모르게 돈이 새나가는 패턴',
    '📈 재물운 상승 시기와 지금 당장 써먹는 전략',
  ],
  love: [
    '💘 내 연애 성향 — 나는 어떤 연애를 하는가',
    '✨ 나와 찰떡인 이성 — 구체적인 성격과 에너지',
    '⚠️ 절대 피해야 할 이성 유형과 반복되는 문제',
    '📅 현재 연애운 흐름과 인연이 찾아오는 시기',
  ],
};

// 테마별 구체적 작성 지침 — 모호한 표현 금지, 직업명/월/특징 등 반드시 명시
const THEME_DIRECTIVES: Record<FortuneTheme, string> = {
  general: `
섹션 ①: 일간(일주 천간 한자)을 직접 언급하며 "당신은 ○간 기질의 사람"으로 시작해 타고난 성격·강점·한계를 구체적으로 분석
섹션 ②: 과거(어린 시절~사회 진입 이전), 현재(지금 이 시점의 운기와 당면 과제), 미래(5~10년 후 가능성)를 각 2~3문장씩 명확히 서술
섹션 ③: 이 사주에 가장 잘 맞는 직업군 3가지를 구체적인 직업명(예: 데이터 분석가, 카피라이터, 심리상담사)과 이유를 각각 한 줄씩
섹션 ④: 나와 에너지가 잘 맞는 사람의 성격 특징 2~3가지, 반드시 피해야 할 사람의 특징 2~3가지를 구체적으로
extras.birthElement: 일간 한자 + 오행 의미 (예: "甲木 — 봄의 나무, 개척과 성장의 에너지")
extras.careers: 직업명 3개 배열 (name, reason 각 한 줄)
extras.compatibleType: 잘 맞는 사람 한 문장 요약
extras.incompatibleType: 피해야 할 사람 한 문장 요약
extras.luckyColor: 이 사주에 어울리는 색상명
extras.luckyItem: 행운을 높이는 물건 또는 음식
  `.trim(),

  yearly: `
섹션 ①: 올해 상반기(1~6월)와 하반기(7~12월)의 에너지 차이를 대조하여 어느 쪽이 더 유리한지 명확히 판단 포함
섹션 ②: 현재 기준 이미 지나온 달들의 흐름을 복기 — 내담자가 "맞아, 그랬어"라고 공감할 수 있는 톤으로 (최근 2~3개월 위주)
섹션 ③: 남은 달 중 운이 가장 좋은 달(구체적 N월)과 그 달에 해야 할 핵심 행동 1가지를 콕 집어서
섹션 ④: 가장 조심해야 할 달(구체적 N월)과 그 시기에 써야 할 현실적인 처세술
extras.bestMonth: 가장 유리한 달 (예: "9월")
extras.worstMonth: 가장 조심할 달 (예: "7월")
extras.keyAction: 기회를 잡기 위한 구체적 행동 한 문장
extras.luckyColor: 올해 이 사람에게 어울리는 색상명
extras.luckyItem: 올해 행운을 높이는 물건 또는 음식
  `.trim(),

  wealth: `
섹션 ①: 재물 에너지가 이 사주에서 강한지 약한지를 직접 판단하고, 이 사람이 돈을 대하는 근본 패턴(안정 축재형/도전 투자형/감정 소비형 등)을 명확히
섹션 ②: 이 사주에 적합한 직업·부업 유형 3가지를 구체적 분야(예: IT 개발, 패션 디자인, 투자/금융)와 이유 함께 제시
섹션 ③: 이 사람이 자신도 모르게 저지르는 구체적인 낭비 패턴(감정 기복에 따른 충동구매, 인간관계 유지 비용 과다 등) 2~3가지
섹션 ④: 재물운이 올라가는 유리한 시기 또는 상황 + 지금 당장 실천 가능한 재테크/관리 행동 1~2가지
extras.moneyType: 재물 유형 한 단어 또는 짧은 표현 (예: "신중한 축재가")
extras.topFields: 추천 분야명 배열 3개
extras.warningHabit: 돈 새는 패턴 한 문장 요약
extras.luckyColor: 재물운을 높이는 색상명
extras.luckyItem: 재물운을 높이는 물건 또는 음식
  `.trim(),

  love: `
섹션 ①: 연애에서 이 사람이 반복하는 구체적인 패턴(밀당형/헌신형/독립형/집착형 등)을 명확히 진단하고 그 배경 설명
섹션 ②: 나와 에너지가 잘 맞는 이성의 성격 특징 3가지 이상 — 성격·말투·가치관·생활 방식 등 구체적으로
섹션 ③: 나와 상극인 이성 유형과 그 관계에서 반복될 문제 패턴 2~3가지를 명확히
섹션 ④: 현재 시점의 연애운 평가(좋음/보통/하강 중 등 명확히 판단) + 좋은 인연이 찾아올 가능성이 높은 시기나 계기
extras.loveStyle: 연애 유형 한 단어 (예: "헌신형")
extras.compatibleTraits: 잘 맞는 이성 특징 배열 3개
extras.incompatibleTraits: 피해야 할 이성 특징 배열 2~3개
extras.bestPeriod: 인연이 찾아오는 시기 표현
extras.luckyColor: 연애운을 높이는 색상명
extras.luckyItem: 연애운을 높이는 물건 또는 음식
  `.trim(),
};

// 테마별 extras JSON 스키마 힌트 (LLM이 정확한 구조로 응답하도록 유도)
const EXTRAS_SCHEMA: Record<FortuneTheme, string> = {
  general: `"extras": { "birthElement": "일간 한자 + 오행 의미", "careers": [{"name": "직업명", "reason": "이유 한 줄"}, {"name": "...", "reason": "..."}, {"name": "...", "reason": "..."}], "compatibleType": "잘 맞는 사람 한 문장", "incompatibleType": "피해야 할 사람 한 문장", "luckyColor": "색상명", "luckyItem": "아이템명" }`,
  yearly: `"extras": { "bestMonth": "N월", "worstMonth": "N월", "keyAction": "기회 행동 한 문장", "luckyColor": "색상명", "luckyItem": "아이템명" }`,
  wealth: `"extras": { "moneyType": "재물 유형", "topFields": ["분야1", "분야2", "분야3"], "warningHabit": "낭비 패턴 한 문장", "luckyColor": "색상명", "luckyItem": "아이템명" }`,
  love: `"extras": { "loveStyle": "연애 유형", "compatibleTraits": ["특징1", "특징2", "특징3"], "incompatibleTraits": ["특징1", "특징2"], "bestPeriod": "인연 시기", "luckyColor": "색상명", "luckyItem": "아이템명" }`,
};

function buildPrompt(theme: FortuneTheme, input: SajuInput, chart: SajuChart): string {
  const genderKo = input.gender === 'male' ? '남성' : '여성';
  const hourText = chart.hourPillar
    ? `${chart.hourPillar.stem}${chart.hourPillar.branch}`
    : '미상(시간 불명)';
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const sectionTitles = THEME_SECTION_TITLES[theme];

  return `당신은 명리학에 깊은 지식을 가진 현대적이고 트렌디한 사주 전문가입니다.
아래 사주 명식 데이터를 바탕으로 ${THEME_LABELS[theme]}을 진행해 주세요.

[사주 명식 - 천간지지 (원국)]
년주: ${chart.yearPillar.stem}${chart.yearPillar.branch}
월주: ${chart.monthPillar.stem}${chart.monthPillar.branch}
일주: ${chart.dayPillar.stem}${chart.dayPillar.branch}  ← 일간(${chart.dayPillar.stem})이 이 사람의 핵심 기질입니다
시주: ${hourText}

[내담자 정보]
성별: ${genderKo}
출생년도: ${input.birthYear}년
현재 기준: ${currentYear}년 ${currentMonth}월

[섹션별 작성 지침 — 반드시 준수]
${THEME_DIRECTIVES[theme]}

[문체 및 표현 규칙]
- 타겟 독자: 학생, 대학생, 취준생, 사회초년생이 깊이 공감할 수 있는 세련된 존댓말
- 낡은 명리학 한자어(비견·겁재·편인 등)는 풀어서 쓰거나 배제
- 유치한 신조어나 밈은 쓰지 말고 진정성 있는 컨설턴트 톤으로
- 이모지(🌟 🎯 💸 📝 등)를 문맥에 맞게 자연스럽게 2~3개 사용
- 각 섹션 300자 내외, 전체 1200자 이상
- 막연하고 두루뭉술한 표현 절대 금지 — 구체적인 직업명·월(月)·성격 특징·행동 지침을 반드시 명시

[출력 형식 — 반드시 순수 JSON만 출력]
마크다운 코드 블록(\`\`\`json 등) 절대 금지. 부연 설명 텍스트 일절 금지.
반드시 아래 형식의 순수 JSON 객체로만 응답하세요:

{
  "summary": "이 사람의 사주를 꿰뚫는 트렌디한 한줄 요약 (50자 이내)",
  "keywords": ["핵심 기질 키워드1", "핵심 기질 키워드2", "핵심 기질 키워드3"],
  "sections": [
    { "title": "${sectionTitles[0]}", "content": "섹션1 상세 풀이 (300자 내외)" },
    { "title": "${sectionTitles[1]}", "content": "섹션2 상세 풀이 (300자 내외)" },
    { "title": "${sectionTitles[2]}", "content": "섹션3 상세 풀이 (300자 내외)" },
    { "title": "${sectionTitles[3]}", "content": "섹션4 상세 풀이 (300자 내외, 구체적 조언 포함)" }
  ],
  ${EXTRAS_SCHEMA[theme]}
}`;
}

// ─── Gemini 응답 파싱 ─────────────────────────────────────────────────────────

function parseGeminiResponse(text: string): {
  summary: string;
  keywords?: string[];
  detail?: string;
  sections?: { title: string; content: string }[];
  extras?: SajuReadingExtras;
} {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
      const summary = typeof parsed.summary === 'string' ? parsed.summary : '';
      const detail = typeof parsed.detail === 'string' ? parsed.detail : undefined;
      const keywords = Array.isArray(parsed.keywords) ? (parsed.keywords as string[]) : undefined;
      const sections = Array.isArray(parsed.sections)
        ? (parsed.sections as { title: string; content: string }[])
        : undefined;
      const extras =
        typeof parsed.extras === 'object' && parsed.extras !== null
          ? (parsed.extras as SajuReadingExtras)
          : undefined;
      return { summary, keywords, detail, sections, extras };
    } catch {
      // JSON 파싱 실패 시 원문 그대로 사용
    }
  }
  return { summary: '', detail: text };
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();

    if (!isSajuReadingRequest(body)) {
      return NextResponse.json(
        { success: false, message: '입력 데이터가 올바르지 않습니다.' },
        { status: 400 }
      );
    }

    const { theme, input } = body;

    // 1. 음력이면 양력으로 변환
    let solarYear = input.birthYear;
    let solarMonth = input.birthMonth;
    let solarDay = input.birthDay;

    if (input.calendarType === 'lunar') {
      const solar = await toSolarDate(input.birthYear, input.birthMonth, input.birthDay);
      solarYear = solar.year;
      solarMonth = solar.month;
      solarDay = solar.day;
    }

    // 2. 만세력 계산 (천간지지 4주)
    const chart = calculateSajuChart(solarYear, solarMonth, solarDay, input.birthHour);

    // 3. Gemini API 호출
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: '서버 설정 오류: API 키가 없습니다.' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const prompt = buildPrompt(theme, input, chart);

    // 안정적인 모델 우선, 에러 발생 시 다음 모델로 폴백
    const MODEL_FALLBACK = ['gemini-2.5-flash', 'gemini-2.5-pro'];
    let responseText = '';
    let lastError: unknown;

    for (const modelName of MODEL_FALLBACK) {
      const model = genAI.getGenerativeModel({ model: modelName });
      try {
        const result = await model.generateContent(prompt);
        responseText = result.response.text().trim();
        break;
      } catch (err: unknown) {
        lastError = err;
        const shouldFallback =
          err instanceof Error &&
          (err.message.includes('503') || err.message.includes('429') || err.message.includes('404') || err.message.includes('403'));
        if (!shouldFallback) throw err; // 503, 429, 404, 403 이외 오류는 즉시 throw
        // 오류면 다음 모델로 폴백 (마지막 모델까지 실패하면 아래서 throw)
      }
    }
    if (!responseText) throw lastError;

    const { summary, keywords, detail, sections, extras } = parseGeminiResponse(responseText);

    const reading: SajuReading = { theme, summary, keywords, detail, sections, extras, chart };

    return NextResponse.json({ success: true, message: 'ok', data: reading });
  } catch (error: unknown) {
    console.error('[/api/saju/reading] 서버 에러:', error);
    const message = error instanceof Error ? error.message : '서버 오류가 발생했습니다.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
