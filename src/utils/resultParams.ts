import type { FortuneTheme, SajuInput, CalendarType, Gender } from '@/types/api';

const FORTUNE_THEMES: FortuneTheme[] = ['general', 'yearly', 'wealth', 'love', 'compatibility'];
const CALENDAR_TYPES: CalendarType[] = ['solar', 'lunar'];
const GENDERS: Gender[] = ['male', 'female'];

export function encodeResultParams(theme: FortuneTheme, input: SajuInput, partnerInput?: SajuInput | null): string {
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
  
  if (partnerInput) {
    params.set('p_year', String(partnerInput.birthYear));
    params.set('p_month', String(partnerInput.birthMonth));
    params.set('p_day', String(partnerInput.birthDay));
    params.set('p_gender', partnerInput.gender);
    params.set('p_calendar', partnerInput.calendarType);
    if (partnerInput.birthHour !== null) {
      params.set('p_hour', String(partnerInput.birthHour));
    }
  }
  
  return params.toString();
}

export function decodeResultParams(
  searchParams: URLSearchParams
): { theme: FortuneTheme; input: SajuInput; partnerInput?: SajuInput } | null {
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

  let partnerInput: SajuInput | undefined = undefined;
  
  if (theme === 'compatibility') {
    const pYear = searchParams.get('p_year');
    const pMonth = searchParams.get('p_month');
    const pDay = searchParams.get('p_day');
    const pGender = searchParams.get('p_gender');
    const pCalendar = searchParams.get('p_calendar');
    const pHourStr = searchParams.get('p_hour');

    if (pYear && pMonth && pDay && pGender && pCalendar) {
      const parsedPYear = parseInt(pYear, 10);
      const parsedPMonth = parseInt(pMonth, 10);
      const parsedPDay = parseInt(pDay, 10);
      const parsedPHour = pHourStr !== null ? parseInt(pHourStr, 10) : null;
      
      if (!isNaN(parsedPYear) && !isNaN(parsedPMonth) && !isNaN(parsedPDay) && (parsedPHour === null || !isNaN(parsedPHour))) {
        partnerInput = {
          calendarType: pCalendar as CalendarType,
          birthYear: parsedPYear,
          birthMonth: parsedPMonth,
          birthDay: parsedPDay,
          birthHour: parsedPHour,
          gender: pGender as Gender,
        };
      }
    }
  }

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
    ...(partnerInput && { partnerInput })
  };
}
