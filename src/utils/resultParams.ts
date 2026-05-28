import type { FortuneTheme, SajuInput, CalendarType, Gender } from '@/types/api';

const FORTUNE_THEMES: FortuneTheme[] = ['general', 'yearly', 'wealth', 'love'];
const CALENDAR_TYPES: CalendarType[] = ['solar', 'lunar'];
const GENDERS: Gender[] = ['male', 'female'];

export function encodeResultParams(theme: FortuneTheme, input: SajuInput): string {
  const params = new URLSearchParams({
    theme,
    year: String(input.birthYear),
    month: String(input.birthMonth),
    day: String(input.birthDay),
    gender: input.gender,
    calendar: input.calendarType,
  });
  if (input.birthHour !== null) {
    params.set('hour', String(input.birthHour));
  }
  return params.toString();
}

export function decodeResultParams(
  searchParams: URLSearchParams
): { theme: FortuneTheme; input: SajuInput } | null {
  const theme = searchParams.get('theme');
  const year = searchParams.get('year');
  const month = searchParams.get('month');
  const day = searchParams.get('day');
  const gender = searchParams.get('gender');
  const calendar = searchParams.get('calendar');
  const hourStr = searchParams.get('hour');

  if (!theme || !year || !month || !day || !gender || !calendar) return null;
  if (!FORTUNE_THEMES.includes(theme as FortuneTheme)) return null;
  if (!CALENDAR_TYPES.includes(calendar as CalendarType)) return null;
  if (!GENDERS.includes(gender as Gender)) return null;

  const parsedYear = parseInt(year, 10);
  const parsedMonth = parseInt(month, 10);
  const parsedDay = parseInt(day, 10);
  const parsedHour = hourStr !== null ? parseInt(hourStr, 10) : null;

  if (
    isNaN(parsedYear) ||
    isNaN(parsedMonth) ||
    isNaN(parsedDay) ||
    (parsedHour !== null && isNaN(parsedHour))
  )
    return null;

  return {
    theme: theme as FortuneTheme,
    input: {
      calendarType: calendar as CalendarType,
      birthYear: parsedYear,
      birthMonth: parsedMonth,
      birthDay: parsedDay,
      birthHour: parsedHour,
      gender: gender as Gender,
    },
  };
}
