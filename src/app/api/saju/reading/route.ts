import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType, Schema, ObjectSchema } from '@google/generative-ai';
import KoreanLunarCalendar from 'korean-lunar-calendar';
import { calculateSajuChart, analyzeSajuElements, getCurrentWoon, calculateDaewun } from '@/utils/saju';
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
  const isValidTheme = ['general', 'yearly', 'wealth', 'love', 'compatibility'].includes(v.theme as string);
  const hasValidInput = isSajuInput(v.input);
  if (v.theme === 'compatibility') {
    return isValidTheme && hasValidInput && isSajuInput(v.partnerInput);
  }
  return isValidTheme && hasValidInput;
}

// ─── 음력 → 양력 변환 ─────────────────────────────────────────────────────────

function toSolarDate(
  year: number,
  month: number,
  day: number
): { year: number; month: number; day: number } {
  const cal = new KoreanLunarCalendar();
  cal.setLunarDate(year, month, day, false);
  return cal.getSolarCalendar();
}
// ─── 특수 기운(살) 판별 로직 ──────────────────────────────────────────────────

function detectSinsal(chart: SajuChart): string[] {
  const sal = new Set<string>();
  const branches = [chart.yearPillar.branch, chart.monthPillar.branch, chart.dayPillar.branch, chart.hourPillar?.branch].filter(Boolean) as string[];
  const pillars = [
    `${chart.yearPillar.stem}${chart.yearPillar.branch}`,
    `${chart.monthPillar.stem}${chart.monthPillar.branch}`,
    `${chart.dayPillar.stem}${chart.dayPillar.branch}`,
    chart.hourPillar ? `${chart.hourPillar.stem}${chart.hourPillar.branch}` : ''
  ].filter(Boolean);

  const dowhaCount = branches.filter(b => ['子', '午', '卯', '酉'].includes(b)).length;
  if (dowhaCount > 0) sal.add(`도화살 (가진 개수: ${dowhaCount}개) - 매력, 인기, 주목받는 힘, 표현력`);

  const yeokmaCount = branches.filter(b => ['寅', '申', '巳', '亥'].includes(b)).length;
  if (yeokmaCount > 0) sal.add(`역마살 (가진 개수: ${yeokmaCount}개) - 활동력, 이동, 해외운, 변화와 도전`);

  const hwagaeCount = branches.filter(b => ['辰', '戌', '丑', '未'].includes(b)).length;
  if (hwagaeCount > 0) sal.add(`화개살 (가진 개수: ${hwagaeCount}개) - 예술성, 고독, 명예, 정신적 깊이, 복구하는 힘`);

  const baekho = ['甲辰', '乙未', '丙戌', '丁丑', '戊辰', '壬戌', '癸丑'];
  if (pillars.some(p => baekho.includes(p))) sal.add('백호대살 - 폭발적 에너지, 카리스마, 리더십, 강한 추진력');

  const gwaegang = ['庚辰', '庚戌', '壬辰', '壬戌', '戊戌'];
  if (pillars.some(p => gwaegang.includes(p))) sal.add('괴강살 - 강력한 기백, 주체성, 무리의 우두머리 기운');

  const hongyeom = ['甲午', '丙寅', '丁未', '戊辰', '庚戌', '辛酉', '壬子', '壬申'];
  if (pillars.some(p => hongyeom.includes(p))) sal.add('홍염살 - 은근하고 치명적인 매력, 높은 친화력, 다정다감');

  return Array.from(sal);
}

// ─── Gemini 프롬프트 빌더 ─────────────────────────────────────────────────────

const THEME_LABELS: Record<FortuneTheme, string> = {
  general: '평생 종합 사주 분석',
  yearly: `${new Date().getFullYear()}년 올해 신수 분석`,
  wealth: '재물운 및 학업/취업운 분석',
  love: '연애운 및 대인관계 분석',
  compatibility: '두 사람의 사주 궁합 분석',
};

