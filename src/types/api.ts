// API 공통 응답 래퍼
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

// 운세 테마
export type FortuneTheme = 'general' | 'yearly' | 'wealth' | 'love' | 'compatibility';

// 양력/음력
export type CalendarType = 'solar' | 'lunar';

// 성별
export type Gender = 'male' | 'female';

// 사주 입력 데이터
export interface SajuInput {
  calendarType: CalendarType;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number | null; // 시(時)를 모를 경우 null
  gender: Gender;
}

// 사주 명식 (만세력 계산 결과)
export interface SajuChart {
  yearPillar: { stem: string; branch: string };
  monthPillar: { stem: string; branch: string };
  dayPillar: { stem: string; branch: string };
  hourPillar: { stem: string; branch: string } | null;
}

// 테마별 부가 정보 (LLM이 채워주는 구조화 데이터)
export interface SajuReadingExtras {
  // general
  birthElement?: string;
  careers?: { name: string; reason: string }[];
  compatibleType?: string;
  incompatibleType?: string;
  // yearly
  bestMonth?: string;
  worstMonth?: string;
  keyAction?: string;
  // wealth
  moneyType?: string;
  topFields?: string[];
  warningHabit?: string;
  // love
  loveStyle?: string;
  compatibleTraits?: string[];
  incompatibleTraits?: string[];
  bestPeriod?: string;
  // compatibility
  compatibilityScore?: number;
  coupleType?: string;
  synergyPoint?: string;
  advice?: string;
  // shared
  myWeapon?: string;
  benefactorZodiac?: string;
}

// LLM 풀이 결과
export interface SajuReading {
  theme: FortuneTheme;
  summary: string;
  keywords?: string[];
  detail?: string;
  sections?: { title: string; content: string }[];
  extras?: SajuReadingExtras;
  chart: SajuChart;
}

// API 요청 파라미터
export interface SajuReadingRequest {
  theme: FortuneTheme;
  input: SajuInput;
  partnerInput?: SajuInput;
}