const THEME_SECTION_TITLES: Record<FortuneTheme, string[]> = {
  general: [
    '⚡ 일간이 말하는 나의 본질과 숨겨진 기질',
    '📅 과거 · 현재 · 미래 — 내 인생의 3막',
    '💼 사주가 가리키는 천직 분야와 그 이유',
    '✨ 내 사주에 숨겨진 특별한 매력과 강력한 무기 (살)',
  ],
  yearly: [
    '🌊 올해 에너지 총평 — 상반기 vs 하반기 대비',
    '⏳ 이미 지나온 달들, 당신이 느꼈을 흐름',
    '🎯 남은 기간, 반드시 잡아야 할 기회와 타이밍',
    '🚨 경계해야 시기와 그때 써야 할 처세술',
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
  compatibility: [
    '👩‍❤️‍👨 우리 커플의 본질적인 인연과 상호작용',
    '🔍 서로가 서로에게 강렬하게 끌리는 이유',
    '⚠️ 두 사람이 부딪히기 쉬운 부분과 현명한 대처법',
    '💍 결혼과 미래를 향한 인연 흐름, 그리고 조언',
  ],
};

// 테마별 구체적 작성 지침 — 모호한 표현 금지, 직업명/월/특징 등 반드시 명시
const THEME_DIRECTIVES: Record<FortuneTheme, string> = {
  general: `
섹션 ①: 일간의 기운과 사주의 전반적인 에너지 균형(강약과 조후)을 분석하여 "당신은 ~한 기운을 타고난 사람"으로 시작해 타고난 성격·강점·한계를 구체적으로 서술
섹션 ②: 과거(어린 시절~사회 진입 이전), 현재(지금 이 시점의 운기와 당면 과제), 미래(5~10년 후 가능성)를 각 2~3문장씩 명확히 서술
섹션 ③: 이 사주의 오행과 십성(기질)을 바탕으로 가장 잠재력을 발휘할 수 있는 직업 3가지를 구체적인 직업명과 그 사주적 근거를 함께 서술
섹션 ④: 프롬프트에 제공된 [당신의 사주에 있는 특수 기운(살)] 정보를 반드시 확인하고, 내 사주에 '실제로 있는' 특수 살(도화, 역마, 백호 등) 중 가장 두드러지는 것을 골라 이를 긍정적인 무기로 활용하는 방법을 구체적으로 서술할 것 (없는 살을 지어내지 말 것)
extras.birthElement: 일간의 기운을 한글로만 표현 (예: "갑목 — 봄의 나무, 개척과 성장의 에너지")
extras.careers: 직업명 3개 배열 (name, reason 각 한 줄)
extras.compatibleType: 잘 맞는 귀인 특징 한 문장 요약
extras.incompatibleType: 피해야 할 상극 특징 한 문장 요약
extras.myWeapon: 이 사주에서 가장 강력한 무기가 되는 기질 한 단어 (예: "불도저 같은 추진력", "상대를 감싸는 포용력")
extras.benefactorZodiac: 가장 큰 도움을 줄 귀인의 띠 1~2개와 그 이유 한 줄 (예: "호랑이띠, 말띠 — 부족한 불의 기운을 보충해 줌")
  `.trim(),

  yearly: `
섹션 ①: 올해 상반기(1~6월)와 하반기(7~12월)의 에너지 차이를 대조하여 어느 쪽이 더 유리한지 명확히 판단 포함
섹션 ②: 현재 기준 이미 지나온 달들의 흐름을 복기 — 당신이 "맞아, 그랬어"라고 공감할 수 있는 톤으로 (최근 2~3개월 위주)
섹션 ③: 남은 달 중 운이 가장 좋은 달(구체적 N월)과 그 달에 해야 할 핵심 행동 1가지를 콕 집어서
섹션 ④: 가장 조심해야 할 달(구체적 N월)과 그 시기에 써야 할 현실적인 처세술
extras.bestMonth: 가장 유리한 달 (예: "9월")
extras.worstMonth: 가장 조심할 달 (예: "7월")
extras.keyAction: 기회를 잡기 위한 구체적 행동 한 문장
extras.myWeapon: 올해 가장 큰 무기가 될 나의 기질 한 단어
extras.benefactorZodiac: 올해 나에게 뜻밖의 도움을 줄 귀인의 띠와 이유
  `.trim(),

  wealth: `
섹션 ①: 재물 에너지가 이 사주에서 강한지 약한지를 직접 판단하고, 당신이 돈을 대하는 근본 패턴(안정 축재형/도전 투자형/감정 소비형 등)을 명확히
섹션 ②: 단순히 재물 기운의 유무만 보지 말고 사주의 전체 밸런스(신강/신약)를 고려해, '자격증/공부', '인맥/협력', '나만의 기술/표현' 중 어떤 무기를 써야 가장 돈을 잘 벌 수 있는지 사주적 근거를 들어 3가지 분야 제시
섹션 ③: 당신이 자신도 모르게 저지르는 구체적인 낭비 패턴(감정 기복에 따른 충동구매, 인간관계 유지 비용 과다 등) 2~3가지
섹션 ④: 재물운이 올라가는 유리한 시기 또는 상황 + 지금 당장 실천 가능한 재테크/관리 행동 1~2가지
extras.moneyType: 재물 유형 한 단어 또는 짧은 표현 (예: "신중한 축재가")
extras.topFields: 추천 분야명 배열 3개
extras.warningHabit: 돈 새는 패턴 한 문장 요약
extras.myWeapon: 재물을 끌어당기는 나만의 가장 강력한 무기 (예: "뛰어난 언변과 협상력")
extras.benefactorZodiac: 금전적으로 유리한 기회를 가져다줄 귀인의 띠와 이유
  `.trim(),

  love: `
섹션 ①: 연애에서 당신이 반복하는 구체적인 패턴(밀당형/헌신형/독립형/집착형 등)을 명확히 진단하고 그 배경 설명
섹션 ②: 배우자궁(태어난 날의 지지)의 특징과 사주에 부족한 기운(용신)을 종합하여, 당신에게 안정감을 주는 이상적인 배우자상과 연애 환경을 구체적으로 서술
섹션 ③: 당신과 에너지가 충돌하는 상극인 이성 유형과 그 관계에서 반복될 문제 패턴 2~3가지를 명확히
섹션 ④: 현재 시점의 연애운 평가(좋음/보통/하강 중 등 명확히 판단) + 좋은 인연이 찾아올 가능성이 높은 시기나 계기
extras.loveStyle: 연애 유형 한 단어 (예: "헌신형")
extras.compatibleTraits: 잘 맞는 이성 특징 배열 3개
extras.incompatibleTraits: 피해야 할 이성 특징 배열 2~3개
extras.bestPeriod: 인연이 찾아오는 시기 표현
extras.myWeapon: 이성에게 어필할 수 있는 나만의 치명적인 사주적 매력 (예: "은근히 사람을 끄는 홍염살의 매력")
extras.benefactorZodiac: 좋은 인연을 맺어주거나 연애 조언을 구하기 좋은 귀인의 띠
  `.trim(),

  compatibility: `
섹션 ①: 두 사람의 일간(태어난 날의 기운)을 비교하여 어떤 형태의 관계인지 명확히 진단하고, 서로가 만나면 어떤 시너지가 발생하는지 서술
섹션 ②: 일간(겉마음)뿐만 아니라 속마음과 가정환경을 뜻하는 배우자궁(일지)의 조화와 충돌까지 종합적으로 분석하여 두 사람이 서로를 어떻게 채워주는지 서술
섹션 ③: 두 사람의 기운이 부딪힐 수 있는 구체적인 갈등 포인트(예: 의사소통 방식, 감정 표현, 소비 습관 등)를 쉽게 설명해주고, 이를 극복하기 위한 따뜻하고 건설적인 대처법 제시
섹션 ④: 현재 운기에서 두 사람의 인연 흐름을 짚어보고, 평생의 동반자로 발전할 가능성과 서로 노력해야 할 점을 조언
extras.compatibilityScore: 1~100 사이의 숫자 (정수)
extras.coupleType: 두 사람의 관계를 정의하는 짧고 임팩트 있는 표현 (예: "서로의 부족함을 완벽히 채우는 소울메이트")
extras.synergyPoint: 두 사람이 함께할 때 생기는 긍정적인 효과 한 줄 요약
extras.advice: 예쁜 사랑을 위해 명심해야 할 조언 한 줄 요약
extras.myWeapon: 두 사람이 함께할 때 가장 시너지가 나는 공통의 무기 (예: "어떤 시련도 이겨내는 긍정 에너지")
extras.benefactorZodiac: 두 사람의 관계를 응원하고 조력해 줄 귀인의 띠와 이유
  `.trim(),
};

// 테마별 Gemini Structured Outputs 스키마 생성기
function getResponseSchema(theme: FortuneTheme): Schema {
  const baseSchema: Schema = {
    type: SchemaType.OBJECT,
    properties: {
      summary: { type: SchemaType.STRING, description: "사주를 꿰뚫는 트렌디한 한줄 요약 (50자 이내, 한자 사용 금지)" },
      keywords: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
      sections: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            title: { type: SchemaType.STRING },
            content: { type: SchemaType.STRING, description: "마크다운 없이 순수 텍스트로 작성" }
          },
          required: ["title", "content"]
        }
      },
      extras: {
        type: SchemaType.OBJECT,
        properties: {},
        required: []
      }
    },
    required: ["summary", "keywords", "sections", "extras"]
  };

  const extrasSchema = baseSchema.properties!.extras as ObjectSchema;
  const extrasProps = extrasSchema.properties!;
  const extrasReq = extrasSchema.required!;

  if (theme === 'general') {
    extrasProps.birthElement = { type: SchemaType.STRING };
    extrasProps.careers = {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: { name: { type: SchemaType.STRING }, reason: { type: SchemaType.STRING } },
        required: ["name", "reason"]
      }
    };
    extrasProps.compatibleType = { type: SchemaType.STRING };
    extrasProps.incompatibleType = { type: SchemaType.STRING };
    extrasProps.luckyColor = { type: SchemaType.STRING };
    extrasProps.luckyItem = { type: SchemaType.STRING };
    extrasReq.push("birthElement", "careers", "compatibleType", "incompatibleType", "luckyColor", "luckyItem");
  } else if (theme === 'yearly') {
    extrasProps.bestMonth = { type: SchemaType.STRING };
    extrasProps.worstMonth = { type: SchemaType.STRING };
    extrasProps.keyAction = { type: SchemaType.STRING };
    extrasProps.luckyColor = { type: SchemaType.STRING };
    extrasProps.luckyItem = { type: SchemaType.STRING };
    extrasReq.push("bestMonth", "worstMonth", "keyAction", "luckyColor", "luckyItem");
  } else if (theme === 'wealth') {
    extrasProps.moneyType = { type: SchemaType.STRING };
    extrasProps.topFields = { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } };
    extrasProps.warningHabit = { type: SchemaType.STRING };
    extrasProps.luckyColor = { type: SchemaType.STRING };
    extrasProps.luckyItem = { type: SchemaType.STRING };
    extrasReq.push("moneyType", "topFields", "warningHabit", "luckyColor", "luckyItem");
  } else if (theme === 'love') {
    extrasProps.loveStyle = { type: SchemaType.STRING };
    extrasProps.compatibleTraits = { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } };
    extrasProps.incompatibleTraits = { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } };
    extrasProps.bestPeriod = { type: SchemaType.STRING };
    extrasProps.luckyColor = { type: SchemaType.STRING };
    extrasProps.luckyItem = { type: SchemaType.STRING };
    extrasReq.push("loveStyle", "compatibleTraits", "incompatibleTraits", "bestPeriod", "luckyColor", "luckyItem");
  } else if (theme === 'compatibility') {
    extrasProps.compatibilityScore = { type: SchemaType.INTEGER };
    extrasProps.coupleType = { type: SchemaType.STRING };
    extrasProps.synergyPoint = { type: SchemaType.STRING };
    extrasProps.advice = { type: SchemaType.STRING };
    extrasProps.luckyColor = { type: SchemaType.STRING };
    extrasProps.luckyItem = { type: SchemaType.STRING };
    extrasReq.push("compatibilityScore", "coupleType", "synergyPoint", "advice", "luckyColor", "luckyItem");
  }

  return baseSchema;
}

function buildPrompt(theme: FortuneTheme, input: SajuInput, chart: SajuChart, partnerInput?: SajuInput, partnerChart?: SajuChart): string {
  const genderKo = input.gender === 'male' ? '남성' : '여성';
  const hourText = chart.hourPillar
    ? `${chart.hourPillar.stem}${chart.hourPillar.branch}`
    : '미상(시간 불명)';
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const sectionTitles = THEME_SECTION_TITLES[theme];

  const { sewun, wolwun } = getCurrentWoon();
  const daewun = calculateDaewun(input.birthYear, input.gender, chart.yearPillar.stem, chart.monthPillar.stem + chart.monthPillar.branch);
  const elements = analyzeSajuElements(chart);

  const elementStr = `[오행 및 십성 분석]
오행 개수: 木(${elements.elementsCount['木']}) 火(${elements.elementsCount['火']}) 土(${elements.elementsCount['土']}) 金(${elements.elementsCount['金']}) 水(${elements.elementsCount['水']})
년주: ${elements.details[0].stemElement}[${elements.details[0].stemTenGod}] / ${elements.details[0].branchElement}[${elements.details[0].branchTenGod}]
월주: ${elements.details[1].stemElement}[${elements.details[1].stemTenGod}] / ${elements.details[1].branchElement}[${elements.details[1].branchTenGod}]
일주(나): ${elements.details[2].stemElement}[일간] / ${elements.details[2].branchElement}[${elements.details[2].branchTenGod}]
시주: ${elements.details[3] ? `${elements.details[3].stemElement}[${elements.details[3].stemTenGod}] / ${elements.details[3].branchElement}[${elements.details[3].branchTenGod}]` : '미상'}`;

  let partnerSection = '';
  if (theme === 'compatibility' && partnerInput && partnerChart) {
    const partnerGenderKo = partnerInput.gender === 'male' ? '남성' : '여성';
    const partnerHourText = partnerChart.hourPillar
      ? `${partnerChart.hourPillar.stem}${partnerChart.hourPillar.branch}`
      : '미상(시간 불명)';

    const partnerElements = analyzeSajuElements(partnerChart);
    const partnerElementStr = `[상대방 오행 및 십성 분석]
오행 개수: 木(${partnerElements.elementsCount['木']}) 火(${partnerElements.elementsCount['火']}) 土(${partnerElements.elementsCount['土']}) 金(${partnerElements.elementsCount['金']}) 水(${partnerElements.elementsCount['水']})`;

    partnerSection = `
[상대방 정보]
성별: ${partnerGenderKo}
출생년도: ${partnerInput.birthYear}년

[상대방 사주 명식 - 천간지지 (원국)]
년주: ${partnerChart.yearPillar.stem}${partnerChart.yearPillar.branch}
월주: ${partnerChart.monthPillar.stem}${partnerChart.monthPillar.branch}
일주: ${partnerChart.dayPillar.stem}${partnerChart.dayPillar.branch}  ← 일간(${partnerChart.dayPillar.stem})이 상대방의 핵심 기질입니다
시주: ${partnerHourText}
${partnerElementStr}
`;
  }

  const mySinsal = detectSinsal(chart);
  const sinsalText = mySinsal.length > 0 
    ? `[당신의 사주에 있는 특수 기운(살)]\n${mySinsal.join('\n')}` 
    : `[당신의 사주에 있는 특수 기운(살)]\n특정 살에 치우치지 않고 기운이 골고루 분배되어 있습니다. 오행의 특징을 무기로 삼으세요.`;

  return `당신은 명리학에 깊은 지식을 가진 현대적이고 트렌디한 사주 전문가입니다.
아래 사주 명식 데이터를 바탕으로 ${THEME_LABELS[theme]}을 진행해 주세요.

[당신(본인) 정보]
성별: ${genderKo}
출생년도: ${input.birthYear}년

[당신(본인) 사주 명식 - 천간지지 (원국)]
년주: ${chart.yearPillar.stem}${chart.yearPillar.branch}
월주: ${chart.monthPillar.stem}${chart.monthPillar.branch}
일주: ${chart.dayPillar.stem}${chart.dayPillar.branch}  ← 일간(${chart.dayPillar.stem})이 당신의 핵심 기질입니다
시주: ${hourText}

${sinsalText}

${elementStr}
${partnerSection}
[현재 운의 흐름 (기준: ${currentYear}년 ${currentMonth}월)]
현재 대운 (10년 주기): ${daewun}
올해 세운 (1년 주기): ${sewun}
이달의 월운: ${wolwun}

[섹션 제목 지정]
생성할 4개 섹션의 title 속성은 반드시 아래 텍스트를 그대로 기입하세요.
1. "${sectionTitles[0]}"
2. "${sectionTitles[1]}"
3. "${sectionTitles[2]}"
4. "${sectionTitles[3]}"

[섹션별 내용 작성 지침 — 반드시 준수]
${THEME_DIRECTIVES[theme]}

[문체 및 표현 규칙]
- 타겟 독자: 학생, 대학생, 취준생, 사회초년생, 직장인들이 깊이 공감할 수 있는 세련되고 친근한 존댓말
- 한자(漢字) 출력 절대 금지(★★★★★): 출력 결과의 어떤 필드에도 한자가 단 한 글자도 들어가서는 안 됩니다. 프롬프트에 제공된 사주 명식(예: 戊寅, 丙子, 甲 등)을 절대로 그대로 복사해서 출력하지 마세요. 반드시 한글 독음(예: 무인, 병자)으로 적거나, "흙의 기운", "물의 기운"처럼 완전히 한글 풀이로만 작성해야 합니다.
- 오행과 기질을 설명할 때 '한여름에 태어난 시원한 물줄기', '추운 겨울의 든든한 큰 나무'처럼 태어난 달(월지)의 계절감과 조후를 살린 자연물 비유를 적극 활용하여 직관적이고 와닿게 설명할 것
- 낡은 명리학 용어(비견·겁재·편인 등)나 '내담자'라는 딱딱한 호칭은 쓰지 말고, "당신", "상대방", "두 분" 등 친근하고 이해하기 쉬운 일상어로 풀어서 쓸 것.
- 불가피하게 명리학 기운을 설명해야 할 경우, 한자를 배제하고 직관적인 의미(나와 경쟁하는 기운, 나를 억누르는 규칙 등)로 현대적으로 풀어서 설명할 것
- 건강상의 심각한 질병, 생명의 위협, 이혼 확정 등 공포감을 주거나 극단적으로 부정적인 예언은 절대 금지하며, 항상 예방과 긍정적인 방향의 조언으로 마무리할 것
- 유치한 신조어나 밈은 쓰지 말고 진정성 있는 컨설턴트 톤으로
- 이모지(🌟 🎯 💸 📝 등)를 문맥에 맞게 자연스럽게 2~3개 사용
- 각 섹션 300자 내외, 전체 1200자 이상
- 막연하고 두루뭉술한 표현 절대 금지 — 구체적인 직업명·월(月)·성격 특징·행동 지침을 반드시 명시
- content 값 안에 **, *, #, __ 등 마크다운 서식 문자 사용 금지`;
}

// ─── Gemini 응답 파싱 및 한자 제거 ─────────────────────────────────────────────

function removeHanja(text: string): string {
  const map: Record<string, string> = {
    '甲': '갑', '乙': '을', '丙': '병', '丁': '정', '戊': '무', '己': '기', '庚': '경', '辛': '신', '壬': '임', '癸': '계',
    '子': '자', '丑': '축', '寅': '인', '卯': '묘', '辰': '진', '巳': '사', '午': '오', '未': '미', '申': '신', '酉': '유', '戌': '술', '亥': '해',
    '木': '목', '火': '화', '土': '토', '金': '금', '水': '수'
  };
  
  // 1. 한자를 한글로 치환
  let result = text.replace(/[甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥木火土金水]/g, match => map[match] || match);
  
  // 2. 치환 후 발생한 동어 반복 괄호 제거 (예: 무(무) -> 무, 무오(무오) -> 무오)
  result = result.replace(/([가-힣]+)\(\1\)/g, '$1');
  
  // 3. 혹시 모를 남은 빈 괄호나 이상한 중복 제거
  result = result.replace(/\(\)/g, '');

  return result;
}

function parseGeminiResponse(text: string): {
  summary: string;
  keywords?: string[];
  detail?: string;
  sections?: { title: string; content: string }[];
  extras?: SajuReadingExtras;
} {
  try {
    const cleanText = removeHanja(text);
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : cleanText;
    const parsed = JSON.parse(jsonStr) as Record<string, unknown>;
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
    console.log('[API] Gemini 응답 JSON 파싱 성공!');
    return { summary, keywords, detail, sections, extras };
  } catch (e: unknown) {
    console.error('[API] Gemini 응답 JSON 파싱 실패 (파싱 에러):', e instanceof Error ? e.message : String(e));
    console.log('[API] 파싱하려던 원본 텍스트:', text);
    return { summary: '', detail: text };
  }
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
      const solar = toSolarDate(input.birthYear, input.birthMonth, input.birthDay);
      solarYear = solar.year;
      solarMonth = solar.month;
      solarDay = solar.day;
    }

    // 2. 만세력 계산 (천간지지 4주)
    const chart = calculateSajuChart(solarYear, solarMonth, solarDay, input.birthHour);

    let partnerChart: SajuChart | undefined = undefined;
    const reqBody = body as SajuReadingRequest;
    if (theme === 'compatibility' && reqBody.partnerInput) {
      const pInput = reqBody.partnerInput;
      let pSolarYear = pInput.birthYear;
      let pSolarMonth = pInput.birthMonth;
      let pSolarDay = pInput.birthDay;

      if (pInput.calendarType === 'lunar') {
        const solar = toSolarDate(pInput.birthYear, pInput.birthMonth, pInput.birthDay);
        pSolarYear = solar.year;
        pSolarMonth = solar.month;
        pSolarDay = solar.day;
      }
      partnerChart = calculateSajuChart(pSolarYear, pSolarMonth, pSolarDay, pInput.birthHour);
    }

    // 3. Gemini API 호출
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: '서버 설정 오류: API 키가 없습니다.' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const prompt = buildPrompt(theme, input, chart, reqBody.partnerInput, partnerChart);

    console.log(`[API] Gemini 호출 시작 - 테마: ${theme}, 모델 후보:`, ['gemini-2.5-flash-lite']);

    const MODEL_FALLBACK = ['gemini-2.5-flash-lite']; let responseText = '';
    let lastError: unknown;

    for (const modelName of MODEL_FALLBACK) {
      console.log(`[API] ${modelName} 모델 호출 시도 중...`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: getResponseSchema(theme),
        }
      });
      try {
        const result = await model.generateContent(prompt);
        responseText = result.response.text().trim();
        console.log(`[API] ${modelName} 호출 성공! 응답 길이: ${responseText.length}자`);
        break;
      } catch (err: unknown) {
        lastError = err;
        const errMessage = err instanceof Error ? err.message : String(err);
        console.error(`[API] ${modelName} 호출 실패! 에러:`, errMessage);

        const shouldFallback =
          err instanceof Error &&
          (err.message.includes('503') || err.message.includes('429') || err.message.includes('404') || err.message.includes('403'));

        if (!shouldFallback) {
          console.error(`[API] 폴백 비대상 에러이므로 즉시 에러를 반환합니다.`);
          throw err; // 503, 429, 404, 403 이외 오류는 즉시 throw
        }
        console.log(`[API] 에러 코드가 폴백 대상이므로 다음 모델로 시도합니다.`);
        // 오류면 다음 모델로 폴백 (마지막 모델까지 실패하면 아래서 throw)
      }
    }
    if (!responseText) {
      console.error('[API] 모든 모델 호출 실패');
      throw lastError;
    }

    const { summary, keywords, detail, sections, extras } = parseGeminiResponse(responseText);

    const reading: SajuReading = { theme, summary, keywords, detail, sections, extras, chart };

    return NextResponse.json({ success: true, message: 'ok', data: reading });
  } catch (error: unknown) {
    console.error('[/api/saju/reading] 서버 에러:', error);
    const message = error instanceof Error ? error.message : '서버 오류가 발생했습니다.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
